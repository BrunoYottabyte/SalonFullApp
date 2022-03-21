import { all } from "redux-saga/effects";

import agendamento from "./modules/agendamento/sagas";
import cliente from "./modules/cliente/sagas";
import colaborador from "./modules/colaborador/sagas";
import servico from "./modules/servico/sagas";
import horario from "./modules/horarios/sagas";
export default function* rootSaga() {
  return yield all([agendamento, cliente, colaborador, servico, horario]);
}
