import { useEffect } from "react";
import "./clientes.css";
import TableComponent from "../../componets/Table";
import { Button, Drawer } from "rsuite";
import {
  allClientes,
  updateCliente,
  filterClientes,
  resetCliente,
  addCliente,
} from "../../store/modules/cliente/actions";
import util from "../../util";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

const Clientes = () => {
  const dispatch = useDispatch();
  const { clientes, cliente, form, components, behavior } = useSelector(
    (state) => state.cliente
  );

  const setComponent = (component, state) => {
    dispatch(
      updateCliente({
        components: { ...components, [component]: state },
      })
    );
  };
  const setCliente = (key, value) => {
    dispatch(
      updateCliente({
        cliente: { ...cliente, [key]: value },
      })
    );
  };
  const save = () => {
    dispatch(addCliente());
  };

  useEffect(() => {
    dispatch(allClientes());
  }, []);
  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => {
          dispatch(resetCliente());
          setComponent("drawer", false);
        }}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create" ? "Criar novo cliente" : "Atualizar cliente"}
          </h3>
          <div className="row mt-4">
            <div className="form-group mb-3 col-12">
              <b>Email</b>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail do cliente"
                  value={cliente.email}
                  onChange={(e) => setCliente("email", e.target.value)}
                />
                <div className="input-group-append">
                  <Button
                    appearance="primary"
                    loading={form.filtering}
                    onClick={() => {
                      dispatch(filterClientes());
                    }}
                  >
                    Pesquisar
                  </Button>
                </div>
              </div>
            </div>
            <h6 className="my-3">Informação Pessoal</h6>
            <div className="form-group my-2 col-6">
              <b className="">Nome</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nome do cliente"
                disabled={form.disabled}
                value={cliente.nome}
                onChange={(e) => setCliente("nome", e.target.value)}
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Data de Nascimento</b>
              <input
                type="date"
                className="form-control"
                placeholder="Data de nascimento"
                disabled={form.disabled}
                value={cliente.dataNascimento}
                onChange={(e) => setCliente("dataNascimento", e.target.value)}
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Sexo</b>
              <select
                type="text"
                className="form-control"
                placeholder="Sexo"
                disabled={form.disabled}
                value={cliente.sexo === "M"}
                onChange={(e) => setCliente("sexo", e.target.value)}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div className="form-group my-2 col-2">
              <b className="">DDD</b>
              <input
                type="text"
                className="form-control"
                placeholder="DDD"
                disabled={form.disabled}
                value={cliente.area}
                onChange={(e) => setCliente("area", e.target.value)}
              />
            </div>
            <div className="form-group my-2 col-4">
              <b className="">Telefone</b>
              <input
                type="text"
                className="form-control"
                placeholder="Telefone(sem DDD)"
                disabled={form.disabled}
                value={cliente.telefone}
                onChange={(e) => setCliente("telefone", e.target.value)}
              />
            </div>
            <h6 className="my-3">Documentação</h6>
            <div className="form-group my-2 col-6">
              <b className="">Uso</b>
              <select
                type="text"
                className="form-control"
                placeholder="Tipo do documento"
                disabled={form.disabled}
                value={cliente.documento.tipo}
                onChange={(e) =>
                  setCliente("documento", {
                    ...cliente.documento,
                    tipo: e.target.value,
                  })
                }
              >
                <option value="individual">Individual</option>
                <option value="corporation">Empresarial</option>
              </select>
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Tipo Documento</b>
              <select
                type="text"
                className="form-control"
                placeholder="Tipo do documento"
                disabled={form.disabled}
                value={cliente.documento.docType}
                onChange={(e) =>
                  setCliente("documento", {
                    ...cliente.documento,
                    docType: e.target.value,
                  })
                }
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
                <option value="PASSAPORT">PASSAPORT</option>
              </select>
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Nº Documento</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nº documento"
                disabled={form.disabled}
                value={cliente.documento.numero}
                onChange={(e) =>
                  setCliente("documento", {
                    ...cliente.documento,
                    numero: e.target.value,
                  })
                }
              />
            </div>
            <h6 className="my-3">Endereço</h6>
            <div className="form-group my-2 col-6">
              <b className="">Rua</b>
              <input
                type="text"
                className="form-control"
                placeholder="Endereco do Cliente"
                disabled={form.disabled}
                value={cliente.endereco.rua}
                onChange={(e) =>
                  setCliente("endereco", {
                    ...cliente.endereco,
                    rua: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Complementar</b>
              <input
                type="text"
                className="form-control"
                placeholder="Endereço Complementar"
                disabled={form.disabled}
                value={cliente.endereco.complementar}
                onChange={(e) =>
                  setCliente("endereco", {
                    ...cliente.endereco,
                    complementar: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Cidade</b>
              <input
                type="text"
                className="form-control"
                placeholder="Cidade"
                disabled={form.disabled}
                value={cliente.endereco.cidade}
                onChange={(e) =>
                  setCliente("endereco", {
                    ...cliente.endereco,
                    cidade: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">UF</b>
              <input
                type="text"
                className="form-control"
                placeholder="UF"
                disabled={form.disabled}
                value={cliente.endereco.uf}
                onChange={(e) =>
                  setCliente("endereco", {
                    ...cliente.endereco,
                    uf: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Cep</b>
              <input
                type="text"
                className="form-control"
                placeholder="Cep "
                disabled={form.disabled}
                value={cliente.endereco.cep}
                onChange={(e) =>
                  setCliente("endereco", {
                    ...cliente.endereco,
                    cep: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button
            block
            className=" mt-3"
            color={behavior === "create" ? "green" : "red"}
            appearance="primary"
            size="lg"
            loading={form.saving}
            onClick={() => {
              if (behavior === "create") {
                save();
              } else {
              }
            }}
          >
            {behavior === "create" ? "Salvar Cliente" : "Remover Cliente"}
          </Button>
        </Drawer.Body>
      </Drawer>
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Clientes</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateCliente({
                      behavior: "create",
                    })
                  );
                  setComponent("drawer", true);
                }}
              >
                <span className="mdi mdi-plus">Novo Cliente</span>
              </button>
            </div>
          </div>
          <TableComponent
            loading={form.filtering}
            data={clientes}
            config={[
              {
                label: "Nome",
                key: "nome",
                width: 200,
                fixed: true,
              },
              { label: "Email", key: "email", width: 200 },
              { label: "Telefone", key: "telefone", width: 200 },
              {
                label: "Sexo",
                content: (item) =>
                  item.sexo === "M" ? "Masculino" : "Feminino",
                width: 200,
              },
              {
                label: "data Cadastro",
                content: (item) =>
                  moment(item.dataCadastro).format("YYYY/MM/DD - HH:mm"),
                width: 200,
              },
            ]}
            actions={(cliente) => (
              <Button color="blue" size="xs">
                Ver {cliente.firstName}
              </Button>
            )}
            onRowClick={(cliente) => {
              dispatch(updateCliente({ behavior: "update", cliente }));
              setComponent("drawer", true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Clientes;
