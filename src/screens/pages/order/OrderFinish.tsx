import { SmileOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router";

export default function OrderFinish() {
  const naviagte = useNavigate();
  return (
    <div className="order-finish">
      <SmileOutlined style={{ fontSize: 70, color: "rgb(35, 120, 217)" }} />
      <p>Đơn hàng đã được đặt thành công!</p>
      <Button type="primary" onClick={() => naviagte("/history")}>
        Xem lịch sử
      </Button>
    </div>
  );
}
