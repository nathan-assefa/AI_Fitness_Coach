import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchUserList,
  fetchSubscribedUserList,
  fetchRevenueData,
  fetchUnsubscribedUserList,
  fetchAnalyticsData,
} from "./userThunks";
import {
  AnalyticsResponse,
  RevenueResponse,
  UserListResponse,
} from "../lib/types";

interface UserState {
  userList: UserListResponse | null;
  subscribedUserList: UserListResponse | null;
  unsubscribedUserList: UserListResponse | null;
  revenueData: RevenueResponse | null;
  analyticsData: AnalyticsResponse | null; // Added analyticsData property
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userList: null,
  subscribedUserList: null,
  unsubscribedUserList: null,
  revenueData: null,
  analyticsData: null, // Initialized analyticsData to null
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error when starting to fetch
      })
      .addCase(
        fetchUserList.fulfilled,
        (state, action: PayloadAction<UserListResponse>) => {
          state.isLoading = false;
          state.userList = action.payload;
        }
      )
      .addCase(fetchUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchSubscribedUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error when starting to fetch
      })
      .addCase(
        fetchSubscribedUserList.fulfilled,
        (state, action: PayloadAction<UserListResponse>) => {
          state.isLoading = false;
          state.subscribedUserList = action.payload;
        }
      )
      .addCase(fetchSubscribedUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchUnsubscribedUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error when starting to fetch
      })
      .addCase(
        fetchUnsubscribedUserList.fulfilled,
        (state, action: PayloadAction<UserListResponse>) => {
          state.isLoading = false;
          state.unsubscribedUserList = action.payload;
        }
      )
      .addCase(fetchUnsubscribedUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchRevenueData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchRevenueData.fulfilled,
        (state, action: PayloadAction<RevenueResponse>) => {
          state.isLoading = false;
          state.revenueData = action.payload;
        }
      )
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || null;
      })
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAnalyticsData.fulfilled,
        (state, action: PayloadAction<AnalyticsResponse>) => {
          state.isLoading = false;
          state.analyticsData = action.payload;
        }
      )
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message || null;
      });
  },
});

export default userSlice.reducer;
