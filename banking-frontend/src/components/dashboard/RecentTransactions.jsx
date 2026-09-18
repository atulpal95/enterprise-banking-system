import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import TransactionCard from "./TransactionCard";
import TransactionDetailsModal
    from "./transactions/TransactionDetailsModal";

import "../../assets/styles/RecentTransactions.css";

function RecentTransactions({
    transactions = []
}) {

    const navigate = useNavigate();

    const [
        selectedTransaction,
        setSelectedTransaction
    ] = useState(null);

    return (

        <div className="transactions-card">

            {/* HEADER */}

            <div className="transactions-header">

                <div>

                    <h3>
                        Recent Transactions
                    </h3>

                    <p className="transactions-subtitle">
                        Your latest banking activity
                    </p>

                </div>

                <button
                    className="view-all-btn"
                    type="button"
                    onClick={() =>
                        navigate("/customer/transactions")
                    }
                >

                    View All

                    <BsArrowRight />

                </button>

            </div>


            {/* TRANSACTIONS */}

            {
                transactions.length === 0

                    ?

                    (

                        <div className="empty-transactions">

                            <h4>
                                No Recent Transactions
                            </h4>

                            <p>
                                Your recent banking activity
                                will appear here.
                            </p>

                        </div>

                    )

                    :

                    (

                        <div className="transactions-list">

                            {

                                transactions.map(
                                    (transaction) => (

                                        <TransactionCard

                                            key={
                                                transaction.id
                                            }

                                            transaction={
                                                transaction
                                            }

                                            onClick={() =>
                                                setSelectedTransaction(
                                                    transaction
                                                )
                                            }

                                        />

                                    )
                                )

                            }

                        </div>

                    )
            }


            {/* TRANSACTION DETAILS MODAL */}

            <TransactionDetailsModal

                transaction={
                    selectedTransaction
                }

                onClose={() =>
                    setSelectedTransaction(null)
                }

            />

        </div>

    );
}

export default RecentTransactions;