import { useEffect } from "react";
import "./agendamentos.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { filterAgendamentos } from "../../store/modules/agendamento/actions";
import utils from "../../util";
const localizer = momentLocalizer(moment);
const Agendamentos = () => {
  const dispatch = useDispatch();
  const { agendamentos } = useSelector((state) => state.agendamento);

  const formatEventos = agendamentos.map((agendamento) => ({
    title: `${agendamento.servicoId.titulo} - ${agendamento.clienteId.nome} - ${agendamento.colaboradorId.nome}`,
    start: moment(agendamento.data).toDate(),
    end: moment(agendamento.data)
      .add(utils.hourToMinutes(agendamento.servicoId.duracao), "minutes")
      .toDate(),
  }));

  const formatRange = (range) => {
    let finalRange = {};
    if (Array.isArray(range)) {
      finalRange = {
        start: moment(range[0]).format('YYYY-MM-DD'),
        end: moment(range[range.length - 1]).format('YYYY-MM-DD')
      }
    }else{
      finalRange = {
        start: moment(range.start).format('YYYY-MM-DD'),
        end: moment(range.end).format('YYYY-MM-DD')
      }
    }

    return finalRange
  };

  useEffect(() => {
    dispatch(
      filterAgendamentos(
        moment(new Date()).weekday(0).format("YYYY-MM-DD"),
        moment(new Date()).weekday(6).format("YYYY-MM-DD")
      )
    );
  }, []);
  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 mt-0">Agendamentos</h2>
          <Calendar
            localizer={localizer}
            onRangeChange={(range) => {
              const {start,end} = formatRange(range)
              console.log(formatRange(range))
              dispatch(
                filterAgendamentos(
                  start,
                  end
                )
              );
            }}
            events={formatEventos}
            defaultView={"week"}
            selectable
            popup
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Agendamentos;
