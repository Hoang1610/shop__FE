import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Divider,
  Drawer,
  Dropdown,
  Input,
  notification,
  Popover,
  Space,
} from "antd";
import { FaReact } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { isMobile } from "react-device-detect";
import { CiMenuBurger } from "react-icons/ci";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import type { MenuProps } from "antd";
import { logout } from "../../services/api";
import { doLogout } from "../../redux/reducer/accountSlice";
import ManageModal from "../manage/ManageModal";

function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
export default function Header({
  searchData,
  setSearchData,
}: {
  searchData: string;
  setSearchData: (s: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isManage, setIsManage] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const onClose = () => {
    setOpen(false);
  };
  const { isAuthenticated, user } = useAppSelector((state) => state.account);
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.order.cart);
  const quantity = cart.length;
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
  const content = (
    <div className="wrap">
      {cart &&
        cart.map((item) => (
          <div className="item">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                item.detail.thumbnail
              }`}
              alt=""
              className="item-img"
            />
            <h3 className="item-title">{item.detail.mainText}</h3>
            <span className="item-price">
              {formatToVND(item.detail.price as number)}
            </span>
          </div>
        ))}
      <div className="pop-footer">
        <button onClick={() => navigate("/order")}>Xem giỏ hàng</button>
      </div>
    </div>
  );
  const urlImage = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user.avatar
  }`;
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <label style={{ cursor: "pointer" }}>Quản lý tài khoản</label>,
      onClick: () => setIsManage(true),
    },
    {
      key: "2",
      label: "Lịch sử mua hàng",
      onClick: () => navigate("/history"),
    },
    {
      key: "3",
      label: "Đăng xuất",
      onClick: handleLoggout,
    },
  ];
  if (user.role === "ADMIN") {
    items.unshift({
      key: "4",
      label: <Link to={"/admin"}>Trang quản trị</Link>,
    });
  }
  return (
    <>
      <div className="header">
        <Drawer
          closable
          title="Menu chức năng"
          placement={"left"}
          onClose={onClose}
          open={open}
          key={"left"}
        >
          <p>Quản lý tài khoản</p>
          <Divider />
          <p>Đăng xuất</p>
        </Drawer>
        {!isMobile ? (
          <Link to={"/"} className="logo">
            <FaReact size={50} className="logo_icon" />
            <p>Tiki Clone</p>
          </Link>
        ) : (
          <CiMenuBurger
            size={70}
            style={{ color: "rgb(83, 168, 196)", fontWeight: "700" }}
            onClick={() => setOpen(true)}
          />
        )}
        <div className="header_input">
          <Input
            prefix={
              <SearchOutlined style={{ color: "#53a8c4", fontSize: "18px" }} />
            }
            className="header_int"
            placeholder="Bạn tìm gì hôm nay"
            value={searchData}
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
        <div className="badge">
          <Popover
            placement="bottomRight"
            title={"Sản phẩm mới thêm"}
            content={content}
            rootClassName="popover-class"
          >
            <Badge count={quantity ?? 0} showZero>
              <LuShoppingCart size={30} className="badge_icon" />
            </Badge>
          </Popover>
        </div>
        {!isMobile ? (
          <div className="header_act">
            {!isAuthenticated ? (
              <Link to={"/login"}>Tài khoản</Link>
            ) : (
              <Dropdown menu={{ items }}>
                <Space>
                  <Avatar src={urlImage} />
                  {user.fullName}
                </Space>
              </Dropdown>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <ManageModal setIsManage={setIsManage} isManage={isManage} />
    </>
  );
}
