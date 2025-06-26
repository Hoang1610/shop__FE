import { Form, FormProps, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { updateUser } from "../../../../services/api";
type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: number;
  _id?: string;
};
const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
export default function UserUpdate({
  isUpdateUser,
  setisUpdateUser,
  userUpdateData,
  fetchUsers,
}: {
  isUpdateUser: boolean;
  setisUpdateUser: (s: boolean) => void;
  userUpdateData: FieldType | undefined;
  fetchUsers: () => Promise<void>;
}) {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(userUpdateData);
  }, [userUpdateData]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, phone } = values;
    setIsSubmit(true);
    const res: any = await updateUser({
      fullName,
      phone,
      id: userUpdateData?._id as string,
    });
    setIsSubmit(false);
    if (res.error) {
      notification.error({
        message: Array.isArray(res.message) ? res.message[0] : res.message,
      });
    }
    if (res.data) {
      notification.success({
        message: "Update thành công",
        placement: "top",
      });
      setisUpdateUser(false);
      fetchUsers();
    }
  };
  const handleDelete = () => {
    form.submit();
  };
  return (
    <Modal
      title="Update User"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isUpdateUser}
      onOk={handleDelete}
      onCancel={() => setisUpdateUser(false)}
      okText={"Update"}
      loading={isSubmit}
    >
      <Form
        form={form}
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
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Phone bắt buộc nhập!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
