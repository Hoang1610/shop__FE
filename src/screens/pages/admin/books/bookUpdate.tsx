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
  message,
  Modal,
  notification,
  Row,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { updateUser } from "../../../../services/api";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { IBook } from "./bookType";
import {
  getBookCategory,
  updateBook,
  uploadImage,
} from "../../../../services/apiBooks";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const onFinishFailed: FormProps<IBook>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

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

export default function BookUpdate({
  isUpdateBook,
  setisUpdateBook,
  bookUpdateData,
  fetchBooks,
}: {
  isUpdateBook: boolean;
  setisUpdateBook: (s: boolean) => void;
  bookUpdateData: IBook | undefined;
  fetchBooks: () => Promise<void>;
}) {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<[]>();
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [dataThumbnail, setDataThumbnail] = useState<
    | {
        name: string;
        uid: string;
        status?: string;
        url?: string;
      }
    | undefined
  >();
  const [dataSlider, setDataSlider] = useState<
    | {
        name: string;
        uid: string;
        status?: string;
        url?: string;
      }[]
  >([]);
  const [form] = Form.useForm();
  useEffect(() => {
    if (bookUpdateData && bookUpdateData.thumbnail && bookUpdateData.slider) {
      form.setFieldsValue(bookUpdateData);
      const data = bookUpdateData.slider.map((item) => ({
        name: item,
        uid: uuidv4(),
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
      }));
      setDataSlider(data);
      setDataThumbnail({
        name: bookUpdateData.thumbnail,
        uid: uuidv4(),
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          bookUpdateData.thumbnail
        }`,
      });
    }
    return () => {
      form.resetFields();
    };
  }, [bookUpdateData, isUpdateBook]);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookCategory();
      setCategoryList(res.data);
    };
    fetchCategory();
  }, []);
  const onFinish: FormProps<IBook>["onFinish"] = async (values) => {
    const { mainText, author, price, sold, quantity, category } = values;
    const newSlider: string[] = dataSlider.map((item) => item.name);
    setIsSubmit(true);
    if (dataThumbnail && dataThumbnail.name && dataSlider.length > 0) {
      const res: any = await updateBook({
        thumbnail: dataThumbnail.name as string,
        slider: newSlider as string[],
        mainText,
        author,
        price: price as number,
        sold,
        quantity,
        category,
        id: bookUpdateData?._id as string,
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
        await fetchBooks();
        setisUpdateBook(false);
      }
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
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64Upload(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  const handleRemove = (file, type) => {
    if (!type) {
      setDataThumbnail(undefined);
    } else {
      const newSlider = dataSlider.filter((item) => item.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };
  const handleUpdate = () => {
    form.submit();
  };
  const handleCancel = () => {
    setisUpdateBook(false);
    setDataSlider([]);
    setDataThumbnail(undefined);
    form.resetFields();
  };
  return (
    <Modal
      title="Cập nhật book"
      closable={{ "aria-label": "Custom Close Button" }}
      open={isUpdateBook}
      onOk={handleUpdate}
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
          onClick={handleUpdate}
        >
          Cập nhật
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
                defaultFileList={[dataThumbnail ? dataThumbnail : {}]}
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
                defaultFileList={dataSlider.length > 0 ? dataSlider : []}
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
  );
}
