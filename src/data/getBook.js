export default async function getBook(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch book");
  }

  return res.json();
}
