"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import { AdminAuthBar } from "./AdminAuthPanel";

interface AdminUserRecord {
  uid: string;
  email: string;
  displayName: string;
  disabled: boolean;
  admin: boolean;
  creditBalance: number;
  subscriptionStatus: string;
  plan: string;
  creationTime: string;
  lastSignInTime: string;
}

const inputClass =
  "w-full min-h-[40px] rounded-lg border border-slate/20 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

const selectClass =
  "w-full min-h-[40px] rounded-lg border border-slate/20 bg-white px-3 text-sm text-deep-navy focus:border-professional-blue focus:outline-none focus:ring-2 focus:ring-professional-blue/20";

export function UserManagementClient() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Create Form State
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createDisplayName, setCreateDisplayName] = useState("");
  const [createCredits, setCreateCredits] = useState(0);
  const [createSubStatus, setCreateSubStatus] = useState("none");
  const [createPlan, setCreatePlan] = useState("");
  const [createIsAdmin, setCreateIsAdmin] = useState(false);

  // Edit Form State
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState(""); // Only used if changing password
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editCredits, setEditCredits] = useState(0);
  const [editSubStatus, setEditSubStatus] = useState("none");
  const [editPlan, setEditPlan] = useState("");
  const [editIsAdmin, setEditIsAdmin] = useState(false);
  const [editDisabled, setEditDisabled] = useState(false);

  const fetchUsers = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) return;

    setLoading(true);
    setError(null);
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to load members.");
      }
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionLoading(true);

    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setActionLoading(false);
      return;
    }

    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: "createUser",
          email: createEmail,
          password: createPassword,
          displayName: createDisplayName,
          creditBalance: createCredits,
          subscriptionStatus: createSubStatus,
          plan: createPlan,
          admin: createIsAdmin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to create member.");
      }

      // Reset form
      setCreateEmail("");
      setCreatePassword("");
      setCreateDisplayName("");
      setCreateCredits(0);
      setCreateSubStatus("none");
      setCreatePlan("");
      setCreateIsAdmin(false);

      setIsCreateOpen(false);
      await fetchUsers();
    } catch (err: any) {
      setActionError(err.message || "Failed to create member.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionError(null);
    setActionLoading(true);

    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      setActionLoading(false);
      return;
    }

    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: "updateUser",
          uid: editingUser.uid,
          email: editEmail !== editingUser.email ? editEmail : undefined,
          password: editPassword.trim() ? editPassword : undefined,
          displayName: editDisplayName,
          disabled: editDisabled,
          admin: editIsAdmin,
          creditBalance: editCredits,
          subscriptionStatus: editSubStatus,
          plan: editPlan,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update member.");
      }

      setEditPassword("");
      setEditingUser(null);
      await fetchUsers();
    } catch (err: any) {
      setActionError(err.message || "Failed to update member.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this member? This action is permanent!")) {
      return;
    }

    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) return;

    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          action: "deleteUser",
          uid,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to delete member.");
      }
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to delete member.");
    }
  };

  const startEdit = (user: AdminUserRecord) => {
    setEditingUser(user);
    setEditEmail(user.email);
    setEditPassword("");
    setEditDisplayName(user.displayName);
    setEditCredits(user.creditBalance);
    setEditSubStatus(user.subscriptionStatus);
    setEditPlan(user.plan);
    setEditIsAdmin(user.admin);
    setEditDisabled(user.disabled);
    setActionError(null);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      u.displayName.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q)
    );
  });

  if (authLoading) {
    return <div className="py-6 text-center text-sm text-slate">Loading session...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="py-4">
        <AdminAuthBar />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminAuthBar />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <input
            type="text"
            placeholder="Search by email, name or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-slate/25 bg-white pl-10 pr-4 text-sm text-deep-navy focus:border-professional-blue focus:outline-none"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/50">
            <SearchIcon />
          </div>
        </div>

        <button
          onClick={() => {
            setIsCreateOpen(true);
            setActionError(null);
          }}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          <PlusIcon /> Add New Member
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate/20 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate/10 bg-off-white text-xs font-semibold uppercase tracking-wider text-text-secondary">
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Subscription</th>
                <th className="px-6 py-4">Registered / Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate">
                    Loading member list...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => (
                  <tr key={item.uid} className="hover:bg-off-white/50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-deep-navy">
                        {item.displayName || "Unnamed"}
                      </div>
                      <div className="text-xs text-text-secondary">{item.email}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-slate/60">
                        UID: {item.uid}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.disabled ? (
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          Disabled
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.admin ? (
                        <span className="inline-flex rounded-full bg-professional-blue bg-opacity-10 px-2 py-0.5 text-xs font-medium text-professional-blue">
                          Evet
                        </span>
                      ) : (
                        <span className="text-xs text-slate/50">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-deep-navy">
                      {item.creditBalance}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-deep-navy capitalize">
                        {item.subscriptionStatus === "none" ? "None" : item.subscriptionStatus === "active" ? "Active" : item.subscriptionStatus === "canceled" ? "Canceled" : item.subscriptionStatus === "past_due" ? "Past Due" : item.subscriptionStatus}
                      </div>
                      {item.plan && (
                        <div className="text-xs text-text-secondary font-mono">
                          {item.plan === "pro" ? "Pro (Monthly)" : item.plan === "pro_annual" ? "Pro (Annual)" : item.plan === "team" ? "Team Plan" : item.plan}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      <div>Registered: {item.creationTime ? new Date(item.creationTime).toLocaleDateString() : "—"}</div>
                      <div>Login: {item.lastSignInTime ? new Date(item.lastSignInTime).toLocaleDateString() : "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="inline-flex h-8 items-center justify-center rounded border border-slate/25 bg-white px-3 text-xs font-semibold text-deep-navy transition-colors hover:bg-off-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => void handleDeleteUser(item.uid)}
                          className="inline-flex h-8 items-center justify-center rounded border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MEMBER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-deep-navy mb-4">Add New Member</h3>
            {actionError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {actionError}
              </div>
            )}
            <form onSubmit={(e) => void handleCreateUser(e)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">E-posta</span>
                  <input
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Password</span>
                  <input
                    type="password"
                    required
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Ad Soyad</span>
                  <input
                    type="text"
                    value={createDisplayName}
                    onChange={(e) => setCreateDisplayName(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Kredi Bakiyesi</span>
                  <input
                    type="number"
                    min="0"
                    value={createCredits}
                    onChange={(e) => setCreateCredits(Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Subscription Status</span>
                  <select
                    value={createSubStatus}
                    onChange={(e) => setCreateSubStatus(e.target.value)}
                    className={selectClass}
                  >
                    <option value="none">None</option>
                    <option value="active">Active</option>
                    <option value="canceled">Canceled</option>
                    <option value="past_due">Payment Overdue</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Plan</span>
                  <select
                    value={createPlan}
                    onChange={(e) => setCreatePlan(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">No Plan</option>
                    <option value="pro">Pro (Monthly)</option>
                    <option value="pro_annual">Pro (Annual)</option>
                    <option value="team">Team Plan</option>
                  </select>
                </label>
              </div>

              <label className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={createIsAdmin}
                  onChange={(e) => setCreateIsAdmin(e.target.checked)}
                  className="rounded border-slate/30 text-professional-blue focus:ring-professional-blue"
                />
                <span className="text-sm font-semibold text-deep-navy">Grant Admin Access</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy hover:bg-off-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  {actionLoading ? "Creating..." : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-deep-navy mb-4">Edit Member</h3>
            {actionError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {actionError}
              </div>
            )}
            <form onSubmit={(e) => void handleUpdateUser(e)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">E-posta</span>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">New Password (optional)</span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Ad Soyad</span>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Kredi Bakiyesi</span>
                  <input
                    type="number"
                    min="0"
                    value={editCredits}
                    onChange={(e) => setEditCredits(Number(e.target.value))}
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Subscription Status</span>
                  <select
                    value={editSubStatus}
                    onChange={(e) => setEditSubStatus(e.target.value)}
                    className={selectClass}
                  >
                    <option value="none">None</option>
                    <option value="active">Active</option>
                    <option value="canceled">Canceled</option>
                    <option value="past_due">Payment Overdue</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-xs font-semibold text-text-secondary uppercase">Plan</span>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">No Plan</option>
                    <option value="pro">Pro (Monthly)</option>
                    <option value="pro_annual">Pro (Annual)</option>
                    <option value="team">Team Plan</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-2 py-1">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editIsAdmin}
                    onChange={(e) => setEditIsAdmin(e.target.checked)}
                    className="rounded border-slate/30 text-professional-blue focus:ring-professional-blue"
                  />
                  <span className="text-sm font-semibold text-deep-navy">Grant Admin Access</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editDisabled}
                    onChange={(e) => setEditDisabled(e.target.checked)}
                    className="rounded border-slate/30 text-professional-blue focus:ring-professional-blue"
                  />
                  <span className="text-sm font-semibold text-deep-navy">Disable Account</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate/25 bg-white px-4 text-sm font-semibold text-deep-navy hover:bg-off-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-professional-blue px-5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
