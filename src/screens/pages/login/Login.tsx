import { Button, Divider, Form, FormProps, Input, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../../../services/api";
import { useAppDispatch } from "../../../redux/hook";
import { doLogin } from "../../../redux/reducer/accountSlice";
type FieldType = {
  password: string;
  username: string;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const data = { ...values, delay: 1500 };
    const res: any = await login(data);
    setIsSubmit(false);
    if (res.error) {
      notification.error({
        message: Array.isArray(res.message) ? res.message[0] : res.message,
      });
    }
    if (res.data) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLogin(res.data.user));
      notification.success({
        message: "Đăng nhập thành công",
        placement: "top",
      });
      navigate("/");
    }
  };
  return (
    <div className="login">
      <h1>Đăng nhập</h1>
      <Divider />
      <Form
        name="basic"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600, margin: "0 auto" }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Email"
          name="username"
          rules={[{ required: true, message: "Email bắt buộc nhập!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: "Pass bắt buộc nhập!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            typeof="submit"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      <Divider>Or</Divider>
      <div className="register_bottom">
        <p>
          Chưa có tài khoản? <Link to={"/register"}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
