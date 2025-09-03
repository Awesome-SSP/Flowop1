import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./AuthPages/Login";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "../dashboard/Dashboard";
import MyDownloads from "./pages/documentsTransfers/MyDownloads";
import MyUploads from "./pages/documentsTransfers/MyUploads";
import ManageContact from "./pages/administration/ManageContact";
import ManageNotice from "./pages/administration/ManageNotice";

const theme = extendTheme({});

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* public route - no sidebar */}
          <Route path="/" element={<Login />} />

          {/* protected routes wrapped by MainLayout (contains Sidebar + Outlet) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* documents with nested routes */}
            <Route path="/documents">
              <Route index element={<Navigate to="uploads" replace />} />
              <Route path="uploads" element={<MyUploads />} />
              <Route path="downloads" element={<MyDownloads />} />
            </Route>

            {/* administration with nested routes */}
            <Route path="/admin" >
              <Route index element={<Navigate to="contacts" replace />} />
              <Route path="contacts" element={<ManageContact />} />
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
