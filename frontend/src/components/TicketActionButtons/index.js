import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import openSocket from "../../services/socket-io";
import { toast } from "react-toastify";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { MoreVert, Replay } from "@material-ui/icons";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";

const useStyles = makeStyles(theme => ({
  actionButtons: {
    marginRight: 6,
    flex: "none",
    alignSelf: "center",
    marginLeft: "auto",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const TicketActionButtons = ({ ticket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const ticketOptionsMenuOpen = Boolean(anchorEl);
  const { user } = useContext(AuthContext);
  const [options, setOptions] = useState([]);
  const timeoutRef = useRef(null);
  const userId = user?.id;
  const intervalRef = useRef(null);

  const handleOpenTicketOptionsMenu = e => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseTicketOptionsMenu = e => {
    setAnchorEl(null);
  };

  const messageReviews = async (userId, queueId, contactId) => {
    try {
      const { data: templates } = await api.get(`/templates`);
      const activeTemplate = templates.find(
        template => template.queueId === queueId && template.status === "active"
      );

      if (!activeTemplate) {
        toast.error("Nenhum template ativo encontrado para este setor.");
        return;
      }

      setOptions(activeTemplate.options || []);

      await api.post(`/messages/${ticket.id}`, {
        contactId: contactId,
        body: activeTemplate.message,
        fromMe: true,
        options: activeTemplate.options,
        templateId: activeTemplate.id,
      });

      toast.success("Mensagem de avaliação enviada com sucesso!");
    } catch (err) {
      toastError(err);
    }
  };

  const handleUpdateTicketStatus = useCallback(async (e, status, userId) => {
    setLoading(true);

    // Cancela o timeout pendente (caso exista)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: status,
        userId: userId || null,
      });

      setLoading(false);
      if (status === "open") {
        history.push(`/tickets/${ticket.id}`);
      } else {
        history.push("/tickets");
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  }, [ticket.id, history]);

  useEffect(() => {
    const socket = openSocket();
    socket.on("connect", () => {
      socket.emit("joinChatBox", ticket.id);
    });

    socket.on("Reviews", async (data) => {
      if (data.contactId === ticket.contactId && !data.fromMe) {
        const isValidResponse = options.some(
          option => option.number.toString() === data.body.toString().trim()
        );

        if (isValidResponse) {
          toast.success("Avaliação finalizada com sucesso!");

          // Cancela o timeout pendente se houver
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          await handleUpdateTicketStatus(null, "closed", userId);
        }
      }
    });

    return () => {
      socket.disconnect();

      // Cancela timeout se o componente for desmontado
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [ticket.id, ticket.contactId, options, userId, handleUpdateTicketStatus]);

  return (
    <div className={classes.actionButtons}>
      {ticket.status === "closed" && (
        <ButtonWithSpinner
          loading={loading}
          startIcon={<Replay />}
          size="small"
          onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
        >
          {i18n.t("messagesList.header.buttons.reopen")}
        </ButtonWithSpinner>
      )}

      {ticket.status === "open" && (
        <>
          <ButtonWithSpinner
            loading={loading}
            startIcon={<Replay />}
            size="small"
            onClick={e => handleUpdateTicketStatus(e, "pending", null)}
          >
            {i18n.t("messagesList.header.buttons.return")}
          </ButtonWithSpinner>

          <ButtonWithSpinner
            loading={loading}
            size="small"
            variant="contained"
            color="primary"
            onClick={async (e) => {
              // Envia a avaliação antes de fechar o ticket
              await messageReviews(user?.id, ticket.queueId, ticket.contactId);

              // Cancela qualquer timeout ou intervalo pendente antes de configurar um novo
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }

              // Define o tempo total (em segundos)
              const totalTime = 5 * 60; // 5 minutos
              let remainingTime = totalTime;

              // Configura o intervalo para exibir o tempo restante no console
              intervalRef.current = setInterval(() => {
                remainingTime -= 1;
                console.log(`Tempo restante para fechar o ticket: ${remainingTime} segundos`);

                // Cancela o intervalo quando o tempo acabar
                if (remainingTime <= 0) {
                  clearInterval(intervalRef.current);
                }
              }, 1000); // Atualiza a cada 1 segundo

              // Configura o timeout para fechar o ticket após 5 minutos
              timeoutRef.current = setTimeout(async () => {
                console.log("Timeout atingido. Fechando o ticket...");
                clearInterval(intervalRef.current); // Cancela o intervalo
                await handleUpdateTicketStatus(null, "closed", user?.id);
              }, totalTime * 1000); // 5 minutos
            }}
          >
            {i18n.t("messagesList.header.buttons.resolve")}
          </ButtonWithSpinner>

          <IconButton color="primary" onClick={handleOpenTicketOptionsMenu}>
            <MoreVert />
          </IconButton>

          <TicketOptionsMenu
            ticket={ticket}
            anchorEl={anchorEl}
            menuOpen={ticketOptionsMenuOpen}
            handleClose={handleCloseTicketOptionsMenu}
          />
        </>
      )}

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            {ticket.status === "pending" && (
              <ButtonWithSpinner
                loading={loading}
                size="small"
                variant="contained"
                color="primary"
                onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
              >
                {i18n.t("messagesList.header.buttons.accept")}
              </ButtonWithSpinner>
            )}
          </>
        )}
      />
    </div>
  );
};

export default TicketActionButtons;
