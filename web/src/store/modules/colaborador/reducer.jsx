import types from "./types";
import produce from "immer";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    messageModal: "default message",
    alert: false,
    confirmDelete: false,
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  colaboradores: [],
  colaborador: {
    nome: "",
    foto: "",
    email: "",
    senha: "",
    telefone: "",
    dataNascimento: "",
    sexo: "M",
    status: "A",
    pessoa: "individual",
    vinculo: "A",
    especialidades: [],
    contaBancaria: {
      titular: "",
      cpfCnpj: "",
      banco: "",
      tipo: "",
      agencia: "",
      numero: "",
      dv: "",
    },
  },
};

const colaborador = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_COLABORADOR: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_COLABORADOR: {
      return produce(state, (draft) => {
        draft.colaborador = INITIAL_STATE.colaborador;
        return draft;
      });
    }

    default:
      return state;
  }
};

export default colaborador;
