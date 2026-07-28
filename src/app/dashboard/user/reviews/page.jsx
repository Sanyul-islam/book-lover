"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton, Button } from "@heroui/react";
import { Star, Pencil, Trash2, X, Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getUserReviews from "@/data/getUserReviews";

export default function MyReviewsPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchReviews() {
      try {
        const data = await getUserReviews(session.user.id);
        if (!ignore) setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load your reviews.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchReviews();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const startEditing = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating || 0);
    setEditComment(review.comment || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
  };

  const saveReview = async (reviewId) => {
    setSavingReview(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/${reviewId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: editRating, comment: editComment }),
        },
      );
      if (!res.ok) throw new Error();

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId
            ? { ...r, rating: editRating, comment: editComment }
            : r,
        ),
      );
      toast.success("Review updated.");
      cancelEditing();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update review.");
    } finally {
      setSavingReview(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Delete this review? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(reviewId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/${reviewId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error();

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review.");
    } finally {
      setDeletingId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-56 rounded-lg" />
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-default-500">
          You haven&apos;t left any reviews yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map((review) => {
            const isEditing = editingId === review._id;

            return (
              <Card key={review._id} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold line-clamp-1">
                    {review.bookTitle || "Untitled Book"}
                  </p>

                  {!isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditing(review)}
                        className="p-1.5 rounded-md text-default-500 hover:bg-default-100 hover:text-primary transition"
                        aria-label="Edit review"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteReview(review._id)}
                        disabled={deletingId === review._id}
                        className="p-1.5 rounded-md text-default-500 hover:bg-danger/10 hover:text-danger transition"
                        aria-label="Delete review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditRating(i + 1)}
                          aria-label={`Rate ${i + 1} stars`}
                        >
                          <Star
                            size={18}
                            className={
                              i < editRating
                                ? "fill-warning text-warning"
                                : "text-default-300"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-default-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />

                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        isDisabled={savingReview}
                        onPress={() => saveReview(review._id)}
                      >
                        <Check size={14} />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={cancelEditing}
                        isDisabled={savingReview}
                      >
                        <X size={14} />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-0.5 mb-2">
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
                    <p className="text-sm text-default-600 leading-relaxed">
                      {review.comment}
                    </p>
                    {review.createdAt && (
                      <p className="text-xs text-default-400 mt-3">
                        {new Date(review.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    )}
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
