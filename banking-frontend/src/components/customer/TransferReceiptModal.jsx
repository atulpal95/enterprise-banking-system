import "./TransferReceiptModal.css";

import {
    FaPrint,
    FaDownload
} from "react-icons/fa";

import jsPDF from "jspdf";


function TransferReceiptModal({
    open,
    onClose,
    receipt
}) {

    if (!open || !receipt) return null;


    const formatAmount = (amount) =>
        Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    const formatDate = (date) =>
        new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );


    const maskedAccount =
        receipt.receiverAccount
            ? `**** **** ${receipt.receiverAccount.slice(-4)}`
            : "N/A";


    /* =========================
       PRINT
    ========================= */

    const handlePrint = () => {

        window.print();

    };


    /* =========================
       DOWNLOAD PDF
    ========================= */

    const downloadReceipt = () => {

        const doc = new jsPDF();


        doc.setFontSize(22);

        doc.setTextColor(
            37,
            99,
            235
        );

        doc.text(
            "PAL Bank",
            105,
            20,
            {
                align: "center"
            }
        );


        doc.setFontSize(16);

        doc.setTextColor(
            0,
            0,
            0
        );

        doc.text(
            "Transfer Receipt",
            105,
            30,
            {
                align: "center"
            }
        );


        doc.line(
            30,
            36,
            180,
            36
        );


        doc.setFontSize(12);

        let y = 50;


        doc.text(
            "Status : Successful",
            30,
            y
        );

        y += 12;


        doc.text(
            "Reference : " +
                receipt.reference,
            30,
            y
        );

        y += 12;


        doc.text(
            "Receiver : " +
                receipt.receiverName,
            30,
            y
        );

        y += 12;


        doc.text(
            "Account : " +
                maskedAccount,
            30,
            y
        );

        y += 12;


        doc.text(
            "Amount : Rs. " +
                formatAmount(receipt.amount),
            30,
            y
        );

        y += 12;


        doc.text(
            "Remaining Balance : Rs. " +
                formatAmount(
                    receipt.senderBalance
                ),
            30,
            y
        );

        y += 12;


        doc.text(
            "Date : " +
                formatDate(
                    receipt.transactionTime
                ),
            30,
            y
        );


        y += 25;


        doc.line(
            30,
            y,
            180,
            y
        );


        y += 12;


        doc.setFontSize(11);

        doc.setTextColor(
            120,
            120,
            120
        );


        doc.text(
            "Thank you for banking with PAL Bank.",
            105,
            y,
            {
                align: "center"
            }
        );


        y += 8;


        doc.text(
            "This is a computer-generated receipt.",
            105,
            y,
            {
                align: "center"
            }
        );


        doc.save(
            `PALBANK_Transfer_${receipt.reference}.pdf`
        );

    };


    return (

        <div
            className="transfer-receipt-overlay"
            onClick={onClose}
        >

            <div
                className="receipt-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="receipt-header">

                    <div className="bank-logo">
                        🏦
                    </div>

                    <h3 className="bank-name">
                        PAL Bank
                    </h3>

                    <p className="bank-tagline">
                        Enterprise Banking
                    </p>


                    <div className="success-icon">
                        ✓
                    </div>


                    <h2>
                        Transfer Successful
                    </h2>

                    <p className="receipt-title">
                        Transfer Receipt
                    </p>

                </div>


                <div className="receipt-details">

                    <div className="receipt-row">

                        <span>
                            Reference
                        </span>

                        <strong>
                            {receipt.reference}
                        </strong>

                    </div>


                    <div className="receipt-row">

                        <span>
                            Receiver
                        </span>

                        <strong>
                            {receipt.receiverName}
                        </strong>

                    </div>


                    <div className="receipt-row">

                        <span>
                            Account
                        </span>

                        <strong>
                            {maskedAccount}
                        </strong>

                    </div>


                    <div className="receipt-row">

                        <span>
                            Amount
                        </span>

                        <strong className="amount-success">
                            ₹{" "}
                            {formatAmount(
                                receipt.amount
                            )}
                        </strong>

                    </div>


                    <div className="receipt-row">

                        <span>
                            Balance
                        </span>

                        <strong>
                            ₹{" "}
                            {formatAmount(
                                receipt.senderBalance
                            )}
                        </strong>

                    </div>


                    <div className="receipt-row">

                        <span>
                            Date
                        </span>

                        <strong>
                            {
                                formatDate(
                                    receipt.transactionTime
                                )
                            }
                        </strong>

                    </div>


                    <div className="receipt-status">
                        ✓ Transfer Completed Successfully
                    </div>

                </div>


                <div className="receipt-buttons">

                    <button
                        className="print-btn"
                        onClick={handlePrint}
                    >
                        <FaPrint />

                        Print
                    </button>


                    <button
                        className="download-btn"
                        onClick={downloadReceipt}
                    >
                        <FaDownload />

                        PDF
                    </button>

                </div>


                <button
                    className="done-btn"
                    onClick={onClose}
                >
                    Done
                </button>

            </div>

        </div>

    );

}

export default TransferReceiptModal;