import {
  Badge,
  Descriptions,
  DescriptionsProps,
  Divider,
  Drawer,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import moment from "moment";
import { IBook } from "./bookType";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
interface IProps {
  isBookDetail: boolean;
  setIsBookDetail: (a: boolean) => void;
  bookDetail: IBook | null | undefined;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
export default function BookViewDetail(props: IProps) {
  const { setIsBookDetail, isBookDetail, bookDetail } = props;
  console.log(bookDetail?.price);
  const onClose = () => {
    setIsBookDetail(false);
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  useEffect(() => {
    if (bookDetail) {
      const item: UploadFile[] = [];
      if (bookDetail.thumbnail) {
        item.push({
          uid: uuidv4(),
          name: bookDetail.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            bookDetail.thumbnail
          }`,
        });
      }
      if (bookDetail.slider && bookDetail.slider?.length > 0) {
        bookDetail.slider.map((book) => {
          item.push({
            uid: uuidv4(),
            name: book,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${book}`,
          });
        });
      }
      setFileList(item);
    }
  }, [bookDetail]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Id",
      children: bookDetail?._id,
    },
    {
      key: "2",
      label: "Tên sách",
      children: bookDetail?.mainText,
    },
    {
      key: "3",
      label: "Tác giả",
      children: bookDetail?.author,
    },
    {
      key: "4",
      label: "Giá tiền",
      children: formatToVND(bookDetail?.price as number),
    },
    {
      key: "5",
      label: "Số lượng",
      children: bookDetail?.quantity,
    },
    {
      key: "6",
      label: "Đã bán",
      children: bookDetail?.sold,
    },
    {
      key: "7",
      label: "Thể loại",
      children: <Badge status="processing" text={bookDetail?.category} />,
      span: 2,
    },
    {
      key: "8",
      label: "Create at",
      children: moment(bookDetail?.createdAt).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      key: "9",
      label: "Update at",
      children: moment(bookDetail?.updatedAt).format("DD-MM-YYYY HH:mm:ss"),
    },
  ];

  return (
    <Drawer
      title="Chức năng xem chi tiết"
      closable={{ "aria-label": "Close Button" }}
      onClose={onClose}
      open={isBookDetail}
      width={"50vw"}
    >
      <Descriptions title="Thông tin book" bordered items={items} column={2} />
      <Divider orientation="left">Ảnh Books</Divider>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{
          showRemoveIcon: false,
        }}
      ></Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Drawer>
  );
}
