import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const useReduxData = () => {
  const { userList, subscribedUserList, isLoading, error } = useSelector(
    (state: RootState) => state.users
  );

  return { userList, subscribedUserList, isLoading, error };
};
