import { message, notification, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../../../services/api";
import HeaderTableUser from "./HeaderTable.User";
import UserViewDetail from "./UserViewDetail";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UserUpdate from "./userUpdate";
interface user {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
export default function UserTable({
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
  const [users, setUsers] = useState<user[]>([]);
  const [pageSize, setPageSize] = useState<number>(2);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortQuery, setSortQuery] = useState<string>("");
  const [isUserDetail, setIsUserDetail] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<user | null>();
  const [isUpdateUser, setisUpdateUser] = useState<boolean>(false);
  const [userUpdate, setUserUpdate] = useState<user | undefined>();
  const fetchUsers = async () => {
    setLoading(true);
    const res = await getUsers(current, pageSize, query, sortQuery);
    if (res && res.data && res.data.result) {
      setUsers(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [current, pageSize, query, sortQuery]);
  const handleDelete = async (data: user) => {
    const res: any = await deleteUser(data._id);
    if (res.data) {
      message.success("Xóa user thành cống");
      fetchUsers();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: res.message,
      });
    }
  };
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
                setIsUserDetail(true);
                setUserDetail(record);
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
      title: "Tên hiển thị",
      dataIndex: "fullName",
      key: "2",
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
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "4",
      sorter: true,
    },
    {
      title: "Action",
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
                setisUpdateUser(true);
                setUserUpdate(record);
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
      key: "4",
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
        dataSource={users}
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
            fetchUsers={fetchUsers}
            users={users}
          />
        )}
      />
      <UserViewDetail
        isUserDetail={isUserDetail}
        setIsUserDetail={setIsUserDetail}
        userDetail={userDetail}
      />
      <UserUpdate
        isUpdateUser={isUpdateUser}
        setisUpdateUser={setisUpdateUser}
        userUpdateData={userUpdate as any}
        fetchUsers={fetchUsers}
      />
    </>
  );
}
