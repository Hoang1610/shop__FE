import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IBook } from "../../screens/pages/admin/books/bookType";
import { message } from "antd";

// Define the initial state using that type
interface IOrder {
  cart: {
    _id: string;
    detail: IBook;
    quantity: number;
  }[];
}
const initialState: IOrder = {
  cart: [],
};

export const orderSlice = createSlice({
  name: "account",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addCart: (
      state,
      action: PayloadAction<{ detail: IBook; quantity: number }>
    ) => {
      const index = state.cart.findIndex(
        (item) => item._id === action.payload.detail._id
      );
      if (index === -1) {
        state.cart.push({
          _id: action.payload.detail._id,
          detail: action.payload.detail,
          quantity: action.payload.quantity,
        });
      } else {
        if (
          state.cart[index].quantity + action.payload.quantity >
          action.payload.detail.quantity
        ) {
          state.cart[index].quantity = action.payload.detail.quantity;
        } else {
          state.cart[index].quantity += action.payload.quantity;
        }
      }
      message.success("Sản phẩm đã được thêm vào giỏ hàng");
    },
    changeQuatity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const index = state.cart.findIndex(
        (item) => item._id === action.payload.id
      );
      state.cart[index].quantity = action.payload.quantity;
    },
    deleteCart: (state, action: PayloadAction<{ id: string }>) => {
      const newCart = state.cart.filter(
        (item) => item._id !== action.payload.id
      );
      state.cart = newCart;
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addCart, changeQuatity, deleteCart, clearCart } =
  orderSlice.actions;

export default orderSlice.reducer;
