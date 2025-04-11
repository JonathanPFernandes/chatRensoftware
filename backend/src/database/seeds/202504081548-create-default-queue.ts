import { QueryInterface } from "sequelize";

module.exports = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert(
        "Queues",
        [
            {
            name: "Financeiro",
            color: "#FF0000",
            greetingMessage: "Departamento Financeiro",
            startWork: "08:00",         
            endWork: "18:00",
            absenceMessage: "Estamos fora do horário de atendimento",
            createdAt: new Date(),
            updatedAt: new Date()
            },
            {
            name: "Suporte",
            color: "#00FF00",
            greetingMessage: "Departamento de Suporte",
            startWork: "08:00",
            endWork: "18:00",
            absenceMessage: "Estamos fora do horário de atendimento",
            createdAt: new Date(),
            updatedAt: new Date()
            }
        ],
        {}
        );
    },
    
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete("Queues", {});
    }
};