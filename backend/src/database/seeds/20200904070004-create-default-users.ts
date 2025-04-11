import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Jonathan",
          email: "admin@pressticket.com.br",
          passwordHash: "$2a$08$WaEmpmFDD/XkDqorkpQ42eUZozOqRCPkPcTkmHHMyuTGUOkI8dHsq",
          profile: "admin",
          tokenVersion: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Carlos",
          email: "carlos@pressticket.com.br",
          passwordHash: "$2a$08$WaEmpmFDD/XkDqorkpQ42eUZozOqRCPkPcTkmHHMyuTGUOkI8dHsq",
          profile: "user",
          tokenVersion: 0,    
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
    );
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Users", {});
  }
};
