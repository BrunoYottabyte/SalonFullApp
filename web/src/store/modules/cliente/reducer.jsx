import types from "./types";
import produce from "immer";

const INITIAL_STATE = {
  behavior: "create", //update tb
  components: {
    drawer: false,
    confirmDelete: false,
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  clientes: [],
  cliente: {
    nome: "",
    foto: "String",
    email: "",
    senha: "",
    telefone: "",
    area: "",
    dataNascimento: "",
    sexo: "",
    status: "",
    documento: {
      tipo: "",
      numero: "",
      docType: "",
    },
    endereco: {
      rua: "",
      complementar: "",
      cidade: "",
      uf: "",
      cep: "",
      paisCode: "",
      pais: "",
    },
  },
};

const cliente = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CLIENTE: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }

    case types.RESET_CLIENTE: {
      return produce(state, (draft) => {
        draft.cliente = INITIAL_STATE.cliente;
      });
    }

    default:
      return state;
  }
};

export default cliente;
