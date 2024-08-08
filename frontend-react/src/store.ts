import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { UserLoginData, UserSignUpData } from "./lib/types";

interface ContentState {
  value: string;
}

const initialState: ContentState = {
  value: "",
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContent(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

const initialStateForToggle: boolean = false;

const initialStateForUserRegistration: UserSignUpData = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  agreed_to_terms: false,
  gender: "",
  language: "",
  country: "",
};

const initialStateForLogin: UserLoginData = {
  email: "",
  password: "",
};

const userSignUpSlice = createSlice({
  name: "userSignUp",
  initialState: initialStateForUserRegistration,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.first_name = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.last_name = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phone_number = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setGender: (state, action: PayloadAction<string>) => {
      state.gender = action.payload as "" | "Male" | "Female";
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload as "English" | "Spanish" | "";
    },
    setCounty: (state, action: PayloadAction<string>) => {
      state.country = action.payload as "" | "Mexico" | "USA";
    },

    resetUserSignUpForm: () => initialStateForUserRegistration,
  },
});

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState: initialStateForLogin,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUserPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

const toggleSlice = createSlice({
  name: "toggle",
  initialState: initialStateForToggle,
  reducers: {
    toggleComponent: (state) => !state,
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setPassword,
  setGender,
  setLanguage,
  setCounty,
  resetUserSignUpForm,
} = userSignUpSlice.actions;

export const { setUserEmail, setUserPassword } = userLoginSlice.actions;
export const { toggleComponent } = toggleSlice.actions;
export const { setContent } = contentSlice.actions;

const rootReducer = combineReducers({
  userSignUp: userSignUpSlice.reducer,
  userLogin: userLoginSlice.reducer,
  isSignUpActive: toggleSlice.reducer,
  content: contentSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
