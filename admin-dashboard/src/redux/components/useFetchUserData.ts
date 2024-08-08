// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import {
//   fetchSubscribedUserList,
//   fetchUserList,
//   fetchRevenueData,
//   fetchUnsubscribedUserList,
// } from "../../redux/userThunks";
// import { AppDispatch, RootState } from "../../redux/store";

// export const useFetchData = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(fetchUserList());
//     dispatch(fetchSubscribedUserList());
//     dispatch(fetchRevenueData());
//     dispatch(fetchUnsubscribedUserList());
//   }, [dispatch]);

//   const {
//     userList,
//     subscribedUserList,
//     unsubscribedUserList,
//     isLoading,
//     error,
//     revenueData,
//   } = useSelector((state: RootState) => state.users);

//   return {
//     userList,
//     subscribedUserList,
//     unsubscribedUserList,
//     isLoading,
//     error,
//     revenueData,
//   };
// };

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchSubscribedUserList,
  fetchUserList,
  fetchRevenueData,
  fetchUnsubscribedUserList,
  fetchAnalyticsData,
} from "../../redux/userThunks";
import { AppDispatch, RootState } from "../../redux/store";

export const useFetchData = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUserList());
    dispatch(fetchSubscribedUserList());
    dispatch(fetchRevenueData());
    dispatch(fetchUnsubscribedUserList());
    dispatch(fetchAnalyticsData());
  }, [dispatch]);

  const {
    userList,
    subscribedUserList,
    unsubscribedUserList,
    isLoading,
    error,
    revenueData,
    analyticsData,
  } = useSelector((state: RootState) => state.users);

  return {
    userList,
    subscribedUserList,
    unsubscribedUserList,
    isLoading,
    error,
    revenueData,
    analyticsData,
  };
};
