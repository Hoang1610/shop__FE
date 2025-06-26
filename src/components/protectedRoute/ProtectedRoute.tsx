import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import NotPermitted from "../../screens/pages/notpermit/NotPermitted";
import { fetchAccount } from "../../services/api";
import { doLogin } from "../../redux/reducer/accountSlice";
import { useEffect } from "react";
const RoleBaseRoute = (props) => {
  const isAdminRoute = location.pathname.startsWith("/admin");
  const user = useAppSelector((state) => state.account.user);
  const userRole = user.role;
  if (
    (isAdminRoute && userRole === "ADMIN") ||
    (!isAdminRoute && (userRole === "USER" || userRole === "ADMIN"))
  ) {
    return <>{props.children}</>;
  } else {
    return <NotPermitted />;
  }
};
export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const getAccount = async () => {
    const res = await fetchAccount();
    if (res.data && res.data.user) {
      dispatch(doLogin(res.data.user));
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    getAccount();
  }, []);
  return (
    <>
      <RoleBaseRoute>{props.children}</RoleBaseRoute>
    </>
  );
}
