"use client";

import { useEffect, useState } from "react";
import { Table, Chip, Skeleton } from "@heroui/react";
import { Clock, PackageSearch, PackageCheck, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getLibrarianDeliveries from "@/data/getLibrarianDeliveries";

const STATUS_FLOW = {
  Pending: "Dispatched",
  Dispatched: "Delivered",
};

const STATUS_META = {
  Pending: { color: "warning", icon: Clock },
  Dispatched: { color: "accent", icon: PackageSearch },
  Delivered: { color: "success", icon: PackageCheck },
};

export default function ManageDeliveriesPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchDeliveries() {
      try {
        const data = await getLibrarianDeliveries(session.user.id);
        if (!ignore) setDeliveries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load deliveries.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchDeliveries();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  const advanceStatus = async (delivery) => {
    const nextStatus = STATUS_FLOW[delivery.status];
    if (!nextStatus) return;

    setUpdatingId(delivery._id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/deliveries/${delivery._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      if (!res.ok) throw new Error();

      setDeliveries((prev) =>
        prev.map((d) =>
          d._id === delivery._id ? { ...d, status: nextStatus } : d,
        ),
      );
      toast.success(`Marked as ${nextStatus}.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update delivery status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (sessionLoading || loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-56 rounded-lg" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Deliveries</h1>

      {deliveries.length === 0 ? (
        <p className="text-default-500">No delivery requests yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Manage deliveries">
              <Table.Header>
                <Table.Column isRowHeader className="text-center">Client Name</Table.Column>
                <Table.Column className="text-center">Book Title</Table.Column>
                <Table.Column className="text-center">Date</Table.Column>
                <Table.Column className="text-center">Status</Table.Column>
                <Table.Column className="text-center">Action</Table.Column>
              </Table.Header>
              <Table.Body>
                {deliveries.map((d) => {
                  const meta = STATUS_META[d.status] || {
                    color: "default",
                    icon: Clock,
                  };
                  const StatusIcon = meta.icon;
                  const nextStatus = STATUS_FLOW[d.status];

                  return (
                    <Table.Row key={d._id}>
                      <Table.Cell className="text-center font-medium">
                        {d.clientName || d.userName || "—"}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {d.bookTitle}
                      </Table.Cell>
                      <Table.Cell className="text-center text-default-500">
                        {d.requestDate
                          ? new Date(d.requestDate).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "—"}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        <Chip variant="soft" color={meta.color} size="sm">
                          <StatusIcon size={12} />
                          <Chip.Label>{d.status}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {nextStatus ? (
                          <button
                            onClick={() => advanceStatus(d)}
                            disabled={updatingId === d._id}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 rounded-md px-2.5 py-1.5 hover:bg-primary/5 transition disabled:opacity-50"
                          >
                            Mark {nextStatus}
                            <ArrowRight size={12} />
                          </button>
                        ) : (
                          <span className="text-xs text-default-400">
                            Complete
                          </span>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  );
}
