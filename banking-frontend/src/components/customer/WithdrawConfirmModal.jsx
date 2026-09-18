import "./WithdrawConfirmModal.css";

function WithdrawConfirmModal({

    open,
    onClose,
    onConfirm,
    amount,
    balance

}) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <h2>

                    Confirm Deposit

                </h2>

                <div className="confirm-row">

                    <span>Withdrawal Amount</span>

                    <strong>

                        ₹ {Number(amount).toLocaleString()}

                    </strong>

                </div>

                <div className="confirm-row">

                    <span>Current Balance</span>

                    <strong>

                        ₹ {balance.toLocaleString()}

                    </strong>

                </div>

                <div className="confirm-row">

                    <span>Balance After Withdrawal</span>

                    <strong>

                        ₹ {(balance - Number(amount)).toLocaleString()}

                    </strong>

                </div>

                <div className="confirm-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-btn"
                        onClick={onConfirm}
                    >
                        Confirm Withdrawal
                    </button>

                </div>

            </div>

        </div>

    );

}

export default WithdrawConfirmModal;