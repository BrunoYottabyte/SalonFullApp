import { useEffect } from "react";
import "./colaboradores.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer, Modal, TagPicker, SelectPicker } from "rsuite";
import {
  allColaborador,
  updateColaborador,
  resetColaborador,
  filterColaboradores,
  addColaborador,
  unlinkColaborador,
  allServicos,
} from "../../store/modules/colaborador/actions";
import TableComponent from "../../componets/Table";
import moment from "moment";
import bancos from "../../data/bancos.json";

const Colaboradores = () => {
  const dispatch = useDispatch();

  const { form, colaboradores, colaborador, servicos, components, behavior } =
    useSelector((state) => state.colaborador);

  useEffect(() => {
    dispatch(allColaborador());
    dispatch(allServicos());
  }, []);

  const setComponent = (key, state) => {
    dispatch(
      updateColaborador({
        components: { ...components, [key]: state },
      })
    );
  };

  const setColaborador = (component, state) => {
    dispatch(
      updateColaborador({
        colaborador: { ...colaborador, [component]: state },
      })
    );
  };

  const save = () => {
    dispatch(addColaborador());
  };

  const deleteColaborador = () => {
    dispatch(unlinkColaborador());
  };

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        onClose={() => {
          setComponent("drawer", false);
          dispatch(resetColaborador());
        }}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create"
              ? "Criar novo colaborador"
              : "Atualizar colaborador"}
          </h3>
          <div className="row mt-4">
            <div className="form-group mb-3 col-12">
              <b>Email</b>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="E-mail do colaborador"
                  value={colaborador.email}
                  onChange={(e) => setColaborador("email", e.target.value)}
                />
                <div className="input-group-append">
                  <Button
                    appearance="primary"
                    loading={form.filtering}
                    onClick={() => {
                      dispatch(filterColaboradores());
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
                placeholder="Nome do colaborador"
                disabled={form.disabled}
                value={colaborador.nome}
                onChange={(e) => setColaborador("nome", e.target.value)}
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Data de Nascimento</b>
              <input
                type="date"
                className="form-control"
                placeholder="Data de nascimento"
                disabled={form.disabled}
                value={colaborador.dataNascimento}
                onChange={(e) =>
                  setColaborador("dataNascimento", e.target.value)
                }
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Sexo</b>
              <select
                type="text"
                className="form-control"
                placeholder="Sexo"
                disabled={form.disabled}
                value={colaborador.sexo}
                onChange={(e) => setColaborador("sexo", e.target.value)}
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
                value={colaborador.area}
                onChange={(e) => setColaborador("area", e.target.value)}
              />
            </div>
            <div className="form-group my-2 col-4">
              <b className="">Telefone</b>
              <input
                type="text"
                className="form-control"
                placeholder="Telefone(sem DDD)"
                disabled={form.disabled}
                value={colaborador.telefone}
                onChange={(e) => setColaborador("telefone", e.target.value)}
              />
            </div>

            <h6 className="my-3">Sobre</h6>

            <div className="form-group my-2 col-6">
              <b className="">Status</b>
              <select
                type="text"
                className="form-control"
                placeholder="Status do Colaborador"
                disabled={form.disabled && behavior === "create"}
                value={colaborador.vinculo}
                onChange={(e) => setColaborador("vinculo", e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
              </select>
            </div>

            <div className="form-group my-2 col-12">
              <b className="">Especialidades</b>
              <TagPicker
                size="lg"
                block
                data={servicos}
                disabled={form.disabled && behavior === "create"}
                value={colaborador.especialidades}
                onChange={(e) => setColaborador("especialidades", e)}
              />
            </div>

            <h6 className="my-3">Conta Bancaria</h6>

            <div className="form-group my-2 col-6">
              <b className="">Titular</b>
              <input
                type="text"
                className="form-control"
                placeholder="Tipo do documento"
                disabled={form.disabled}
                value={colaborador.contaBancaria.titular}
                onChange={(e) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    titular: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Nº Documento</b>
              <input
                type="text"
                className="form-control"
                placeholder="CPF OU CNPJ"
                disabled={form.disabled}
                value={colaborador.contaBancaria.cpfCnpj}
                onChange={(e) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    cpfCnpj: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Banco</b>
              <SelectPicker
                type="text"
                placeholder="3 dig - banco"
                disabled={form.disabled && behavior === "create"}
                value={colaborador.contaBancaria.banco}
                data={bancos}
                block
                size="lg"
                onChange={(banco) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    banco: banco,
                  })
                }
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">tipo</b>
              <select
                type="text"
                className="form-control"
                placeholder="tipo (cheking / savings)"
                disabled={form.disabled}
                value={colaborador.contaBancaria.tipo}
                onChange={(e) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    tipo: e.target.value,
                  })
                }
              >
                <option value="checking">checking</option>
                <option value="savings">savings</option>
              </select>
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Agencia</b>
              <input
                type="text"
                className="form-control"
                placeholder="Ag"
                disabled={form.disabled}
                value={colaborador.contaBancaria.agencia}
                onChange={(e) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    agencia: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group my-2 col-4">
              <b className="">Conta</b>
              <input
                type="text"
                className="form-control"
                placeholder="Nº da conta"
                disabled={form.disabled}
                value={colaborador.contaBancaria.numero}
                onChange={(e) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    numero: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group my-2 col-2">
              <b className="">D V</b>
              <input
                type="text"
                className="form-control"
                placeholder="Dígito"
                disabled={form.disabled}
                value={colaborador.contaBancaria.dv}
                onChange={(e) =>
                  setColaborador("contaBancaria", {
                    ...colaborador.contaBancaria,
                    dv: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* <div className="form-group my-2 col-6">
            <b className="">Uso</b>
            <select
              type="text"
              className="form-control"
              placeholder="Tipo do documento"
              disabled={form.disabled}
              value={colaborador.pessoa}
              onChange={(e) => setCliente("pessoa", e.target.value)}
            >
              <option value="individual">Individual</option>
              <option value="company">Empresarial</option>
            </select>
          </div> */}
          {behavior === "update" && (
            <Button
              block
              className=" mt-3"
              color={"blue"}
              appearance="primary"
              size="lg"
              loading={form.saving}
              onClick={() => {
                save();
              }}
            >
              Atualizar colaborador
            </Button>
          )}
          <Button
            block
            className=" mt-1"
            color={behavior === "create" ? "green" : "red"}
            appearance="primary"
            size="lg"
            loading={form.saving}
            onClick={() => {
              if (behavior === "create") {
                dispatch(
                  updateColaborador({
                    components: {
                      ...components,
                      alert: true,
                      messageAlert: "colaborador criado com sucesso :)",
                    },
                  })
                );
                save();
              } else {
                setComponent("confirmDelete", true);
              }
            }}
          >
            {behavior === "create"
              ? "Salvar colaborador"
              : "Remover colaborador"}
          </Button>
        </Drawer.Body>
      </Drawer>
      <Modal
        open={components.confirmDelete}
        onClose={() => setComponent("confirmDelete", false)}
      >
        <Modal.Body>
          <h6 className="mdi mdi-trash-can-outline">
            Tem certeza que deseja excluir? Essa ação é irreversível!
          </h6>
        </Modal.Body>
        <Modal.Footer>
          <Button
            loading={form.saving}
            onClick={() => deleteColaborador()}
            appearance="primary"
            color="red"
          >
            Sim, tenho certeza
          </Button>
          <Button
            onClick={() => setComponent("confirmDelete", false)}
            appearance="subtle"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Colaboradores</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setComponent("drawer", true);
                  dispatch(updateColaborador({ behavior: "create" }));
                }}
              >
                <span className="mdi mdi-plus">Novo Colaborador</span>
              </button>
            </div>
          </div>
          <TableComponent
            loading={form.filtering}
            data={colaboradores}
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
                label: "Status",
                content: (item) => (item.status === "A" ? "Ativo" : "Inativo"),
                width: 200,
              },
              {
                label: "data Cadastro",
                content: (item) =>
                  moment(item.dataCadastro).format("YYYY/MM/DD - HH:mm"),
                width: 200,
              },
            ]}
            actions={(colaborador) => (
              <Button
                appearance="primary"
                size="xs"
                onClick={() => {
                  dispatch(
                    updateColaborador({ behavior: "update", colaborador })
                  );
                  setComponent("drawer", true);
                }}
              >
                Ver informações
              </Button>
            )}
            // onRowClick={(colaborador) => {
            //   dispatch(updatecolaborador({ behavior: "update", colaborador }));
            //   setComponent("drawer", true);
            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default Colaboradores;
