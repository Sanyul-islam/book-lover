export default async function getAllTransactions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/transactions`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
