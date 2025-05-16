import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import api from "../../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

const AttendantsPieChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: reviews } = await api.get("/reviews");

      const grouped = reviews.reduce((acc, review) => {
        const userName = review.user?.name || "Desconhecido";
        if (!acc[userName]) {
          acc[userName] = { name: userName, value: 0 };
        }
        acc[userName].value += 1;
        return acc;
      }, {});

      setChartData(Object.values(grouped));
    };

    fetchData();
  }, []);

  const options = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "bottom",
    },
    series: [
      {
        name: "Atendimentos",
        type: "pie",
        radius: "50%",
        data: chartData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: COLORS[index % COLORS.length],
          },
        })),
        label: {
          formatter: "{b}: {c} ({d}%)",
        },
      },
    ],
  };

  return (
    <div style={{ width: "90%", height: "400px" }}>
      <ReactECharts option={options} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default AttendantsPieChart;
