import { all, takeLatest, call, put, select } from "redux-saga/effects";
import api from "../../../services/api";
import consts from "../../../consts";
import {
  updateCliente,
  allClientes as allClientesAction,
  resetCliente,
} from "./actions";
import types from "./types";

export function* allClientes() {
  const { form } = yield select((state) => state.cliente);
  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.get,
      `/cliente/salao/${consts.salaoId}`
    );

    yield put(updateCliente({ form: { ...form, filtering: false } }));
    if (res.error) {
      alert(res.message);
      return false;
    }
    yield put(updateCliente({ clientes: res.clientes }));
  } catch (err) {
    yield put(updateCliente({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* filterClientes() {
  const { form, cliente } = yield select((state) => state.cliente);
  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(api.post, `/cliente/filter`, {
      filters: {
        email: cliente.email,
        status: "A",
      },
    });

    yield put(updateCliente({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    if (res.clientes.length > 0) {
      yield put(
        updateCliente({
          cliente: res.clientes[0],
          form: { ...form, disabled: true },
        })
      );
    } else {
      yield put(updateCliente({ form: { ...form, disabled: false } }));
    }
  } catch (err) {
    yield put(updateCliente({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addCliente() {
  const { form, cliente } = yield select((state) => state.cliente);
  try {
    yield put(updateCliente({ form: { ...form, saving: true } }));
    const { data: res } = yield call(api.post, `/cliente`, {
      salaoId: consts.salaoId,
      cliente: { ...cliente, paisCode: "55", pais: "BR" },
    });

    yield put(updateCliente({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allClientesAction());
    yield put(updateCliente({ components: { ...components, drawer: false } }));
    yield put(resetCliente());
  } catch (err) {
    yield put(updateCliente({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_CLIENTES, allClientes),
  takeLatest(types.FILTER_CLIENTES, filterClientes),
  takeLatest(types.ADD_CLIENTE, addCliente),
]);
