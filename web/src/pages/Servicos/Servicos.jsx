import { useEffect } from "react";
import "./servicos.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Drawer,
  Modal,
  TagPicker,
  SelectPicker,
  DateRangePicker,
  Uploader,
  DatePicker,
  Tag,
} from "rsuite";
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
import consts from "../../consts";

const Servicos = () => {
  const dispatch = useDispatch();

  const { form, servico, servicos, components, behavior } = useSelector(
    (state) => state.servico
  );

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
        servico: { ...servico, [component]: state },
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
            {behavior === "create" ? "Criar novo serviço" : "Atualizar serviço"}
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
                value={new Date(servico.duracao)}
                hideMinutes={(min) => ![0, 30].includes(min)}
                onChange={(e) => setServico("duracao", e)}
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Status</b>
              <select
                className="form-control"
                value={servico.status}
                onChange={(e) => setServico("status", e.target.value)}
              >
                <option value="A">Ativo</option>
                <option value="I">Inativo</option>
              </select>
            </div>

            <div className="form-group my-2 col-12">
              <b className="">Descrição</b>
              <textarea
                type="text"
                rows="5"
                className="form-control "
                placeholder="Descrição"
                value={servico.descricao}
                onChange={(e) => setServico("descricao", e.target.value)}
              />
            </div>

            <div className="form-group col-12">
              <b className="d-block">Imagens do serviço</b>
              <Uploader
                multiple
                listType="picture"
                autoUpload={false}
                defaultFileList={servico.arquivos.map((servico, index) => ({
                  name: servico?.caminho,
                  fileKey: index,
                  url: `${consts.BUCKET_URL}/${servico.caminho}`,
                }))}
                onChange={(files) => {
                  const arquivos = files
                    .filter((f) => f.blobFile)
                    .map((f) => f.blobFile);
                  setServico("arquivos", arquivos);
                }}
                onRemove={(file) => {
                  if (behavior === "update" && file.url) {
                    dispatch(removeArquivo(file.name));
                  }
                }}
              >
                <button>
                  <span className="mdi mdi-camera"></span>
                </button>
              </Uploader>
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
            {behavior === "create" ? "Salvar Serviço" : "Remover Serviço"}
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
      </Modal>
      <Modal open={components.alert}>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          <span
            className="mdi mdi-alert-outline"
            style={{ fontSize: "2.2em" }}
          ></span>
          <h4 className="mx-3">{components.messageAlert}</h4>
        </Modal.Body>
        <Modal.Footer className="mt-3">
          <Button
            block
            loading={form.saving}
            appearance="primary"
            color="green"
            style={{ backgroundColor: "#7b2cbf " }}
            onClick={() => setComponent("alert", false)}
          >
            Entendi :)
          </Button>
        </Modal.Footer>
      </Modal>

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
              {
                label: "Preço",
                content: (item) => `R$ ${item.preco.toFixed(2)}`,
                width: 200,
              },
              {
                label: "Comissão",
                content: (item) => `${item.comissao}%`,
                width: 200,
              },
              {
                label: "Recorrência (dias)",
                content: (item) => item.recorrencia,
                width: 200,
              },
              {
                label: "Duração",
                content: (item) => moment(item.duracao).format("HH:mm"),
                width: 200,
              },
              {
                label: "Status",
                content: (item) => (
                  <Tag color={item.status === "A" ? "green" : "red"}>
                    {item.status === "A" ? "Ativo" : "Inativo"}
                  </Tag>
                ),

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
                  dispatch(updateServico({ behavior: "update", servico }));
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
