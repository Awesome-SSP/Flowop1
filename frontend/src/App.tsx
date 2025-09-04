import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./AuthPages/Login";
import Auth from "./AuthPages/Auth";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./dashboard/Dashboard";
import Reports from "./pages/Reports";
import Data from "./pages/Data";
import MyDownloads from "./pages/documentsTransfers/MyDownloads";
import MyUploads from "./pages/documentsTransfers/MyUploads";
// replace ManageContact import with ViewControl
import ViewControl from "./pages/administration/ViewContact";
import ManageNotice from "./pages/administration/ManageNotice";
import ViewContact from "./pages/administration/ViewContact";

// Extended theme with color mode support for better theming
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

// Simple guard: require token; if token but no selectedRole -> go to /auth
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const selectedRole = typeof window !== "undefined" ? localStorage.getItem("selectedRole") : null;

  if (!token) return <Navigate to="/" replace />;
  if (!selectedRole) return <Navigate to="/auth" replace />;
  return children;
}

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* public route - login page */}
          <Route path="/" element={<Login />} />

          {/* role selection after successful login */}
          <Route path="/auth" element={<Auth />} />

          {/* protected routes wrapped by MainLayout (contains Sidebar + Outlet) */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/data" element={<Data />} />

            {/* documents with nested routes */}
            <Route path="/documents">
              <Route index element={<Navigate to="uploads" replace />} />
              <Route path="uploads" element={<MyUploads />} />
              <Route path="downloads" element={<MyDownloads />} />
            </Route>

            {/* administration with nested routes */}
            <Route path="/admin">
              <Route index element={<Navigate to="contacts" replace />} />
              <Route path="contacts" element={<ViewContact />} />
              <Route path="notices" element={<ManageNotice />} />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
