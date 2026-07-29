export default async function getAllBooksAdmin() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/books?admin=true`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
