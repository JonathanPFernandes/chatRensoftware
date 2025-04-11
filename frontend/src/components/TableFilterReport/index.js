import React, { useState } from "react";
import { TextField, Button, Grid, MenuItem } from "@material-ui/core";

const TableFilter = ({ onFilter }) => {
  const [filter, setFilter] = useState({
    text: "",
    status: "",
    startDate: "",
    endDate: "",
    sector: "",
    contact: "",
    attendant: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilter = () => {
    onFilter(filter); // Chama a função de filtro passando todos os critérios
    console.log("Filtro aplicado:", filter.text); // Log para verificar os filtros aplicados
  };

  const handleClear = () => {
    setFilter({
      text: "",
      status: "",
      startDate: "",
      endDate: "",
      sector: "",
      contact: "",
      attendant: "",
    });
    onFilter({}); // Limpa todos os filtros
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {/* Primeira linha: até o campo Data Fim */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Filtrar por texto"
          variant="outlined"
          name="text"
          value={filter.text}
          onChange={handleInputChange}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          select
          fullWidth
          label="Status"
          variant="outlined"
          name="status"
          value={filter.status}
          onChange={handleInputChange}
          size="small"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="open">Aberto</MenuItem>
          <MenuItem value="closed">Fechado</MenuItem>
          <MenuItem value="pending">Pendente</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Data Início"
          type="date"
          variant="outlined"
          name="startDate"
          value={filter.startDate}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Data Fim"
          type="date"
          variant="outlined"
          name="endDate"
          value={filter.endDate}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          size="small"
        />
      </Grid>

      {/* Segunda linha: Setor, Contato, Fim. Atendente e Botões */}
      <Grid item xs={12} md={3}>
        <TextField
          fullWidth
          label="Contato"
          variant="outlined"
          name="contact"
          value={filter.contact}
          onChange={handleInputChange}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Setor"
          variant="outlined"
          name="sector"
          value={filter.sector}
          onChange={handleInputChange}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          fullWidth
          label="Fim. Atendente"
          variant="outlined"
          name="attendant"
          value={filter.attendant}
          onChange={handleInputChange}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilter}
          fullWidth
        >
          Filtrar
        </Button>
      </Grid>
      <Grid item xs={12} md={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClear}
          fullWidth
        >
          Limpar
        </Button>
      </Grid>
    </Grid>
  );
};

export default TableFilter;