import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  TablePagination,
} from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";

const AverageReviewsByAttendant = ({ reviews = [] }) => {
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
  const data = reviews.reduce((acc, review) => {
    const attendant = review.user?.name || "Desconhecido";
    if (!acc[attendant]) acc[attendant] = { total: 0, count: 0, tickets: new Set() };
    acc[attendant].total += review.nota;
    acc[attendant].count++;
    acc[attendant].tickets.add(review.ticketId);
    return acc;
  }, {});

  const attendants = Object.entries(data);

  // Paginação dos dados
  const paginatedAttendants = attendants.slice(
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
        <StarIcon style={{ marginRight: 8, color: "#f9a825" }} />
        Média de Avaliações e Total de Tickets por Atendente
      </Typography>

      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow style={{ backgroundColor: "#f0f0f0" }}>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Atendente</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Média de Avaliações</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Total de Tickets</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAttendants.map(([attendant, { total, count, tickets }], index) => (
            <TableRow
              key={attendant}
              style={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
              }}
            >
              <TableCell style={{ textAlign: "center", fontWeight: 500 }}>{attendant}</TableCell>
              <TableCell style={{ textAlign: "center", color: "#f57c00", fontWeight: "bold" }}>
                {(total / count).toFixed(2)}
              </TableCell>
              <TableCell style={{ textAlign: "center", fontWeight: 500 }}>{tickets.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      <TablePagination
        component="div"
        count={attendants.length}
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

export default AverageReviewsByAttendant;