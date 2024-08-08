// import { FC } from "react";

// type Props = {
//   status?: string;
// };

// const UserTwoStepsCell: FC<Props> = ({ status }) => (
//   <>
//     {" "}
//     {status === "Active" ? (
//       <div className="badge badge-light-success fw-bolder">{status}</div>
//     ) : (
//       <div className="badge badge-light-danger fw-bolder">{status}</div>
//     )}
//   </>
// );

// export { UserTwoStepsCell };

import { FC } from "react";

type Props = {
  status?: string;
};

export const SubscriptionStatusCell: FC<Props> = ({ status }) => (
  <>
    {" "}
    {status === "Active" ? (
      <div className="badge badge-light-success fw-bolder">{status}</div>
    ) : (
      <div className="badge badge-light-danger fw-bolder">{status}</div>
    )}
  </>
);

export const ChatStatusCell: FC<Props> = ({ status }) => (
  <>
    {" "}
    {status === "In progress" ? (
      <div className="badge badge-light-primary fw-bolder">{status}</div>
    ) : (
      <div className="badge badge-light-secondary fw-bolder">{status}</div>
    )}
  </>
);

export const PlanGenerationStatusCell: FC<Props> = ({ status }) => (
  <>
    {" "}
    {status === "Generated" ? (
      <div className="badge badge-light-success fw-bolder">{status}</div>
    ) : (
      <div className="badge badge-light-danger fw-bolder">{status}</div>
    )}
  </>
);

export const PlanType: FC<Props> = ({ status }) => (
  <div className={`badge fw-bolder ${getColorClass(status)}`}>{status}</div>
);

const getColorClass = (status?: string) => {
  if (status === "Meal Plan") {
    return "badge-light-blue";
  } else if (status === "Workout Plan") {
    return "badge-light-green";
  } else if (status === "Meal Workout Plan") {
    return "badge-light-purple";
  } else if (status === "Not chosen yet") {
    return "badge-light-red";
  } else {
    return "badge-light-secondary"; // Default color
  }
};
