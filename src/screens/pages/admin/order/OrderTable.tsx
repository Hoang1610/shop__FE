import { Table } from "antd";
import { useEffect, useState } from "react";
import { getOrders } from "../../../../services/api";

export default function OrderTable() {
  const [order, setOrder] = useState([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortQuery, setSortQuery] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [current, setCurrent] = useState<number>(1);
  const fetchUsers = async () => {
    setLoading(true);
    const res = await getOrders(current, pageSize, query, sortQuery);
    if (res && res.data && res.data.result) {
      setOrder(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
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
  useEffect(() => {
    fetchUsers();
  }, [current, pageSize, query, sortQuery]);
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
                // setIsUserDetail(true);
                // setUserDetail(record);
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
      title: "Price",
      dataIndex: "totalPrice",
      key: "2",
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "3",
      sorter: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "3",
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "4",
      sorter: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "5",
      sorter: true,
    },
  ];
  return (
    <Table
      loading={loading}
      dataSource={order}
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
        <h2
          style={{
            margin: 0,
            fontWeight: 500,
            fontSize: "16px",
            paddingBottom: "10px",
          }}
        >
          Table list order
        </h2>
      )}
    />
  );
}
