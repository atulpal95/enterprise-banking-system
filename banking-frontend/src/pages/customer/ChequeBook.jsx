import { useEffect, useState } from "react";
import "../../assets/styles/ChequeBook.css";

import customerService from "../../services/customerService";
import { toast } from "react-toastify";
import RequestChequeBookModal from "../../components/customer/RequestChequeBookModal";

function ChequeBook() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [requestOpen, setRequestOpen] = useState(false);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await customerService.getChequeBookHistory();
            setHistory(response.data);
        } catch (error) {
            console.error("Failed to load cheque book history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (numberOfLeaves) => {
        try {
            setRequesting(true);

            await customerService.requestChequeBook({
                numberOfLeaves,
            });

            toast.success("Cheque Book Requested Successfully.");

            setRequestOpen(false);
            await loadHistory();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to request cheque book."
            );
        } finally {
            setRequesting(false);
        }
    };

    // =====================================================
    // FIND LATEST CHEQUE BOOK REQUEST
    // =====================================================

    const latest =
        history.length > 0
            ? [...history].sort((a, b) => {
                  const dateA = new Date(
                      a.requestDate || 0
                  ).getTime();

                  const dateB = new Date(
                      b.requestDate || 0
                  ).getTime();

                  return dateB - dateA;
              })[0]
            : null;

    // =====================================================
    // REQUEST BUTTON STATE
    // =====================================================

    const isRequestDisabled =
        requesting ||
        latest?.status === "REQUESTED" ||
        latest?.status === "APPROVED" ||
        latest?.status === "DISPATCHED";

    const getButtonText = () => {
        if (requesting) return "Requesting...";

        if (latest?.status === "REQUESTED") {
            return "Already Requested";
        }

        if (latest?.status === "APPROVED") {
            return "Approved";
        }

        if (latest?.status === "DISPATCHED") {
            return "Dispatched";
        }

        return "Request Cheque Book";
    };

    // =====================================================
    // BLUE CHEQUE CARD LEAVES
    // =====================================================

    const displayedLeaves = latest?.numberOfLeaves || 50;

    return (
        <div className="cheque-page">

            {/* =================================================
                TOP SECTION
            ================================================= */}

            <div className="cheque-top">

                {/* =================================================
                    CHEQUE BOOK CARD
                ================================================= */}

                <div className="cheque-illustration">

                    <div className="cheque-card">

                        <div className="cheque-header">

                            <div className="cheque-bank-info">

                                <h2>
                                    PAL BANK
                                </h2>

                                <span>
                                    Enterprise Banking
                                </span>

                            </div>

                            <h3>
                                Cheque Book
                            </h3>

                        </div>

                        <div className="cheque-body">

                            <div className="cheque-icon">
                                🏦
                            </div>

                            {/* =====================================
                                DYNAMIC LEAVES
                            ===================================== */}

                            <h1>
                                {displayedLeaves} Leaves
                            </h1>

                            <p>
                                Personalized Cheque Book
                            </p>

                        </div>

                        <div className="cheque-footer">

                            <div>

                                <small>
                                    Account Holder
                                </small>

                                <h4>
                                    Customer
                                </h4>

                            </div>

                            <div>

    <small>
        Status
    </small>

    <h4>
        {latest?.status
            ? latest.status.charAt(0) +
              latest.status.slice(1).toLowerCase()
            : "Ready to Request"}
    </h4>

</div>
                        </div>

                    </div>

                </div>

                {/* =================================================
                    CURRENT REQUEST
                ================================================= */}

                <div className="cheque-status-card">

                    <h2>
                        Current Request
                    </h2>

                    <div className="status-row">

                        <span>
                            Status
                        </span>

                        <strong
                            className={
                                latest
                                    ? `status-badge ${latest.status.toLowerCase()}`
                                    : ""
                            }
                        >
                            {latest?.status || "--"}
                        </strong>

                    </div>

                    <div className="status-row">

                        <span>
                            Leaves
                        </span>

                        <strong>
                            {latest?.numberOfLeaves || "--"}
                        </strong>

                    </div>

                    <div className="status-row">

                        <span>
                            Requested On
                        </span>

                        <strong>
                            {latest?.requestDate
                                ? latest.requestDate.substring(0, 10)
                                : "--"}
                        </strong>

                    </div>

                    <button
                        type="button"
                        className="request-btn"
                        onClick={() => setRequestOpen(true)}
                        disabled={isRequestDisabled}
                    >
                        {getButtonText()}
                    </button>

                </div>

            </div>

            {/* =================================================
                REQUEST HISTORY
            ================================================= */}

            <div className="history-card">

                <h2>
                    Request History
                </h2>

                <div className="history-table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Leaves
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td colSpan="3">
                                        Loading...
                                    </td>

                                </tr>

                            ) : history.length === 0 ? (

                                <tr>

                                    <td colSpan="3">
                                        No Requests Found
                                    </td>

                                </tr>

                            ) : (

                                history.map((item) => (

                                    <tr key={item.id}>

                                        <td>

                                            {item.requestDate
                                                ? item.requestDate.substring(
                                                      0,
                                                      10
                                                  )
                                                : "--"}

                                        </td>

                                        <td>
                                            {item.numberOfLeaves}
                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge ${item.status.toLowerCase()}`}
                                            >
                                                {item.status}
                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* =================================================
                REQUEST MODAL
            ================================================= */}

            <RequestChequeBookModal
                open={requestOpen}
                onClose={() => setRequestOpen(false)}
                onConfirm={handleRequest}
            />

        </div>
    );
}

export default ChequeBook;