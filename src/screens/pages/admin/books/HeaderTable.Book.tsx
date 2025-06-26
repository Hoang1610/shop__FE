import {
  DeliveredProcedureOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import * as XLSX from "xlsx";
import {
  Button,
  Col,
  Divider,
  Form,
  FormProps,
  GetProp,
  Image,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  UploadFile,
  UploadProps,
} from "antd";
import { message, Upload } from "antd";
import { useEffect, useState } from "react";
import { IBook } from "./bookType";
import {
  createBook,
  getBookCategory,
  uploadImage,
} from "../../../../services/apiBooks";

const onFinishFailed: FormProps<IBook>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64Upload = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
export default function HeaderTableUser({
  setSortQuery,
  setQuery,
  fetchBooks,
  books,
}: {
  setSortQuery: (s: string) => void;
  setQuery: (s: string) => void;
  fetchBooks: () => Promise<void>;
  books: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [dataThumbnail, setDataThumbnail] = useState<
    | {
        name: string;
        uid: string;
      }
    | undefined
  >();
  const [dataSlider, setDataSlider] = useState<
    | {
        name: string;
        uid: string;
      }[]
  >([]);
  const [categoryList, setCategoryList] = useState<[]>();
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookCategory();
      setCategoryList(res.data);
    };
    fetchCategory();
  }, []);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setDataThumbnail(undefined);
    setDataSlider([]);
    form.resetFields();
  };
  const handleRemove = (file, type) => {
    if (!type) {
      setDataThumbnail([]);
    } else {
      const newSlider = dataSlider.filter((item) => item.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };
  const onFinish: FormProps<IBook>["onFinish"] = async (values) => {
    const { mainText, author, price, sold, quantity, category } = values;
    setIsSubmit(true);
    const newSlider = dataSlider.map((item) => item.name);
    if (!dataThumbnail) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh thumbnail",
      });
      return;
    }
    if (dataSlider.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh slider",
      });
      return;
    }
    const data: IBook = {
      mainText,
      author,
      price,
      sold,
      quantity,
      category,
      thumbnail: dataThumbnail.name,
      slider: newSlider,
    };
    const res: any = await createBook(data);
    console.log(res);
    setIsSubmit(false);
    if (res.error) {
      notification.error({
        message: Array.isArray(res.message) ? res.message[0] : res.message,
      });
    }
    if (res.data) {
      notification.success({
        message: "Tạo mới book thành công",
        placement: "top",
      });
      form.resetFields();
      setIsModalOpen(false);
      setDataThumbnail(undefined);
      await fetchBooks();
      setDataSlider([]);
    }
  };
  const handleUploadThumb = async (options: RcCustomRequestOptions) => {
    const { onSuccess, onError, file } = options;
    const res = await uploadImage(file);
    if (res && res.data) {
      setDataThumbnail({
        name: res.data.fileUploaded,
        uid: file.uid,
      });
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra");
    }
  };
  const handleUploadSlider = async (options: RcCustomRequestOptions) => {
    const { onSuccess, onError, file } = options;
    const res = await uploadImage(file);
    if (res && res.data) {
      setDataSlider((prev) => [
        ...prev,
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("Đã có lỗi xảy ra");
    }
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Upload(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleExport = (data: IBook[]) => {
    if (data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workbook, "DataSheet.csv");
    }
  };
  const handleChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const handleChangeSlider: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoadingSlider(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoadingSlider(false);
        setImageUrl(url);
      });
    }
  };
  return (
    <>
      <Modal
        title="Thêm mới book"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        confirmLoading={isSubmit}
        width={900}
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
          style={{ maxWidth: 900, margin: "0 auto" }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item<IBook>
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: "Tên sách bắt buộc nhập!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<IBook>
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: "Tác giả bắt buộc nhập!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={6}>
              <Form.Item<IBook>
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
              >
                <InputNumber
                  addonAfter="VND"
                  min={1}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<IBook> label="Thể loại" name="category">
                <Select
                  style={{ width: "100%" }}
                  // onChange={handleChange}
                  options={categoryList?.map((item) => {
                    return { label: item, value: item };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<IBook>
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<IBook>
                label="Đã bán"
                name="sold"
                rules={[{ required: true, message: "Vui lòng nhập đã bán!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item<IBook> label="Ảnh Thumbnail" name="thumbnail">
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  customRequest={handleUploadThumb}
                  maxCount={1}
                  multiple={false}
                  onPreview={handlePreview}
                  onRemove={handleRemove}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<IBook> label="Ảnh Slider" name="slider">
                <Upload
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onChange={handleChangeSlider}
                  customRequest={handleUploadSlider}
                  onPreview={handlePreview}
                  onRemove={(file) => handleRemove(file, "slider")}
                  multiple
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: 0, fontWeight: 600 }}>Table List books</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button type="primary" onClick={() => handleExport(books)}>
            <DeliveredProcedureOutlined />
            Export
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
