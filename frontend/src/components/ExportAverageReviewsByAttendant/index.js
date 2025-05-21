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

const ExportAverageReviewsByAttendant = ({ reviews, filters }) => {
  const [exportOption, setExportOption] = useState("");

  // Agrupa avaliações por atendente
  const groupedData = reviews.reduce((acc, review) => {
    const attendant = review.user?.name || "Desconhecido";
    if (!acc[attendant]) acc[attendant] = { total: 0, count: 0, tickets: new Set() };
    acc[attendant].total += review.nota;
    acc[attendant].count++;
    acc[attendant].tickets.add(review.ticketId);
    return acc;
  }, {});

  const data = Object.entries(groupedData).map(([attendant, { total, count, tickets }]) => ({
    Atendente: attendant,
    "Média de Avaliações": (total / count).toFixed(2),
    "Total de Tickets": tickets.size,
  }));

  const handleExportChange = async (event) => {
    const selected = event.target.value;
    setExportOption(selected);

    if (selected === "pdf") {
      exportToPDF();
    } else if (selected === "excel") {
      exportToExcel();
    }

    setExportOption("");
  };

  const exportToPDF = () => {
    if (data.length === 0) {
      alert("Nenhum dado disponível para exportar.");
      return;
    }

    const doc = new jsPDF();

    // Estilo do título
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Média de Avaliações por Atendente", 14, 10);

    // Estilo dos filtros aplicados
    doc.setFontSize(10);
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
    const appliedFilters = Object.entries(filters || {})
      .filter(([key, value]) => value?.trim())
      .map(([key, value]) => `${filterLabels[key] || key}: ${value}`)
      .join(", ");

    if (appliedFilters) {
      doc.text("Filtros Aplicados:", 14, 20);
      doc.setTextColor(100);
      doc.text(appliedFilters, 14, 25, { maxWidth: 180 });
    }

    autoTable(doc, {
      head: [["Atendente", "Média de Avaliações", "Total de Tickets"]],
      body: data.map((item) => [
        item.Atendente,
        item["Média de Avaliações"],
        item["Total de Tickets"],
      ]),
      startY: appliedFilters ? 35 : 20,
    });

    doc.save("avaliacoes_por_atendente.pdf");
  };

  const exportToExcel = () => {
    if (data.length === 0) {
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
    const appliedFilters = Object.entries(filters || {})
      .filter(([key, value]) => value?.trim())
      .map(([key, value]) => `${filterLabels[key] || key}: ${value}`)
      .join(", ");

    // Criar o conteúdo da planilha
    const worksheetData = [
      ["Média de Avaliações por Atendente"], // Título
      [appliedFilters || "Sem filtros aplicados"], // Filtros
      [], // Linha vazia para separar do conteúdo
      ["Atendente", "Média de Avaliações", "Total de Tickets"], // Cabeçalho
      ...data.map((item) => [
        item.Atendente,
        item["Média de Avaliações"],
        item["Total de Tickets"],
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Avaliações por Atendente");
    XLSX.writeFile(wb, "avaliacoes_por_atendente.xlsx");
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

export default ExportAverageReviewsByAttendant;
