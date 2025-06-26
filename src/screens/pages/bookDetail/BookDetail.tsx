// import "react-image-gallery/styles/scss/image-gallery.scss";
// import "react-image-gallery/styles/css/image-gallery.css";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { Col, Row } from "antd";
import BookDetailModal from "./BookDetailModal";
import { useEffect, useRef, useState } from "react";
import BookLoader from "./BookLoader";
import { IBook } from "../admin/books/bookType";
import { getBookById } from "../../../services/apiBooks";
import { useAppDispatch } from "../../../redux/hook";
import { addCart } from "../../../redux/reducer/order";
import { useNavigate } from "react-router";
interface IImages {
  original: string;
  thumbnail: string;
  originalClass: string;
  thumbnailClass: string;
}
function formatToVND(number: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
}
export default function BookDetail() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const imageGalleryRef = useRef(null);
  const [dataBook, setDataBook] = useState<IBook | undefined>();
  const [images, setImages] = useState<IImages[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchbooks = async () => {
      const url = new URL(location.href);
      const params = new URLSearchParams(url.search);
      const id = params.get("id");
      if (id) {
        const res = await getBookById(id);
        setTimeout(() => {
          setDataBook(res.data);
        }, 1000);
      }
    };
    fetchbooks();
  }, []);
  useEffect(() => {
    if (dataBook && dataBook._id) {
      const imageData: IImages[] = [];
      imageData.push({
        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataBook.thumbnail
        }`,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          dataBook.thumbnail
        }`,
        originalClass: "original-class",
        thumbnailClass: "thumbnail-class",
      });
      dataBook.slider.forEach((item) => {
        imageData.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-class",
          thumbnailClass: "thumbnail-class",
        });
      });
      setImages(imageData);
    }
  }, [dataBook]);
  const handleClick = () => {
    setIsModalOpen(true);
    if (imageGalleryRef && imageGalleryRef.current) {
      setCurrentIndex(imageGalleryRef.current.getCurrentIndex());
    }
  };
  const handleQuantity = (type: string) => {
    if (type === "add" && dataBook?.quantity) {
      if (quantity < dataBook.quantity) {
        setQuantity(quantity + 1);
      }
    }
    if (type === "minus") {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (dataBook?.quantity && +e.target.value <= dataBook.quantity) {
      setQuantity(+e.target.value);
    }
  };
  return (
    <>
      <div style={{ padding: "30px 50px" }}>
        {dataBook && dataBook._id ? (
          <Row
            style={{
              boxShadow: "  rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              padding: "20px 10px",
              borderRadius: "10px",
            }}
            gutter={20}
          >
            <Col span={12}>
              <ImageGallery
                items={images}
                showFullscreenButton={false}
                showPlayButton={false}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
                onClick={handleClick}
                ref={imageGalleryRef}
                slideOnThumbnailOver={true}
              />
            </Col>
            <Col span={12}>
              <div className="book_detail-left">
                <p className="book_detail-author">
                  Tác giả: <span>{dataBook.author}</span>
                </p>
                <h3 className="book_detail-title">{dataBook.mainText}</h3>
                <div className="book_detail-info">
                  <div className="book_detail-rate">⭐⭐⭐⭐⭐</div>
                  <div className="book_detail-sold">Đã bán {dataBook.sold}</div>
                </div>
                <div className="book_detail-cost">
                  {formatToVND(dataBook.price as number)}
                </div>
                <div className="book_detail-row">
                  <span className="book_detail-row-title">Vận chuyển</span>
                  <span className="book_detail-row-desc">
                    Miễn phí vận chuyển
                  </span>
                </div>
                <div className="book_detail-row">
                  <span className="book_detail-row-title">Số lượng</span>
                  <div className="book_detail-input">
                    <button
                      className="book_detail-left"
                      onClick={() => handleQuantity("minus")}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={handleChange}
                    />
                    <button
                      className="book_detail-right"
                      onClick={() => handleQuantity("add")}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="book_detail-button-group">
                  <button
                    className="book_detail-addCart"
                    onClick={() => {
                      dispatch(addCart({ detail: dataBook, quantity }));
                    }}
                  >
                    <img
                      alt="icon-add-to-cart"
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/2fb1996a867e2eacd4a8.svg"
                    />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    className="book_detail-buy"
                    onClick={() => {
                      dispatch(addCart({ detail: dataBook, quantity }));
                      navigate("/order");
                    }}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <BookLoader />
        )}
      </div>
      <BookDetailModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={dataBook?.mainText}
        images={images}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </>
  );
}
