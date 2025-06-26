import { Button, Divider, Form, FormProps, Input, notification } from "antd";
import { register } from "../../../services/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: number;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [sortQuery, setSortQuery] = useState<string>("sort=-updatedAt");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const res: any = await register(values);
    setIsSubmit(false);
    if (res.error) {
      notification.error({
        message: Array.isArray(res.message) ? res.message[0] : res.message,
      });
    }
    if (res.data) {
      notification.success({
        message: "Đăng ký thành công",
        placement: "top",
      });
      navigate("/login");
    }
  };
  return (
    <div className="register">
      <h1>Đăng ký tài khoản</h1>
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
          label="Full name"
          name="fullName"
          rules={[{ required: true, message: "Full name bắt buộc nhập!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
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

        <Form.Item<FieldType>
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone bắt buộc nhập!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmit}
            typeof="submit"
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
      <Divider>Or</Divider>
      <div className="register_bottom">
        <p>
          Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
