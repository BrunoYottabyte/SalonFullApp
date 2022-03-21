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
  const { form } = yield select((state) => state.servico);
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
    yield put(updateServico({ form: { ...form, saving: true } }));
    console.log(servico.salaoId);
    const formData = new FormData();
    console.log(servico.arquivos);
    formData.append("servico", JSON.stringify(servico));
    formData.append("salaoId", consts.salaoId);
    servico.arquivos.map((a, i) => {
      formData.append(`arquivo_${i}`, a);
    });

    const { data: res } = yield call(
      api[behavior === "create" ? "post" : "put"],
      behavior === "create" ? `/servico` : `/servico/${servico._id}`,
      formData
    );

    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      yield put(
        updateServico({
          components: { ...components, messageAlert: res.message },
        })
      );

      yield put(allServicosAction());
      return false;
    }

    yield put(resetServico());
    yield put(allServicosAction());
    yield put(updateServico({ components: { ...components, drawer: false } }));
  } catch (err) {
    yield put(updateServico({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export function* removeServico() {
  const { form, servico, components } = yield select((state) => state.servico);
  console.log(servico);
  try {
    yield put(updateServico({ form: { ...form, saving: true } }));
    const { data: res } = yield call(api.delete, `/servico/${servico._id}`);

    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allServicosAction());
    yield put(
      updateServico({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );

    yield put(resetServico());
  } catch (err) {
    yield put(updateServico({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export function* removeArquivo({ key, type }) {
  const { form } = yield select((state) => state.servico);
  try {
    const { data: res } = yield call(api.post, `/servico/delete-arquivo`, {
      key,
    });
    yield put(allServicosAction());
    yield put(updateServico({ form: { ...form, saving: false } }));
  } catch (err) {
    yield put(updateServico({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export default all([
  takeLatest(types.ADD_SERVICO, addServico),
  takeLatest(types.REMOVE_SERVICO, removeServico),
  takeLatest(types.REMOVE_ARQUIVO, removeArquivo),
  takeLatest(types.ALL_SERVICO, allServicos),
  takeLatest(types.RESET_SERVICO, resetServico),
]);
