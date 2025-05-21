import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  TablePagination,
} from "@material-ui/core";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

const ResolutionTimeReport = ({ reports = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetar para a primeira página
  };

  // Filtrar tickets fechados e válidos
  const closedTickets = reports.filter(
    (report) =>
      report.atualStatus === "closed" &&
      report.startedAt &&
      report.finishedAt
  );

  // Processar os dados
  const data = closedTickets.map((ticket) => {
    const resolutionTimeInMinutes =
      (new Date(ticket.finishedAt) - new Date(ticket.startedAt)) / 60000;

    const hours = Math.floor(resolutionTimeInMinutes / 60);
    const minutes = Math.floor(resolutionTimeInMinutes % 60);

    return {
      id: ticket.id,
      contact: ticket.contact?.name || "Sem Contato",
      createdAt: ticket.createdAt,
      resolutionTime: `${hours}h ${minutes}m`,
    };
  });

  // Calcular tempo médio
  const totalTimeInMinutes = data.reduce((acc, ticket) => {
    const [hours, minutes] = ticket.resolutionTime
      .split(" ")
      .map((value) => parseInt(value) || 0);
    return acc + hours * 60 + minutes;
  }, 0);

  const avgTimeInMinutes = data.length > 0 ? totalTimeInMinutes / data.length : 0;
  const avgHours = Math.floor(avgTimeInMinutes / 60);
  const avgMinutes = Math.floor(avgTimeInMinutes % 60);

  // Paginação dos dados
  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={3}
      style={{
        padding: "24px",
        marginTop: "24px",
        borderRadius: "12px",
        overflowX: "auto",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        style={{
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          alignItems: "center",
        }}
      >
        <AccessTimeIcon style={{ marginRight: 8, color: "#1976d2" }} />
        Tempo Médio de Resolução
      </Typography>

      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow style={{ backgroundColor: "#f5f5f5" }}>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
              ID do Ticket
            </TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
              Contato
            </TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
              Data de Criação
            </TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
              Tempo de Resolução
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((ticket, index) => (
            <TableRow
              key={ticket.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                transition: "background-color 0.2s ease-in-out",
              }}
            >
              <TableCell style={{ textAlign: "center" }}>{ticket.id}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{ticket.contact}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {new Date(ticket.createdAt).toLocaleString()}
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                {ticket.resolutionTime}
              </TableCell>
            </TableRow>
          ))}
          {data.length > 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundColor: "#f0f0f0",
                }}
              >
                Tempo Médio
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundColor: "#f0f0f0",
                  color: "#2e7d32",
                }}
              >
                <span role="img" aria-label="Relógio">
                  ⏱️
                </span>{" "}
                {avgHours}h {avgMinutes}m
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginação */}
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página"
      />
    </Paper>
  );
};

export default ResolutionTimeReport;