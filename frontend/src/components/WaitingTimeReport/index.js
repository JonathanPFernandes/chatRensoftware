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

const WaitingTimeReport = ({ reports = [] }) => {
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

  // Processar os dados
  const data = reports.map((ticket) => {
    const waitingTimeInMinutes =
      ticket.startedAt && ticket.createdAt
        ? (new Date(ticket.startedAt) - new Date(ticket.createdAt)) / 60000
        : null;

    const hours = waitingTimeInMinutes ? Math.floor(waitingTimeInMinutes / 60) : 0;
    const minutes = waitingTimeInMinutes ? Math.floor(waitingTimeInMinutes % 60) : 0;

    return {
      id: ticket.id,
      contact: ticket.contact?.name || "Sem Contato",
      createdAt: ticket.createdAt,
      waitingTime: waitingTimeInMinutes ? `${hours}h ${minutes}m` : "N/A",
    };
  });

  const validTickets = data.filter((ticket) => ticket.waitingTime !== "N/A");

  const totalTimeInMinutes = validTickets.reduce((acc, ticket) => {
    const [hours, minutes] = ticket.waitingTime.split(" ").map((val) => parseInt(val) || 0);
    return acc + hours * 60 + minutes;
  }, 0);

  const avgTimeInMinutes = validTickets.length > 0 ? totalTimeInMinutes / validTickets.length : 0;

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
        style={{ fontWeight: "bold", color: "#333", display: "flex", alignItems: "center" }}
      >
        <AccessTimeIcon style={{ marginRight: 8, color: "#1976d2" }} />
        Tempo Médio de Espera por Ticket
      </Typography>

      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow style={{ backgroundColor: "#f0f0f0" }}>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>ID do Ticket</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Contato</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Data de Criação</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Tempo de Espera</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((ticket, index) => (
            <TableRow
              key={ticket.id}
              style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
            >
              <TableCell style={{ textAlign: "center" }}>{ticket.id}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{ticket.contact}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {new Date(ticket.createdAt).toLocaleString()}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>{ticket.waitingTime}</TableCell>
            </TableRow>
          ))}
          {validTickets.length > 0 && (
            <TableRow>
              <TableCell colSpan={3} style={{ fontWeight: "bold", textAlign: "center" }}>
                Tempo Médio
              </TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign: "center", color: "#1976d2" }}>
                <span role="img" aria-label="Relógio">⏱️</span> {avgHours}h {avgMinutes}m
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

export default WaitingTimeReport;