import { Modal, Tabs } from "antd";
import ManageInfo from "./ManageInfo";
import ManagePass from "./ManagePass";

export default function ManageModal({
  setIsManage,
  isManage,
}: {
  setIsManage: (s: boolean) => void;
  isManage: boolean;
}) {
  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <ManageInfo />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ManagePass />,
    },
  ];
  return (
    <Modal
      title="Quản lý tài khoản"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isManage}
      onCancel={() => setIsManage(false)}
      footer={() => <></>}
      width={800}
      maskClosable={false}
    >
      <div className="manage-modal">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </Modal>
  );
}
