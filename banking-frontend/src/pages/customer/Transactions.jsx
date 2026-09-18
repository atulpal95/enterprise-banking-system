import { useMemo, useState, useRef, useEffect } from "react";
import "../../assets/styles/Transactions.css";

import useTransactions from "../../hooks/useTransactions";

import TransactionCard from "../../components/dashboard/TransactionCard";
import TransactionDetailsModal from "../../components/dashboard/transactions/TransactionDetailsModal";

function Transactions() {
    const {
        transactions,
        loading,
        error,
    } = useTransactions();

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [filterOpen, setFilterOpen] = useState(false);

const filterRef = useRef(null);

useEffect(() => {

    const handleClickOutside = (event) => {

        if (
            filterRef.current &&
            !filterRef.current.contains(event.target)
        ) {
            setFilterOpen(false);
        }

    };

    document.addEventListener(
        "mousedown",
        handleClickOutside
    );

    return () => {

        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );

    };

}, []);

    const filteredTransactions = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        return transactions.filter((transaction) => {
            const matchesSearch =
                transaction.type?.toLowerCase().includes(keyword) ||
                transaction.description?.toLowerCase().includes(keyword) ||
                transaction.reference?.toLowerCase().includes(keyword);

            const matchesType =
                typeFilter === "ALL" ||
                transaction.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [transactions, search, typeFilter]);

    const getTransactionFilterLabel = (value) => {

    const labels = {

        ALL: "All Transactions",

        DEPOSIT: "Deposit",

        WITHDRAW: "Withdrawal",

        TRANSFER_IN: "Transfer In",

        TRANSFER_OUT: "Transfer Out",

        LOAN_CREDIT: "Loan Credit",

        LOAN_EMI: "Loan EMI",

        FIXED_DEPOSIT: "Fixed Deposit",

        FD_OPEN: "FD Open",

        FD_MATURITY: "FD Maturity",

        FD_REFUND: "FD Refund",

        RD_OPEN: "Recurring Deposit",

        RD_MATURITY: "RD Maturity",

        RD_REFUND: "RD Refund"

    };

    return labels[value] || "All Transactions";
};

    return (
        <div className="transactions-page">

            {/* PAGE HEADER */}
            <div className="transactions-page-header">
                <div>
                    <h1>Transaction History</h1>
                    <p>
                        View and manage your complete banking transactions
                    </p>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="transactions-toolbar">

                <div className="transaction-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search by type, description or reference..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                            type="button"
                        >
                            ×
                        </button>
                    )}
                </div>

               <div
    className="transaction-filter"
    ref={filterRef}
>

    <button
        type="button"
        className="transaction-filter-btn"
        onClick={() =>
            setFilterOpen((prev) => !prev)
        }
    >

        <span>
            {getTransactionFilterLabel(typeFilter)}
        </span>

        <span
            className={`filter-arrow ${
                filterOpen ? "open" : ""
            }`}
        >
            ▼
        </span>

    </button>


    {filterOpen && (

        <div className="transaction-filter-menu">

            {[
                ["ALL", "All Transactions"],
                ["DEPOSIT", "Deposit"],
                ["WITHDRAW", "Withdrawal"],
                ["TRANSFER_IN", "Transfer In"],
                ["TRANSFER_OUT", "Transfer Out"],
                ["LOAN_CREDIT", "Loan Credit"],
                ["LOAN_EMI", "Loan EMI"],
                ["FIXED_DEPOSIT", "Fixed Deposit"],
                ["FD_OPEN", "FD Open"],
                ["FD_MATURITY", "FD Maturity"],
                ["FD_REFUND", "FD Refund"],
                ["RD_OPEN", "Recurring Deposit"],
                ["RD_MATURITY", "RD Maturity"],
                ["RD_REFUND", "RD Refund"]
            ].map(([value, label]) => (

                <button
                    key={value}
                    type="button"
                    className={`transaction-filter-option ${
                        typeFilter === value
                            ? "active"
                            : ""
                    }`}
                    onClick={() => {

                        setTypeFilter(value);

                        setFilterOpen(false);

                    }}
                >

                    <span>
                        {label}
                    </span>

                    {typeFilter === value && (
                        <span className="filter-check">
                            ✓
                        </span>
                    )}

                </button>

            ))}

        </div>

    )}

</div>

            </div>

            {/* RESULT COUNT */}
            {!loading && !error && (
                <div className="transaction-result-info">
                    <span>
                        {filteredTransactions.length}
                        {" "}
                        Transaction
                        {filteredTransactions.length !== 1
                            ? "s"
                            : ""}
                        {" "}Found
                    </span>

                    {(search || typeFilter !== "ALL") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setTypeFilter("ALL");
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="transactions-content">
                    <div className="transaction-loader"></div>

                    <h3>Loading transactions...</h3>

                    <p>
                        Please wait while we fetch your
                        transaction history.
                    </p>
                </div>
            )}

            {/* ERROR */}
            {!loading && error && (
                <div className="transactions-content error-state">

                    <div className="empty-transaction-icon">
                        !
                    </div>

                    <h3>Unable to Load Transactions</h3>

                    <p>{error}</p>

                </div>
            )}

            {/* EMPTY */}
            {!loading &&
                !error &&
                filteredTransactions.length === 0 && (
                    <div className="transactions-content">

                        <div className="empty-transaction-icon">
                            ↔
                        </div>

                        <h3>No Transactions Found</h3>

                        <p>
                            {search || typeFilter !== "ALL"
                                ? "No transaction matches your current filters."
                                : "Your transaction history will appear here."
                            }
                        </p>

                        {(search || typeFilter !== "ALL") && (
                            <button
                                className="reset-filter-btn"
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setTypeFilter("ALL");
                                }}
                            >
                                Clear Filters
                            </button>
                        )}

                    </div>
                )}

            {/* TRANSACTIONS */}
            {!loading &&
                !error &&
                filteredTransactions.length > 0 && (
                    <div className="transactions-list">

                        {filteredTransactions.map(
                            (transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                    onClick={() =>
                                        setSelectedTransaction(
                                            transaction
                                        )
                                    }
                                />
                            )
                        )}

                    </div>
                )}

            {/* DETAILS MODAL */}
            <TransactionDetailsModal
                transaction={selectedTransaction}
                onClose={() =>
                    setSelectedTransaction(null)
                }
            />

        </div>
    );
}

export default Transactions;