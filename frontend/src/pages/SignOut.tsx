import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Typography,
  Button,
  Space,
  Divider,
  Spin,
  Result,
} from "antd";
import {
  LogoutOutlined,
  LoginOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const { Title, Text, Paragraph } = Typography;

export default function SignOut() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Track whether the user has confirmed sign-out
  const [signingOut, setSigningOut] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  // Store username before logout clears it
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  // If there's no token and we haven't just signed out, redirect to sign-in
  useEffect(() => {
    if (!token && !signedOut) {
      navigate("/signin", { replace: true });
    }
  }, [token, signedOut, navigate]);

  const handleConfirmSignOut = () => {
    setSigningOut(true);

    // Small delay so the user sees the loading state
    setTimeout(() => {
      logout();
      setSigningOut(false);
      setSignedOut(true);
    }, 800);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleBackToSignIn = () => {
    navigate("/signin");
  };

  // ── Already signed out ──────────────────────────────────
  if (signedOut) {
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
          <Result
            icon={
              <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 64 }} />
            }
            title="You've been signed out"
            subTitle={
              username
                ? `Goodbye, ${username}! We hope to see you again soon.`
                : "Thanks for using ReadUp. See you next time!"
            }
            extra={[
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={handleBackToSignIn}
                key="signin"
              >
                Sign In Again
              </Button>,
              <Link to="/signup" key="signup">
                <Button size="large">Create New Account</Button>
              </Link>,
            ]}
          />

          <Divider />

          <div style={{ textAlign: "center" }}>
            <Paragraph type="secondary" italic>
              "If you fail to plan, you plan to fail."
            </Paragraph>
          </div>
        </Card>
      </div>
    );
  }

  // ── Confirmation screen ─────────────────────────────────
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
        <Space
          direction="vertical"
          size="small"
          style={{ width: "100%", textAlign: "center", marginBottom: 8 }}
        >
          <BookOutlined style={{ fontSize: 44, color: "#1677ff" }} />
          <Title level={3} style={{ margin: 0 }}>
            Sign Out
          </Title>
          <Text type="secondary">
            Are you sure you want to sign out?
          </Text>
        </Space>

        <Divider />

        {/* User info */}
        <div
          style={{
            background: "#fafafa",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 24,
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            Signed in as
          </Text>
          <div style={{ marginTop: 4 }}>
            <Text strong style={{ fontSize: 16 }}>
              {user?.username}
            </Text>
          </div>
          <div>
            <Text type="secondary">{user?.email}</Text>
          </div>
        </div>

        {signingOut ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin size="large" />
            <Paragraph style={{ marginTop: 16 }} type="secondary">
              Signing you out...
            </Paragraph>
          </div>
        ) : (
          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%" }}
          >
            <Button
              type="primary"
              danger
              size="large"
              icon={<LogoutOutlined />}
              onClick={handleConfirmSignOut}
              block
            >
              Yes, Sign Me Out
            </Button>
            <Button size="large" onClick={handleCancel} block>
              Cancel — Go Back
            </Button>
          </Space>
        )}

        <Divider />

        <div style={{ textAlign: "center" }}>
          <Paragraph type="secondary" italic style={{ marginBottom: 0 }}>
            "As long as Oluwa is involved." #oluwatigboalao11
          </Paragraph>
        </div>
      </Card>
    </div>
  );
}