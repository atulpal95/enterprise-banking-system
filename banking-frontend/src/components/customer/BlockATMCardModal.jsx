import "./BlockATMCardModal.css";

function BlockATMCardModal({

    open,

    onClose,

    onConfirm

}) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <div className="warning-icon">

                    ⚠️

                </div>

                <h2>

                    Block ATM Card

                </h2>

                <p>

                    Your ATM card will be blocked immediately.

                </p>

                <ul>

                    <li>ATM withdrawals will stop.</li>

                    <li>POS transactions will stop.</li>

                    <li>Online card payments will stop.</li>

                    <li>You can unblock it later.</li>

                </ul>

                <div className="modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                    >

                        Cancel

                    </button>

                    <button
                        className="danger-btn"
                        onClick={onConfirm}
                    >

                        Block Card

                    </button>

                </div>

            </div>

        </div>

    );

}

export default BlockATMCardModal;