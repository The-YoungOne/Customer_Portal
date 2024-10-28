import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const PendingTransactions = () => {
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [submitStatus, setSubmitStatus] = useState(""); // Success or failure messages

  // Fetch pending transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://localhost:5000/api/user/transactions/pending", // Ensure the path matches your backend route
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        setTransactions(response.data); // Set the transactions data
      } catch (error) {
        setError("Failed to fetch transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Handle transaction approval
  const handleApprove = async (transactionId) => {
    try {
      setIsLoading(true);
      await axios.post(
        `https://localhost:5000/api/user/payments/${transactionId}/approve`, // Corrected route
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      // Remove the approved transaction from the list
      setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
      setSubmitStatus("Transaction approved successfully.");
    } catch (error) {
      setError("Failed to approve transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle transaction denial
  const handleDeny = async (transactionId) => {
    try {
      setIsLoading(true);
      await axios.post(
        `https://localhost:5000/api/user/payments/${transactionId}/deny`, // Corrected route
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      // Remove the denied transaction from the list
      setTransactions(transactions.filter((transaction) => transaction._id !== transactionId));
      setSubmitStatus("Transaction denied successfully.");
    } catch (error) {
      setError("Failed to deny transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pending Transactions</h1>
        <p className="text-gray-600 mt-2">
          Review and approve pending transactions
        </p>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {submitStatus && (
        <div className="text-green-500 mb-4">{submitStatus}</div>
      )}
      {isLoading && <div className="text-gray-500 mb-4">Loading...</div>}

      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sender Account Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient Account Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction._id} // Ensure _id is used as the unique key
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.userAccountNumber} {/* Display sender's account number */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transaction.recipientAccountNumber} {/* Display recipient's account number */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.paymentReference || "N/A"} {/* Display payment reference */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {transaction.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                      onClick={() => handleApprove(transaction._id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                      onClick={() => handleDeny(transaction._id)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Deny
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-3 text-sm text-gray-500" colSpan={3}>
                Total Pending Transactions: {transactions.length}
              </td>
              <td className="px-6 py-3 text-sm text-gray-500">
                Total Amount:{" "}
                {transactions
                  .reduce((sum, transaction) => sum + transaction.amount, 0)
                  .toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                {transactions[0]?.currency}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PendingTransactions;
