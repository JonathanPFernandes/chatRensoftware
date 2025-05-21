import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import api from "../../services/api";

const WaitingTimeChart = () => {
  const [data, setData] = useState([]);

  // Função para formatar o tempo em horas e minutos
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/reports");
        const tickets = Array.isArray(response.data) ? response.data : response.data.tickets || [];

        const grouped = tickets.reduce((acc, ticket) => {
          const contactName = ticket.contact?.name || "Desconhecido";

          // Verifica se os campos startedAt e createdAt são válidos
          if (!ticket.startedAt || !ticket.createdAt) {
            console.warn(`Dados inválidos para o ticket ${ticket.id}:`, ticket);
            return acc;
          }

          // Calcula o tempo de espera em minutos
          const waitingTime =
            (new Date(ticket.startedAt) - new Date(ticket.createdAt)) / 60000;

          if (!acc[contactName]) {
            acc[contactName] = { name: contactName, totalTime: 0, tickets: 0 };
          }

          acc[contactName].totalTime += waitingTime;
          acc[contactName].tickets += 1;

          return acc;
        }, {});

        // Calcula o tempo médio de espera para cada contato
        const chartData = Object.values(grouped).map((entry) => ({
          name: entry.name.length > 10 ? entry.name.slice(0, 10) + "…" : entry.name,
          avgTime: parseFloat((entry.totalTime / entry.tickets).toFixed(2)), // Tempo médio em minutos
          ticketCount: entry.tickets,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => formatTime(value)} // Formata os valores do eixo Y
          />
          <Tooltip
            formatter={(value, name) =>
              name === "avgTime" ? formatTime(value) : `${value} tickets`
            }
            labelFormatter={() => ""} // Remove o "Contato" do Tooltip
          />
          <Legend />
          <Bar
            dataKey="avgTime"
            fill="#8884d8"
            name="Tempo Médio de Espera"
          >
            <LabelList dataKey="avgTime" position="top" formatter={(v) => formatTime(v)} />
          </Bar>
          <Bar
            dataKey="ticketCount"
            fill="#82ca9d"
            name="Qtd. Tickets"
          >
            <LabelList dataKey="ticketCount" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaitingTimeChart;