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
import AssignmentIcon from "@material-ui/icons/Assignment"; // Ícone para tickets
import BusinessIcon from "@material-ui/icons/Business"; // Ícone para departamentos

const TotalTicketsByDepartment = ({ reports = [] }) => {
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
  const data = reports.reduce((acc, report) => {
    const department = report.queue?.name || "Sem Departamento";
    if (!acc[department]) acc[department] = 0;
    acc[department]++;
    return acc;
  }, {});

  const departments = Object.entries(data);

  // Paginação dos dados
  const paginatedDepartments = departments.slice(
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
        <BusinessIcon style={{ marginRight: 8, color: "#1976d2" }} />
        Total de Tickets por Departamento
      </Typography>

      <Table size={isMobile ? "small" : "medium"}>
        <TableHead>
          <TableRow style={{ backgroundColor: "#f5f5f5" }}>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
              Departamento
            </TableCell>
            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
              Total de Tickets
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedDepartments.map(([department, total], index) => (
            <TableRow
              key={department}
              style={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
              }}
            >
              <TableCell style={{ textAlign: "center" }}>{department}</TableCell>
              <TableCell
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#1565c0",
                }}
              >
                <AssignmentIcon
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                {total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      <TablePagination
        component="div"
        count={departments.length}
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

export default TotalTicketsByDepartment;