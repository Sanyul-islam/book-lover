"use client";

import { useEffect, useState } from "react";
import { Table, Chip, Skeleton } from "@heroui/react";
import { Check, Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getAllBooksAdmin from "@/data/getAllBooksAdmin";

export default function ApprovalQueuePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchBooks() {
      try {
        const data = await getAllBooksAdmin();
        if (!ignore) {
          const pending = Array.isArray(data)
            ? data.filter((b) => b.status === "Pending Approval")
            : [];
          setBooks(pending);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load the approval queue.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const approveBook = async (bookId) => {
    setProcessingId(bookId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${bookId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Published", available: true }),
        },
      );
      if (!res.ok) throw new Error();

      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("Book approved and published.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve book.");
    } finally {
      setProcessingId(null);
    }
  };

  const deleteBook = async (bookId) => {
    const confirmed = window.confirm(
      "Delete this book? This cannot be undone.",
    );
    if (!confirmed) return;

    setProcessingId(bookId);
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
      setProcessingId(null);
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
      <h1 className="text-2xl font-bold mb-2">Book Approval Queue</h1>
      <p className="text-default-500 mb-6">
        Books submitted by librarians awaiting your review.
      </p>

      {books.length === 0 ? (
        <p className="text-default-500">No books awaiting approval.</p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Book approval queue">
              <Table.Header>
                <Table.Column className="text-center">Title</Table.Column>
                <Table.Column className="text-center">Librarian</Table.Column>
                <Table.Column className="text-center">Category</Table.Column>
                <Table.Column className="text-center">
                  Delivery Fee
                </Table.Column>
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
                    <Table.Cell className="text-center">
                      <Chip variant="soft" color="accent" size="sm">
                        <Chip.Label>{book.category}</Chip.Label>
                      </Chip>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      ${Number(book.deliveryFee).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => approveBook(book._id)}
                          disabled={processingId === book._id}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-success border border-success/30 rounded-md px-2.5 py-1.5 hover:bg-success/5 transition disabled:opacity-50"
                        >
                          <Check size={12} />
                          Approve & Publish
                        </button>
                        <button
                          onClick={() => deleteBook(book._id)}
                          disabled={processingId === book._id}
                          className="p-1.5 rounded-md text-default-500 hover:bg-danger/10 hover:text-danger transition disabled:opacity-50"
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
