import { IBook } from "../screens/pages/admin/books/bookType";
import axios from "../utils/axios-custom";
const getBooks = async (
  currentPage: number,
  pageSize: number,
  query: string,
  sortQuery: string,
  searchData: string
) => {
  const res = await axios.get(
    `/api/v1/book?current=${currentPage}&pageSize=${pageSize}${query}&${sortQuery}&${searchData}`
  );
  return res;
};
const updateBook = async ({
  thumbnail,
  slider,
  mainText,
  author,
  price,
  sold,
  quantity,
  category,
  id,
}: {
  id: string;
  thumbnail: string;
  slider: string[];
  mainText: string;
  author: string;
  price: number;
  sold: number;
  quantity: number;
  category: string;
}) => {
  const res = await axios.put(`/api/v1/book/${id}`, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    sold,
    quantity,
    category,
  });
  return res;
};
const uploadImage = (fileImage) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImage);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};
const getBookCategory = async () => {
  return axios.get("/api/v1/database/category");
};
const createBook = async (data: IBook) => {
  return axios.post("/api/v1/book", data);
};
const deleteBooks = async (id: string) => {
  return axios.delete(`/api/v1/book/${id}`);
};
const getBookById = async (id: string) => {
  return axios.get(`/api/v1/book/${id}`);
};
export {
  getBooks,
  updateBook,
  uploadImage,
  getBookCategory,
  createBook,
  deleteBooks,
  getBookById,
};
