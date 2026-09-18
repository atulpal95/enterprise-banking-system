import { useState } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";

function AddBeneficiaryModal({

    open,

    onClose,

    onSuccess,

}) {

    const [beneficiaryEmail, setBeneficiaryEmail] =
        useState("");

    const [nickname, setNickname] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    if (!open) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = {

                beneficiaryEmail,

                nickname,

            };

            const response =
                await customerService.addBeneficiary(data);

            toast.success(
                response.data.message
            );

            setBeneficiaryEmail("");

            setNickname("");

            onSuccess();

            onClose();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to add beneficiary."

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

                        Add Beneficiary

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

                            Beneficiary Email

                        </label>

                        <input

                            type="email"

                            value={beneficiaryEmail}

                            onChange={(e)=>

                                setBeneficiaryEmail(
                                    e.target.value
                                )

                            }

                            required

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

                            placeholder="Friend"

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

                            <FaUserPlus />

                            {

                                loading

                                ?

                                "Adding..."

                                :

                                "Add Beneficiary"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddBeneficiaryModal;