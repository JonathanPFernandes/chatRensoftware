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

const ExportReviewsReviews = ({ reviews, filters }) => {
  const [exportOption, setExportOption] = useState("");

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const data = reviews.map((review) => ({
    Contato: review.contato?.name || "-",
    Departamento: review.queue?.name || "-",
    Ticket: review.ticketId || "-",
    Atendente: review.user?.name || "-",
    Nota: review.nota || "-",
    Data: formatDate(review.createdAt),
  }));

  const handleExportChange = (event) => {
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
    doc.text("Relatório de Avaliações", 14, 10);

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
      head: [["Contato", "Departamento", "Ticket", "Atendente", "Nota", "Data"]],
      body: data.map((item) => [
        item.Contato,
        item.Departamento,
        item.Ticket,
        item.Atendente,
        item.Nota,
        item.Data,
      ]),
      startY: appliedFilters ? 35 : 20,
    });

    doc.save("avaliacoes.pdf");
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
      ["Relatório de Avaliações"], // Título
      [appliedFilters || "Sem filtros aplicados"], // Filtros
      [], // Linha vazia para separar do conteúdo
      ["Contato", "Departamento", "Ticket", "Atendente", "Nota", "Data"], // Cabeçalho
      ...data.map((item) => [
        item.Contato,
        item.Departamento,
        item.Ticket,
        item.Atendente,
        item.Nota,
        item.Data,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Avaliações");
    XLSX.writeFile(wb, "avaliacoes.xlsx");
  };

  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="export-reviews-label">Exportar</InputLabel>
      <Select
        labelId="export-reviews-label"
        id="export-reviews-select"
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

export default ExportReviewsReviews;
