import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import api from "../../services/api";

const AttendantsBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: reviews } = await api.get("/reviews");

        const groupedData = reviews.reduce((acc, review) => {
          const userName = review.user?.name || "Desconhecido";
          if (!acc[userName]) {
            acc[userName] = { name: userName, atendimentos: 0, totalScore: 0 };
          }
          acc[userName].atendimentos += 1;
          acc[userName].totalScore += review.nota;
          return acc;
        }, {});

        const chartData = Object.values(groupedData).map((user) => ({
          name: user.name,
          atendimentos: user.atendimentos,
          avgScore: parseFloat((user.totalScore / user.atendimentos).toFixed(2)),
        }));

        setData(chartData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      data: ["Atendimentos", "Nota Média"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      data: data.map((d) => d.name),
    },
    series: [
      {
        name: "Atendimentos",
        type: "bar",
        data: data.map((d) => d.atendimentos),
        itemStyle: { color: "#0088FE" },
      },
      {
        name: "Nota Média",
        type: "bar",
        data: data.map((d) => d.avgScore),
        itemStyle: { color: "#FFBB28" },
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default AttendantsBarChart;
