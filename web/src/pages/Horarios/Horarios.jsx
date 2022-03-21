import { useEffect } from "react";
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
// import {
//   allServicos,
//   updateServico,
//   resetServico,
//   addServico,
//   removeServico,
//   removeArquivo,
// } from "../../store/modules/servico/actions";
import TableComponent from "../../componets/Table";
import moment from "moment";
import consts from "../../consts";

const Horarios = () => {
  // const dispatch = useDispatch();

  const { form, servico, servicos, components, behavior } = useSelector(
    (state) => state.servico
  );

  // useEffect(() => {
  //   dispatch(allServicos());
  // }, []);

  // const setComponent = (key, state) => {
  //   dispatch(
  //     updateServico({
  //       components: { ...components, [key]: state },
  //     })
  //   );
  // };

  // const setServico = (component, state) => {
  //   dispatch(
  //     updateServico({
  //       servico: { ...servico, [component]: state },
  //     })
  //   );
  // };

  // const save = () => {
  //   dispatch(addServico());
  // };

  // const deleteServico = () => {
  //   dispatch(removeServico());
  // };

  return (
    <div className="col p-5 overflow-auto h-100">
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
          <h4 className="mx-3">{components.messageModal}</h4>
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

export default Horarios;
