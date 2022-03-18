import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./styles.css";

//components
import Header from "./componets/Header";
import Sidebar from "./componets/Sidebar";

//pages
import Agendamentos from "./pages/Agendamentos";
import Clientes from "./pages/Clientes";
import Colaboradores from "./pages/Colaboradores";
import Servicos from './pages/Servicos'

const Routes = () => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Router>
            <Sidebar />
            <Switch>
              <Route path={"/"} exact component={Agendamentos} />
              <Route path={"/clientes"} exact component={Clientes} />
              <Route path={"/colaboradores"} exact component={Colaboradores} />
              <Route path={"/servicos"} exact component={Servicos} />
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
};

export default Routes;
