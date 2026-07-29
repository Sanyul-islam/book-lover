"use client";

import { useEffect, useState } from "react";
import { Table, Skeleton } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getAllTransactions from "@/data/getAllTransactions";

export default function TransactionsPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchTransactions() {
      try {
        const data = await getAllTransactions();
        if (!ignore) setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load transactions.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchTransactions();

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
      <h1 className="text-2xl font-bold mb-6">All Transactions</h1>

      {transactions.length === 0 ? (
        <p className="text-default-500">No transactions yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="All transactions">
              <Table.Header>
                <Table.Column isRowHeader className="text-center">
                  Transaction ID
                </Table.Column>
                <Table.Column className="text-center">User Email</Table.Column>
                <Table.Column className="text-center">
                  Librarian Email
                </Table.Column>
                <Table.Column className="text-center">Amount</Table.Column>
                <Table.Column className="text-center">Date</Table.Column>
              </Table.Header>
              <Table.Body>
                {transactions.map((t) => (
                  <Table.Row key={t._id}>
                    <Table.Cell className="text-center font-mono text-xs text-default-500">
                      {t.transactionId}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {t.userEmail}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      {t.librarianEmail}
                    </Table.Cell>
                    <Table.Cell className="text-center font-medium">
                      ${Number(t.amount).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell className="text-center text-default-500">
                      {t.date
                        ? new Date(t.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  );
}
