
import getTokenServer from "./getTokenServer";

export default async function getAllUsers() {
  const token  = await getTokenServer();
  console.log("Token:", token);
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}
