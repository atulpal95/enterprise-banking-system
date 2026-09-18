import "./BlockATMCardModal.css";

function UnblockATMCardModal({

    open,

    onClose,

    onConfirm

}) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <div className="confirm-icon">

                    🔓

                </div>

                <h2>

                    Unblock ATM Card?

                </h2>

                <p>

                    Your ATM Card will become active again and can be used for transactions.

                </p>

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

                        Unblock Card

                    </button>

                </div>

            </div>

        </div>

    );

}

export default UnblockATMCardModal;