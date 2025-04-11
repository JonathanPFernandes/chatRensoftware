# Documentação para Implementar a Funcionalidade da Página "Relatório"

## Passo 1: Alterações no Backend

1. **Atualizar `systemRoutes.ts`**:
   - **Por que?**: As rotas são como endereços que dizem ao servidor onde encontrar diferentes funcionalidades. Precisamos adicionar novas rotas para que o servidor saiba como gerar e recuperar relatórios.
   - **O que fazer?**: Adicione as seguintes rotas:
   ```typescript
    import { Router } from "express";
    import isAuth from "../middleware/isAuth";
    import * as reportController from "../controllers/ReportController";

    import * as sytemController from "../controllers/SystemController";

    const systemRoutes = Router();

    systemRoutes.post("/restartpm2", isAuth, sytemController.restartPm2);
    // Rota para gerar um relatório
    systemRoutes.post("/reports", isAuth, reportController.generateReport);

    // Rota para recuperar dados do relatório
    systemRoutes.get("/reports", isAuth, reportController.getReports);

    export default systemRoutes;

   ```

2. **Criar `ReportController.ts`**:
   - **Por que?**: O controlador é responsável por lidar com a lógica de negócios. Ele processa as solicitações que chegam e retorna as respostas apropriadas.
   - **O que fazer?**: Crie um novo controlador para gerenciar a lógica dos relatórios:
   ```typescript
    import { Request, Response } from "express";
    import { generateReportService, getReportsService } from "../services/ReportServices/ReportServices"; // Crie esses serviços


    export const generateReport = async (req: Request, res: Response): Promise<Response> => {
        // Lógica para gerar relatório
        const reportData = await generateReportService(req.body);
        return res.status(200).json(reportData); // Retorna os dados do relatório
    };

    export const getReports = async (req: Request, res: Response): Promise<Response> => {
        // Lógica para recuperar relatórios
        const reports = await getReportsService();
        return res.status(200).json(reports); // Retorna a lista de relatórios
    };

   ```

3. **Criar `ReportServices.ts`**:
   - **Por que?**: Os serviços são responsáveis por interagir com o banco de dados ou realizar operações complexas. Eles mantêm a lógica separada do controlador, tornando o código mais organizado.
   - **O que fazer?**: Implemente serviços para lidar com a geração e recuperação de relatórios:
   ```typescript
    export const generateReportService = async (criteria: any) => {
    const reportData = await fetchDataBasedOnCriteria(criteria);
    const formattedReport = formatReport(reportData);
    return formattedReport;
    };

    export const getReportsService = async () => {
        const reports = await fetchReportsFromDatabase();
        return reports;
    };

    const fetchDataBasedOnCriteria = async (criteria: any) => {
        // Logic to fetch data from the database based on criteria
        // Example: return await database.query('SELECT * FROM reports WHERE ...', [criteria]);
    };

    const fetchReportsFromDatabase = async () => {
        // Logic to fetch existing reports from the database
        // Example: return await database.query('SELECT * FROM reports');
    };

    const formatReport = (data: any) => {
        // Logic to format the report data
        // Example: return { title: data.title, content: data.content };
        return data; // Placeholder implementation
    };

   ```

## Passo 2: Alterações no Frontend

1. **Criar/Atualizar Página de Relatório**:
   - **Por que?**: A página de relatório é onde os usuários verão as informações. Precisamos garantir que ela exiba os dados corretamente.
   - **O que fazer?**: Em `frontend/src/pages/Report/`, crie ou atualize o componente de relatório:
   ```javascript
   import React, { useEffect, useState } from 'react';
   import { fetchReports } from '../../services/reportService'; // Crie este serviço

   const ReportPage = () => {
       const [reports, setReports] = useState([]); // Estado para armazenar os relatórios

       useEffect(() => {
           const loadReports = async () => {
               const data = await fetchReports(); // Chama o serviço para buscar relatórios
               setReports(data); // Atualiza o estado com os dados recebidos
           };
           loadReports();
       }, []);

       return (
           <div>
               <h1>Relatórios</h1>
               {/* Renderize os relatórios aqui */}
           </div>
       );
   };

   export default ReportPage;
   ```

2. **Criar/Atualizar Serviço**:
   - **Por que?**: O serviço é responsável por fazer chamadas à API do backend para buscar dados. Ele facilita a comunicação entre o frontend e o backend.
   - **O que fazer?**: Implemente um serviço para buscar dados do relatório:
   ```javascript
   import axios from 'axios';

   export const fetchReports = async () => {
       const response = await axios.get('/reports'); // Faz uma solicitação GET para a rota de relatórios
       return response.data; // Retorna os dados recebidos
   };
   ```

3. **Garantir Roteamento**:
   - **Por que?**: O roteamento permite que os usuários naveguem entre diferentes páginas da aplicação. Precisamos garantir que a página de relatórios esteja acessível.
   - **O que fazer?**: Verifique se a página de relatório é acessível através do roteamento da aplicação.

## Passo 3: Testes
- **Por que?**: Testar é essencial para garantir que tudo funcione como esperado. Isso ajuda a identificar e corrigir problemas antes que os usuários vejam.
- **O que fazer?**: Teste a nova funcionalidade de relatório para garantir que funcione como esperado e que a página exiba os dados corretos.

Esta documentação fornece um guia abrangente para implementar a funcionalidade da página "Relatório" tanto no frontend quanto no backend da aplicação.
