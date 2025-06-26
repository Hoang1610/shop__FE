import { changeQuatity, deleteCart } from "../../../redux/reducer/order";
import { DeleteOutlined } from "@ant-design/icons";
import { Col, Divider, Empty, InputNumber, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { useEffect, useState } from "react";
function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
export default function OrderDetail({
  setStepNumber,
}: {
  setStepNumber: (n: number) => void;
}) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.order.cart);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  useEffect(() => {
    if (cart) {
      let total = 0;
      cart.forEach((item) => {
        return (total += +item.detail.price * item.quantity);
      });
      setTotalPrice(total);
    }
  }, [cart]);
  const handleChange = (value: number, id: string) => {
    if (value && !isNaN(value)) {
      dispatch(changeQuatity({ id, quantity: value }));
    }
  };
  const handleDelete = (id: string) => {
    dispatch(deleteCart({ id }));
  };
  return (
    <>
      {cart.length === 0 ? (
        <div className="order-wrag">
          <div className="order-list">
            <div
              className="order-item"
              style={{
                justifyContent: "center",
                marginTop: 30,
                height: 400,
                alignItems: "flex-start",
                paddingTop: 80,
              }}
            >
              <Empty description="Không có sản phẩm nào trong giỏ hàng" />
            </div>
          </div>
        </div>
      ) : (
        <Row gutter={20} style={{ marginTop: 10 }}>
          <Col lg={18} md={24}>
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
                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(value) =>
                          handleChange(value as number, item._id)
                        }
                      />
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
          <Col lg={6} md={24}>
            <div className="order-bill">
              <div className="order-bill-wrag">
                <p className="order-bill-title">Tạm tính</p>
                <p className="order-bill-sub">{formatToVND(totalPrice)}</p>
              </div>
              <Divider />
              <div className="order-bill-wrag">
                <p className="order-bill-title">Tổng tiền</p>
                <p className="order-bill-total">{formatToVND(totalPrice)}</p>
              </div>
              <Divider />
              <button
                className="order-bill-btn"
                onClick={() => setStepNumber(1)}
              >
                Mua hàng ({cart.length})
              </button>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
