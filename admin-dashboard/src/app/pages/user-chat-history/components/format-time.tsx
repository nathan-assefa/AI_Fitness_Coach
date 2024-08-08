import moment from "moment";

const formatTimeWithAMPM = (createdAt: string): string => {
  const date = moment(createdAt);
  const formattedTime = date.format("h:mm A");
  return formattedTime;
};

export default formatTimeWithAMPM;
