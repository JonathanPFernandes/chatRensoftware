import { toast } from "react-toastify";
import { i18n } from "../translate/i18n";

const toastError = err => {
    // Verifica se err.response e err.response.data existem
    const errorMsg = err.response?.data?.message || err.response?.data?.error;

    if (errorMsg) {
        // Verifica se existe uma tradução para o erro no i18n
        if (i18n.exists(`backendErrors.${errorMsg}`)) {
            toast.error(i18n.t(`backendErrors.${errorMsg}`), {
                toastId: errorMsg,
            });
        } else {
            toast.error(errorMsg, {
                toastId: errorMsg,
            });
        }
    } else {
        // Mensagem genérica caso não haja detalhes do erro
        toast.error("An error occurred!");
    }
};

export default toastError;