import { useState, useEffect } from "react";
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
  Steps,
  Result,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  signUpRequest,
  verifyCodeRequest,
  resendCodeRequest,
} from "../api/auth";
import { useAuth } from "../context/AuthContext";

const { Title, Text, Paragraph } = Typography;

export default function SignUp() {
  // "form" = fill out signup form, "verify" = enter OTP code
  const [step, setStep] = useState<"form" | "verify">("form");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Step 1: Submit signup form ──────────────────────────

  const onSignupSubmit = async (values: {
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
      message.success(data.message);
      setEmail(values.email);
      setStep("verify");
      setCountdown(60); // 60 second cooldown before resend
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

  // ── Step 2: Submit verification code ────────────────────

  const onVerifySubmit = async (values: { code: string }) => {
    setLoading(true);
    try {
      const { data } = await verifyCodeRequest(email, values.code);
      login(data.access_token, data.username);
      message.success(`Welcome to ReadUp, ${data.username}!`);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      message.error(
        typeof detail === "string"
          ? detail
          : "Verification failed. Check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Resend code ─────────────────────────────────────────

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await resendCodeRequest(email);
      message.success(data.message);
      setCountdown(60);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      message.error(
        typeof detail === "string"
          ? detail
          : "Failed to resend code. Try again."
      );
    } finally {
      setResending(false);
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
          width: 480,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.10)",
          borderRadius: 12,
        }}
      >
        {/* Header */}
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", textAlign: "center", marginBottom: 8 }}
        >
          <BookOutlined style={{ fontSize: 44, color: "#1677ff" }} />
          <Title level={3} style={{ margin: 0 }}>
            {step === "form" ? "Create your ReadUp account" : "Verify your email"}
          </Title>
        </Space>

        {/* Progress steps */}
        <Steps
          current={step === "form" ? 0 : 1}
          size="small"
          style={{ margin: "16px 0" }}
          items={[
            { title: "Sign Up" },
            { title: "Verify Email" },
          ]}
        />

        <Divider style={{ margin: "12px 0" }} />

        {/* ── Step 1: Signup Form ─────────────────────────── */}
        {step === "form" && (
          <>
            <Text
              type="secondary"
              style={{ display: "block", textAlign: "center", marginBottom: 16 }}
            >
              We'll send a verification code to your email
            </Text>

            <Form
              layout="vertical"
              onFinish={onSignupSubmit}
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
                      return Promise.reject(
                        new Error("Passwords do not match")
                      );
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
                  Send Verification Code
                </Button>
              </Form.Item>
            </Form>
          </>
        )}

        {/* ── Step 2: OTP Verification ────────────────────── */}
        {step === "verify" && (
          <>
            <Result
              icon={
                <SafetyCertificateOutlined
                  style={{ color: "#1677ff", fontSize: 48 }}
                />
              }
              title="Check your email"
              subTitle={
                <span>
                  We sent a 6-digit code to <strong>{email}</strong>
                </span>
              }
              style={{ padding: "12px 0" }}
            />

            <Form
              layout="vertical"
              onFinish={onVerifySubmit}
              requiredMark={false}
            >
              <Form.Item
                name="code"
                label="Verification Code"
                rules={[
                  { required: true, message: "Please enter the code" },
                  { len: 6, message: "Code must be 6 digits" },
                  {
                    pattern: /^\d{6}$/,
                    message: "Code must be 6 digits",
                  },
                ]}
              >
                <Input
                  placeholder="000000"
                  size="large"
                  maxLength={6}
                  style={{
                    textAlign: "center",
                    fontSize: 24,
                    letterSpacing: 12,
                    fontWeight: "bold",
                  }}
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
                  Verify & Create Account
                </Button>
              </Form.Item>
            </Form>

            {/* Resend code */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <Paragraph type="secondary" style={{ marginBottom: 8 }}>
                Didn't receive the code?
              </Paragraph>
              <Button
                type="link"
                onClick={handleResend}
                loading={resending}
                disabled={countdown > 0}
              >
                {countdown > 0
                  ? `Resend code in ${countdown}s`
                  : "Resend verification code"}
              </Button>
            </div>

            {/* Go back */}
            <div style={{ textAlign: "center" }}>
              <Button
                type="text"
                onClick={() => setStep("form")}
                size="small"
              >
                ← Back to signup form
              </Button>
            </div>
          </>
        )}

        <Divider style={{ margin: "12px 0" }} />

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