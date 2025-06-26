import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { useEffect } from "react";
interface IProps {
  setQuery: (a: string) => void;
  setCurrent: (n: number) => void;
  query: string;
}
export default function BookInput(props: IProps) {
  const { setQuery, setCurrent, query } = props;
  const [form] = Form.useForm();
  type FieldType = {
    mainText?: string;
    author?: string;
    category?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { mainText, author, category } = values;
    let query = "";
    if (mainText) {
      query += `&mainText=/${mainText}/i`;
    }
    if (author) {
      query += `&author=/${author}/i`;
    }
    if (category) {
      query += `&category=/${category}/i`;
    }
    setQuery(query);
    if (query) {
      setCurrent(1);
    }
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (query === "") {
      form.resetFields();
    }
  }, [query]);
  return (
    <Form
      name="basic"
      //   labelCol={{ span: 24 }}
      //   wrapperCol={{ span: 8 }}
      style={{ width: "100%" }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      labelWrap={true}
      layout="vertical"
      form={form}
    >
      <Row gutter={24} style={{ width: "100%" }}>
        <Col span={8}>
          <Form.Item<FieldType> label="Tên sách" name="mainText">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<FieldType> label="Tác giả" name="author">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<FieldType> label="Thể loại" name="category">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={4} offset={20}>
          <Row>
            <Col>
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
              </Form.Item>
            </Col>
            <Col>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  setQuery("");
                  form.resetFields();
                  setCurrent(1);
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
