export default async function getDeliveries(userId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/deliveries?userId=${userId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
