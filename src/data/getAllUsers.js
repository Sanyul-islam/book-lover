export default async function getAllUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
