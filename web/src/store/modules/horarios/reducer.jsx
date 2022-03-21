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
  servicos: [],
  horarios: [],
  horario: {
    dias: [],
    inicio: "",
    fim: "",
    especialidades: [],
    colaboradores: [],
  },
};

const horario = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_HORARIO: {
      produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_HORARIO: {
      produce(state, (draft) => {
        draft.horario = INITIAL_STATE.horario;
        return draft;
      });
    }

    default:
      return state;
  }
};

export default horario;
