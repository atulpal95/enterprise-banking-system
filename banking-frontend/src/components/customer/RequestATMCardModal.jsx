
function RequestATMCardModal({

    open,

    onClose,

    onConfirm

}) {

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <h2>

                    Request ATM Card

                </h2>

                <p>

                    Are you sure you want to request a new ATM Card?

                </p>

                <div className="modal-buttons">

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

                        Request

                    </button>

                </div>

            </div>

        </div>

    );

}

export default RequestATMCardModal;