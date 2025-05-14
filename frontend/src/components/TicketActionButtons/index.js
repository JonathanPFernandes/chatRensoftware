import React, { useContext, useState, useEffect, useCallback } from "react";
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
	const userId = user?.id;


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
				(template) => template.queueId === queueId && template.status === "active"
			);
	
			if (!activeTemplate) {
				toast.error("Nenhum template ativo encontrado para este setor.");
				return;
			}
	
			// Salva as opções para serem usadas na verificação da resposta
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
		console.log("Conectando ao WebSocket...");

		socket.on("connect", () => {
			console.log("WebSocket conectado com sucesso!");
			socket.emit("joinChatBox", ticket.id); // Ingressa no canal do ticket
		});

		socket.on("Reviews", async (data) => {
			console.log("Evento 'Reviews' recebido:", data);

			if (data.contactId === ticket.contactId) {
			console.log("Mensagem pertence ao ticket atual.");

			if (data.fromMe === false) {
				console.log("Mensagem enviada pelo contato:", data.body);

				const isValidResponse = options.some(
					(option) => option.number.toString() === data.body.toString().trim()
				);

				if (isValidResponse) {
				console.log("Resposta válida recebida. Fechando o ticket...");
				toast.success("Avaliação finalizada com sucesso!");
				await handleUpdateTicketStatus(null, "closed", userId);
				} else {
				console.log("Resposta inválida recebida:", data.body);
				}
			}
			}
		});

		socket.on("disconnect", () => {
			console.log("WebSocket desconectado.");
		});

		return () => {
			socket.disconnect();
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
						
							// Aguarda 5 minutos ou a resposta do contato antes de fechar o ticket
							setTimeout(async () => {
							  await handleUpdateTicketStatus(e, "closed", user?.id);
							}, 5 * 60 * 1000); // 5 minutos
						  }}
					>
						{i18n.t("messagesList.header.buttons.resolve")}
					</ButtonWithSpinner>
					<IconButton
						color="primary"
						onClick={handleOpenTicketOptionsMenu}>
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
