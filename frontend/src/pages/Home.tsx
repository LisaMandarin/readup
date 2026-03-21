import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Layout, Menu, message, theme } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { healthCheckRequest } from "../api/auth";

const { Header, Content, Footer } = Layout;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleSignOut = () => {
    navigate("/signout");
  };

  const callHealthCheck = async () => {
    try {
      setCheckingHealth(true);
      setHealthStatus(null);
      const { data } = await healthCheckRequest();
      setHealthStatus(data.status ?? "unknown");
    } catch (error) {
      setHealthStatus("error");
      console.error("Health check failed", error);
    } finally {
      setCheckingHealth(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-white text-xl font-semibold mr-8">ReadUp</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={[{ key: "home", label: "Home" }]}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-white">
            Hello, <strong>{user?.username}</strong>
          </span>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleSignOut}
            size="small"
            danger
          >
            Sign Out
          </Button>
        </div>
      </Header>

      <Content className="p-6">
        <div
          className="max-w-3xl mx-auto rounded-lg p-8 shadow-sm"
          style={{ background: colorBgContainer }}
        >
          <h1 className="text-3xl font-bold mb-2">Welcome to ReadUp 📚</h1>
          <p className="text-gray-600 mb-2">
            You are signed in as <strong>{user?.email}</strong>.
          </p>
          <p className="text-gray-600 mb-6">
            Start reading, learning vocabulary, and improving your English
            comprehension!
          </p>

          <div className="flex items-center gap-4">
            <Button
              onClick={callHealthCheck}
              loading={checkingHealth}
              type="primary"
              size="large"
            >
              Call Backend Health Check
            </Button>
            {healthStatus && (
              <span className="text-sm text-gray-600">
                Backend status: <strong>{healthStatus}</strong>
              </span>
            )}
          </div>
        </div>
      </Content>

      <Footer className="text-center text-gray-500">
        ReadUp &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}