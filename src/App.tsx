import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./screens/pages/Home/Home";
import Register from "./screens/pages/register/Register";
import Login from "./screens/pages/login/Login";
import { useEffect, useState } from "react";
import { fetchAccount } from "./services/api";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { doLogin } from "./redux/reducer/accountSlice";
import Loading from "./screens/pages/loading/Loading";
import NotFound from "./screens/pages/notFound/NotFound";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import LayoutAdmin from "./screens/pages/admin/LayoutAdmin";
import Users from "./screens/pages/admin/users/users";
import Books from "./screens/pages/admin/books/books";
import BookDetail from "./screens/pages/bookDetail/BookDetail";
import Order from "./screens/pages/order/Order";
import History from "./screens/pages/history/History";
import DashBoard from "./screens/pages/admin/dashboard/DashBoard";
import OrderTable from "./screens/pages/admin/order/OrderTable";
const Layout = () => {
  const [searchData, setSearchData] = useState<string>("");
  return (
    <>
      <Header searchData={searchData} setSearchData={setSearchData} />
      <Outlet context={[searchData, setSearchData]} />
      <Footer />
    </>
  );
};

function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    const path = location.pathname;
    if (path === "/login" || path === "/register") return;
    const res = await fetchAccount();
    if (res.data && res.data.user) {
      dispatch(doLogin(res.data.user));
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: "contact", element: <div>Contact</div> },
        { path: "book/:slug", element: <BookDetail /> },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ),
        },
        {
          path: "history",
          element: (
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          ),
        },
        {
          path: "managerUsers",
          element: <Users />,
        },
        { path: "managerBooks", element: <Books /> },
        { path: "managerOrders", element: <OrderTable /> },
      ],
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <>
      {isLoading ||
      location.pathname === "/login" ||
      location.pathname === "/" ||
      location.pathname === "/register" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
