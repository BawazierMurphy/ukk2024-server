import moment from "moment";

const now = (): string => moment(moment.now()).toISOString();

export default { now };
