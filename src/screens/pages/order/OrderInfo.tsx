import { clearCart, deleteCart } from "../../../redux/reducer/order";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Input, message, Radio, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { createOrder } from "../../../services/api";
function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
export default function OrderInfo({
  setStepNumber,
}: {
  setStepNumber: (n: number) => void;
}) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.order.cart);
  const user = useAppSelector((state) => state.account.user);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  useEffect(() => {
    if (cart) {
      let total = 0;
      cart.forEach((item) => {
        return (total += +item.detail.price * item.quantity);
      });
      setTotalPrice(total);
    }
  }, [cart]);
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user]);
  const handleDelete = (id: string) => {
    dispatch(deleteCart({ id }));
  };

  const onFinish = async (values: {
    address: string;
    fullName: string;
    phone: string;
  }) => {
    setIsLoading(true);
    const { address, fullName, phone } = values;
    const detail = cart.map((item) => ({
      bookName: item.detail.mainText,
      quantity: item.quantity,
      _id: item._id,
    }));
    const res = await createOrder({
      address,
      phone,
      name: fullName,
      totalPrice,
      detail,
    });
    setIsLoading(false);
    if (res && res.data) {
      message.success("Đặt hàng thành công");
      dispatch(clearCart());
      setStepNumber(2);
    } else {
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <Row gutter={20} style={{ marginTop: 10 }}>
      <Col lg={16} md={24}>
        <div className="order-wrag">
          <div className="order-list">
            {cart &&
              cart.map((item) => (
                <div className="order-item" key={item._id}>
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                      item.detail.thumbnail
                    }`}
                    alt=""
                    className="order-img"
                  />
                  <h3 className="order-title">{item.detail.mainText}</h3>
                  <span className="order-price">
                    {formatToVND(item.detail.price as number)}{" "}
                  </span>
                  <p>Số lượng {item.quantity}</p>
                  <p className="order-total-price">
                    Tổng:<> </>
                    <span>
                      {" "}
                      {formatToVND(
                        (item.detail.price as number) * item.quantity
                      )}{" "}
                    </span>
                  </p>
                  <DeleteOutlined
                    style={{
                      marginLeft: "auto",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              ))}
          </div>
        </div>
      </Col>
      <Col lg={8} md={24}>
        <div className="order-info">
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            size="small"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              label="Tên người nhận"
              name="fullName"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Hình thức thanh toán">
              <Radio value={"pear"} checked>
                Thanh toán khi nhận hàng
              </Radio>
            </Form.Item>
            <Divider />
            <div className="order-bill-wrag">
              <p className="order-bill-title">Tổng tiền</p>
              <p className="order-bill-total-small">
                {formatToVND(totalPrice)}
              </p>
            </div>
            <Divider />
            <button className="order-bill-btn">
              {isLoading ? <LoadingOutlined /> : <></>} Đặt hàng ({cart.length})
            </button>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
