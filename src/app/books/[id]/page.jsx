"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { Card, Chip, Skeleton, Button } from "@heroui/react";
import {
  User,
  CalendarDays,
  Truck,
  Pencil,
  Trash2,
  EyeOff,
  Star,
  MessageSquareText,
  Loader2,
  Send,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getBook from "@/data/getBook";
import getBookReviews from "@/data/getBookReviews";
import checkPurchase from "@/data/checkPurchase";

const STATUS_STYLES = {
  Available: { color: "success", label: "Available" },
  "Checked Out": { color: "danger", label: "Checked Out" },
  "Pending Delivery": { color: "warning", label: "Pending Delivery" },
};

export default function BookDetails() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchBook() {
      try {
        const data = await getBook(id);
        if (!ignore) setBook(data);
      } catch (error) {
        console.log(error);
        if (!ignore) {
          setBook(null);
          toast.error("Failed to load book details.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    async function fetchReviews() {
      try {
        const data = await getBookReviews(id);
        if (!ignore) setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        if (!ignore) setReviews([]);
      }
    }

    fetchBook();
    fetchReviews();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Check whether the current user has purchased this book (gates the review form)
  useEffect(() => {
    if (!session?.user?.id || !id) {
      // No setState here: the review UI only ever renders when `session` is
      // truthy, so checkingPurchase's value is irrelevant until then.
      return;
    }

    let ignore = false;

    async function checkStatus() {
      try {
        const purchased = await checkPurchase(session.user.id, id);
        if (!ignore) setHasPurchased(purchased);
      } catch (error) {
        console.log(error);
      } finally {
        if (!ignore) setCheckingPurchase(false);
      }
    }

    checkStatus();

    return () => {
      ignore = true;
    };
  }, [session, id]);

  // Handle return from Stripe Checkout
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      let ignore = false;
      const sessionId = searchParams.get("session_id");

      async function confirmPayment() {
        try {
          if (sessionId) {
            // Fallback: verifies payment directly with Stripe and creates the
            // delivery if the webhook hasn't already done so. Safe to call
            // even if the webhook DID already fire — the backend is idempotent.
            await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-checkout-session`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
              },
            );
          }

          toast.success("Payment successful! Delivery is now pending.");

          const data = await getBook(id);
          if (!ignore) setBook(data);
        } catch (error) {
          console.log(error);
        }
      }

      confirmPayment();
      router.replace(`/books/${id}`);

      return () => {
        ignore = true;
      };
    } else if (searchParams.get("canceled") === "true") {
      toast.info("Payment was canceled.");
      router.replace(`/books/${id}`);
    }
  }, [searchParams, id, router]);

  const isOwnerLibrarian =
    session?.user?.role === "librarian" &&
    session?.user?.id === book?.librarianId;

  const isCheckedOut = book?.status === "Checked Out";
  const isBookunAvailable = book?.available === false;
  const requestDisabled =
    isCheckedOut || isOwnerLibrarian || requesting || isBookunAvailable;

  const handleRequestDelivery = async () => {
    if (!session) {
      toast.info("Please log in to request delivery.");
      router.push("/login");
      return;
    }

    setRequesting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: book._id,
            userId: session.user.id,
            deliveryFee: book.deliveryFee,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.message || "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong starting checkout.");
      setRequesting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();

      toast.success("Book deleted.");
      router.push("/dashboard/manage-books");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete book.");
      setDeleting(false);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: false, status: "Unpublished" }),
        },
      );
      if (!res.ok) throw new Error();

      toast.success("Book unpublished.");
      fetchBook();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unpublish book.");
    } finally {
      setUnpublishing(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!session) {
      toast.info("Please log in to leave a review.");
      router.push("/login");
      return;
    }

    if (!reviewRating || !reviewComment.trim()) {
      toast.error("Please add a rating and a comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            userName: session.user.name,
            userImage: session.user.image,
            rating: reviewRating,
            comment: reviewComment.trim(),
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review.");

      setReviews((prev) => [data.review, ...prev]);
      setReviewRating(0);
      setReviewComment("");
      toast.success("Review submitted.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="h-120 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-5 w-1/2 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Book not found</h1>
        <p className="text-default-500 mt-2">
          The book you&apos;re looking for doesn&apos;t exist or was removed.
        </p>
        <NextLink
          href="/books"
          className="button button--primary mt-6 inline-flex"
        >
          Back to Browse Books
        </NextLink>
      </section>
    );
  }

  const statusInfo = STATUS_STYLES[book.status] || {
    color: "default",
    label: book.status,
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Cover Image */}
        <div className="relative h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {!book.available && (
            <Chip
              color="danger"
              variant="primary"
              className="absolute top-3 right-3"
            >
              <Chip.Label>Unavailable</Chip.Label>
            </Chip>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <Chip variant="soft" color={statusInfo.color}>
              <Chip.Label>{statusInfo.label}</Chip.Label>
            </Chip>
            {book.category && (
              <Chip variant="soft" color="accent">
                <Chip.Label>{book.category}</Chip.Label>
              </Chip>
            )}
            {avgRating && (
              <div className="flex items-center gap-1 text-sm text-default-500">
                <Star size={14} className="fill-warning text-warning" />
                {avgRating} ({reviews.length})
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{book.title}</h1>

          <div className="flex items-center gap-2 text-default-500 mt-2">
            <User size={16} />
            <span>{book.author}</span>
          </div>

          {book.createdAt && (
            <div className="flex items-center gap-2 text-default-500 mt-1 text-sm">
              <CalendarDays size={14} />
              <span>
                Added on{" "}
                {new Date(book.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          <p className="text-default-600 mt-6 leading-relaxed">
            {book.description}
          </p>

          <p className="text-xl font-semibold mt-6">
            Delivery Fee: ${book.deliveryFee}
          </p>

          {/* Request Delivery */}
          <Button
            variant="primary"
            className="w-full md:w-auto mt-6"
            isDisabled={requestDisabled}
            onPress={handleRequestDelivery}
          >
            {requesting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Redirecting to checkout...
              </>
            ) : (
              <>
                <Truck size={16} />
                Request Delivery
              </>
            )}
          </Button>

          {isOwnerLibrarian && (
            <p className="text-xs text-default-400 mt-2">
              You own this listing, so you can&apos;t request delivery on it.
            </p>
          )}
          {isCheckedOut && !isOwnerLibrarian && (
            <p className="text-xs text-default-400 mt-2">
              This book is currently checked out.
            </p>
          )}

          {/* Librarian Controls */}
          {isOwnerLibrarian && (
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-default-200">
              <NextLink
                href={`/dashboard/manage-books/edit/${book._id}`}
                className="button button--secondary inline-flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit
              </NextLink>

              <Button
                variant="outline"
                isDisabled={unpublishing}
                onPress={handleUnpublish}
              >
                <EyeOff size={16} />
                {unpublishing ? "Unpublishing..." : "Unpublish"}
              </Button>

              <Button
                variant="danger"
                isDisabled={deleting}
                onPress={handleDelete}
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-10 border-t border-default-200">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquareText size={20} className="text-primary" />
          <h2 className="text-2xl font-bold">
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>
        </div>

        {session && !checkingPurchase && hasPurchased && (
          <Card className="p-5 mb-8">
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1.5">Your Rating</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      aria-label={`Rate ${i + 1} stars`}
                    >
                      <Star
                        size={20}
                        className={
                          i < reviewRating
                            ? "fill-warning text-warning"
                            : "text-default-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts about this book..."
                className="w-full rounded-lg border border-default-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                isDisabled={submittingReview}
              >
                {submittingReview ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Submit Review
                  </>
                )}
              </Button>
            </form>
          </Card>
        )}

        {session && !checkingPurchase && !hasPurchased && (
          <Card className="p-5 mb-8 bg-default-50">
            <p className="text-sm text-default-500">
              Only readers who&apos;ve purchased this book can leave a review.
            </p>
          </Card>
        )}

        {reviews.length === 0 ? (
          <p className="text-default-500">No reviews yet for this book.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {reviews.map((review) => (
              <Card key={review._id} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {review.userImage ? (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                          src={review.userImage}
                          alt={review.userName || "Reviewer"}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-default-200 flex items-center justify-center">
                        <User size={14} className="text-default-500" />
                      </div>
                    )}
                    <span className="font-medium text-sm">
                      {review.userName || "Anonymous Reader"}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < (review.rating || 0)
                            ? "fill-warning text-warning"
                            : "text-default-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-default-600 leading-relaxed">
                  {review.comment}
                </p>

                {review.createdAt && (
                  <p className="text-xs text-default-400 mt-3">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
