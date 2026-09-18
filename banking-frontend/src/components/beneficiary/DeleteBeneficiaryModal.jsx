import { FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";

import customerService from "../../services/customerService";

function DeleteBeneficiaryModal({

    open,

    beneficiary,

    onClose,

    onSuccess,

}) {

    const [loading, setLoading] = useState(false);

    if (!open || !beneficiary) return null;

    const handleDelete = async () => {

        try {

            setLoading(true);

            const response =
                await customerService.deleteBeneficiary(
                    beneficiary.id
                );

            toast.success(
                response.data.message
            );

            onSuccess();

            onClose();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to delete beneficiary."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="modal-overlay">

            <div className="beneficiary-modal">

                <div className="modal-header">

                    <h2>

                        Delete Beneficiary

                    </h2>

                    <button
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>

                <div
                    style={{
                        padding: "20px 0"
                    }}
                >

                    <p>

                        Are you sure you want to delete

                    </p>

                    <h3
                        style={{
                            marginTop: "12px"
                        }}
                    >

                        {beneficiary.beneficiaryName}

                    </h3>

                    <p
                        style={{
                            color: "#64748b"
                        }}
                    >

                        {beneficiary.beneficiaryEmail}

                    </p>

                </div>

                <div className="modal-footer">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="delete-btn"

                        disabled={loading}

                        onClick={handleDelete}

                    >

                        <FaTrash />

                        {

                            loading

                                ?

                                "Deleting..."

                                :

                                "Delete"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteBeneficiaryModal;