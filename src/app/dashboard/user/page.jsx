"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Skeleton } from "@heroui/react";
import { BookOpen, Truck, Wallet } from "lucide-react";
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
import getDeliveries from "@/data/getDeliveries";

const PIE_COLORS = {
  Pending: "#f5a524",
  Dispatched: "#006fee",
  Delivered: "#17c964",
};

export default function UserDashboardOverview() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchDeliveries = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const data = await getDeliveries(session.user.id);
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!sessionLoading && session) fetchDeliveries();
  }, [sessionLoading, session, fetchDeliveries]);

  const totalBooksRead = useMemo(
    () => deliveries.filter((d) => d.status === "Delivered").length,
    [deliveries],
  );

  const pendingDeliveries = useMemo(
    () =>
      deliveries.filter(
        (d) => d.status === "Pending" || d.status === "Dispatched",
      ).length,
    [deliveries],
  );

  const totalSpent = useMemo(
    () => deliveries.reduce((sum, d) => sum + (Number(d.deliveryFee) || 0), 0),
    [deliveries],
  );

  const statusBreakdown = useMemo(() => {
    const counts = { Pending: 0, Dispatched: 0, Delivered: 0 };
    deliveries.forEach((d) => {
      if (counts[d.status] !== undefined) counts[d.status] += 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [deliveries]);

  const monthlySpend = useMemo(() => {
    const months = {};
    deliveries.forEach((d) => {
      if (!d.requestDate) return;
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
      return [{ month: currentMonth, fee: 0 }];
    }

    return Object.entries(months).map(([month, fee]) => ({ month, fee }));
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
          Here&apos;s a look at your reading activity and deliveries.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-5 text-center">
        <StatCard
          icon={BookOpen}
          label="Total Books Read"
          value={totalBooksRead}
          color="success"
        />
        <StatCard
          icon={Truck}
          label="Pending Deliveries"
          value={pendingDeliveries}
          color="warning"
        />
        <StatCard
          icon={Wallet}
          label="Total Spent on Fees"
          value={`$${totalSpent.toFixed(2)}`}
          color="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-6">
          <h2 className="font-bold mb-4">Delivery Status Breakdown</h2>
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
                    fill={PIE_COLORS[entry.name] || "#999"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold mb-4">Spending Over Time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="fee" fill="#006fee" radius={[6, 6, 0, 0]} />
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
