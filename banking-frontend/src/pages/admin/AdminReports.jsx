import { useState } from "react";
import {
    downloadCustomerExcel,
    downloadCustomerPdf,
    downloadLoanExcel,
    downloadFixedDepositExcel,
    downloadFixedDepositPdf,
    downloadRecurringDepositExcel,
    downloadRecurringDepositPdf,
    downloadTransactionExcel,
    downloadTransactionPdf,
} from "../../api/adminApi";

import "../../assets/styles/AdminReports.css";

function AdminReports() {

    const [loadingReport, setLoadingReport] = useState("");

    // =====================================================
    // GENERIC FILE DOWNLOAD
    // =====================================================

    const downloadFile = async (
        apiFunction,
        fileName,
        reportKey
    ) => {

        try {

            setLoadingReport(reportKey);

            const response = await apiFunction();

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers?.["content-type"] ||
                        "application/octet-stream",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                `Report download failed: ${fileName}`,
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to download report. Please try again."
            );

        } finally {

            setLoadingReport("");

        }
    };


    // =====================================================
    // REPORT CONFIGURATION
    // =====================================================

    const reports = [

        {
            id: "customers",
            icon: "👥",
            title: "Customer Report",
            description:
                "Customer accounts, contact details, account status and balances.",
            color: "blue",

            actions: [

                {
                    key: "customer-pdf",
                    label: "PDF",
                    type: "pdf",

                    action: () =>
                        downloadFile(
                            downloadCustomerPdf,
                            "customer_report.pdf",
                            "customer-pdf"
                        ),
                },

                {
                    key: "customer-excel",
                    label: "Excel",
                    type: "excel",

                    action: () =>
                        downloadFile(
                            downloadCustomerExcel,
                            "customer_report.xlsx",
                            "customer-excel"
                        ),
                },

            ],
        },


        {
            id: "transactions",
            icon: "💳",
            title: "Transaction Report",
            description:
                "Complete banking transaction records including type, amount and balance.",
            color: "purple",

            actions: [

                {
                    key: "transaction-pdf",
                    label: "PDF",
                    type: "pdf",

                    action: () =>
                        downloadFile(
                            downloadTransactionPdf,
                            "transaction_report.pdf",
                            "transaction-pdf"
                        ),
                },

                {
                    key: "transaction-excel",
                    label: "Excel",
                    type: "excel",

                    action: () =>
                        downloadFile(
                            downloadTransactionExcel,
                            "transaction_report.xlsx",
                            "transaction-excel"
                        ),
                },

            ],
        },


        {
            id: "fixed-deposits",
            icon: "🏦",
            title: "Fixed Deposit Report",
            description:
                "Fixed deposit principal, interest rate, tenure, maturity and status.",
            color: "green",

            actions: [

                {
                    key: "fd-pdf",
                    label: "PDF",
                    type: "pdf",

                    action: () =>
                        downloadFile(
                            downloadFixedDepositPdf,
                            "fixed_deposit_report.pdf",
                            "fd-pdf"
                        ),
                },

                {
                    key: "fd-excel",
                    label: "Excel",
                    type: "excel",

                    action: () =>
                        downloadFile(
                            downloadFixedDepositExcel,
                            "fixed_deposit_report.xlsx",
                            "fd-excel"
                        ),
                },

            ],
        },


        {
            id: "recurring-deposits",
            icon: "🔄",
            title: "Recurring Deposit Report",
            description:
                "Recurring deposit installments, interest, maturity amount and status.",
            color: "orange",

            actions: [

                {
                    key: "rd-pdf",
                    label: "PDF",
                    type: "pdf",

                    action: () =>
                        downloadFile(
                            downloadRecurringDepositPdf,
                            "recurring_deposit_report.pdf",
                            "rd-pdf"
                        ),
                },

                {
                    key: "rd-excel",
                    label: "Excel",
                    type: "excel",

                    action: () =>
                        downloadFile(
                            downloadRecurringDepositExcel,
                            "recurring_deposit_report.xlsx",
                            "rd-excel"
                        ),
                },

            ],
        },


        {
            id: "loans",
            icon: "💰",
            title: "Loan Report",
            description:
                "Loan amount, interest rate, tenure, EMI, status and application details.",
            color: "red",

            actions: [

                {
                    key: "loan-excel",
                    label: "Excel",
                    type: "excel",

                    action: () =>
                        downloadFile(
                            downloadLoanExcel,
                            "loan_report.xlsx",
                            "loan-excel"
                        ),
                },

            ],
        },

    ];


    return (

        <div className="admin-reports-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="admin-reports-header">

                <div>

                    <div className="admin-reports-eyebrow">
                        REPORTS
                    </div>

                    <h1>
                        Reports
                    </h1>

                    <p>
                        Generate, download and manage banking reports.
                    </p>

                </div>

            </div>


            {/* =================================================
                REPORT SUMMARY
            ================================================= */}

            <div className="reports-summary">

                <div className="summary-card">

                    <div className="summary-icon">
                        📊
                    </div>

                    <div>

                        <span>
                            Available Reports
                        </span>

                        <strong>
                            5
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">
                        📄
                    </div>

                    <div>

                        <span>
                            PDF Reports
                        </span>

                        <strong>
                            4
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">
                        📗
                    </div>

                    <div>

                        <span>
                            Excel Reports
                        </span>

                        <strong>
                            5
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                REPORT CARDS
            ================================================= */}

            <div className="reports-section">

                <div className="reports-section-header">

                    <div>

                        <h2>
                            Banking Reports
                        </h2>

                        <p>
                            Download detailed reports in PDF or Excel format.
                        </p>

                    </div>

                </div>


                <div className="reports-grid">

                    {reports.map((report) => (

                        <div
                            className={`report-card ${report.color}`}
                            key={report.id}
                        >

                            {/* Card Header */}

                            <div className="report-card-top">

                                <div
                                    className={`report-icon ${report.color}`}
                                >
                                    {report.icon}
                                </div>

                                <span className="report-type">
                                    REPORT
                                </span>

                            </div>


                            {/* Card Content */}

                            <div className="report-card-content">

                                <h3>
                                    {report.title}
                                </h3>

                                <p>
                                    {report.description}
                                </p>

                            </div>


                            {/* Card Actions */}

                            <div className="report-actions">

                                {report.actions.map((action) => {

                                    const isLoading =
                                        loadingReport === action.key;

                                    return (

                                        <button
                                            key={action.key}
                                            className={`report-download-btn ${action.type}`}
                                            onClick={action.action}
                                            disabled={
                                                loadingReport !== "" &&
                                                !isLoading
                                            }
                                        >

                                            {isLoading ? (

                                                <>
                                                    <span className="report-spinner">
                                                    </span>

                                                    Downloading...
                                                </>

                                            ) : (

                                                <>

                                                    <span>
                                                        {action.type === "pdf"
                                                            ? "↓ PDF"
                                                            : "↓ Excel"}
                                                    </span>

                                                </>

                                            )}

                                        </button>

                                    );

                                })}

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* =================================================
                INFORMATION CARD
            ================================================= */}

            <div className="reports-info-card">

                <div className="reports-info-icon">
                    ℹ
                </div>

                <div>

                    <h3>
                        Report Information
                    </h3>

                    <p>
                        Reports are generated using the latest banking
                        data available in the system. PDF reports are
                        suitable for viewing and printing, while Excel
                        reports can be used for further analysis.
                    </p>

                </div>

            </div>

        </div>

    );
}

export default AdminReports;