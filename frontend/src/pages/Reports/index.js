import React, { useState, useEffect } from "react";
import { Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import api from "../../services/api";
import TableReport from "../../components/TableReport";
import TableFilter from "../../components/TableFilterReport";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { PictureAsPdf } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
    border: "1px solid #ddd",
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  tableHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tableHeadCell: {
    color: theme.palette.common.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
      cursor: "pointer",
    },
  },
  tableCell: {
    textAlign: "center",
    padding: theme.spacing(1.5),
  },
  statusOpen: {
    backgroundColor: "MediumAquamarine",
    color: "white",
    fontWeight: "bold",
    border: "1px solid green",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusClosed: {
    backgroundColor: "LightCoral",
    color: "white",
    fontWeight: "bold",
    border: "1px solid red",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusPending: {
    backgroundColor: "orange",
    color: "white",
    fontWeight: "bold",
    border: "1px solid orange",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusDefault: {
    backgroundColor: "gray",
    color: "white",
    fontWeight: "bold",
    border: "1px solid gray",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  exportContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    alignItems: "center",
  },
  exportLabel: {
    fontWeight: "bold",
  },
}));

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await api.get("/reports");
        setReports(data);
        setFilteredReports(data); // Inicialmente, exibe todos os dados
        setLoading(false);
      } catch (err) {
        toast.error("Erro ao carregar relatórios");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleFilter = (filter) => {
    let filtered = reports;
  
    // Filtro por texto
    if (filter.text?.trim()) {
      filtered = filtered.filter((report) => {
        // Verifica apenas os campos relevantes para o filtro de texto
        const searchableFields = [
          report.id,
          report.atualStatus,
          report.queue?.name,
          report.contact?.name,
          report.finishedByUser?.name,
        ];

        return searchableFields.some((value) =>
          String(value || "").toLowerCase().includes(filter.text.toLowerCase())
        );
      });
    }
  
    // Filtro por status
    if (filter.status) {
      filtered = filtered.filter((report) => report.atualStatus === filter.status);
    }
  
    // Filtro por período de data
    if (filter.startDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) >= new Date(filter.startDate)
      );
    }
    if (filter.endDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) <= new Date(filter.endDate)
      );
    }
  
    // Filtro por setor
    if (filter.sector?.trim()) {
      filtered = filtered.filter((report) =>
        report.queue?.name?.toLowerCase().includes(filter.sector.toLowerCase())
      );
    }
  
    // Filtro por contato
    if (filter.contact?.trim()) {
      filtered = filtered.filter((report) =>
        report.contact?.name?.toLowerCase().includes(filter.contact.toLowerCase())
      );
    }
  
    // Filtro por Fim. Atendente
    if (filter.attendant?.trim()) {
      filtered = filtered.filter((report) =>
        report.finishedByUser?.name
          ?.toLowerCase()
          .includes(filter.attendant.toLowerCase())
      );
    }
  
    setFilteredReports(filtered);
  };

  // Função para exportar os dados renderizados
  const handleExport = (format) => {
    if (format === "pdf") {
      exportToPDF();
    } else if (format === "excel") {
      exportToExcel();
    }
  };

  // Exportar para PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "ID",
      "Status",
      "Início Ticket",
      "Ticket",
      "Setor",
      "Contato",
      "Ini. Atendimento",
      "Ini. Atendente",
      "Fim. Atendimento",
      "Fim. Atendente",
    ];
    const tableRows = [];

    // Adiciona os dados renderizados na tabela
    filteredReports.forEach((report) => {
      const rowData = [
        report.id,
        report.atualStatus,
        report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A",
        report.ticketId || "N/A",
        report.queue?.name || "N/A",
        report.contact?.name || "N/A",
        report.startedAt ? new Date(report.startedAt).toLocaleString() : "N/A",
        report.startedByUser?.name || "N/A",
        report.finishedAt ? new Date(report.finishedAt).toLocaleString() : "N/A",
        report.finishedByUser?.name || "N/A",
      ];
      tableRows.push(rowData);
    });

    // Configurações do PDF
    doc.text("Relatório de Tickets", 14, 10);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Salva o PDF
    doc.save("relatorio_tickets.pdf");
  };

  // Exportar para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredReports.map((report) => ({
        ID: report.id,
        Status: report.atualStatus,
        "Início Ticket": report.createdAt
          ? new Date(report.createdAt).toLocaleString()
          : "N/A",
        Ticket: report.ticketId || "N/A",
        Setor: report.queue?.name || "N/A",
        Contato: report.contact?.name || "N/A",
        "Ini. Atendimento": report.startedAt
          ? new Date(report.startedAt).toLocaleString()
          : "N/A",
        "Ini. Atendente": report.startedByUser?.name || "N/A",
        "Fim. Atendimento": report.finishedAt
          ? new Date(report.finishedAt).toLocaleString()
          : "N/A",
        "Fim. Atendente": report.finishedByUser?.name || "N/A",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    // Salva o arquivo Excel
    XLSX.writeFile(workbook, "relatorio_tickets.xlsx");
  };

  return (
    <Paper className={classes.paper}>
      <h4 style={{ marginBottom: "5px" }}>Filtro</h4>
      <hr style={{ border: "1px solid #ddd", marginBottom: "15px"}} />
      <TableFilter onFilter={handleFilter} />
      <hr style={{ border: "1px solid #ddd", marginTop: "15px"}} />
      <h3>Relatórios</h3>
      <div className={classes.exportContainer} style={{marginBottom: "5px"}}>
        <label className={classes.exportLabel}>Exportar Relatório:</label>
        <Button variant="contained" color="primary" onClick={() => handleExport("pdf")}>
          <PictureAsPdf style={{ marginRight: 4 }} />
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleExport("excel")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" 
            className="bi bi-filetype-xlsx" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 
            2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 
            1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 
            1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 
            0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 
            0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 
            1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 
            2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 
            3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 
            1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"/>
          </svg>
        </Button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <TableReport reports={filteredReports} classes={classes} />
      )}
    </Paper>
  );
};

export default Reports;