import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  IconButton,
} from "@material-ui/core";
import { AddCircleOutline, RemoveCircleOutline } from "@material-ui/icons";

const ReviewSchema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  message: Yup.string().required("Mensagem é obrigatória"),
  status: Yup.string().required("Status é obrigatório"),
  queueId: Yup.string().required("Fila é obrigatória"),
});

const ModalReviews = ({ open, onClose, onSave, reviewData, reviews }) => {
  const [queue, setQueue] = useState([]);
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    status: "active",
    queueId: "",
    options: [],
  });

  useEffect(() => {
    if (open) {
      const firstFocusableElement = document.querySelector("[role='dialog'] button");
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const { data } = await api.get("/queue");
        setQueue(data);
      } catch (err) {
        toast.error("Erro ao carregar filas");
      }
    };

    fetchQueue();
  }, []);

  useEffect(() => {
    if (reviewData) {
      setFormData({
        ...reviewData,
        queueId: queue.some((q) => q.id === reviewData.queueId) ? reviewData.queueId : "", // Verifica se o queueId é válido
        options: reviewData.options || [], // Garante que as opções sejam carregadas
      });
      setOptions(reviewData.options || []); // Atualiza o estado local de opções
    } else {
      setFormData({
        name: "",
        message: "",
        status: "active",
        queueId: "",
        options: [],
      });
      setOptions([]);
    }
  }, [reviewData, queue]);

  const validateActiveStatus = (formData) => {
    if (formData.status === "active") {
      const alreadyActive = reviews.some(
        (review) =>
          review.queueId === formData.queueId && review.status === "active" && review.id !== formData.id
      );
  
      if (alreadyActive) {
        toast.error("Já existe um template ativo para este setor.");
        return false;
      }
    }
    return true;
  };

  const handleSaveReview = async (formData) => {
    // Valida se já existe um template ativo no mesmo setor
    if (!validateActiveStatus(formData)) {
      return; // Interrompe o processo de salvamento se a validação falhar
    }
  
    const valuess = { ...formData, options };
    try {
      if (formData.id) {
        // Atualiza o template existente
        await api.put(`/templates/${formData.id}`, valuess);
        toast.success("Template atualizado com sucesso!");
      } else {
        // Cria um novo template
        await api.post("/templates", valuess);
        toast.success("Template criado com sucesso!");
      }
  
      // Atualiza a lista de reviews localmente
      onSave(valuess);
      onClose();
    } catch (err) {
      toast.error("Erro ao salvar o template");
    }
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { number: "", qualification: "" }]);
  };
  
  const handleRemoveOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleOptionChange = (index, field, value) => {
    setOptions((prev) => {
      const updatedOptions = [...prev];
      updatedOptions[index][field] = value;
      return updatedOptions;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          margin: "auto",
          maxWidth: "500px",
        },
      }}
    >
      <DialogTitle>
        {reviewData ? "Editar Avaliação" : "Adicionar Avaliação"}
      </DialogTitle>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={ReviewSchema}
        onSubmit={(formData) => handleSaveReview(formData)}
      >
        {({ values, touched, errors, handleChange, isSubmitting }) => (
            
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                label="Nome"
                name="name"
                value={values.name || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="dense"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                label="Mensagem"
                name="message"
                value={values.message || ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                margin="dense"
                multiline
                minRows={3}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
              />
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Status</InputLabel>
                <Field
                  as={Select}
                  name="status"
                  value={values.status || ""}
                  onChange={handleChange}
                  label="Status"
                  error={touched.status && Boolean(errors.status)}
                >
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </Field>
              </FormControl>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Fila</InputLabel>
                <Field
                  as={Select}
                  name="queueId"
                  value={values.queueId || ""}
                  onChange={handleChange}
                  label="Fila"
                  error={touched.queueId && Boolean(errors.queueId)}
                >
                  {queue.length > 0 ? (
                    queue.map((q) => (
                      <MenuItem key={q.id} value={q.id}>
                        {q.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Nenhuma fila disponível</MenuItem>
                  )}
                </Field>
              </FormControl>
              <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                Opções de Avaliação
              </Typography>
              {options.map((option, index) => (
                <div
                    key={index}
                    style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    }}
                >
                    <TextField
                    label="Número da Opção"
                    name={`options[${index}].number`}
                    value={option.number || ""}
                    onChange={(e) =>
                        handleOptionChange(index, "number", e.target.value)
                    }
                    variant="outlined"
                    margin="dense"
                    style={{ flex: 1 }}
                    />
                    <TextField
                    label="Qualificação"
                    name={`options[${index}].qualification`}
                    value={option.qualification || ""}
                    onChange={(e) =>
                        handleOptionChange(index, "qualification", e.target.value)
                    }
                    variant="outlined"
                    margin="dense"
                    style={{ flex: 1 }}
                    />
                    <IconButton
                    color="secondary"
                    onClick={() => handleRemoveOption(index)}
                    >
                    <RemoveCircleOutline />
                    </IconButton>
                </div>
                ))}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddCircleOutline />}
                onClick={handleAddOption}
                style={{ marginTop: "10px" }}
              >
                Adicionar Opção
              </Button>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={onClose}
                color="secondary"
                disabled={isSubmitting}
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                variant="contained"
              >
                Salvar
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ModalReviews;