import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from "@material-ui/core";
import clsx from "clsx";

const TableReport = ({ reports, classes }) => {
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>ID</TableCell>
            <TableCell className={classes.tableHeadCell}>Status</TableCell>
            <TableCell className={classes.tableHeadCell}>Início Ticket</TableCell>
            <TableCell className={classes.tableHeadCell}>Ticket</TableCell>
            <TableCell className={classes.tableHeadCell}>Setor</TableCell>
            <TableCell className={classes.tableHeadCell}>Contato</TableCell>
            <TableCell className={classes.tableHeadCell}>Ini. Atendimento</TableCell>
            <TableCell className={classes.tableHeadCell}>Ini. Atendente</TableCell>
            <TableCell className={classes.tableHeadCell}>Fim. Atendimento</TableCell>
            <TableCell className={classes.tableHeadCell}>Fim. Atendente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id} className={classes.tableRow}>
              <TableCell className={classes.tableCell}>{report.id}</TableCell>
              <TableCell className={classes.tableCell}>
                <span
                  className={clsx({
                    [classes.statusOpen]: report.atualStatus === "open",
                    [classes.statusClosed]: report.atualStatus === "closed",
                    [classes.statusPending]: report.atualStatus === "pending",
                    [classes.statusDefault]: !report.atualStatus,
                  })}
                >
                  {report.atualStatus === "open" && "Aberto"}
                  {report.atualStatus === "closed" && "Fechado"}
                  {report.atualStatus === "pending" && "Pendente"}
                  {!report.atualStatus && "N/A"}
                </span>
              </TableCell>
              <TableCell className={classes.tableCell}>
                {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell className={classes.tableCell}>{report.ticketId || "N/A"}</TableCell>
              <TableCell className={classes.tableCell}>{report.queue?.name || "N/A"}</TableCell>
              <TableCell className={classes.tableCell}>{report.contact?.name || "N/A"}</TableCell>
              <TableCell className={classes.tableCell}>
                {report.startedAt ? new Date(report.startedAt).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell className={classes.tableCell}>{report.startedByUser?.name || "N/A"}</TableCell>
              <TableCell className={classes.tableCell}>
                {report.finishedAt ? new Date(report.finishedAt).toLocaleString() : "N/A"}
              </TableCell>
              <TableCell className={classes.tableCell}>{report.finishedByUser?.name || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableReport;