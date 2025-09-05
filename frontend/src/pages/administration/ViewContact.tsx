import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import ManageContact from "./ManageContact";

type User = {
  id: string;
  name: string;
  role: string;
  code: string;
  email: string;
  contactStatus: "active" | "inactive" | string;
  pipewayStatus: "connected" | "disconnected" | string;
};

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", role: "Admin", code: "A100", email: "alice@example.com", contactStatus: "active", pipewayStatus: "connected" },
  { id: "2", name: "Bob Smith", role: "User", code: "B200", email: "bob@example.com", contactStatus: "inactive", pipewayStatus: "disconnected" },
  { id: "3", name: "Charlie Brown", role: "Manager", code: "C300", email: "charlie@example.com", contactStatus: "active", pipewayStatus: "connected" },
  { id: "4", name: "Diana Prince", role: "User", code: "D400", email: "diana@example.com", contactStatus: "inactive", pipewayStatus: "connected" },
  { id: "5", name: "Edward Davis", role: "User", code: "E500", email: "edward@example.com", contactStatus: "active", pipewayStatus: "connected" },
  { id: "6", name: "Fiona Green", role: "Manager", code: "F600", email: "fiona@example.com", contactStatus: "inactive", pipewayStatus: "disconnected" },
];

export default function ViewContact(): React.ReactElement {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof User | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers(sampleUsers);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = users.filter(u =>
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.code.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
    if (sortKey) {
      list = list.slice().sort((a, b) => {
        const av = String(a[sortKey] ?? "").toLowerCase();
        const bv = String(b[sortKey] ?? "").toLowerCase();
        if (av === bv) return 0;
        return (av > bv ? 1 : -1) * (sortAsc ? 1 : -1);
      });
    }
    return list;
  }, [users, query, sortKey, sortAsc]);

  function handleSort(key: keyof User) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  // navigate to ManageContact route with query params: mode and userId
  function openCreate() {
    navigate("/admin/manage-contact?mode=create");
  }

  function openView(user: User) {
    navigate(`/admin/manage-contact?mode=view&userId=${user.id}`);
  }

  function openEdit(user: User) {
    navigate(`/admin/manage-contact?mode=edit&userId=${user.id}`);
  }

  return (
    <div style={{ padding: 16, backgroundColor: "#f5f5f5", minHeight: "100vh", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: "#333", fontSize: "20px" }}>Contacts Management</h2>
        <button
          onClick={openCreate}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Add Contact
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <input
          placeholder="Search contacts"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            padding: "8px 12px",
            minWidth: 300,
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            outline: "none"
          }}
        />
        <button
          onClick={() => {}}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Search
        </button>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: "4px", backgroundColor: "white" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px", color: "#666" }}>
            <p>Loading...</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={thStyle}>#</th>
                <th style={thStyle} onClick={() => handleSort("name")}>
                  Name {sortKey === "name" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("role")}>
                  Role {sortKey === "role" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("code")}>
                  Code {sortKey === "code" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("email")}>
                  Email {sortKey === "email" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("contactStatus")}>
                  Status {sortKey === "contactStatus" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={thStyle} onClick={() => handleSort("pipewayStatus")}>
                  Pipeway {sortKey === "pipewayStatus" ? (sortAsc ? "↑" : "↓") : ""}
                </th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{idx + 1}</td>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.role}</td>
                  <td style={tdStyle}>{u.code}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}><StatusBadge value={u.contactStatus} /></td>
                  <td style={tdStyle}><StatusBadge value={u.pipewayStatus} /></td>
                  <td style={tdStyle}>
                    <button onClick={() => openView(u)} style={buttonStyle}>View</button>
                    <button onClick={() => openEdit(u)} style={{ ...buttonStyle, backgroundColor: "#ffc107", marginLeft: 4 }}>Edit</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#666" }}>
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const lower = value?.toLowerCase?.() ?? "";
  const isActive = lower.includes("active") || lower.includes("connected");
  const bg = isActive ? "#d4f8d4" : "#ffdede";
  const color = isActive ? "#0a7a0a" : "#7a0a0a";
  return (
    <span style={{
      background: bg,
      color,
      padding: "4px 8px",
      borderRadius: 4,
      fontSize: 12
    }}>
      {value}
    </span>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px",
  cursor: "pointer",
  userSelect: "none",
  fontWeight: "bold",
  borderBottom: "1px solid #ddd",
  fontSize: "14px"
};

const tdStyle: React.CSSProperties = {
  padding: "8px",
  verticalAlign: "middle",
  fontSize: "14px"
};

const buttonStyle: React.CSSProperties = {
  padding: "4px 8px",
  backgroundColor: "#17a2b8",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px"
};