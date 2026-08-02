export default async function checkPurchase(userId, bookId) {
  if (!userId || !bookId) return false;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/deliveries/check?userId=${userId}&bookId=${bookId}`,
    { cache: "no-store" },
  );

  if (!res.ok) return false;

  const data = await res.json();
  return Boolean(data.purchased);
}
