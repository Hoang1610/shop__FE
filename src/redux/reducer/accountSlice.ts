import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IUser {
  email: string;
  phone: string;
  fullName: string;
  role: string;
  avatar: string;
  id: string;
}
interface IAccount {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IUser;
}

// Define the initial state using that type
const initialState: IAccount = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    email: "",
    phone: "",
    fullName: "",
    role: "",
    avatar: "",
    id: "",
  },
};

export const accountSlice = createSlice({
  name: "account",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    doLogin: (state, action: PayloadAction<IUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    doLogout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
      };
    },
    doUpdate: (
      state,
      action: PayloadAction<{ avatar: string; phone: string; fullName: string }>
    ) => {
      state.user.avatar = action.payload.avatar;
      state.user.phone = action.payload.phone;
      state.user.fullName = action.payload.fullName;
    },
  },
});

export const { doLogin, doLogout, doUpdate } = accountSlice.actions;

export default accountSlice.reducer;
