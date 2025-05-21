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

const ExportTotalTicketsByAttendant = ({ reports, filters }) => {
  const [exportOption, setExportOption] = useState("");

  // Agrupa os tickets por atendente
  const groupedData = reports.reduce((acc, report) => {
    const attendant = report.finishedByUser?.name || "Desconhecido";
    acc[attendant] = (acc[attendant] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(groupedData).map(([attendant, total]) => ({
    Atendente: attendant,
    "Total de Tickets": total,
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
    doc.text("Tickets por Atendente", 14, 10);

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
      head: [["Atendente", "Total de Tickets"]],
      body: data.map((item) => [item.Atendente, item["Total de Tickets"]]),
      startY: appliedFilters ? 35 : 20,
    });

    doc.save("tickets_por_atendente.pdf");
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
      ["Tickets por Atendente"], // Título
      [appliedFilters || "Sem filtros aplicados"], // Filtros
      [], // Linha vazia para separar do conteúdo
      ["Atendente", "Total de Tickets"], // Cabeçalho
      ...data.map((item) => [item.Atendente, item["Total de Tickets"]]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, "Tickets por Atendente");
    XLSX.writeFile(wb, "tickets_por_atendente.xlsx");
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

export default ExportTotalTicketsByAttendant;