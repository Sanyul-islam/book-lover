export default async function getLibrarianBooks(librarianId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/librarian/books?librarianId=${librarianId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
