import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import { getHistory } from "../../../services/api";
import ReactJson from "react-json-view";

interface DataType {
  key: string;
  updatedAt: string;
  totalPrice: string;
  detail: [];
  stt: number;
}
function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
const columns: TableProps<DataType>["columns"] = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Thời gian",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
  {
    title: "Tổng số tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (value) => <>{formatToVND(value)}</>,
  },
  {
    title: "Trạng thái",
    key: "tags",
    render: () => (
      <>
        <Tag color={"green"}>Thành công</Tag>
      </>
    ),
  },
  {
    title: "Chi tiết",
    dataIndex: "detail",
    key: "detail",
    render: (value) => (
      <ReactJson
        name="Chi tiết đơn mua"
        src={value}
        collapsed
        displayDataTypes={false}
        enableClipboard={false}
      />
    ),
  },
];

export default function History() {
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getHistory();
      const newData: DataType[] = res.data.map((item, index) => ({
        updatedAt: item.updatedAt,
        totalPrice: item.totalPrice,
        detail: item.detail,
        stt: index + 1,
      }));
      setData(newData);
    };
    fetchData();
  }, []);
  return (
    <div className="history">
      <h2>Lịch sử đặt hàng</h2>
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
}
