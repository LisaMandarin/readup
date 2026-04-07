import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import Home from "./pages/Home";
import SessionHistory from "./pages/SessionHistory";
import SessionDetail from "./pages/SessionDetail";

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signout" element={<SignOut />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sessions/:sessionId"
              element={
                <ProtectedRoute>
                  <SessionDetail />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;