import React, { useState, useEffect } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import api from "../../services/api";

import TableReport from "../../components/TableReport";
import TableFilter from "../../components/TableFilterReport";
import TotalTicketsByAttendant from "../../components/TotalTicketsByAttendant";
import TotalTicketsByDepartment from "../../components/TotalTicketsByDepartment";
import AverageReviewsByAttendant from "../../components/AverageReviewsByAttendant";
import ResolutionTimeReport from "../../components/ResolutionTimeReport";
import WaitingTimeReport from "../../components/WaitingTimeReport";
import ExportTotalTicketsByAttendant from "../../components/ExportTotalTicketsByAttendant";
import ExportDocReport from "../../components/ExportDocReport";
import ExportTotalTicketsByDepartment from "../../components/ExportTotalTicketsByDepartment";
import ExportAverageReviewsByAttendant from "../../components/ExportAverageReviewsByAttendant";
import ExportResolutionTimeReport from "../../components/ExportResolutionTimeReport";
import ExportWaitingTimeReport from "../../components/ExportWaitingTimeReport";
import TableShowReviews from "../../components/TableshowReviews";
import ExportReviewsReviews from "../../components/ExportReviewsReviews";


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  tabContainer: {
    display: "flex",
    overflowX: "auto",
    whiteSpace: "nowrap",
    gap: "1px", // opcional para espaçamento
  },

  tabButton: {
    padding: theme.spacing(1, 3),
    border: "none",
    cursor: "pointer",
    backgroundColor: "#dedaf2",
    borderBottom: "1px solid red",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "#e5e7eb",
    },
    "&:first-child": {
      borderTopLeftRadius: "8px",
    },
    "&:last-child": {
      borderTopRightRadius: "8px",
    },
    "&.active": {
      border: "1px solid red",
      borderBottom: "none",
      backgroundColor: "#fff",
      color: "red",
      fontWeight: "bold",
    },
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
  statusOpen: {
    backgroundColor: "MediumAquamarine",
    color: "white",
    fontWeight: "bold",
    border: "1px solid green",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusClosed: {
    backgroundColor: "LightCoral",
    color: "white",
    fontWeight: "bold",
    border: "1px solid red",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusPending: {
    backgroundColor: "orange",
    color: "white",
    fontWeight: "bold",
    border: "1px solid orange",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
  statusDefault: {
    backgroundColor: "gray",
    color: "white",
    fontWeight: "bold",
    border: "1px solid gray",
    padding: theme.spacing(0.5, 1),
    borderRadius: "4px",
    textAlign: "center",
  },
}));

