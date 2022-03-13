import types from "./types";
import produce from "immer";

const INITIAL_STATE = {
  clientes: [],
};

const cliente = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPDATE_CLIENTES: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    default:
      return state;
  }
};

export default cliente;
