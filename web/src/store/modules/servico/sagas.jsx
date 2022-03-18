import { all, takeLatest, call, put, select } from "redux-saga/effects";
import consts from "../../../consts";
import api from "../../../services/api";
import types from "./types";
import {
  updateServico,
  allServicos as allServicosAction,
  resetServico,
  removeArquivo as removeArquivoAction,
} from "./actions";


export function* allServicos() {
    const { form } = yield select(
      (state) => state.servico
    );
    try {
      yield put(updateServico({ form: { ...form, filtering: true } }));
      const { data: res } = yield call(
        api.get,
        `servico/salao/${consts.salaoId}`
      );
      yield put(updateServico({ form: { ...form, filtering: false } }));
  
      if (res.error) {
        alert(res.message);
        return false;
      }
      
  
      yield put(updateServico({ servicos: res.servicos }));
    } catch (err) {
      yield put(updateServico({ form: { ...form, filtering: false } }));
      alert(err.message);
    }
  }
  
export function* addServico() {
  const { form, servico, components, behavior } = yield select(
    (state) => state.servico
  );
  try {
    yield put(updateColaborador({ form: { ...form, saving: true } }));
    let res = {};
    if (behavior === "create") {
      const response = yield call(api.post, `/colaborador`, {
        salaoId: consts.salaoId,
        colaborador: { ...colaborador },
        especialidades: [`${consts.servidoId}`],
      });
      res = response.data;
    } else {
      const response = yield call(api.put, `/colaborador/${colaborador._id}`, {
        vinculo: colaborador.vinculo,
        vinculoId: colaborador.vinculoId,
        especialidades: colaborador.especialidades,
      });
      res = response.data;
    }

    console.log(res);
    yield put(updateColaborador({ form: { ...form, saving: false } }));

    if (res.error) {
      yield put(
        updateColaborador({
          components: { ...components, messageAlert: res.message },
        })
      );
      // alert(res.message);
      yield put(allColaboradorAction());
      return false;
    }

    yield put(allColaboradorAction());
    yield put(
      updateColaborador({ components: { ...components, drawer: false } })
    );
    yield put(resetColaborador());
  } catch (err) {
    yield put(updateColaborador({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export function* removeServico() {
  const { form, colaborador, components } = yield select(
    (state) => state.servico
  );

  try {
    yield put(updateColaborador({ form: { ...form, saving: true } }));
    const { data: res } = yield call(
      api.delete,
      `/colaborador/vinculo/${colaborador.vinculoId}`
    );

    yield put(updateColaborador({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allColaboradorAction());
    yield put(
      updateColaborador({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );

    yield put(resetColaborador());
  } catch (err) {
    yield put(updateColaborador({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export function* removeArquivo() {
    const { form, colaborador, components } = yield select(
      (state) => state.servico
    );
  
    try {
    } catch (err) {
      yield put(updateColaborador({ form: { ...form, saving: false } }));
      alert("catch", err.message);
    }
  }
  

export default all([

  takeLatest(types.ADD_SERVICO, addServico),
  takeLatest(types.REMOVE_SERVICO, removeServico),
  takeLatest(types.REMOVE_ARQUIVO, removeArquivo),
  takeLatest(types.ALL_SERVICO, allServicos),
]);
