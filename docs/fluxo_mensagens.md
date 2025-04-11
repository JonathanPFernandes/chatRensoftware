# Fluxo de Mensagens na Aplicação

1. **Entrada do Usuário**:
   - O atendente insere uma mensagem na interface do usuário (frontend), especificamente na página de tickets.


2. **Envio da Mensagem**:
   - Quando o atendente clica em "Enviar", a mensagem é enviada para o backend através da função `store` no `MessageController.ts`, que está responsável por processar a mensagem e interagir com o banco de dados.


3. **Processamento da Mensagem**:
   - A função `store` recebe os parâmetros da requisição, incluindo o `ticketId`, o corpo da mensagem (`body`) e uma mensagem citada (`quotedMsg`), se houver. Essa função também verifica se existem arquivos de mídia anexados.

   - A função verifica se existem arquivos de mídia anexados. Se houver, ela processa cada arquivo de mídia usando a função `SendWhatsAppMedia`. Caso contrário, ela envia a mensagem de texto usando a função `SendWhatsAppMessage`.

4. **Interação com o Banco de Dados**:
   - A função `ShowTicketService` é chamada para recuperar os detalhes do ticket associado ao `ticketId`. Após o envio da mensagem, a mensagem é armazenada na tabela `messages` do banco de dados, que contém todos os detalhes da mensagem, como `body`, `ticketId`, e `contactId`.

   - Após o envio da mensagem, a função atualiza o ticket com a última mensagem enviada.

5. **Envio da Mensagem via WhatsApp**:
   - A mensagem é enviada para o número de contato associado ao ticket usando a biblioteca `whatsapp-web.js`, que se conecta à API do WhatsApp para enviar a mensagem.

   - Se a mensagem for enviada com sucesso, o ticket é atualizado com a última mensagem.

6. **Atualização em Tempo Real**:
   - O sistema emite um evento para atualizar a interface do usuário em tempo real, informando que uma nova mensagem foi enviada, permitindo que o atendente e o cliente vejam a mensagem instantaneamente.


### Conclusão
Esse fluxo garante que as mensagens enviadas pelo atendente sejam processadas corretamente e salvas no banco de dados, permitindo uma comunicação eficiente através da aplicação.
