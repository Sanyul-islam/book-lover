export default async function getBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}
