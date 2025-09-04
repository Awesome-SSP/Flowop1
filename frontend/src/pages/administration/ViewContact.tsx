import React, { useEffect, useMemo, useState } from "react";
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
];

// Define the prop shape you expect ManageContact to accept.
// Adjust this to match the actual ManageContact props if different.
type ManageContactProps = {
    mode: "view" | "edit" | "create";
    visible: boolean;
    data?: User;
    onClose: () => void;
    onSave: (u: User) => void;
};

// Cast imported component to the props type to avoid TS errors at usage site.
const ManageContactComponent = ManageContact as React.ComponentType<ManageContactProps>;

export default function ViewContact(): React.ReactElement {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<keyof User | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
    const [activeUser, setActiveUser] = useState<User | null>(null);

    useEffect(() => {
        // Replace this with a real API call if needed.
        setUsers(sampleUsers);
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

    function openCreate() {
        setActiveUser(null);
        setModalMode("create");
        setModalOpen(true);
    }

    function openEdit(user: User) {
        setActiveUser(user);
        setModalMode("edit");
        setModalOpen(true);
    }

    function openView(user: User) {
        setActiveUser(user);
        setModalMode("view");
        setModalOpen(true);
    }

    function handleSave(saved: User) {
        // basic upsert logic; replace with API calls in real app
        setUsers(prev => {
            const exists = prev.findIndex(p => p.id === saved.id);
            if (exists >= 0) {
                const copy = prev.slice();
                copy[exists] = saved;
                return copy;
            }
            return [saved, ...prev];
        });
        setModalOpen(false);
    }

    function handleClose() {
        setModalOpen(false);
        setActiveUser(null);
    }

    return (
        <div style={{ padding: 16, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, color: "#333" }}>Contacts Management</h2>
                <button 
                    onClick={openCreate} 
                    style={{ 
                        padding: "10px 20px", 
                        backgroundColor: "#007bff", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold"
                    }}
                >
                    Contact Registration
                </button>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                <input
                    placeholder="Search by name, email, code or role"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ 
                        padding: "10px 15px", 
                        minWidth: 350, 
                        border: "1px solid #ccc", 
                        borderRadius: "6px",
                        fontSize: "14px"
                    }}
                />
                <button 
                    onClick={() => {/* search is automatically triggered by query state */}}
                    style={{ 
                        padding: "10px 20px", 
                        backgroundColor: "#28a745", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold"
                    }}
                >
                    Search
                </button>
            </div>

            <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#e9ecef" }}>
                            <th style={thStyle}>#</th>
                            <th style={thStyle} onClick={() => handleSort("name")}>
                                Name {sortKey === "name" ? (sortAsc ? "▲" : "▼") : ""}
                            </th>
                            <th style={thStyle} onClick={() => handleSort("role")}>
                                Type (Role) {sortKey === "role" ? (sortAsc ? "▲" : "▼") : ""}
                            </th>
                            <th style={thStyle} onClick={() => handleSort("code")}>
                                Code {sortKey === "code" ? (sortAsc ? "▲" : "▼") : ""}
                            </th>
                            <th style={thStyle} onClick={() => handleSort("email")}>
                                Email ID {sortKey === "email" ? (sortAsc ? "▲" : "▼") : ""}
                            </th>
                            <th style={thStyle} onClick={() => handleSort("contactStatus")}>
                                Contact Status {sortKey === "contactStatus" ? (sortAsc ? "▲" : "▼") : ""}
                            </th>
                            <th style={thStyle} onClick={() => handleSort("pipewayStatus")}>
                                Pipeway Status {sortKey === "pipewayStatus" ? (sortAsc ? "▲" : "▼") : ""}
                            </th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((u, idx) => (
                            <tr key={u.id} style={{ borderTop: "1px solid #eee", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}>
                                <td style={tdStyle}>{idx + 1}</td>
                                <td style={tdStyle}>{u.name}</td>
                                <td style={tdStyle}>{u.role}</td>
                                <td style={tdStyle}>{u.code}</td>
                                <td style={tdStyle}>{u.email}</td>
                                <td style={tdStyle}><StatusBadge value={u.contactStatus} /></td>
                                <td style={tdStyle}><StatusBadge value={u.pipewayStatus} /></td>
                                <td style={tdStyle}>
                                    <button 
                                        onClick={() => openView(u)} 
                                        style={buttonStyle}
                                    >
                                        View
                                    </button>
                                    <button 
                                        onClick={() => openEdit(u)}
                                        style={{...buttonStyle, backgroundColor: "#ffc107", marginLeft: "8px"}}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#666", fontStyle: "italic" }}>
                                    No contacts found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #eee" }}>
                            <h3 style={{ margin: 0 }}>{modalMode === "view" ? "View Contact" : modalMode === "edit" ? "Edit Contact" : "Create Contact"}</h3>
                            <button 
                                onClick={handleClose} 
                                style={{ 
                                    background: "none", 
                                    border: "none", 
                                    fontSize: "20px", 
                                    cursor: "pointer", 
                                    color: "#666" 
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <ManageContactComponent
                            mode={modalMode}
                            visible={modalOpen}
                            data={activeUser ?? undefined}
                            onClose={handleClose}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            )}
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
            padding: "6px 12px", 
            borderRadius: 8, 
            fontSize: 13,
            fontWeight: "500",
            display: "inline-block"
        }}>
            {value}
        </span>
    );
}

const thStyle: React.CSSProperties = { 
    textAlign: "left", 
    padding: "15px", 
    cursor: "pointer", 
    userSelect: "none",
    fontWeight: "600",
    borderBottom: "2px solid #dee2e6",
    fontSize: "14px"
};

const tdStyle: React.CSSProperties = { 
    padding: "15px", 
    verticalAlign: "middle",
    borderBottom: "1px solid #eee",
    fontSize: "14px"
};

const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.2s"
};

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed", 
    inset: 0, 
    background: "rgba(0,0,0,0.6)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 10000
};

const modalStyle: React.CSSProperties = {
    background: "#fff", 
    borderRadius: 10, 
    boxShadow: "0 15px 35px rgba(0,0,0,0.3)", 
    width: "95%", 
    maxWidth: 1000, 
    maxHeight: "95vh", 
    overflow: "auto",
    position: "relative"
};