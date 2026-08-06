"use client";

import { useEffect, useState } from "react";
import { Chip, Skeleton, Table } from "@heroui/react";
import { PackageCheck, PackageSearch, Clock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getDeliveries from "@/data/getDeliveries";

const STATUS_META = {
  Pending: { color: "warning", icon: Clock },
  Dispatched: { color: "accent", icon: PackageSearch },
  Delivered: { color: "success", icon: PackageCheck },
};

export default function DeliveryHistoryPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchDeliveries() {
      try {
        const data = await getDeliveries(session.user.id);
        if (!ignore) setDeliveries(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load delivery history.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchDeliveries();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

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
      <h1 className="text-2xl font-bold mb-6">Delivery History</h1>

      {deliveries.length === 0 ? (
        <p className="text-default-500">
          You haven&apos;t requested any deliveries yet.
        </p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Delivery history">
              <Table.Header>
                <Table.Column isRowHeader className="text-center">
                  Book Title
                </Table.Column>
                <Table.Column className="text-center">
                  Delivery Fee
                </Table.Column>
                <Table.Column className="text-center">
                  Request Date
                </Table.Column>
                <Table.Column className="text-center">Status</Table.Column>
              </Table.Header>
              <Table.Body>
                {deliveries.map((d) => {
                  const meta = STATUS_META[d.status] || {
                    color: "default",
                    icon: Clock,
                  };
                  const StatusIcon = meta.icon;
                  return (
                    <Table.Row key={d._id}>
                      <Table.Cell className="text-center font-medium">
                        {d.bookTitle}
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        ${Number(d.deliveryFee).toFixed(2)}
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
