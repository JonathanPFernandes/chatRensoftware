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

const ExportResolutionTimeReport = ({ reports, filters }) => {
  const [exportOption, setExportOption] = useState("");

  const closedTickets = reports.filter((ticket) => ticket.atualStatus === "closed");

  const data = closedTickets.map((ticket) => {
    const resolutionTimeInMinutes = (new Date(ticket.finishedAt) - new Date(ticket.createdAt)) / 60000;
    const hours = Math.floor(resolutionTimeInMinutes / 60);
    const minutes = Math.floor(resolutionTimeInMinutes % 60);

    return {
      "ID do Ticket": ticket.id,
      Contato: ticket.contact?.name || "Sem Contato",
      "Data de Criação": new Date(ticket.createdAt).toLocaleString(),
      "Tempo de Resolução": `${hours}h ${minutes}m`,
    };
  });

  const totalTimeInMinutes = data.reduce((acc, item) => {
    const [h, m] = item["Tempo de Resolução"].split(" ").map((v) => parseInt(v) || 0);
    return acc + h * 60 + m;
  }, 0);

  const avgTimeInMinutes = data.length > 0 ? totalTimeInMinutes / data.length : 0;
  const avgHours = Math.floor(avgTimeInMinutes / 60);
  const avgMinutes = Math.floor(avgTimeInMinutes % 60);
  const tempoMedioStr = `${avgHours}h ${avgMinutes}m`;

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
    doc.text("Relatório de Tempo de Resolução", 14, 10);

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
      head: [["ID do Ticket", "Contato", "Data de Criação", "Tempo de Resolução"]],
      body: data.map((item) => [
        item["ID do Ticket"],
        item["Contato"],
        item["Data de Criação"],
        item["Tempo de Resolução"],
      ]),
      startY: appliedFilters ? 35 : 20,
    });

    // Adiciona tempo médio no final
    doc.setFont("helvetica", "bold");
    doc.text(`Tempo Médio de Resolução: ${tempoMedioStr}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("tempo_resolucao.pdf");
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
      ["Relatório de Tempo de Resolução"], // Título
      [appliedFilters || "Sem filtros aplicados"], // Filtros
      [], // Linha vazia para separar do conteúdo
      ["ID do Ticket", "Contato", "Data de Criação", "Tempo de Resolução"], // Cabeçalho
      ...data.map((item) => [
        item["ID do Ticket"],
        item["Contato"],
        item["Data de Criação"],
        item["Tempo de Resolução"],
      ]),
      ["Tempo Médio", "", "", tempoMedioStr], // Tempo médio no final
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Tempo de Resolução");
    XLSX.writeFile(wb, "tempo_resolucao.xlsx");
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

export default ExportResolutionTimeReport;
