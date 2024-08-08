import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersList } from "../lib/utils/user-list";
import { getSubscribedUserList } from "../lib/utils/subscribed-user-list";
import {
  AnalyticsResponse,
  RevenueResponse,
  User,
  UserListResponse,
} from "../lib/types"; // Adjust the path as needed to your User type
import { getSubscriptionData } from "../lib/utils/subscription-data";
import { getUnsubscribedUserList } from "../lib/utils/unsubscribed-user-list";
import { getAnalyticsData } from "../lib/utils/analytics";

export const fetchUserList = createAsyncThunk<UserListResponse, void>(
  "users/fetchUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsersList();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSubscribedUserList = createAsyncThunk<UserListResponse, void>(
  "users/fetchSubscribedUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscribedUserList();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUnsubscribedUserList = createAsyncThunk<
  UserListResponse,
  void
>("users/fetchUnsubscribedUserList", async (_, { rejectWithValue }) => {
  try {
    const response = await getUnsubscribedUserList();
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchRevenueData = createAsyncThunk<
  RevenueResponse,
  void,
  { rejectValue: string }
>("users/fetchRevenueData", async (_, { rejectWithValue }) => {
  try {
    const response = await getSubscriptionData();
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchAnalyticsData = createAsyncThunk<
  AnalyticsResponse,
  void,
  { rejectValue: string }
>("users/fetchAnalyticsData", async (_, { rejectWithValue }) => {
  try {
    const response = await getAnalyticsData();
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
