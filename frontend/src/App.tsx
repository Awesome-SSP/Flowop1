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
import ManageNotice from "./pages/administration/ManageNotice";
import ViewContact from "./pages/administration/ViewContact";

// Premium Design System Theme
const premiumTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#EEF2FF",
      100: "#E0E7FF",
      200: "#C7D2FE",
      300: "#A5B4FC",
      400: "#818CF8",
      500: "#6366F1", // Primary brand color
      600: "#4F46E5",
      700: "#4338CA",
      800: "#3730A3",
      900: "#312E81",
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    success: {
      50: "#ECFDF5",
      500: "#10B981",
      600: "#059669",
    },
    warning: {
      50: "#FFFBEB",
      500: "#F59E0B",
      600: "#D97706",
    },
    error: {
      50: "#FEF2F2",
      500: "#EF4444",
      600: "#DC2626",
    }
  },
  fonts: {
    heading: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  radii: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    premium: "0 32px 64px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1)",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "xl",
        _focus: {
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
        }
      },
      variants: {
        premium: {
          bg: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          color: "white",
          _hover: {
            bg: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)"
          },
          _active: {
            transform: "translateY(0px)"
          }
        }
      }
    },
    Card: {
      baseStyle: {
        borderRadius: "2xl",
        boxShadow: "lg",
        border: "1px solid",
        borderColor: "gray.200",
        bg: "white",
        _dark: {
          bg: "gray.800",
          borderColor: "gray.700"
        }
      }
    },
    Input: {
      variants: {
        premium: {
          field: {
            borderRadius: "xl",
            border: "2px solid",
            borderColor: "gray.200",
            bg: "white",
            _hover: {
              borderColor: "gray.300"
            },
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
              transform: "translateY(-1px)"
            },
            _dark: {
              bg: "gray.800",
              borderColor: "gray.600",
              _hover: {
                borderColor: "gray.500"
              }
            }
          }
        }
      }
    }
  },
  styles: {
    global: {
      "*": {
        boxSizing: "border-box",
      },
      body: {
        bg: "gray.50",
        color: "gray.900",
        lineHeight: "1.6",
        _dark: {
          bg: "gray.900",
          color: "gray.50"
        }
      }
    }
  }
});

const theme = premiumTheme;

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
