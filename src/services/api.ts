import { IRegister } from "../types/type";
import axios from "../utils/axios-custom";
const register = async ({ fullName, email, password, phone }: IRegister) => {
  const res = await axios.post("api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
  return res;
};
const login = async ({
  username,
  password,
  delay,
}: {
  username: string;
  password: string;
  delay: number;
}) => {
  const res = await axios.post("api/v1/auth/login", {
    username,
    password,
    delay,
  });
  return res;
};
const fetchAccount = async () => {
  const res = await axios.get("/api/v1/auth/account");
  return res;
};
const logout = async () => {
  const res = await axios.post("/api/v1/auth/logout");
  return res;
};
const getUsers = async (
  currentPage: number,
  pageSize: number,
  query: string,
  sortQuery: string
) => {
  const res = await axios.get(
    `/api/v1/user?current=${currentPage}&pageSize=${pageSize}${query}&${sortQuery}`
  );
  return res;
};
const createAUser = async (
  fullName: string,
  password: string,
  email: string,
  phone: number
) => {
  const res = await axios.post("/api/v1/user", {
    fullName,
    password,
    email,
    phone,
  });
  return res;
};
const createMultiUser = async (data: IRegister[]) => {
  const res = await axios.post("/api/v1/user/bulk-create", data);
  return res;
};
const updateUser = async ({
  id,
  fullName,
  phone,
}: {
  id: string;
  fullName: string;
  phone: number;
}) => {
  const res = await axios.put("/api/v1/user", {
    fullName,
    _id: id,
    phone,
  });
  return res;
};
const deleteUser = async (id: string) => {
  const res = await axios.delete(`/api/v1/user/${id}`);
  return res;
};
interface IData {
  name: string;
  address: string;
  phone: string;
  totalPrice: number;
  detail: {
    bookName: string;
    quantity: number;
    _id: string;
  }[];
}
const createOrder = async (data: IData) => {
  return axios.post("/api/v1/order", data);
};
const getHistory = async () => {
  return axios.get("/api/v1/history");
};
const uploadAvatar = async (file) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", file);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  };
  return axios.post(`/api/v1/file/upload`, bodyFormData, config);
};
const updateInfo = ({
  fullName,
  phone,
  avatar,
  _id,
}: {
  fullName: string;
  phone: string;
  avatar: string;
  _id: string;
}) => {
  return axios.put(`/api/v1/user`, { fullName, phone, avatar, _id });
};
const changeUserPass = ({
  email,
  oldpass,
  newpass,
}: {
  email: string;
  oldpass: string;
  newpass: string;
}) => {
  return axios.post(`/api/v1/user/change-password`, {
    email,
    oldpass,
    newpass,
  });
};
const getDashboard = () => {
  return axios.get("/api/v1/database/dashboard");
};
const getOrders = async (
  currentPage: number,
  pageSize: number,
  query: string,
  sortQuery: string
) => {
  const res = await axios.get(
    `/api/v1/order?current=${currentPage}&pageSize=${pageSize}${query}&${sortQuery}`
  );
  return res;
};
export {
  register,
  getDashboard,
  changeUserPass,
  getOrders,
  login,
  fetchAccount,
  logout,
  getUsers,
  createAUser,
  createMultiUser,
  updateUser,
  deleteUser,
  createOrder,
  getHistory,
  uploadAvatar,
  updateInfo,
};
