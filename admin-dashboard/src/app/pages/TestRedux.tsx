import React from "react";
import { useFetchData } from "../../redux/components/useFetchUserData";

const UserList: React.FC = () => {
  const { userList, subscribedUserList, isLoading, error, analyticsData } =
    useFetchData();
  console.log("user-list: ", userList);
  console.log("sub user list: ", subscribedUserList);
  console.log("analytical data: ", analyticsData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User List</h2>
      <p>Got the user data from redux</p>
    </div>
  );
};

export default UserList;
