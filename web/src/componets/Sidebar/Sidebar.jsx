import "./sidebar.css";
import { Link, withRouter } from "react-router-dom";

const Sidebar = ({ location }) => {
  return (
    <section className="col-2 h-100">
      <h1 className="px-3 py-4 logo">
        salão <span className="logoCss">na</span> mão
      </h1>
      <ul className="p-0 m-0">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            <span className="mdi mdi-calendar-check"></span>
            <span>Agendamentos</span>
          </Link>
        </li>
        <li>
          <Link
            to="/clientes"
            className={location.pathname === "/clientes" ? "active" : ""}
          >
            <span className="mdi mdi-account-multiple"></span>
            <span>Clientes</span>
          </Link>
        </li>
        <li>
          <Link
            to="/colaboradores"
            className={location.pathname === "/colaboradores" ? "active" : ""}
          >
            <span className="mdi mdi-account-tie"></span>
            <span>Colaboradores</span>
          </Link>
        </li>
        <li>
          <Link
            to="/horarios"
            className={location.pathname === "/horarios" ? "active" : ""}
          >
            <span className="mdi mdi-clock-outline"></span>
            <span>Horários</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default withRouter(Sidebar);
