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
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { signUpRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const { data } = await signUpRequest(
        values.username,
        values.email,
        values.password
      );
      login(data.access_token, data.username);
      message.success(`Welcome to ReadUp, ${data.username}!`);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      message.error(
        typeof detail === "string"
          ? detail
          : "Sign-up failed. Please try again."
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
            Create your ReadUp account
          </Title>
          <Text type="secondary">
            Start improving your English reading skills today
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
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please enter a username" },
              { min: 3, message: "At least 3 characters" },
              { max: 50, message: "At most 50 characters" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "Letters, numbers, and underscores only",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="e.g. lisa_reads"
              size="large"
            />
          </Form.Item>

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
              { required: true, message: "Please enter a password" },
              { min: 8, message: "At least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••••"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Re-enter password"
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Text>
            Already have an account?{" "}
            <Link to="/signin">
              <strong>Sign In</strong>
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}