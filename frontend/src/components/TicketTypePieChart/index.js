import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../../services/api";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#E74C3C"];

const TicketTypeHalfDoughnutChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: reviews } = await api.get("/reviews");

      const groupedData = reviews.reduce((acc, review) => {
        const queueName = review.queue?.name || "Desconhecido";
        if (!acc[queueName]) {
          acc[queueName] = { name: queueName, value: 0 };
        }
        acc[queueName].value += 1;
        return acc;
      }, {});

      setData(Object.values(groupedData));
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={200}> {/* Altura reduzida */}
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="65%"           
          startAngle={180}
          endAngle={0}
          innerRadius={50}    
          outerRadius={80}   
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TicketTypeHalfDoughnutChart;
