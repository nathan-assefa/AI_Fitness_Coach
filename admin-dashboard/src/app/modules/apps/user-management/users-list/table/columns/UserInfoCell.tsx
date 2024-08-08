import { FC } from "react";
import { User } from "../../../../../../../lib/types";
import { Link } from "react-router-dom";

type Props = {
  user: User;
};

const UserInfoCell: FC<Props> = ({ user }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="d-flex flex-column">
        <Link
          to={`/user-chat-history/${user.id}`}
          className="text-gray-800 text-hover-primary mb-1"
        >
          {user.first_name}
        </Link>
        <span>{user.email}</span>
      </div>
    </div>
  );
};

export { UserInfoCell };
