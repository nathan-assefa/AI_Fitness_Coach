import { Column } from "react-table";
import { UserInfoCell } from "./UserInfoCell";
import { UserLastLoginCell } from "./UserLastLoginCell";
import {
  ChatStatusCell,
  PlanGenerationStatusCell,
  PlanType,
  SubscriptionStatusCell,
} from "./UserTwoStepsCell";
import { UserActionsCell } from "./UserActionsCell";
import { UserSelectionCell } from "./UserSelectionCell";
import { UserCustomHeader } from "./UserCustomHeader";
import { UserSelectionHeader } from "./UserSelectionHeader";
import { User } from "../../../../../../../lib/types";
// import { User } from "../../core/_models";

const usersColumns: ReadonlyArray<Column<User>> = [
  // {
  //   Header: (props) => <UserSelectionHeader tableProps={props} />,
  //   id: "selection",
  //   Cell: ({ ...props }) => (
  //     <UserSelectionCell id={props.data[props.row.index].id} />
  //   ),
  // },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Name"
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Chat Status"
        className="min-w-125px"
      />
    ),
    id: "chat_status",
    Cell: ({ ...props }) => (
      <ChatStatusCell status={props.data[props.row.index].chat_status} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Last login"
        className="min-w-125px"
      />
    ),
    id: "last_login",
    Cell: ({ ...props }) => (
      <UserLastLoginCell last_login={props.data[props.row.index].last_login} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Plan Type"
        className="min-w-125px"
      />
    ),
    id: "sub_plan",
    Cell: ({ ...props }) => (
      <PlanType
        status={(props.data[props.row.index].subscription_plan || "")
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Plan Generated Status"
        className="min-w-125px"
      />
    ),
    id: "plan_generation",
    Cell: ({ ...props }) => (
      <PlanGenerationStatusCell
        status={props.data[props.row.index].plan_generated_status}
      />
    ),
  },

  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Subscription Status"
        className="min-w-125px"
      />
    ),
    id: "two_steps",
    Cell: ({ ...props }) => (
      <SubscriptionStatusCell
        status={props.data[props.row.index].subscription_status}
      />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Joined day"
        className="min-w-125px"
      />
    ),
    id: "join_date",
    Cell: ({ ...props }) => (
      <PlanType status={props.data[props.row.index].created_at} />
    ),
  },

  // {
  //   Header: (props) => (
  //     <UserCustomHeader
  //       tableProps={props}
  //       title="Joined day"
  //       className="min-w-125px"
  //     />
  //   ),
  //   accessor: "created_at", //change this to join date
  // },
];

export { usersColumns };
