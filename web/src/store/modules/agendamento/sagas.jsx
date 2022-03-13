import { all, takeLatest, call, put } from "redux-saga/effects";
import types from './types'
import {updateAgendamentos} from './actions';
import api from "../../../services/api";
import consts from "../../../consts";

export function* filterAgendamentos({ start, end }) {
  try {
    const {data: res} = yield call(api.post, "/agendamento/filter", {
      salaoId: consts.salaoId,
      periodo: {
        inicio: start,
        final: end,
      },
    });
    if(res.error){
      alert(res.message);
      return false;
    }
    console.log(res);
    yield put(updateAgendamentos(res.agendamento))

  } catch (err) {
    alert(err.message);
  }
}

export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamentos)]);
