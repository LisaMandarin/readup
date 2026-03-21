import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
  Space,
  Divider,
} from "antd";
import { MailOutlined, LockOutlined, BookOutlined } from "@ant-design/icons";
import { signInRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await signInRequest(values.email, values.password);
      login(data.access_token, data.username);
      message.success(`Welcome back, ${data.username}!`);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      message.error(
        typeof detail === "string"
          ? detail
          : "Sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #f3e5f5 100%)",
      }}
    >
      <Card
        style={{
          width: 440,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.10)",
          borderRadius: 12,
        }}
      >
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", textAlign: "center", marginBottom: 8 }}
        >
          <BookOutlined style={{ fontSize: 44, color: "#1677ff" }} />
          <Title level={3} style={{ margin: 0 }}>
            Sign in to ReadUp
          </Title>
          <Text type="secondary">
            Welcome back! Continue your learning journey
          </Text>
        </Space>

        <Divider />

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="you@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text>
            Don't have an account?{" "}
            <Link to="/signup">
              <strong>Sign Up</strong>
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}