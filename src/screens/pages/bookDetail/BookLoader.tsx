import { Col, Row, Skeleton } from "antd";
export default function BookLoader() {
  return (
    <Row gutter={20}>
      <Col md={10} sm={0} xs={0}>
        <Skeleton.Input active block style={{ width: "100%", height: 350 }} />
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            justifyContent: "center",
          }}
        >
          <Skeleton.Image active />
          <Skeleton.Image active />
          <Skeleton.Image active />
        </div>
      </Col>
      <Col md={14} sm={24} style={{ marginTop: "-16px" }}>
        <Skeleton paragraph={{ rows: 3 }} active />
        <br />
        <Skeleton paragraph={{ rows: 2 }} active />
        <br /> <br />
        <div style={{ display: "flex", gap: 20 }}>
          <Skeleton.Button active style={{ width: 100 }} />
          <Skeleton.Button active style={{ width: 100 }} />
        </div>
      </Col>
    </Row>
  );
}
