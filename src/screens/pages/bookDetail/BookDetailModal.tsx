import { Col, Image, Modal, Row } from "antd";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef } from "react";
interface IProp {
  isModalOpen: boolean;
  setIsModalOpen: (s: boolean) => void;
  title: string | undefined;
  images: {
    original: string;
    thumbnail: string;
  }[];
  currentIndex: number;
  setCurrentIndex: (n: number) => void;
}
export default function BookDetailModal(props: IProp) {
  const {
    isModalOpen,
    setIsModalOpen,
    title,
    images,
    currentIndex,
    setCurrentIndex,
  } = props;
  const imageRef = useRef(null);
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closable={false}
      footer=<></>
      width={900}
    >
      <Row gutter={20}>
        <Col span={16}>
          <ImageGallery
            items={images}
            showFullscreenButton={false}
            showPlayButton={false}
            showThumbnails={false}
            ref={imageRef}
            startIndex={currentIndex}
            onSlide={() => setCurrentIndex(imageRef.current.getCurrentIndex())}
            slideDuration={0}
          />
        </Col>
        <Col span={8}>
          <p style={{ margin: "0" }}>{title}</p>
          <Row gutter={[20, 20]} style={{ paddingRight: "50px" }}>
            {images.map((item, i) => (
              <Col span={12}>
                <Image
                  src={item.thumbnail}
                  preview={false}
                  onClick={() => imageRef.current.slideToIndex(i)}
                  style={
                    currentIndex === i
                      ? { border: "2px solid red", cursor: "pointer" }
                      : { cursor: "pointer" }
                  }
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}
