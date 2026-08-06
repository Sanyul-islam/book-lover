"use client";

import { useEffect, useState } from "react";
import { Table, Chip, Skeleton } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getAllUsers from "@/data/getAllUsers";
import getTokenServer from "@/data/getTokenServer";

const ROLE_COLORS = {
  admin: "danger",
  librarian: "accent",
  user: "default",
};

const ROLES = ["user", "librarian", "admin"];

export default function ManageUsersPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        if (!ignore) setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load users.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const changeRole = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const token  = await getTokenServer();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        },
      );
      if (!res.ok) throw new Error();

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success(`Role updated to ${newRole}.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId) => {
    if (userId === session?.user?.id) {
      toast.error("You can't delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this user? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(userId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error();

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-56 rounded-lg" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {users.length === 0 ? (
        <p className="text-default-500">No users found.</p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Manage users">
              <Table.Header>
                <Table.Column className="text-center" isRowHeader>
                  Name
                </Table.Column>
                <Table.Column className="text-center">Email</Table.Column>
                <Table.Column className="text-center">Role</Table.Column>
                <Table.Column className="text-center">Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell className="text-center font-medium">
                      {user.name}
                    </Table.Cell>
                    <Table.Cell className="text-center text-default-500">
                      {user.email}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <Chip
                        variant="soft"
                        color={ROLE_COLORS[user.role] || "default"}
                        size="sm"
                      >
                        <Chip.Label>{user.role}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <select
                          value={user.role}
                          disabled={
                            updatingId === user._id ||
                            user._id === session?.user?.id
                          }
                          onChange={(e) => changeRole(user._id, e.target.value)}
                          className="text-xs rounded-md border border-default-200 px-2 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-40"
                        >
                          {ROLES.map((r) => (
                            <option
                              key={r}
                              value={r}
                              className="bg-white text-black dark:bg-neutral-900 dark:text-white"
                            >
                              {r}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => deleteUser(user._id)}
                          disabled={
                            deletingId === user._id ||
                            user._id === session?.user?.id
                          }
                          className="p-1.5 rounded-md text-default-500 hover:bg-danger/10 hover:text-danger transition disabled:opacity-40"
                          aria-label="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  );
}
