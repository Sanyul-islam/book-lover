"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import BookForm from "@/components/dashboard/BookForm";
import getTokenServer from "@/data/getTokenServer";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (bookData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in as a librarian to add a book.");
      return;
    }

    setSubmitting(true);
    
    try {
      const token  = await getTokenServer();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...bookData,
          librarianId: session.user.id,
          librarianName: session.user.name,
          status: "Pending Approval",
          available: false,
          createdAt: new Date(),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Book submitted for approval.");
      router.push("/dashboard/librarian/manage-inventory");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Add a New Book</h1>
      <p className="text-default-500 mb-6">
        New listings start as <strong>Pending Approval </strong> and won&apos;t 
        appear on the public Browse page until approved.
      </p>
      <BookForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Submit for Approval"
      />
    </div>
  );
}
