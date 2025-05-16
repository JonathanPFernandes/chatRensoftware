import React, { useEffect, useState } from "react";
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
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spaco: {
    marginTop: theme.spacing(4),
  },
  tableHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  green: {
    backgroundColor: "#d4edda",
    color: "#155724",
    fontWeight: "bold",
  },
  orange: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    fontWeight: "bold",
  },
  red: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    fontWeight: "bold",
  },
}));

const TableAttendantsReviews = () => {
  const classes = useStyles();
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/reviews");

        const groupedAttendants = data.reduce((acc, review) => {
          const userId = review.user.id;
          if (!acc[userId]) {
            acc[userId] = {
              user: review.user,
              totalReviews: 0,
              totalScore: 0,
            };
          }
          acc[userId].totalReviews += 1;
          acc[userId].totalScore += review.nota;
          return acc;
        }, {});

        const attendantsArray = Object.values(groupedAttendants).map((attendant) => ({
          ...attendant,
          averageScore: (attendant.totalScore / attendant.totalReviews).toFixed(2),
        }));

        setAttendants(attendantsArray);
      } catch (err) {
        toast.error("Erro ao carregar reviews de avaliação");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getNotaClass = (nota) => {
    const score = parseFloat(nota);
    if (score < 3) return classes.red;
    if (score <= 4) return classes.orange;
    return classes.green;
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={classes.spaco}>
      <MainHeader>
        <Title>
          {i18n.t("reviews.title")} ({attendants.length})
        </Title>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow className={classes.tableHeader}>
              <TableCell>Atendente</TableCell>
              <TableCell>Atendimentos</TableCell>
              <TableCell>Média Nota</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendants.map((attendant) => (
            <TableRow key={attendant.user.id} className={getNotaClass(attendant.averageScore)}>
                <TableCell>{attendant.user?.name || "-"}</TableCell>
                <TableCell>{attendant.totalReviews}</TableCell>
                <TableCell>{attendant.averageScore}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableAttendantsReviews;
