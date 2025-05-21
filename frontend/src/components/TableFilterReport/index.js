import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import ExportDocReport from "../ExportDocReport";

const TableFilter = ({ onFilter, filteredReports }) => {
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
    onFilter(filter);
  };

  const handleClear = () => {
    const cleared = {
      text: "",
      status: "",
      startDate: "",
      endDate: "",
      sector: "",
      contact: "",
      attendant: "",
    };
    setFilter(cleared);
    onFilter({});
  };

  return (
    <Accordion style={{ marginBottom: 10 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1">Filtros Avançados</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={1}>
          {/* Linha 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Texto"
              name="text"
              value={filter.text}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              select
              label="Status"
              name="status"
              value={filter.status}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="open">Aberto</MenuItem>
              <MenuItem value="closed">Fechado</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="Início"
              type="date"
              name="startDate"
              value={filter.startDate}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="Fim"
              type="date"
              name="endDate"
              value={filter.endDate}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          {/* Linha 2 */}
          <Grid item xs={6} md={2}>
            <TextField
              label="Setor"
              name="sector"
              value={filter.sector}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="Contato"
              name="contact"
              value={filter.contact}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="Atendente"
              name="attendant"
              value={filter.attendant}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
              fullWidth
            />
          </Grid>

          {/* Botões + Exportação */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFilter}
                  fullWidth
                >
                  Filtrar
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClear}
                  fullWidth
                >
                  Limpar
                </Button>
              </Grid>
              <Grid item xs={4}>
                {/* <ExportDocReport filteredReports={filteredReports} /> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default TableFilter;