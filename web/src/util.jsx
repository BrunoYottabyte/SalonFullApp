import moment from "moment";
export default {
  hourToMinutes: (hour) => {
    const [hours, minutes] = moment(hour).format("HH:mm").split(":");
    return parseInt(parseInt(hours * 60) + parseInt(minutes));
  },
};
