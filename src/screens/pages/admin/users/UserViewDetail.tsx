import { Badge, Descriptions, DescriptionsProps, Drawer } from "antd";
import moment from "moment";
interface user {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
interface IProps {
  isUserDetail: boolean;
  setIsUserDetail: (a: boolean) => void;
  userDetail: user | null | undefined;
}

export default function UserViewDetail(props: IProps) {
  const { setIsUserDetail, isUserDetail, userDetail } = props;
  const onClose = () => {
    setIsUserDetail(false);
  };
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: userDetail?._id,
    },
    {
      key: "2",
      label: "Tên hiển thị",
      children: userDetail?.fullName,
    },
    {
      key: "3",
      label: "Email",
      children: userDetail?.email,
    },
    {
      key: "4",
      label: "Số điện thoại",
      children: userDetail?.phone,
    },
    {
      key: "5",
      label: "Role",
      children: <Badge status="processing" text={userDetail?.role} />,
      span: 2,
    },
    {
      key: "6",
      label: "Create at",
      children: moment(userDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      key: "7",
      label: "Update at",
      children: moment(userDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];
  return (
    <Drawer
      title="Chức năng xem chi tiết"
      closable={{ "aria-label": "Close Button" }}
      onClose={onClose}
      open={isUserDetail}
      width={"50vw"}
    >
      <Descriptions title="Thông tin user" bordered items={items} column={2} />
    </Drawer>
  );
}
