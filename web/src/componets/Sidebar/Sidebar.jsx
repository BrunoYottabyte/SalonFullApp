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
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <span className="mdi mdi-calendar-check"></span>
            <span>Agendamentos</span>
          </Link>
        </li>
        <li>
          <Link to="/clientes" className={location.pathname === '/clientes' ? 'active' : ''}>
            <span className="mdi mdi-account-multiple"></span>
            <span >Clientes</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default withRouter(Sidebar);
