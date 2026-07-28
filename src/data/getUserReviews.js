export default async function getUserReviews(userId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/reviews?userId=${userId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
