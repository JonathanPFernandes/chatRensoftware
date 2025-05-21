import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../../services/api";

const ResolutionTimeChart = () => {
  const [data, setData] = useState([]);

  // Função para formatar o tempo em horas e minutos
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: reports } = await api.get("/reports");

      const groupedData = reports.reduce((acc, report) => {
        const userName = report.finishedByUser?.name || "Desconhecido";

        // Verifica se os campos startedAt e finishedAt são válidos
        if (!report.startedAt || !report.finishedAt) {
          console.warn(`Dados inválidos para o ticket ${report.id}:`, report);
          return acc;
        }

        // Calcula o tempo de atendimento em minutos
        const resolutionTime = (new Date(report.finishedAt) - new Date(report.startedAt)) / 60000;

        if (!acc[userName]) {
          acc[userName] = { name: userName, totalTime: 0, tickets: 0 };
        }
        acc[userName].totalTime += resolutionTime; // Soma o tempo total de atendimento
        acc[userName].tickets += 1; // Conta o número de tickets atendidos
        return acc;
      }, {});

      // Calcula o tempo médio de atendimento para cada atendente
      const chartData = Object.values(groupedData).map((user) => ({
        name: user.name,
        avgTime: parseFloat((user.totalTime / user.tickets).toFixed(2)), // Tempo médio em minutos
      }));

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => (value > 0 ? formatTime(value) : "N/A")} // Exibe "N/A" para valores inválidos
        />
        <Tooltip
          formatter={(value) => formatTime(value)} // Formata o tempo no tooltip
          labelFormatter={(label) => `Atendente: ${label}`} // Formata o rótulo do tooltip
        />
        <Legend formatter={() => "Tempo Médio"} /> {/* Altera o rótulo da legenda */}
        <Bar dataKey="avgTime" name="Tempo Médio" fill="#34c38f" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ResolutionTimeChart;