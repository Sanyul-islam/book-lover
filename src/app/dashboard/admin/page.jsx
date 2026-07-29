"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Skeleton } from "@heroui/react";
import { Users, Library, Truck, Wallet } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getAllUsers from "@/data/getAllUsers";
import getAllBooksAdmin from "@/data/getAllBooksAdmin";
import getAllTransactions from "@/data/getAllTransactions";

const CATEGORY_COLORS = [
  "#006fee",
  "#17c964",
  "#f5a524",
  "#f31260",
  "#7828c8",
  "#0891b2",
  "#65a30d",
];

export default function AdminDashboardOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchData() {
      try {
        const [usersData, booksData, transactionsData] = await Promise.all([
          getAllUsers(),
          getAllBooksAdmin(),
          getAllTransactions(),
        ]);
        if (!ignore) {
          setUsers(Array.isArray(usersData) ? usersData : []);
          setBooks(Array.isArray(booksData) ? booksData : []);
          setTransactions(
            Array.isArray(transactionsData) ? transactionsData : [],
          );
        }
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load platform overview.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const totalUsers = users.length;
  const totalBooks = books.length;
  const totalDeliveries = transactions.length;

  const totalRevenue = useMemo(
    () => transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [transactions],
  );

  const booksByCategory = useMemo(() => {
    const counts = {};
    books.forEach((b) => {
      const cat = b.category || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [books]);

  const monthlyRevenue = useMemo(() => {
    const months = {};
    transactions.forEach((t) => {
      if (!t.date) return;
      const date = new Date(t.date);
      const key = date.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
      months[key] = (months[key] || 0) + (Number(t.amount) || 0);
    });

    if (Object.keys(months).length === 0) {
      const currentMonth = new Date().toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
      return [{ month: currentMonth, revenue: 0 }];
    }

    return Object.entries(months).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }, [transactions]);

  if (sessionLoading || loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <div className="grid md:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-default-500 mt-1">
          A platform-wide look at users, books, and revenue.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-5 text-center">
        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          color="primary"
        />
        <StatCard
          icon={Library}
          label="Total Books"
          value={totalBooks}
          color="accent"
        />
        <StatCard
          icon={Truck}
          label="Total Deliveries"
          value={totalDeliveries}
          color="warning"
        />
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-bold mb-4">Books by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={booksByCategory}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {booksByCategory.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="revenue" fill="#006fee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <Card className="p-6 flex items-center gap-4">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm text-default-500 mt-1">{label}</p>
      </div>
    </Card>
  );
}
