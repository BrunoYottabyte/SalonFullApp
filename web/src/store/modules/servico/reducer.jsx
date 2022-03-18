import types from "./types";
import produce from "immer";
import moment from "moment";
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
  servicos: [],
  servico: {
    titulo: "",
    preco: "",
    comissao: "",
    duracao: moment('00:30').format('HH:mm'),
    recorrencia: "",
    descricao: "",
    status: 'A',
    arquivos: [],
  },
};

const servico = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_SERVICO: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_SERVICO: {
      return produce(state, (draft) => {
        draft.servico = INITIAL_STATE.servico;
        return draft;
      });
    }

    default:
      return state;
  }
};

export default servico;
