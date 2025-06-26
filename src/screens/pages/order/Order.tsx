import { useState } from "react";
import OrderDetail from "./OrderDetail";
import { Steps } from "antd";
import OrderInfo from "./OrderInfo";
import OrderFinish from "./OrderFinish";
export default function Order() {
  const [stepNumber, setStepNumber] = useState<number>(0);
  return (
    <div className="order">
      <div className="order-step">
        <Steps
          size="small"
          current={stepNumber}
          items={[
            {
              title: "Đơn hàng",
            },
            {
              title: "Đặt hàng",
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
      </div>
      {stepNumber === 0 && <OrderDetail setStepNumber={setStepNumber} />}
      {stepNumber === 1 && <OrderInfo setStepNumber={setStepNumber} />}
      {stepNumber === 2 && <OrderFinish />}
    </div>
  );
}
