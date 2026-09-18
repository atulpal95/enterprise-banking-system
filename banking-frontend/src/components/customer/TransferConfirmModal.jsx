import "./TransferConfirmModal.css";

function TransferConfirmModal({
    open,
    onClose,
    onConfirm,
    beneficiary,
    amount,
    balance
}) {

    if (!open) return null;


    const transferAmount =
        Number(amount || 0);

    const currentBalance =
        Number(balance || 0);

    const remainingBalance =
        currentBalance - transferAmount;


    const receiverName =
        beneficiary?.beneficiaryName ||
        beneficiary?.fullName ||
        "N/A";


    const receiverAccount =
        beneficiary?.accountNumber ||
        "";


    const maskedAccount =
        receiverAccount.length > 4
            ? `XXXX XXXX ${receiverAccount.slice(-4)}`
            : receiverAccount || "N/A";


    const formatAmount = (value) =>
        Number(value).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );


    return (

        <div
            className="transfer-confirm-overlay"
            onClick={onClose}
        >

            <div
                className="confirm-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="confirm-header">

                    <div className="confirm-icon">
                        ₹
                    </div>

                    <div>
                        <h2>
                            Confirm Transfer
                        </h2>

                        <p>
                            Please review the transfer
                            details before confirming.
                        </p>
                    </div>

                </div>


                <div className="confirm-details">

                    <div className="confirm-row">

                        <span>
                            Beneficiary
                        </span>

                        <strong>
                            {receiverName}
                        </strong>

                    </div>


                    <div className="confirm-row">

                        <span>
                            Account
                        </span>

                        <strong>
                            {maskedAccount}
                        </strong>

                    </div>


                    {beneficiary?.ifscCode && (

                        <div className="confirm-row">

                            <span>
                                IFSC
                            </span>

                            <strong>
                                {beneficiary.ifscCode}
                            </strong>

                        </div>

                    )}


                    <div className="confirm-row highlight">

                        <span>
                            Transfer Amount
                        </span>

                        <strong>
                            ₹ {formatAmount(
                                transferAmount
                            )}
                        </strong>

                    </div>


                    <div className="confirm-row">

                        <span>
                            Current Balance
                        </span>

                        <strong>
                            ₹ {formatAmount(
                                currentBalance
                            )}
                        </strong>

                    </div>


                    <div className="confirm-row remaining">

                        <span>
                            Balance After Transfer
                        </span>

                        <strong>
                            ₹ {formatAmount(
                                remainingBalance
                            )}
                        </strong>

                    </div>

                </div>


                <div className="confirm-warning">

                    🔒 Please verify the recipient details
                    carefully before confirming.

                </div>


                <div className="confirm-buttons">

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="confirm-btn"
                        onClick={onConfirm}
                    >
                        Confirm Transfer
                    </button>

                </div>

            </div>

        </div>

    );

}

export default TransferConfirmModal;