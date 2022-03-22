import { all, takeLatest, call, put, select, take } from "redux-saga/effects";
import consts from "../../../consts";
import api from "../../../services/api";
import types from "./types";
import {
  updateHorario,
  allHorarios as allHorariosAction,
  resetHorario,
} from "./actions";

export function* allHorarios() {
  const { form } = yield select((state) => state.horario);
  try {
    yield put(
      updateHorario({
        form: { ...form, filtering: true },
      })
    );
    const { data: res } = yield call(
      api.get,
      `/horario/salao/${consts.salaoId}`
    );

    yield put(
      updateHorario({
        form: { ...form, filtering: false },
      })
    );

    if (res.error) {
      alert(error.message);
      return false;
    }

    yield put(
      updateHorario({
        horarios: res.horarios,
      })
    );
  } catch (err) {
    yield put(
      updateHorario({
        form: { ...form, filtering: false },
      })
    );
    alert(err.message);
    return false;
  }
}

export function* addHorario() {
  const { form, horario, components, behavior } = yield select(
    (state) => state.horario
  );
  try {
    yield put(updateHorario({ form: { ...form, saving: true } }));
    let res = {};
    if (behavior === "create") {
      const response = yield call(api.post, `/horario`, {
        salaoId: consts.salaoId,
        ...horario,
      });
      res = response.data;
    } else {
      const response = yield call(api.put, `/horario/${horario._id}`, horario);
      res = response.data;
    }

    console.log(res);
    yield put(updateHorario({ form: { ...form, saving: false } }));

    if (res.error) {
      yield put(
        updateHorario({
          components: { ...components, messageAlert: res.message },
        })
      );
      // alert(res.message);
      yield put(allColaboradorAction());
      return false;
    }

    yield put(allHorariosAction());
    yield put(updateHorario({ components: { ...components, drawer: false } }));
    yield put(resetHorario());
  } catch (err) {
    yield put(updateHorario({ form: { ...form, saving: false } }));
    alert("catch", err.message);
  }
}

export function* allServicos() {
  const { form, horario, components } = yield select((state) => state.horario);
  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.get,
      `/salao/servicos/${consts.salaoId}`
    );
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }
    console.log("servico", res);
    yield put(updateHorario({ servicos: res.servicos }));
  } catch (err) {
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* filterColaboradores() {
  const { form, horario } = yield select((state) => state.horario);
  try {
    console.log(horario);
    yield put(updateHorario({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(api.post, `/horario/colaboradores`, {
      especialidades: horario.especialidades,
    });
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }
    console.log("filter", res);
    yield put(updateHorario({ colaboradores: res.listaColaboradores }));
  } catch (err) {
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* removeHorario() {
  const { form, horario, components } = yield select((state) => state.horario);
  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(api.delete, `/horario/${horario._id}`);
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allHorariosAction());
    yield put(
      updateHorario({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
    yield put(resetHorario());
  } catch (err) {
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_HORARIOS, allHorarios),
  takeLatest(types.ALL_SERVICOS, allServicos),
  takeLatest(types.ADD_HORARIO, addHorario),
  takeLatest(types.FILTER_COLABORADORES, filterColaboradores),
  takeLatest(types.REMOVE_HORARIO, removeHorario),
]);
