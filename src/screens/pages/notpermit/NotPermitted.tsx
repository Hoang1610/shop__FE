import { Result } from "antd";
import { Button } from "antd/es/radio";
import { useNavigate } from "react-router";

export default function NotPermitted() {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page ."
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  );
}
