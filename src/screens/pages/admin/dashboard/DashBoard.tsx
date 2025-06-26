import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { getDashboard } from "../../../../services/api";

export default function DashBoard() {
  const [countUser, setCountUser] = useState<number>();
  const [countOrder, setCountOrder] = useState<number>();
  useEffect(() => {
    const fetchData = async () => {
      const res = await getDashboard();
      if (res && res.data) {
        setCountOrder(res.data.countOrder);
        setCountUser(res.data.countUser);
      }
    };
    fetchData();
  }, []);
  return (
    <Row gutter={50}>
      <Col lg={8}>
        <Card style={{ width: "100%" }}>
          <p style={{ margin: 0, color: "#aaa" }}>Tổng Users</p>
          <CountUp
            end={countUser ?? 10}
            duration={3}
            style={{ fontSize: "20px" }}
          />
        </Card>
      </Col>
      <Col lg={8}>
        <Card style={{ width: "100%" }}>
          <p style={{ margin: 0, color: "#aaa" }}>Tổng đơn hàng</p>
          <CountUp
            end={countOrder ?? 10}
            duration={3}
            style={{ fontSize: "20px" }}
          />
        </Card>
      </Col>
    </Row>
  );
}
