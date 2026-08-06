"use client";

import { useEffect, useState } from "react";
import { Table, Chip, Skeleton } from "@heroui/react";
import { EyeOff, Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getAllBooksAdmin from "@/data/getAllBooksAdmin";

const STATUS_COLORS = {
  "Pending Approval": "warning",
  Published: "success",
  Unpublished: "default",
};

export default function ManageAllBooksPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchBooks() {
      try {
        const data = await getAllBooksAdmin();
        if (!ignore) setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load books.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const forceUnpublish = async (bookId) => {
    setUpdatingId(bookId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${bookId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Unpublished", available: false }),
        },
      );
      if (!res.ok) throw new Error();

      setBooks((prev) =>
        prev.map((b) =>
          b._id === bookId
            ? { ...b, status: "Unpublished", available: false }
            : b,
        ),
      );
      toast.success("Book unpublished.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to unpublish book.");
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
        {
          method: "DELETE",
        },
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
      <h1 className="text-2xl font-bold mb-6">Manage All Books</h1>

      {books.length === 0 ? (
        <p className="text-default-500">No books found.</p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Manage all books">
              <Table.Header>
                <Table.Column isRowHeader className="text-center">Title</Table.Column>
                <Table.Column className="text-center">Librarian</Table.Column>
                <Table.Column className="text-center">Category</Table.Column>
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
                      {book.librarianName || "—"}
                    </Table.Cell>
                    <Table.Cell className="text-center text-default-500">
                      {book.category}
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
                        <button
                          onClick={() => forceUnpublish(book._id)}
                          disabled={
                            book.status !== "Published" ||
                            updatingId === book._id
                          }
                          className="p-1.5 rounded-md text-default-500 hover:bg-default-100 hover:text-primary transition disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Force unpublish"
                          title="Force unpublish"
                        >
                          <EyeOff size={14} />
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
