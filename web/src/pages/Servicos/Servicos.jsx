import { useEffect } from "react";
import "./servicos.css";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer, Modal, TagPicker, SelectPicker, DatePicker ,Tag} from "rsuite";
import {
  allServicos,
  updateServico,
  resetServico,
  addServico,
  removeServico,
  removeArquivo,
} from "../../store/modules/servico/actions";
import TableComponent from "../../componets/Table";
import moment from "moment";


const Servicos = () => {
  const dispatch = useDispatch();

  const { form, servico, servicos, components, behavior } =
    useSelector((state) => state.servico);

  useEffect(() => {
    dispatch(allServicos());
  }, []);

  const setComponent = (key, state) => {
    dispatch(
      updateServico({
        components: { ...components, [key]: state },
      })
    );
  };

  const setServico = (component, state) => {
    dispatch(
      updateServico({
        colaborador: { ...colaborador, [component]: state },
      })
    );
  };

  const save = () => {
    dispatch(addServico());
  };

  const deleteServico = () => {
    dispatch(removeServico());
  };

  return (
    <div className="col p-5 overflow-auto h-100">
    <Drawer
        open={components.drawer}
        onClose={() => {
          setComponent("drawer", false);
          dispatch(resetServico());
        }}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create"
              ? "Criar novo serviço"
              : "Atualizar serviço"}
          </h3>
          <div className="row mt-4">
           
          
            <h6 className="my-3">Detalhes do Serviço</h6>
            <div className="form-group my-2 col-6">
              <b className="">Título</b>
              <input
                type="text"
                className="form-control"
                placeholder="Título do serviço"
           
                value={servico.titulo}
                onChange={(e) => setServico("titulo", e.target.value)}
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Descrição</b>
              <input
                type="text"
                className="form-control"
                placeholder="Descrição"
           
                value={servico.descricao}
                onChange={(e) =>
                  setServico("descricao", e.target.value)
                }
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">R$ Preço</b>
              <input
                type="text"
                className="form-control"
                placeholder="Preço"
           
                value={servico.preco}
                onChange={(e) => setServico("preco", e.target.value)}
             />
            </div>

            
            <div className="form-group my-2 col-6">
              <b className="">% Comissão</b>
              <input
                type="text"
                className="form-control"
       
                value={servico.comissao}
                onChange={(e) => setServico("comissao", e.target.value)}
             />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Recorrência (dias)</b>
              <input
                type="text"
                className="form-control"
                placeholder="Recorrência (dias)"
           
                value={servico.recorrencia}
                onChange={(e) => setServico("recorrencia", e.target.value)}
             />
            </div>
            <div className="form-group my-2 col-6">
              <b className="d-block">Duração (min)</b>
              <DatePicker
                block
                format="HH:mm"
                // defaultValue={servico.duracao}
                hideMinutes={(min) => ![0,30].includes(min)}
                onChange={(e) => setServico("duracao", e)}
             />
           
            </div>
           </div>
        
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
                  updateServico({
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
              ? "Salvar Serviço"
              : "Remover Serviço"}
          </Button>
        </Drawer.Body> 
     </Drawer>   
      {/* <Modal
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
            onClick={() => deleteServico()}
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
      </Modal> */}
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Servicos</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setComponent("drawer", true);
                  dispatch(updateServico({ behavior: "create" }));
                }}
              >
                <span className="mdi mdi-plus">Novo Serviço</span>
              </button>
            </div>
          </div>
          <TableComponent
            loading={form.filtering}
            data={servicos}
            config={[
              {
                label: "Titulo",
                key: "titulo",
                width: 200,
                fixed: true,
              },
              { label: "Descrição", key: "descricao", width: 200 },
              { label: "Preço", content: (item) => `R$ ${item.preco.toFixed(2)}`, width: 200 },
              {
                label: "Comissão",
                content: (item) =>
                  `${item.comissao}%`,
                width: 200,
              },
              {
                label: "Recorrência (dias)",
                content: (item) => (item.recorrencia),
                width: 200,
              },
              {
                label: "Duração",
                content: (item) => (moment(item.duracao).format('HH:mm')),
                width: 200,
              },
              {
                label: "Status",
                content: (item) => <Tag color={item.status === 'A' ? 'green' : 'red'}>
                  {item.status === "A" ? "Ativo" : "Inativo"}
                </Tag>,

                width: 200,
              },
              {
                label: "Data Cadastro",
                content: (item) =>
                  moment(item.dataCadastro).format("YYYY/MM/DD - HH:mm"),
                width: 200,
              },
            ]}
            actions={(servico) => (
              <Button
                appearance="primary"
                size="xs"
                onClick={() => {
                  dispatch(
                    updateServico({ behavior: "update", servico })
                  );
                  setComponent("drawer", true);
                }}
              >
                Ver informações
              </Button>
            )}
         
          />
        </div>
      </div>
    </div>
  );
};

export default Servicos;