const Reports = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsRes, reviewsRes] = await Promise.all([
          api.get("/reports"),
          api.get("/reviews"),
        ]);
        setReports(reportsRes.data);
        setFilteredReports(reportsRes.data);
        setReviews(reviewsRes.data);
        setFilteredReviews(reviewsRes.data); // Inicializa filteredReviews com os dados de reviews
      } catch (err) {
        toast.error("Erro ao carregar dados dos relatórios ou avaliações");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilter = (filter) => {
    setFilter(filter);
    let filtered = reports;

    // Filtro por texto
    if (filter.text?.trim()) {
      filtered = filtered.filter((report) => {
        const searchableFields = [
          report.id,
          report.atualStatus,
          report.queue?.name,
          report.contact?.name,
          report.finishedByUser?.name,
        ];

        return searchableFields.some((value) =>
          String(value || "").toLowerCase().includes(filter.text.toLowerCase())
        );
      });
    }

    // Filtro por status
    if (filter.status) {
      filtered = filtered.filter((report) => report.atualStatus === filter.status);
    }

    // Filtro por período de data
    if (filter.startDate) {
      filtered = filtered.filter(
        (report) => new Date(report.startedAt) >= new Date(filter.startDate)
      );
      console.log("startDate", filter.startDate);
    }
    if (filter.endDate) {
      filtered = filtered.filter((report) => {
        const finishedDate = new Date(report.finishedAt);
        const endDate = new Date(filter.endDate);

        // Comparar apenas ano, mês e dia
        const finishedDateStr = finishedDate.toISOString().split("T")[0];
        const endDateStr = endDate.toISOString().split("T")[0];

        return finishedDateStr <= endDateStr;
      });
    }

    // Filtro por setor
    if (filter.sector?.trim()) {
      filtered = filtered.filter((report) =>
        report.queue?.name?.toLowerCase().includes(filter.sector.toLowerCase())
      );
    }

    // Filtro por contato
    if (filter.contact?.trim()) {
      filtered = filtered.filter((report) =>
        report.contact?.name?.toLowerCase().includes(filter.contact.toLowerCase())
      );
    }

    // Filtro por atendente
    if (filter.attendant?.trim()) {
      filtered = filtered.filter((report) =>
        report.finishedByUser?.name
          ?.toLowerCase()
          .includes(filter.attendant.toLowerCase())
      );
    }

    setFilteredReports(filtered);
    console.log("filteredReports", filtered);

    // Filtragem de Reviews
    let filteredReviewsData = reviews;

    // Filtro por texto
    if (filter.text?.trim()) {
      filteredReviewsData = filteredReviewsData.filter((review) => {
        const searchableFields = [
          review.id,
          review.name,
          review.queue?.name,
          review.contato?.name,
          review.user?.name,
        ];

        return searchableFields.some((value) =>
          String(value || "").toLowerCase().includes(filter.text.toLowerCase())
        );
      });
    }

    // Filtro por período de data
    if (filter.startDate) {
      filteredReviewsData = filteredReviewsData.filter(
        (review) => new Date(review.createdAt) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filteredReviewsData = filteredReviewsData.filter(
        (review) => new Date(review.createdAt) <= new Date(filter.endDate)
      );
    }

    // Filtro por Contato
    if (filter.contact?.trim()) {
      filteredReviewsData = filteredReviewsData.filter((review) =>
        review.contato?.name
          ?.toLowerCase()
          .includes(filter.contact.toLowerCase())
      );
    }

    // Filtro por Departamento
    if (filter.sector?.trim()) {
      filteredReviewsData = filteredReviewsData.filter((review) =>
        review.queue?.name?.toLowerCase().includes(filter.sector.toLowerCase())
      );
    }

    // Filtro por Atendente
    if (filter.attendant?.trim()) {
      filteredReviewsData = filteredReviewsData.filter((review) =>
        review.user?.name
          ?.toLowerCase()
          .includes(filter.attendant.toLowerCase())
      );
    }

    setFilteredReviews(filteredReviewsData);

};
  

  const tabs = [
    { id: "tickets", label: "Total Tickets" },
    { id: "attendants", label: "Tickets por Atendente" },
    { id: "departments", label: "Tickets por Departamento" },
    { id: "reviews", label: "Média de Avaliações" },
    { id: "tReviews", label: "Avaliações" },
    { id: "resolution", label: "Tempo de Resolução" },
    { id: "waiting", label: "Tempo de Espera" },
  ];

  return (
    <Paper className={classes.paper}>
      <div className={classes.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${classes.tabButton} ${
              activeTab === tab.id ? "active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <TableFilter onFilter={handleFilter} filteredReports={filteredReports} />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          {activeTab === "tickets" && (
            <>
              <ExportDocReport filteredReports={filteredReports} filters={filter} />
              <TableReport reports={filteredReports} classes={classes} />
            </>
          )}
          {activeTab === "attendants" && (
            <>
              <ExportTotalTicketsByAttendant reports={filteredReports} filters={filter} />
              <TotalTicketsByAttendant reports={filteredReports} />
            </>
          )}
          {activeTab === "departments" && (
            <>
              <ExportTotalTicketsByDepartment reports={filteredReports} filters={filter} />
              <TotalTicketsByDepartment reports={filteredReports} />
            </>
          )}
          {activeTab === "reviews" && (
            <>
              <ExportAverageReviewsByAttendant reviews={filteredReviews} filters={filter} />
              <AverageReviewsByAttendant reviews={filteredReviews} />
            </>
          )}
          {activeTab === "tReviews" && (
            <>
              <ExportReviewsReviews reviews={filteredReviews} filters={filter} />
              <TableShowReviews reviews={filteredReviews} />
            </>
          )}
          {activeTab === "resolution" && (
            <>
              <ExportResolutionTimeReport reports={filteredReports} filters={filter} />
              <ResolutionTimeReport reports={filteredReports} />
            </>
          )}
          {activeTab === "waiting" && (
            <>
              <ExportWaitingTimeReport reports={filteredReports} filters={filter} />
              <WaitingTimeReport reports={filteredReports} />
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default Reports;
