import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment"; // Ícone para tickets

const TableReport = ({ reports, classes }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // valor padrão
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // resetar para a primeira página
  };

  const paginatedReports = reports.slice(
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
        <AssignmentIcon style={{ marginRight: 8, color: "#1976d2" }} />
        Relatório de Tickets
      </Typography>

      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow style={{ backgroundColor: "#f5f5f5" }}>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>ID</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Início Ticket</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Ticket</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Setor</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Contato</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Ini. Atendimento</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Ini. Atendente</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Fim. Atendimento</TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Fim. Atendente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedReports.map((report, index) => (
            <TableRow
              key={report.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
              }}
            >
              <TableCell style={{ textAlign: "center" }}>{report.id}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <span
                  style={{
                    backgroundColor:
                      report.atualStatus === "open"
                        ? "MediumAquamarine"
                        : report.atualStatus === "closed"
                        ? "LightCoral"
                        : report.atualStatus === "pending"
                        ? "orange"
                        : "gray",
                    color: "white",
                    fontWeight: "bold",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
                >
                  {report.atualStatus === "open" && "Aberto"}
                  {report.atualStatus === "closed" && "Fechado"}
                  {report.atualStatus === "pending" && "Pendente"}
                  {!report.atualStatus && "N/A"}
                </span>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>{report.ticketId || "N/A"}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{report.queue?.name || "N/A"}</TableCell>
              <TableCell style={{ textAlign: "center" }}>{report.contact?.name || "N/A"}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {report.startedAt ? new Date(report.startedAt).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>{report.startedByUser?.name || "N/A"}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {report.finishedAt ? new Date(report.finishedAt).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>{report.finishedByUser?.name || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      <TablePagination
        component="div"
        count={reports.length}
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

export default TableReport;