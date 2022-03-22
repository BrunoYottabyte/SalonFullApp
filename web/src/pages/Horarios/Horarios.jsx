import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./horarios.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { DatePicker, Drawer, TagPicker, Button, Modal } from "rsuite";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/pt-br";
moment.locale("pt-br");
import {
  allHorarios,
  allServicos,
  filterColaboradores,
  resetHorario,
  updateHorario,
  addHorario,
  removeHorario,
} from "../../store/modules/horarios/actions";

const localizer = momentLocalizer(moment);

const Horarios = () => {
  const dispatch = useDispatch();
  const {
    horarios,
    horario,
    form,
    components,
    servicos,
    behavior,
    colaboradores,
  } = useSelector((state) => state.horario);
  const setComponent = (key, state) => {
    dispatch(
      updateHorario({
        components: { ...components, [key]: state },
      })
    );
  };

  const setHorario = (component, state) => {
    dispatch(
      updateHorario({
        horario: { ...horario, [component]: state },
      })
    );
  };

  const save = () => {
    dispatch(addHorario());
  };

  const deleteHorario = () => {
    dispatch(removeHorario());
  };

  const diasSemanaData = [
    new Date(2022, 2, 22, 0, 0, 0, 0),
    new Date(2022, 2, 23, 0, 0, 0, 0),
    new Date(2022, 2, 24, 0, 0, 0, 0),
    new Date(2022, 2, 25, 0, 0, 0, 0),
    new Date(2022, 2, 26, 0, 0, 0, 0),
    new Date(2022, 2, 27, 0, 0, 0, 0),
    new Date(2022, 2, 28, 0, 0, 0, 0),
  ];

  const diasDaSemana = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  console.log(servicos);

  const formatEvents = horarios
    .map((horario, index) =>
      horario.dias.map((dia) => ({
        resource: horario,
        title: `${horario.especialidades.length} espec. e ${horario.colaboradores.length} colab.`,
        start: new Date(
          diasSemanaData[dia].setHours(
            parseInt(moment(horario.inicio).format("HH")),
            parseInt(moment(horario.inicio).format("mm"))
          )
        ),
        end: new Date(
          diasSemanaData[dia].setHours(
            parseInt(moment(horario.fim).format("HH")),
            parseInt(moment(horario.fim).format("mm"))
          )
        ),
      }))
    )
    .flat();

  useEffect(() => {
    // TODOS OS HORARIOS
    //TODOS OS SERVICOS
    dispatch(allHorarios());
    dispatch(allServicos());
  }, []);

  useEffect(() => {
    dispatch(filterColaboradores());
  }, [horario.especialidades]);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => {
          dispatch(resetHorario());
          setComponent("drawer", false);
        }}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create" ? "Criar novo" : "Atualizar"} horário de
            atendimento
          </h3>
          <div className="row mt-4">
            <h6 className="my-3">Informação Pessoal</h6>
            <div className="form-group my-2 col-6">
              <b className="">Dias da semana</b>
              <TagPicker
                size="lg"
                block
                value={horario.dias}
                data={diasDaSemana.map((label, value) => ({ label, value }))}
                onChange={(e) => setHorario("dias", e)}
              />
            </div>

            <div className="form-group my-2 col-6">
              <b className="">Horário Inicial</b>
              <DatePicker
                block
                format="HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                value={new Date(horario.inicio)}
                onChange={(e) => setHorario("inicio", e)}
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Horário Final</b>
              <DatePicker
                block
                format="HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                value={new Date(horario.fim)}
                onChange={(e) => setHorario("fim", e)}
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Especialidades disponíveis</b>
              <TagPicker
                size="lg"
                block
                data={servicos}
                value={horario.especialidades}
                onChange={(e) => setHorario("especialidades", e)}
              />
            </div>
            <div className="form-group my-2 col-6">
              <b className="">Colaboradores disponíveis</b>
              <TagPicker
                size="lg"
                block
                data={colaboradores}
                value={horario.colaboradores}
                onChange={(e) => setHorario("colaboradores", e)}
              />
            </div>
          </div>
          <Button
            block
            className=" mt-3"
            color="green"
            size="lg"
            loading={form.saving}
            appearance="primary"
            onClick={() => {
              save();
            }}
          >
            {behavior === "create"
              ? "Salvar Horário de Atendimento"
              : "Atualizar Horário de Atendimento"}
          </Button>
          {behavior === "update" && (
            <Button
              block
              className=" mt-3"
              color={"red"}
              size="lg"
              appearance="primary"
              loading={form.saving}
              onClick={() => {
                setComponent("confirmDelete", true);
              }}
            >
              Remover Horário de Atendimento
            </Button>
          )}
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
            onClick={() => deleteHorario()}
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
            <h2 className="mb-4 mt-0">Horários de atendimento</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setComponent("drawer", true);
                  dispatch(updateHorario({ behavior: "create" }));
                }}
              >
                <span className="mdi mdi-plus">Novo Horário</span>
              </button>
            </div>
          </div>
          <Calendar
            onSelectEvent={(e) => {
              dispatch(
                updateHorario({
                  horario: e.resource,
                })
              );
              dispatch(updateHorario({ behavior: "update" }));
              setComponent("drawer", true);
            }}
            localizer={localizer}
            toolbar={false}
            view="week"
            formats={{
              dateFormat: "dd",
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, "dddd", culture),
            }}
            popup
            selectable
            onSelectSlot={(slotInfo) => {
              const { start, end } = slotInfo;
              dispatch(
                updateHorario({
                  behavior: "create",
                  horario: {
                    ...horario,
                    dias: [moment(start).day()],
                    inicio: start,
                    fim: end,
                  },
                })
              );
              setComponent("drawer", true);
            }}
            events={formatEvents}
            date={diasSemanaData[moment().day()]}
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Horarios;
