"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Skeleton, Chip } from "@heroui/react";
import { Library, Wallet, Clock3, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getLibrarianBooks from "@/data/getLibrarianBooks";
import getLibrarianDeliveries from "@/data/getLibrarianDeliveries";

const STATUS_PIE_COLORS = {
  "Pending Approval": "#f5a524",
  Published: "#17c964",
  Unpublished: "#71717a",
};

export default function LibrarianDashboardOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [books, setBooks] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchData() {
      try {
        const [booksData, deliveriesData] = await Promise.all([
          getLibrarianBooks(session.user.id),
          getLibrarianDeliveries(session.user.id),
        ]);
        if (!ignore) {
          setBooks(Array.isArray(booksData) ? booksData : []);
          setDeliveries(Array.isArray(deliveriesData) ? deliveriesData : []);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load your dashboard.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const totalBooksListed = books.length;

  const totalEarnings = useMemo(
    () =>
      deliveries
        .filter((d) => d.status === "Delivered" || d.status === "Dispatched")
        .reduce((sum, d) => sum + (Number(d.deliveryFee) || 0), 0),
    [deliveries],
  );

  const activePendingRequests = useMemo(
    () => deliveries.filter((d) => d.status === "Pending").length,
    [deliveries],
  );

  const statusBreakdown = useMemo(() => {
    const counts = { "Pending Approval": 0, Published: 0, Unpublished: 0 };
    books.forEach((b) => {
      if (counts[b.status] !== undefined) counts[b.status] += 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [books]);

  const monthlyEarnings = useMemo(() => {
    const months = {};
    deliveries.forEach((d) => {
      if (!d.requestDate || d.status === "Pending") return;
      const date = new Date(d.requestDate);
      const key = date.toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
      months[key] = (months[key] || 0) + (Number(d.deliveryFee) || 0);
    });

    if (Object.keys(months).length === 0) {
      const currentMonth = new Date().toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
      return [{ month: currentMonth, earnings: 0 }];
    }

    return Object.entries(months).map(([month, earnings]) => ({
      month,
      earnings,
    }));
  }, [deliveries]);

  const mostRequested = useMemo(() => {
    const counts = {};
    deliveries.forEach((d) => {
      if (!d.bookTitle) return;
      counts[d.bookTitle] = (counts[d.bookTitle] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([title, requests]) => ({ title, requests }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);
  }, [deliveries]);

  if (sessionLoading || loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-9 w-64 rounded-lg" />
        <div className="grid md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
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
          Here&apos;s how your listed books are performing.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-5 text-center">
        <StatCard
          icon={Library}
          label="Total Books Listed"
          value={totalBooksListed}
          color="primary"
        />
        <StatCard
          icon={Wallet}
          label="Total Earnings"
          value={`$${totalEarnings.toFixed(2)}`}
          color="success"
        />
        <StatCard
          icon={Clock3}
          label="Active Pending Requests"
          value={activePendingRequests}
          color="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-bold mb-4">Inventory Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
              >
                {statusBreakdown.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STATUS_PIE_COLORS[entry.name] || "#999"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold mb-4">Earnings Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="earnings" fill="#17c964" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Most Requested Books */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-primary" />
          <h2 className="text-2xl font-bold">Most Requested Books</h2>
        </div>

        {mostRequested.length === 0 ? (
          <p className="text-default-500">No delivery requests yet.</p>
        ) : (
          <Card className="p-2">
            {mostRequested.map((item, i) => (
              <div
                key={item.title}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== mostRequested.length - 1
                    ? "border-b border-default-100"
                    : ""
                }`}
              >
                <span className="text-sm font-medium">{item.title}</span>
                <Chip variant="soft" color="primary" size="sm">
                  <Chip.Label>{item.requests} requests</Chip.Label>
                </Chip>
              </div>
            ))}
          </Card>
        )}
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
