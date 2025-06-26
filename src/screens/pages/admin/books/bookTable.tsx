import { message, notification, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import HeaderTableUser from "./HeaderTable.Book";
import BookViewDetail from "./BookViewDetail";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import BookUpdate from "./bookUpdate";
import { IBook } from "./bookType";
import { deleteBooks, getBooks } from "../../../../services/apiBooks";
export default function BookTable({
  query,
  current,
  setCurrent,
  setQuery,
}: {
  query: string;
  current: number;
  setCurrent: (n: number) => void;
  setQuery: (s: string) => void;
}) {
  const [books, setBooks] = useState<IBook[]>([]);
  const [pageSize, setPageSize] = useState<number>(2);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortQuery, setSortQuery] = useState<string>("sort=-updatedAt");
  const [isBookDetail, setIsBookDetail] = useState<boolean>(false);
  const [bookDetail, setBookDetail] = useState<IBook | null>();
  const [isUpdateBook, setisUpdateBook] = useState<boolean>(false);
  const [bookUpdate, setBookUpdate] = useState<IBook | undefined>();
  const fetchbooks = async () => {
    setLoading(true);
    const res = await getBooks(current, pageSize, query, sortQuery);
    if (res && res.data && res.data.result) {
      setBooks(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
  function formatToVND(number: number) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  }
  useEffect(() => {
    fetchbooks();
  }, [current, pageSize, query, sortQuery]);
  const handleDelete = async (data: IBook) => {
    const res: any = await deleteBooks(data._id);
    if (res.data) {
      message.success("Xóa book thành cống");
      fetchbooks();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };
  books.map((item) => {
    item.priceScreen = formatToVND(item.price as number);
    return item;
  });
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsBookDetail(true);
                setBookDetail(record);
              }}
            >
              {record._id}
            </a>
          </>
        );
      },
      key: "1",
      sorter: true,
    },
    {
      title: "Tên sách",
      dataIndex: "mainText",
      key: "2",
      sorter: true,
    },
    {
      title: "Thể loại",
      dataIndex: "category",
      key: "3",
      sorter: true,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "4",
      sorter: true,
    },
    {
      title: "Giá tiền",
      dataIndex: "priceScreen",
      key: "5",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "6",
      sorter: true,
    },
    {
      title: "Action",
      width: 100,
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title="Xác nhận user"
              description="Bạn có chắc chắn muốn xóa user này?"
              okText="Xác nhận"
              cancelText="Hủy"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined
                style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
              />
            </Popconfirm>
            <EditOutlined
              onClick={() => {
                setisUpdateBook(true);
                setBookUpdate(record);
              }}
              style={{
                marginLeft: "20px",
                fontSize: "20px",
                cursor: "pointer",
                color: "#e9e95b",
              }}
            />
          </>
        );
      },
      key: "7",
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend"
          ? `sort=${sorter.field}`
          : `sort=-${sorter.field}`;
      setSortQuery(q);
    }
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <>
      <Table
        loading={loading}
        dataSource={books}
        columns={columns}
        pagination={{
          pageSize,
          current,
          showSizeChanger: true,
          total,
          showTotal: (total, range) => (
            <div>
              {range[0]} - {range[1]} trên {total} rows
            </div>
          ),
        }}
        onChange={onChange}
        bordered
        title={() => (
          <HeaderTableUser
            setSortQuery={setSortQuery}
            setQuery={setQuery}
            fetchBooks={fetchbooks}
            books={books}
          />
        )}
      />
      <BookViewDetail
        isBookDetail={isBookDetail}
        setIsBookDetail={setIsBookDetail}
        bookDetail={bookDetail}
      />
      <BookUpdate
        isUpdateBook={isUpdateBook}
        setisUpdateBook={setisUpdateBook}
        bookUpdateData={bookUpdate as any}
        fetchBooks={fetchbooks}
      />
    </>
  );
}
