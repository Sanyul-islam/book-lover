export default async function getLibrarianDeliveries(librarianId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/deliveries?librarianId=${librarianId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}
