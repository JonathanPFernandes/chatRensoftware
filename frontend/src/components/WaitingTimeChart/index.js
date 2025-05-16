import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../../services/api";

const WaitingTimeChart = () => {
  const [data, setData] = useState([]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/tickets");
        const tickets = Array.isArray(data) ? data : data.tickets || [];
        console.log("Tickets processados:", tickets);

        const groupedData = tickets.reduce((acc, ticket) => {
          const contactName = ticket.contact?.name || "Desconhecido";

          // Calcula o tempo de espera em minutos
          const waitingTime = ticket.startedAt && ticket.createdAt
            ? (new Date(ticket.startedAt) - new Date(ticket.createdAt)) / 60000
            : 0;

          if (!acc[contactName]) {
            acc[contactName] = { name: contactName, totalTime: 0, tickets: 0 };
          }
          acc[contactName].totalTime += waitingTime;
          acc[contactName].tickets += 1;
          return acc;
        }, {});

        const chartData = Object.values(groupedData).map((contact) => ({
          name: contact.name,
          avgTime: parseFloat((contact.totalTime / contact.tickets).toFixed(2)),
        }));

        setData(chartData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => formatTime(value)}
          labelFormatter={(label) => `Contato: ${label}`}
        />
        <Legend formatter={() => "Tempo Médio de Espera"} />
        <Bar dataKey="avgTime" name="Tempo Médio de Espera" fill="#8884d8" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WaitingTimeChart;