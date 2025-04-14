import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import api from "../../services/api";
import TableReport from "../../components/TableReport";
import TableFilter from "../../components/TableFilterReport";
import ExportDocReport from "../../components/ExportDocReport";

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
  const [loading, setLoading] = useState(true);
  const [filteredReports, setFilteredReports] = useState([]);
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

  return (
    <Paper className={classes.paper}>
      <hr style={{ border: "1px solid #ddd", marginBottom: "15px"}} />
      <TableFilter onFilter={handleFilter} />
      <hr style={{ border: "1px solid #ddd", marginTop: "15px"}} />
      <ExportDocReport filteredReports={filteredReports} />
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <TableReport reports={filteredReports} classes={classes} />
      )}
    </Paper>
  );
};

export default Reports;