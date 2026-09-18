import { useEffect, useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";

function EditBeneficiaryModal({

    open,

    beneficiary,

    onClose,

    onSuccess,

}) {

    const [nickname, setNickname] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (beneficiary) {

            setNickname(
                beneficiary.nickname || ""
            );

        }

    }, [beneficiary]);

    if (!open || !beneficiary) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response =
                await customerService.updateBeneficiary(

                    beneficiary.id,

                    {
                        nickname
                    }

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

                "Unable to update beneficiary."

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

                        Edit Beneficiary

                    </h2>

                    <button
                        onClick={onClose}
                    >

                        <FaTimes />

                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>

                            Beneficiary Name

                        </label>

                        <input

                            type="text"

                            value={beneficiary.beneficiaryName}

                            disabled

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Email

                        </label>

                        <input

                            type="email"

                            value={beneficiary.beneficiaryEmail}

                            disabled

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Nickname

                        </label>

                        <input

                            type="text"

                            value={nickname}

                            onChange={(e)=>

                                setNickname(
                                    e.target.value
                                )

                            }

                        />

                    </div>

                    <div className="modal-footer">

                        <button

                            type="button"

                            className="cancel-btn"

                            onClick={onClose}

                        >

                            Cancel

                        </button>

                        <button

                            type="submit"

                            className="save-btn"

                            disabled={loading}

                        >

                            <FaEdit />

                            {

                                loading

                                ?

                                "Updating..."

                                :

                                "Update"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditBeneficiaryModal;