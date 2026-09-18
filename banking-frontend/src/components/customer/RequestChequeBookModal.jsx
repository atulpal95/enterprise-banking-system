import { useState, useEffect } from "react";

function RequestChequeBookModal({

    open,

    onClose,

    onConfirm

}) {

    const [leaves, setLeaves] = useState(50);

    useEffect(() => {

        if (open) {

            setLeaves(50);

        }

    }, [open]);

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="confirm-modal">

                <h2>

                    Request Cheque Book

                </h2>

                <p>

                    Select the number of cheque leaves.

                </p>

                <div className="leaves-options">

                    <label>

                        <input

                            type="radio"

                            value={25}

                            checked={leaves === 25}

                            onChange={() => setLeaves(25)}

                        />

                        25 Leaves

                    </label>

                    <label>

                        <input

                            type="radio"

                            value={50}

                            checked={leaves === 50}

                            onChange={() => setLeaves(50)}

                        />

                        50 Leaves

                    </label>

                    <label>

                        <input

                            type="radio"

                            value={100}

                            checked={leaves === 100}

                            onChange={() => setLeaves(100)}

                        />

                        100 Leaves

                    </label>

                </div>

                <div className="modal-buttons">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="confirm-btn"

                        onClick={() => onConfirm(leaves)}

                    >

                        Submit Request

                    </button>

                </div>

            </div>

        </div>

    );

}

export default RequestChequeBookModal;