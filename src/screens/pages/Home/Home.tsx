import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Tabs,
  Spin,
  TabsProps,
} from "antd";
import { useEffect, useState } from "react";
import { FormProps, useNavigate, useOutletContext } from "react-router";
import { getBookCategory, getBooks } from "../../../services/apiBooks";
import { IBook } from "../admin/books/bookType";
const onFinishFailed: FormProps["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
function toSlug(str) {
  return str
    .toLowerCase() // chuyển thành chữ thường
    .normalize("NFD") // tách dấu khỏi chữ cái
    .replace(/[\u0300-\u036f]/g, "") // xóa các dấu
    .replace(/đ/g, "d") // thay đ -> d
    .replace(/[^a-z0-9\s-]/g, "") // xóa ký tự đặc biệt
    .replace(/\s+/g, "-") // thay khoảng trắng bằng -
    .replace(/-+/g, "-") // loại bỏ dấu - liên tiếp
    .replace(/^-+|-+$/g, ""); // xóa - ở đầu và cuối
}
export default function Home() {
  const [searchData, setSearchData] = useOutletContext();
  const [books, setBooks] = useState<IBook[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [query, setQuery] = useState<string>("");
  const [current, setCurrent] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
  const [total, setTotal] = useState<number>(1);
  const [categoryList, setCategoryList] = useState<[]>([]);
  const navigate = useNavigate();
  const onFinish: FormProps["onFinish"] = async (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let q = `&price>=${values.range.from}&price<=${values.range.to}`;
      if (values.category?.length > 0) {
        const cate = values.category.join(",");
        q += `&category=${cate}`;
      }
      setQuery(q);
    }
  };
  const items: TabsProps["items"] = [
    {
      key: "sort=-sold",
      label: "Phổ biến",
      children: <></>,
    },
    {
      key: "sort=-updatedAt",
      label: "Hàng mới",
      children: <></>,
    },
    {
      key: "sort=price",
      label: "Giá thấp đến cao",
      children: <></>,
    },
    {
      key: "sort=-price",
      label: "Giá cao đến thấp",
      children: <></>,
    },
  ];
  const handleClick = (item: IBook) => {
    console.log(item);
    const slug = toSlug(item.mainText);
    navigate(`/book/${slug}?id=${item._id}`);
  };
  const [form] = Form.useForm();
  const fetchbooks = async () => {
    setLoading(true);

    const res = await getBooks(
      current,
      pageSize,
      query,
      sortQuery,
      `mainText=/${searchData}/i`
    );
    if (res && res.data && res.data.result) {
      setBooks(res.data.result);
      setTotal(res.data.meta.total);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchbooks();
  }, [current, pageSize, query, sortQuery, searchData]);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getBookCategory();
      setCategoryList(res.data);
    };
    fetchCategory();
  }, []);
  const onChange = (key: string) => {
    setSortQuery(key);
  };
  const handleChange = (pg: number, pgz: number) => {
    console.log(pg, pgz);
    if (pg !== current) {
      setCurrent(pg);
    }
    if (pgz !== pageSize) {
      setPageSize(pgz);
      setCurrent(1);
    }
  };
  const onChangeValue = (changedValues: any, values: Values) => {
    if (changedValues.category) {
      if (changedValues.category.length > 0) {
        let arrayQuery = values.category;
        console.log(arrayQuery);
        arrayQuery = arrayQuery.join(",");
        setQuery(`&category=${arrayQuery}`);
      } else {
        setQuery("");
      }
    }
  };
  return (
    <Row style={{ padding: "30px 20px" }} gutter={20}>
      <Col md={4} sm={0} xs={0}>
        <div
          style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            padding: "15px",
            borderRadius: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ cursor: "pointer", fontSize: "16px" }}>
              <FilterOutlined
                style={{
                  fontSize: "20px",
                  color: "rgb(0, 106, 255)",
                  paddingRight: "10px",
                }}
              />
              Bộ lọc tìm kiếm
            </span>
            <ReloadOutlined
              onClick={() => {
                form.resetFields();
                setQuery("");
              }}
              style={{
                fontSize: "16px",
                paddingRight: "10px",
                cursor: "pointer",
              }}
            />
          </div>
          <Form
            name="basic"
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600, marginTop: "10px" }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            onValuesChange={onChangeValue}
          >
            <Form.Item name="category" label="Danh mục sản phẩm">
              <Checkbox.Group>
                <Row>
                  {categoryList?.length > 0 &&
                    categoryList.map((item) => (
                      <Col span={24} style={{ margin: "10px 0" }}>
                        <Checkbox value={item}>{item}</Checkbox>
                      </Col>
                    ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Form.Item
                  name={["range", "from"]}
                  rules={[{ required: true, message: "Bắt buộc nhập!" }]}
                >
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="đ Từ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item
                  name={["range", "to"]}
                  rules={[{ required: true, message: "Bắt buộc nhập!" }]}
                >
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ Đến"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label={null}>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => form.submit()}
              >
                Áp dụng
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <p>Đánh giá</p>
          <Rate defaultValue={5} />
          <Flex gap="middle">
            <Rate defaultValue={4} />
            <span style={{ fontSize: "14px" }}>Trở lên</span>
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={3} />
            <span style={{ fontSize: "14px" }}>Trở lên</span>
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={2} />
            <span style={{ fontSize: "14px" }}>Trở lên</span>
          </Flex>
          <Flex gap="middle">
            <Rate defaultValue={1} />
            <span style={{ fontSize: "14px" }}>Trở lên</span>
          </Flex>
        </div>
      </Col>
      <Col md={20} xs={24}>
        <div
          style={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <Spin spinning={loading} tip="Loading">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            <Row style={{ marginRight: "-20px" }}>
              {books.length > 0 &&
                books.map((item) => (
                  <div className="book_wrap" onClick={() => handleClick(item)}>
                    <div className="book_top">
                      <div className="book_img">
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/images/book/${item.thumbnail}`}
                          alt=""
                        />
                      </div>
                      <h3 className="book_title">{item.mainText}</h3>
                    </div>
                    <div className="book_content">
                      <span className="book_price">
                        {formatToVND(item.price as number)}
                      </span>
                      <div className="book_rate">
                        ⭐⭐⭐⭐⭐
                        <span className="book_sold">Đã bán {item.sold}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </Row>
          </Spin>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              pageSize={pageSize}
              current={current}
              total={total}
              onChange={handleChange}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
