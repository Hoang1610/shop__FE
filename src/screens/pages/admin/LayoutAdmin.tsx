import { Link, Outlet, useNavigate } from "react-router";
import Footer from "../../../components/footer/Footer";
import {
  Avatar,
  Button,
  ConfigProvider,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  notification,
  Space,
  theme,
} from "antd";
import {
  AppstoreOutlined,
  BookOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SnippetsOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { logout } from "../../../services/api";
import { doLogout } from "../../../redux/reducer/accountSlice";

const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const user = useAppSelector((state) => state.account.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLoggout = async () => {
    const res = await logout();
    if (res) {
      localStorage.removeItem("access_token");
      dispatch(doLogout());
      notification.success({
        message: "Đăng xuất thành công",
        placement: "top",
      });
      navigate("/");
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Quản lý tài khoản",
    },
    {
      key: "2",
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "3",
      label: "Đăng xuất",
      onClick: handleLoggout,
    },
  ];
  const urlImage = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user.avatar
  }`;
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              triggerBg: "#fff",
              triggerColor: "#002140",
            },
          },
        }}
      >
        <Space>
          <Layout style={{ minHeight: "100vh", minWidth: "98vw" }}>
            <Sider
              style={{ background: colorBgContainer }}
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div
                className="sider_title"
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                  marginTop: "18px",
                  fontSize: "18px",
                }}
              >
                Admin
              </div>
              <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={[
                  {
                    key: "/admin",
                    icon: <AppstoreOutlined />,
                    label: <Link to={"/admin"}>Dashborad</Link>,
                  },
                  {
                    key: `/manager`,
                    icon: <UserOutlined />,
                    label: "Manager users",
                    children: [
                      {
                        key: "/admin/managerUsers",
                        label: <Link to={"/admin/managerUsers"}>CRUD</Link>,
                        icon: <UsergroupDeleteOutlined />,
                      },
                      {
                        key: "3",
                        label: "Files",
                        icon: <UsergroupDeleteOutlined />,
                      },
                    ],
                  },
                  {
                    key: "/admin/managerBooks",
                    icon: <BookOutlined />,
                    label: (
                      <Link to={"/admin/managerBooks"}>Manager books</Link>
                    ),
                  },
                  {
                    key: "/admin/managerOrders",
                    icon: <SnippetsOutlined />,
                    label: (
                      <Link to={"/admin/managerOrders"}>Manager orders</Link>
                    ),
                  },
                ]}
              />
            </Sider>
            <Layout>
              <Header style={{ padding: 0, background: colorBgContainer }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "30px",
                    height: "100%",
                  }}
                >
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                      fontSize: "16px",
                      width: 42,
                      height: 42,
                    }}
                  />
                  <Dropdown menu={{ items }}>
                    <Space>
                      <Avatar src={urlImage} />
                      {user.fullName}
                    </Space>
                  </Dropdown>
                </div>
              </Header>
              <Content
                style={{
                  margin: "24px 16px",
                  padding: 24,
                  height: "auto",
                  background:
                    location.pathname === "/admin" ? "" : colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
              >
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </Space>
      </ConfigProvider>

      <Footer />
    </>
  );
};
export default LayoutAdmin;
