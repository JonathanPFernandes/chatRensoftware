import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  InputAdornment,
  Tooltip,
  Button,
  IconButton,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from "@material-ui/core/styles";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { toast } from "react-toastify";
import ModalReviews from "../../components/ModalReviews";
import api from "../../services/api";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import {
    AddCircleOutline,
    Search
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  spaco: {
    marginTop: theme.spacing(4),
  },
  table: {
    minWidth: 650,
    border: "1px solid #ddd",
  },
  tableHead: {
    backgroundColor: theme.palette.primary.light,
  },
  tableHeadCell: {
    color: theme.palette.common.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
      cursor: "pointer",
    },
  },
  tableCell: {
    textAlign: "center",
    padding: theme.spacing(1.5),
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusActive: {
    backgroundColor: "MediumAquamarine",
    color: "white",
    fontWeight: "bold",
    border: "1px solid green",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusInactive: {
    backgroundColor: "LightCoral",
    color: "white",
    fontWeight: "bold",
    border: "1px solid red",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  
}));

const TableReviews = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/templates");
        setReviews(data); // Inicialmente, exibe todos os dados
      } catch (err) {
        toast.error("Erro ao carregar templates de avaliação");
      }
    };

    fetchReviews();
  }, []);

  
  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Tem certeza de que deseja deletar este template?");
    if (!confirmDelete) return;
  
    try {
      await api.delete(`/templates/${reviewId}`); // Envia a requisição DELETE para a API
      toast.success("Template deletado com sucesso!");
  
      // Atualiza a lista de reviews localmente
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (err) {
      toast.error("Erro ao deletar o template");
    }
  };

  const handleOpenModal = (review = {}) => {
    setSelectedReview({
      ...review,
      options: review.options || [], // Garante que options seja um array, mesmo que undefined
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setModalOpen(false);
  };

  const handleSaveReview = (review) => {
    // Atualiza a lista de reviews após salvar
    setReviews((prev) =>
      review.id
        ? prev.map((r) => (r.id === review.id ? review : r))
        : [...prev, review]
    );
    handleCloseModal();
  };

  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchParam)
  );

  return (
    <div className={classes.spaco}>
      <MainHeader>
        <Title>{i18n.t("reviews.title")} ({reviews.length})</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="secondary" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title={i18n.t("reviews.buttons.add")}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal()}
            >
              <AddCircleOutline />
            </Button>
          </Tooltip>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Mensagem</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Setor</TableCell>
              <TableCell>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id} className={classes.tableRow}>
                <TableCell>{review.name}</TableCell>
                <TableCell>{review.message}</TableCell>
                <TableCell>
                    <span className={review.status === "active" ? classes.statusActive : classes.statusInactive}>
                        {review.status === "active" ? "Ativo" : "Inativo"}
                    </span>
                </TableCell>
                <TableCell>{review.queueId}</TableCell>
                <TableCell>
                  <IconButton 
                    size="small"
                    color="primary"
                    onClick={() => handleOpenModal(review)}                  >
                        <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small"
                    color="secondary"
                    onClick={() => handleDeleteReview(review.id)}>
                        <DeleteForeverIcon />
                    </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {modalOpen && (
        <ModalReviews
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveReview}
          reviewData={selectedReview}
          reviews={reviews} // Passa a lista de reviews para o modal
        />
      )}
    </div>
  );
};

export default TableReviews;