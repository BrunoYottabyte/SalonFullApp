import { all, takeLatest, call, put, select } from "redux-saga/effects";
import consts from "../../../consts";
import api from "../../../services/api";
import types from "./types";
import { updateColaborador } from "./actions";

export function* allColaborador() {
  try {
    const { data: res } = yield call(
      api.get,
      `/colaborador/salao/${consts.salaoId}`
    );

    console.log(res);
    if (res.error) {
      alert(error.message);
      return false;
    }

    yield put(
      updateColaborador({
        colaboradores: res.colaboradores,
      })
    );
  } catch (err) {
    alert(err.message);
    return false;
  }
}

export function* filterColaboradores() {
  const { form, colaborador } = yield select((state) => state.colaborador);
  try {
    yield put(updateColaborador({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(api.post, `/colaborador/filter`, {
      filters: {
        email: colaborador.email,
        status: "A",
      },
    });
    yield put(updateColaborador({ form: { ...form, filtering: false } }));
    if (res.error) {
      alert(res.message);
      return false;
    }

    if (res.colaboradores.length > 0) {
      yield put(
        updateColaborador({
          colaborador: res.colaboradores[0],
          form: { ...form, disabled: true },
        })
      );
    } else {
      yield put(updateColaborador({ form: { ...form, disabled: false } }));
    }
  } catch (err) {
    yield put(updateColaborador({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addColaborador() {
  const { form, colaborador, components } = yield select(
    (state) => state.colaborador
  );
  try {
    yield put(updateColaborador({ form: { ...form, saving: true } }));
    const { data: res } = yield call(api.post, `/colaborador`, {
      salaoId: consts.salaoId,
      colaborador: { ...colaborador },
      especialidades: [`${consts.servidoId}`],
    });
    console.log(res);
    yield put(updateColaborador({ form: { ...form, saving: false } }));

    if (res.error) {
      yield put(
        updateColaborador({
          components: { ...components, messageAlert: res.message },
        })
      );
      // alert(res.message);
      //  yield put(allClientesAction());
      return false;
    }

    //     yield put(allClientesAction());
    yield put(
      updateColaborador({ components: { ...components, drawer: false } })
    );
    //     yield put(resetCliente());
  } catch (err) {
    yield put(updateColaborador({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export default all([
  takeLatest(types.ALL_COLABORADOR, allColaborador),
  takeLatest(types.FILTER_COLABORADOR, filterColaboradores),
  takeLatest(types.ADD_COLABORADOR, addColaborador),
]);
