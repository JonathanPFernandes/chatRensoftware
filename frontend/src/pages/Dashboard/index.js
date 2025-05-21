import React, { useContext } from "react"

import Paper from "@material-ui/core/Paper"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography";
import useTickets from "../../hooks/useTickets"
import { AuthContext } from "../../context/Auth/AuthContext";
import { i18n } from "../../translate/i18n";
import Chart from "./Chart"
import AttendantsBarChart from "../../components/AttendantsBarChart";
import ResolutionTimeChart from "../../components/ResolutionTimeChart";
import TicketTypePieChart from "../../components/TicketTypePieChart";
import AttendantsRadarChart from "../../components/AttendantsRadarChart";
import WaitingTimeChart from "../../components/WaitingTimeChart";


const useStyles = makeStyles(theme => ({
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	fixedHeightPaper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
		height: 280,
	},
	customFixedHeightPaper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
		height: 120,
	},
	customFixedHeightPaperLg: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
		height: "100%",
	},
	responsiveText: {
		fontSize: "1.25rem", // Tamanho padrão (h6)
		[theme.breakpoints.down("sm")]: {
		fontSize: "1rem", // Tamanho menor para telas pequenas
		textAlign: "center",
		},
		[theme.breakpoints.down("xs")]: {
		fontSize: "0.875rem", // Tamanho ainda menor para telas muito pequenas
		},
	},
}))

const Dashboard = () => {
	const classes = useStyles()

	const { user } = useContext(AuthContext);
	var userQueueIds = [];

	if (user.queues && user.queues.length > 0) {
		userQueueIds = user.queues.map(q => q.id);
	}

	const GetTickets = (status, showAll, withUnreadMessages) => {

		const { count } = useTickets({
			status: status,
			showAll: showAll,
			withUnreadMessages: withUnreadMessages,
			queueIds: JSON.stringify(userQueueIds)
		});
		return count;
	}

	return (
		<div>
			<Container maxWidth="lg" className={classes.container}>
				<Grid container spacing={3}>
					<Grid item xs={4}>
						<Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
							<Typography component="h3" variant="h6" color="primary" paragraph  className={classes.responsiveText}>
								{i18n.t("dashboard.messages.inAttendance.title")}
							</Typography>
							<Grid item>
								<Typography component="h1" variant="h4">
									{GetTickets("open", "true", "false")}
								</Typography>
							</Grid>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
							<Typography component="h3" variant="h6" color="primary" paragraph>
								{i18n.t("dashboard.messages.waiting.title")}
							</Typography>
							<Grid item>
								<Typography component="h1" variant="h4">
									{GetTickets("pending", "true", "false")}
								</Typography>
							</Grid>
						</Paper>
					</Grid>
					<Grid item xs={4}>
						<Paper className={classes.customFixedHeightPaper} style={{ overflow: "hidden" }}>
							<Typography component="h3" variant="h6" color="primary" paragraph>
								{i18n.t("dashboard.messages.closed.title")}
							</Typography>
							<Grid item>
								<Typography component="h1" variant="h4">
									{GetTickets("closed", "true", "false")}
								</Typography>
							</Grid>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						<Paper className={classes.fixedHeightPaper}>
							<Chart />
						</Paper>
					</Grid>
					{/* Gráficos */}
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.fixedHeightPaper}>
                            <Typography component="h3" variant="h6" color="primary" paragraph>
                                Atendimentos por Atendente
                            </Typography>
                            <AttendantsBarChart />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.fixedHeightPaper}>
                            <Typography component="h3" variant="h6" color="primary" paragraph>
                                Tempo Médio de Resolução
                            </Typography>
                            <ResolutionTimeChart />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.fixedHeightPaper}>
                            <Typography component="h3" variant="h6" color="primary" paragraph>
                                Avaliações por Tipo de Ticket
                            </Typography>
                            <TicketTypePieChart />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={classes.fixedHeightPaper}>
                            <Typography component="h3" variant="h6" color="primary" paragraph>
                                Comparação de Atendentes
                            </Typography>
                            <AttendantsRadarChart />
                        </Paper>
                    </Grid>
					<Grid item xs={12}>
						<Paper className={classes.fixedHeightPaper}>
							<Typography component="h3" variant="h6" color="primary" paragraph>
								Tempo Médio de Espera
							</Typography>
							<WaitingTimeChart />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</div>
	)
}

export default Dashboard