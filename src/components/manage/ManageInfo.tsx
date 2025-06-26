import {
  Avatar,
  Button,
  Col,
  Form,
  FormProps,
  Input,
  message,
  Row,
  Upload,
  UploadProps,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { updateInfo, uploadAvatar } from "../../services/api";
import { doUpdate } from "../../redux/reducer/accountSlice";
const props: UploadProps = {
  name: "file",
  headers: {
    authorization: "authorization-text",
  },
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
};

type FieldType = {
  email?: string;
  fullName?: string;
  phone?: string;
};
export default function ManageInfo() {
  const user = useAppSelector((state) => state.account.user);
  const [fileImg, setFileImg] = useState<string>("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user]);
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    onSuccess("ok"); // Gọi onSuccess khi tải lên thành công
    const res = await uploadAvatar(file);
    if (res && res.data) {
      setFileImg(`${res.data.fileUploaded}`);
    }
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, phone } = values;
    const data = {
      fullName: fullName as string,
      phone: phone as string,
      _id: user.id,
      avatar: fileImg,
    };
    const res = await updateInfo(data);
    if (res && res.data) {
      message.success("Cập nhật thành công");
      dispatch(
        doUpdate({
          fullName: fullName as string,
          phone: phone as string,
          avatar: fileImg,
        })
      );
      localStorage.removeItem("access_token");
    }
  };

  return (
    <div className="manage-info">
      <Row>
        <Col span={12}>
          <div className="manage-info-column">
            <Avatar
              size={160}
              src={
                fileImg
                  ? `${
                      import.meta.env.VITE_BACKEND_URL
                    }/images/avatar/${fileImg}`
                  : `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
                      user.avatar
                    }`
              }
            />
            <Upload
              {...props}
              customRequest={handleCustomRequest}
              accept=".png,.jpg,.jpeg,.gif,.bmp,.webp"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>
        </Col>
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
              label="Tên hiển thị"
              name="fullName"
              rules={[
                { required: true, message: "Please input your fullName!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={null}>
              <Button htmlType="submit">Cập nhật</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
