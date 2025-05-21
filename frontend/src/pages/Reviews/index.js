import React, { useState } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableReviews from "../../components/TableReviews";
import TableShowReviews from "../../components/TableshowReviews";
import TableAttendantsReviews from "../../components/TableAttendantsReviews";


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
    gap: "1px",
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
}));


const Reviews = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState("reviews");

  const tabs = [
    { id: "reviews", label: "Avaliações" },
    {id: "attendants", label: "Atendentes"},
    { id: "create", label: "Criar Avaliações" },
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

      {activeTab === "reviews" && <TableShowReviews />}
      {activeTab === "attendants" && <TableAttendantsReviews />}
      {activeTab === "create" && <TableReviews />}
    </Paper>
  );
};

export default Reviews;
