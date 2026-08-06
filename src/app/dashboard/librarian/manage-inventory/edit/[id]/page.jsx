"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@heroui/react";
import { toast } from "react-toastify";
import BookForm from "@/components/dashboard/BookForm";
import getBook from "@/data/getBook";
import getTokenServer from "@/data/getTokenServer";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const data = await getBook(id);
        setBook(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load book.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  const handleSubmit = async (bookData) => {
    setSubmitting(true);
    try {
      const token  = await getTokenServer();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookData),
        },
      );

      if (!res.ok) throw new Error();

      toast.success("Book updated.");
      router.push("/dashboard/librarian/manage-inventory");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update book.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-56 rounded-lg" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!book) {
    return <p className="text-default-500">Book not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm
        initialData={book}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
