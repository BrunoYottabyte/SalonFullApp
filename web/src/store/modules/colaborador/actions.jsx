import types from "./types";

export function allColaborador() {
  return {
    type: types.ALL_COLABORADOR,
  };
}

export function updateColaborador(payload) {
  return {
    type: types.UPDATE_COLABORADOR,
    payload,
  };
}

export function filterColaboradores() {
  return {
    type: types.FILTER_COLABORADOR,
  };
}

export function addColaborador() {
  return {
    type: types.ADD_COLABORADOR,
  };
}

export function resetColaborador() {
  return {
    type: types.RESET_COLABORADOR,
  };
}

export function unlinkColaborador() {
  return {
    type: types.UNLINK_COLABORADOR,
  };
}

export function allServicos() {
  return {
    type: types.ALL_SERVICOS,
  };
}
