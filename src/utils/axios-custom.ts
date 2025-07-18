import axios from "axios";
const baseURL = import.meta.env.VITE_BACKEND_URL;
const instance = axios.create({
  baseURL,
  withCredentials: true,
});
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
const updateToken = async () => {
  const res = await instance.get("/api/v1/auth/refresh");
  if (res && res.data) return res.data.access_token;
  else return null;
};
// Add a response interceptor
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // if (
    //   error.config &&
    //   error.response &&
    //   +error.response.status === 401 &&
    //   !error.config.headers["NO_RETRY_HEADER"]
    // ) {
    //   error.config.headers["NO_RETRY_HEADER"] = true;
    //   const access_token = await updateToken();
    //   if (access_token) {
    //     localStorage.setItem("access_token", access_token);
    //     error.config.headers["Authorization"] = `Bearer ${localStorage.getItem(
    //       "access_token"
    //     )}`;
    //     return instance.request(error.config);
    //   }
    // }
    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/api/v1/auth/refresh" &&
      location.pathname !== "/"
    ) {
      console.log(location.href);
      location.href = "/login";
    }
    return error?.response?.data ?? Promise.reject(error);
  }
);
export default instance;
