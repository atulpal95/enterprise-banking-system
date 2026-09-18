import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import axiosInstance from "../../api/axiosInstance";

import "../../assets/styles/admin-transactions.css";

function AdminTransactions() {
  const [searchParams] = useSearchParams();

  const selectedType =
    searchParams.get("type")?.toUpperCase() || "ALL";

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD ADMIN TRANSACTIONS
  // =========================================================

  const loadTransactions = async () => {
    try {
      setLoading(true);

      /*
       * Backend endpoint:
       *
       * GET /api/admin/reports
       *
       * axiosInstance automatically adds:
       *
       * Authorization: Bearer <JWT>
       *
       * because the JWT interceptor is configured
       * inside axiosInstance.js.
       */

      const response = await axiosInstance.get(
        "/admin/reports",
        {
          params: {
            startDate: "2000-01-01",
            endDate: "2099-12-31",
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setTransactions(data);
    } catch (error) {
      console.error(
        "Admin transaction loading error:",
        error
      );

      console.error(
        "Response:",
        error.response?.data
      );

      console.error(
        "Status:",
        error.response?.status
      );

      setTransactions([]);

      /*
       * Different messages for different
       * authentication problems.
       */

      if (error.response?.status === 401) {
        toast.error(
          "Your session has expired. Please login again."
        );
      } else if (error.response?.status === 403) {
        toast.error(
          "Access denied. Admin authorization required."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
          "Unable to load transactions."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadTransactions();
  }, []);

  // =========================================================
  // FILTER TRANSACTIONS
  // =========================================================

  const filteredTransactions = useMemo(() => {
  if (selectedType === "ALL") {
    return transactions;
  }

  return transactions.filter(
    (transaction) =>
      transaction.transactionType?.toUpperCase() === selectedType
  );
}, [transactions, selectedType]);

  // =========================================================
  // TOTAL TRANSACTIONS
  // =========================================================

  const totalTransactions =
    filteredTransactions.length;

  // =========================================================
  // TOTAL DEPOSITS
  // =========================================================

  const totalDeposits = filteredTransactions
    .filter(
      (transaction) =>
        transaction.transactionType?.toUpperCase() === "DEPOSIT"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  // =========================================================
  // TOTAL WITHDRAWALS
  // =========================================================

  const totalWithdrawals = filteredTransactions
    .filter(
      (transaction) =>
        transaction.transactionType?.toUpperCase() === "WITHDRAW"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  // =========================================================
  // PAGE TITLE
  // =========================================================

  const pageTitle =
    selectedType === "DEPOSIT"
      ? "All Deposits"
      : selectedType === "WITHDRAW"
        ? "All Withdrawals"
        : "All Transactions";

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-transactions-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-transactions-header">

        <div>
          <span className="admin-transactions-label">
            TRANSACTION MANAGEMENT
          </span>

          <h2>{pageTitle}</h2>

          <p>
            View and monitor banking transaction activity.
          </p>
        </div>

        <button
          type="button"
          className="admin-transactions-refresh"
          onClick={loadTransactions}
          disabled={loading}
        >
          <span>↻</span>

          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="admin-transactions-summary">

        {/* =================================================
            TOTAL TRANSACTIONS
        ================================================= */}

        <div className="admin-transaction-summary-card">

          <div>
            <span>Total Transactions</span>

            <strong>
              {totalTransactions}
            </strong>
          </div>

          <div className="transaction-summary-icon">
            ⇄
          </div>

        </div>

        {/* =================================================
            TOTAL DEPOSITS
        ================================================= */}

        <div className="admin-transaction-summary-card deposit">

          <div>
            <span>Total Deposits</span>

            <strong>
              {formatAmount(totalDeposits)}
            </strong>
          </div>

          <div className="transaction-summary-icon">
            ↓
          </div>

        </div>

        {/* =================================================
            TOTAL WITHDRAWALS
        ================================================= */}

        <div className="admin-transaction-summary-card withdrawal">

          <div>
            <span>Total Withdrawals</span>

            <strong>
              {formatAmount(totalWithdrawals)}
            </strong>
          </div>

          <div className="transaction-summary-icon">
            ↑
          </div>

        </div>

      </div>

      {/* =================================================
          TRANSACTION TABLE
      ================================================= */}

      <div className="admin-transactions-table-card">

        <div className="admin-transactions-table-header">

          <div>

            <h3>
              Transaction History
            </h3>

            <span>
              Showing {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1
                ? "s"
                : ""}
            </span>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="admin-transactions-loading">

            <div className="transaction-loading-spinner">
              ↻
            </div>

            <p>
              Loading transactions...
            </p>

          </div>

        ) : filteredTransactions.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="admin-transactions-empty">

            <div className="transaction-empty-icon">
              🧾
            </div>

            <h3>
              No Transactions Found
            </h3>

            <p>
              There are no transactions to display.
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="admin-transactions-table-wrapper">

            <table className="admin-transactions-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Balance After
                  </th>

                  <th>
                    Date & Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredTransactions.map(
                  (transaction) => (

                    <tr key={transaction.transactionId}>

                      <td>
                        #{transaction.transactionId}
                      </td>

                      <td>
                        {transaction.customerEmail || "-"}
                      </td>

                      <td>

                        <span
                          className={`transaction-badge ${
                            transaction.transactionType?.toUpperCase() ===
                            "DEPOSIT"
                              ? "deposit"
                              : transaction.transactionType?.toUpperCase() ===
                                "WITHDRAW"
                                ? "withdrawal"
                                : ""
                          }`}
                        >
                          {transaction.transactionType || "-"}
                        </span>

                      </td>

                      <td className="transaction-amount">
                        {formatAmount(
                          transaction.amount
                        )}
                      </td>

                      <td>
                        {formatAmount(
                          transaction.balanceAfterTransaction
                        )}
                      </td>

                      <td>
                        {formatDate(
                          transaction.transactionTime
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminTransactions;