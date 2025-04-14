import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { PictureAsPdf, Description } from "@material-ui/icons";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";

const ExportDocReport = ({ filteredReports }) => {
    const [exportOption, setExportOption] = useState("");
    // Função para exportar os dados renderizados
    const handleExportChange = (event) => {
        const selectedOption = event.target.value;
        setExportOption(selectedOption);

        if (selectedOption === "pdf") {
            exportToPDF();
        } else if (selectedOption === "excel") {
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
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel htmlFor="export-select">Exportar Relatório</InputLabel>
            <Select
                value={exportOption}
                onChange={handleExportChange}
                label="Exportar Relatório"
                inputProps={{
                name: "export",
                id: "export-select",
                }}>
                <MenuItem value="pdf">
                <PictureAsPdf style={{ marginRight: 8 }} />
                    PDF
                </MenuItem>
                <MenuItem value="excel">
                <Description style={{ marginRight: 8 }} />
                    Excel
                </MenuItem>
            </Select>
        </FormControl>
    </div>
  );
};

export default ExportDocReport;