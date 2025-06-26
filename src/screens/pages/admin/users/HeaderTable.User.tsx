import {
  CloudUploadOutlined,
  DeliveredProcedureOutlined,
  InboxOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import * as XLSX from "xlsx";
import {
  Button,
  Divider,
  Form,
  FormProps,
  Input,
  Modal,
  notification,
  Table,
} from "antd";
import { message, Upload } from "antd";
import { useState } from "react";
import { createAUser, createMultiUser } from "../../../../services/api";
import templateFile from "./Book1.xlsx?url";
const { Dragger } = Upload;
type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: number;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
export default function HeaderTableUser({
  setSortQuery,
  setQuery,
  fetchUsers,
  users,
}: {
  setSortQuery: (s: string) => void;
  setQuery: (s: string) => void;
  fetchUsers: () => Promise<void>;
  users: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [dataFile, setDataFile] = useState<FieldType[] | undefined>();
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleUpload = async () => {
    const data = dataFile?.map((item) => {
      item.password = "123456";
      return item;
    });
    const res: any = await createMultiUser(data as FieldType[]);
    if (res.data) {
      notification.success({
        description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
        message: "Upload thành công",
      });
      setDataFile(undefined);
      setIsUpload(false);
      fetchUsers();
    } else {
      notification.error({
        description: res.message,
        message: "Đã có lỗi xảy ra",
      });
    }
  };
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, password, email, phone } = values;
    setIsSubmit(true);
    const res: any = await createAUser(fullName, password, email, phone);
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
      form.resetFields();
      setIsModalOpen(false);
    }
  };
  const dummyRequest = async (options: RcCustomRequestOptions) => {
    const { onSuccess } = options;
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const columns = [
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      key: "1",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "3",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "3",
      sorter: true,
    },
  ];
  const fileProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: dummyRequest,
    accept:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("uploading");
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.file.originFileObj) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(info.file.originFileObj);
          reader.onload = (e) => {
            if (reader.result) {
              const data = new Uint8Array(reader.result as ArrayBuffer);
              const workbook = XLSX.read(data, { type: "array" });
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              // convert to json format
              const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: ["fullName", "email", "phone"],
                range: 1,
              });
              if (jsonData && jsonData.length > 0)
                setDataFile(jsonData as FieldType[]);
            }
          };
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const handleExport = (data: FieldType[]) => {
    if (data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "DataSheet.csv");
    }
  };
  return (
    <>
      <Modal
        title="Import data user"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isUpload}
        onOk={handleUpload}
        onCancel={() => setIsUpload(false)}
        maskClosable={false}
        confirmLoading={isSubmit}
        width={800}
        footer={[
          <Button key="back" onClick={() => setIsUpload(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmit}
            onClick={handleUpload}
            disabled={dataFile ? false : true}
          >
            Import data
          </Button>,
        ]}
      >
        <Dragger {...fileProps} style={{ maxHeight: "180px" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single upload. Only accept .csv, .xls, .xlsx .or
            &nbsp;
            <a
              href={templateFile}
              download
              onClick={(e) => e.stopPropagation()}
            >
              Download Sample File
            </a>
          </p>
        </Dragger>
        <p>Dữ liệu upload</p>
        <Table
          dataSource={dataFile}
          columns={columns}
          pagination={{
            pageSize: 4,
          }}
          bordered
        />
      </Modal>
      <Modal
        title="Thêm mới người dùng"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        confirmLoading={isSubmit}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmit}
            onClick={handleOk}
          >
            Tạo mới
          </Button>,
        ]}
      >
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
          form={form}
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
        </Form>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 600 }}>Table List Users</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button type="primary" onClick={() => handleExport(users)}>
            <DeliveredProcedureOutlined />
            Export
          </Button>
          <Button type="primary" onClick={() => setIsUpload(true)}>
            <CloudUploadOutlined />
            Import
          </Button>
          <Button type="primary" onClick={showModal}>
            <PlusOutlined />
            Thêm mới
          </Button>
          <ReloadOutlined
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => {
              setQuery("");
              setSortQuery("");
            }}
          />
        </div>
      </div>
    </>
  );
}
