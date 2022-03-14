import { combineReducers } from "redux";

import agendamento from "./modules/agendamento/reducer";
import cliente from "./modules/cliente/reducer";

export default combineReducers({
  agendamento,
  cliente,
});
