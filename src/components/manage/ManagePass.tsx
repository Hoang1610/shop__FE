import { Button, Col, Form, FormProps, Input, message, Row } from "antd";
import { useAppSelector } from "../../redux/hook";
import { useEffect } from "react";
import { changeUserPass } from "../../services/api";
type FieldType = {
  email?: string;
  password?: string;
  newPassword?: string;
};
export default function ManagePass() {
  const [form] = Form.useForm();
  const user = useAppSelector((state) => state.account.user);
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, password, newPassword } = values;
    const data = {
      email: email as string,
      oldpass: password as string,
      newpass: newPassword as string,
    };
    const res = await changeUserPass(data);
    if (res && res.data) {
      message.success("Cập nhật mật khẩu thành công");
      form.resetFields();
      form.setFieldsValue(user);
    } else {
      message.error("Mật khẩu cũ chính xác");
    }
  };

  return (
    <div className="manage-info">
      <Row>
        <Col span={12}>
          <Form
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item<FieldType>
              label="email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item<FieldType>
              label="Mật khẩu hiện tại"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
