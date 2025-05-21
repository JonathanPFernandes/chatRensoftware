import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
} from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";

const useStyles = makeStyles((theme) => ({
  spaco: {
    marginTop: theme.spacing(4),
  },
}));

const TableshowReviews = ({ reviews: externalReviews }) => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (!externalReviews) {
      const fetchReviews = async () => {
        try {
          const { data } = await api.get("/reviews");
          setReviews(data);
        } catch (err) {
          toast.error("Erro ao carregar reviews de avaliação");
        }
      };

      fetchReviews();
    } else {
      setReviews(externalReviews); // Usa os dados externos se fornecidos
    }
  }, [externalReviews]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetar para a primeira página
  };

  // Paginação dos dados
  const paginatedReviews = reviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className={classes.spaco}>
      <MainHeader>
        <Title>
          {i18n.t("reviews.title")} ({reviews.length})
        </Title>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contato</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Ticket</TableCell>
              <TableCell>Atendente</TableCell>
              <TableCell>Nota</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.contato?.name || "-"}</TableCell>
                <TableCell>{review.queue?.name || "-"}</TableCell>
                <TableCell>{review.ticketId || "-"}</TableCell>
                <TableCell>{review.user?.name || "-"}</TableCell>
                <TableCell>
                  {review.nota
                    ? [...Array(review.nota)].map((_, i) => (
                        <StarIcon key={i} style={{ color: "#FFD700" }} />
                      ))
                    : "-"}
                </TableCell>
                <TableCell>{formatDate(review.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={reviews.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Linhas por página"
      />
    </div>
  );
};

export default TableshowReviews;