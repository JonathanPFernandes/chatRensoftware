import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { PictureAsPdf, Description } from "@material-ui/icons";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";

const ExportDocReport = ({ filteredReports, filters }) => {
  const [exportOption, setExportOption] = useState("");

  const handleExportChange = async (event) => {
    const selected = event.target.value;
    setExportOption(selected);

    if (selected === "pdf") {
      await exportToPDF();
    } else if (selected === "excel") {
      await exportToExcel();
    }

    setExportOption("");
  };

  const exportToPDF = () => {
    if (!filteredReports || filteredReports.length === 0) {
      alert("Nenhum dado disponível para exportar.");
      return;
    }

    const doc = new jsPDF();

    // Estilo do título
    doc.setFontSize(16); // Tamanho da fonte do título
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Tickets", 14, 10);

    // Estilo dos filtros aplicados
    doc.setFontSize(10); // Tamanho da fonte dos filtros
    doc.setFont("helvetica", "normal");

    // Mapeamento de rótulos personalizados
    const filterLabels = {
      text: "Texto",
      status: "Status",
      startDate: "Data Inicial",
      endDate: "Data Final",
      sector: "Setor",
      contact: "Contato",
      attendant: "Atendente",
    };

    // Filtrar apenas os filtros que possuem valores e aplicar os rótulos
    const appliedFilters = Object.entries(filters)
      .filter(([key, value]) => value?.trim()) // Apenas filtros com valores
      .map(
        ([key, value]) =>
          `${filterLabels[key] || key}: ${value}` // Usar rótulo personalizado ou o nome original
      )
      .join(", ");

    if (appliedFilters) {
      doc.text("Filtros Aplicados:", 14, 20);
      doc.setTextColor(100); // Cor do texto dos filtros
      doc.text(appliedFilters, 14, 25, { maxWidth: 180 }); // Quebra de linha automática
    }

    // Adicionar a tabela
    const headers = [
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
    const rows = filteredReports.map((r) => [
      r.id,
      r.atualStatus,
      r.createdAt ? new Date(r.createdAt).toLocaleString() : "N/A",
      r.ticketId || "N/A",
      r.queue?.name || "N/A",
      r.contact?.name || "N/A",
      r.startedAt ? new Date(r.startedAt).toLocaleString() : "N/A",
      r.startedByUser?.name || "N/A",
      r.finishedAt ? new Date(r.finishedAt).toLocaleString() : "N/A",
      r.finishedByUser?.name || "N/A",
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: appliedFilters ? 35 : 20, // Ajustar a posição da tabela com base nos filtros
      styles: { fontSize: 9 }, // Diminuir a fonte da tabela
      headStyles: { fillColor: [22, 160, 133] }, // Cor do cabeçalho
    });

    doc.save("relatorio_tickets.pdf");
  };

  const exportToExcel = () => {
    if (!filteredReports || filteredReports.length === 0) {
      alert("Nenhum dado disponível para exportar.");
      return;
    }

    // Mapeamento de rótulos personalizados
    const filterLabels = {
      text: "Texto",
      status: "Status",
      startDate: "Data Inicial",
      endDate: "Data Final",
      sector: "Setor",
      contact: "Contato",
      attendant: "Atendente",
    };

    // Filtrar apenas os filtros que possuem valores e aplicar os rótulos
    const appliedFilters = Object.entries(filters)
      .filter(([key, value]) => value?.trim())
      .map(([key, value]) => `${filterLabels[key] || key}: ${value}`)
      .join(", ");

    // Criar o conteúdo da planilha
    const worksheetData = [
      ["Relatório de Tickets"], // Título
      [appliedFilters || "Sem filtros aplicados"], // Filtros
      [], // Linha vazia para separar do conteúdo
      [
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
      ], // Cabeçalho
      ...filteredReports.map((r) => [
        r.id,
        r.atualStatus,
        r.createdAt ? new Date(r.createdAt).toLocaleString() : "N/A",
        r.ticketId || "N/A",
        r.queue?.name || "N/A",
        r.contact?.name || "N/A",
        r.startedAt ? new Date(r.startedAt).toLocaleString() : "N/A",
        r.startedByUser?.name || "N/A",
        r.finishedAt ? new Date(r.finishedAt).toLocaleString() : "N/A",
        r.finishedByUser?.name || "N/A",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Relatório");
    XLSX.writeFile(wb, "relatorio_tickets.xlsx");
  };

  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="export-label">Exportar</InputLabel>
      <Select
        labelId="export-label"
        id="export-select"
        value={exportOption}
        onChange={handleExportChange}
        label="Exportar"
      >
        <MenuItem value="pdf">
          <PictureAsPdf fontSize="small" style={{ marginRight: 8 }} />
          PDF
        </MenuItem>
        <MenuItem value="excel">
          <Description fontSize="small" style={{ marginRight: 8 }} />
          Excel
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default ExportDocReport;