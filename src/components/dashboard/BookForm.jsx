"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, Button } from "@heroui/react";
import { ImageUp, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const CATEGORIES = [
  "Fiction",
  "Technology",
  "History",
  "Science",
  "Self Development",
  "Finance",
  "Fantasy",
];

export default function BookForm({
  initialData = null,
  onSubmit,
  submitting = false,
  submitLabel = "Submit",
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [deliveryFee, setDeliveryFee] = useState(
    initialData?.deliveryFee || "",
  );
  const [category, setCategory] = useState(
    initialData?.category || CATEGORIES[0],
  );
  const [image, setImage] = useState(initialData?.image || "");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("Image hosting is not configured.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error("Upload failed");
      }

      setImage(data.data.url);
      toast.success("Image uploaded.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !author || !description || !deliveryFee || !image) {
      toast.error("Please fill in all fields and upload a cover image.");
      return;
    }

    onSubmit({
      title,
      author,
      description,
      deliveryFee: Number(deliveryFee),
      category,
      image,
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-default-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Book title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-default-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Author name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-default-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="What is this book about?"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Delivery Fee ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="w-full rounded-lg border border-default-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. 3.50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-default-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-transparent"
            >
              {CATEGORIES.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="bg-white text-black dark:bg-black dark:text-white capitalize"
                >
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            {image ? (
              <div className="relative h-24 w-20 rounded-lg overflow-hidden shrink-0 border border-default-200">
                <Image
                  src={image}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-24 w-20 rounded-lg border border-dashed border-default-300 flex items-center justify-center shrink-0 text-default-300">
                <ImageUp size={20} />
              </div>
            )}

            <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 rounded-lg px-3 py-2 hover:bg-primary/5 transition">
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ImageUp size={14} />
                  {image ? "Change Image" : "Upload Image"}
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full md:w-auto"
          isDisabled={submitting || uploading}
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Card>
  );
}
