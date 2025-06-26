import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { useEffect } from "react";
interface IProps {
  setQuery: (a: string) => void;
  setCurrent: (n: number) => void;
  query: string;
}
export default function UserInput(props: IProps) {
  const { setQuery, setCurrent, query } = props;
  const [form] = Form.useForm();
  type FieldType = {
    name?: string;
    email?: string;
    phone?: string;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const { name, email, phone } = values;
    let query = "";
    if (name) {
      query += `&fullName=/${name}/i`;
    }
    if (email) {
      query += `&email=/${email}/i`;
    }
    if (phone) {
      query += `&phone=/${phone}/i`;
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
          <Form.Item<FieldType> label="Name" name="name">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<FieldType> label="Email" name="email">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item<FieldType> label="Số điện thoại" name="phone">
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
