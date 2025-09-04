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
    { id: "5", name: "Edward Davis", role: "User", code: "E500", email: "edward@example.com", contactStatus: "active", pipewayStatus: "connected" },
    { id: "6", name: "Fiona Green", role: "Manager", code: "F600", email: "fiona@example.com", contactStatus: "inactive", pipewayStatus: "disconnected" },
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Simulate API call
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
        setUsers(prev => {
            const exists = prev.findIndex(p => p.id === saved.id);
            if (exists >= 0) {
                const copy = prev.slice();
                copy[exists] = saved;
                return copy;
            }
            return [{ ...saved, id: Date.now().toString() }, ...prev];
        });
        setModalOpen(false);
    }

    function handleClose() {
        setModalOpen(false);
        setActiveUser(null);
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
                    onClick={() => {/* search is automatic */}}
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
                                        <button 
                                            onClick={() => openView(u)} 
                                            style={buttonStyle}
                                        >
                                            View
                                        </button>
                                        <button 
                                            onClick={() => openEdit(u)}
                                            style={{...buttonStyle, backgroundColor: "#ffc107", marginLeft: "4px"}}
                                        >
                                            Edit
                                        </button>
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

            {modalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #ddd" }}>
                            <h3 style={{ margin: 0, fontSize: "18px" }}>{modalMode === "view" ? "View Contact" : modalMode === "edit" ? "Edit Contact" : "Create Contact"}</h3>
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
                        <div style={{ padding: "16px", height: "calc(100% - 60px)", overflow: "auto" }}>
                            <ManageContactComponent
                                mode={modalMode}
                                visible={modalOpen}
                                data={activeUser ?? undefined}
                                onClose={handleClose}
                                onSave={handleSave}
                            />
                        </div>
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

const modalOverlayStyle: React.CSSProperties = {
    position: "absolute", 
    inset: 0, 
    background: "rgba(0,0,0,0.5)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    zIndex: 10000
};

const modalStyle: React.CSSProperties = {
    background: "#fff", 
    borderRadius: 4, 
    position: "absolute",
    top: "2.5%",
    left: "2.5%",
    width: "95%",
    height: "95%",
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    maxWidth: "none"
};