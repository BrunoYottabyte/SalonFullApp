import { all } from "redux-saga/effects";

import agendamento from "./modules/agendamento/sagas";
import cliente from "./modules/cliente/sagas";
export default function* rootSaga() {
  return yield all([agendamento, cliente]);
}
