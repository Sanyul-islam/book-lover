"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Table, Chip, Skeleton, Button } from "@heroui/react";
import { Pencil, Trash2, Eye, EyeOff, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getLibrarianBooks from "@/data/getLibrarianBooks";

const STATUS_COLORS = {
  "Pending Approval": "warning",
  Published: "success",
  Unpublished: "default",
};

export default function ManageInventoryPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    async function fetchBooks() {
      try {
        const data = await getLibrarianBooks(session.user.id);
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your books.");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [sessionLoading, session?.user?.id]);

  const togglePublish = async (book) => {
    if (book.status === "Pending Approval") {
      toast.info(
        "This book is still awaiting approval and can't be published yet.",
      );
      return;
    }

    const newStatus = book.status === "Published" ? "Unpublished" : "Published";

    setUpdatingId(book._id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${book._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            available: newStatus === "Published",
          }),
        },
      );
      if (!res.ok) throw new Error();

      setBooks((prev) =>
        prev.map((b) =>
          b._id === book._id
            ? { ...b, status: newStatus, available: newStatus === "Published" }
            : b,
        ),
      );
      toast.success(`Book is now ${newStatus}.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update book status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteBook = async (bookId) => {
    const confirmed = window.confirm(
      "Delete this book? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(bookId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${bookId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();

      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Book deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete book.");
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Inventory</h1>
        <NextLink
          href="/dashboard/librarian/add-book"
          className="button button--primary"
        >
          Add Book
        </NextLink>
      </div>

      {books.length === 0 ? (
        <p className="text-default-500">
          You haven&apos;t added any books yet.
        </p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Manage inventory">
              <Table.Header>
                <Table.Column isRowHeader className="text-center">
                  Title
                </Table.Column>
                <Table.Column className="text-center">Category</Table.Column>
                <Table.Column className="text-center">
                  Delivery Fee
                </Table.Column>
                <Table.Column className="text-center">Status</Table.Column>
                <Table.Column className="text-center">Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {books.map((book) => (
                  <Table.Row key={book._id}>
                    <Table.Cell className="text-center font-medium">
                      {book.title}
                    </Table.Cell>
                    <Table.Cell className="text-center text-default-500">
                      {book.category}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      ${Number(book.deliveryFee).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <Chip
                        variant="soft"
                        color={STATUS_COLORS[book.status] || "default"}
                        size="sm"
                      >
                        <Chip.Label>{book.status}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <NextLink
                          href={`/dashboard/librarian/manage-inventory/edit/${book._id}`}
                          className="p-1.5 rounded-md text-default-500 hover:bg-default-100 hover:text-primary transition"
                          aria-label="Edit book"
                        >
                          <Pencil size={14} />
                        </NextLink>

                        <button
                          onClick={() => togglePublish(book)}
                          disabled={
                            book.status === "Pending Approval" ||
                            updatingId === book._id
                          }
                          className="p-1.5 rounded-md text-default-500 hover:bg-default-100 hover:text-primary transition disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={
                            book.status === "Pending Approval"
                              ? "Awaiting approval"
                              : book.status === "Published"
                                ? "Unpublish"
                                : "Publish"
                          }
                        >
                          {book.status === "Pending Approval" ? (
                            <Lock size={14} />
                          ) : book.status === "Published" ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>

                        <button
                          onClick={() => deleteBook(book._id)}
                          disabled={deletingId === book._id}
                          className="p-1.5 rounded-md text-default-500 hover:bg-danger/10 hover:text-danger transition"
                          aria-label="Delete book"
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
