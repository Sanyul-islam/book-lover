export default async function getBookReviews(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}/reviews`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
