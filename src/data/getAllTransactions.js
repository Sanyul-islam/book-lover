import getTokenServer from "./getTokenServer";

export default async function getAllTransactions() {
  const token  = await getTokenServer();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/transactions`,
    { headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
      cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
