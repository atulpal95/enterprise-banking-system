import {
    FaUserCircle,
    FaEnvelope,
    FaUniversity,
    FaHashtag,
    FaEdit,
    FaTrash
} from "react-icons/fa";

function BeneficiaryCard({
    beneficiary,
    onEdit,
    onDelete
}) {

    const account =
        beneficiary.accountNumber
            ? `XXXX${beneficiary.accountNumber.slice(-4)}`
            : "N/A";

    return (

        <div className="beneficiary-card">

            <div className="beneficiary-top">

                <FaUserCircle className="beneficiary-avatar" />

                <div>

                    <h3>
                        {beneficiary.beneficiaryName}
                    </h3>

                    <span className="nickname">

                        {beneficiary.nickname || "No Nickname"}

                    </span>

                </div>

            </div>

            <div className="beneficiary-body">

                <p>

                    <FaEnvelope />

                    {beneficiary.beneficiaryEmail}

                </p>

                <p>

                    <FaUniversity />

                    {account}

                </p>

                <p>

                    <FaHashtag />

                    {beneficiary.ifscCode}

                </p>

            </div>

            <div className="beneficiary-actions">

                <button
                    className="edit-btn"
                    onClick={onEdit}
                >

                    <FaEdit />

                    Edit

                </button>

                <button
                    className="delete-btn"
                    onClick={onDelete}
                >

                    <FaTrash />

                    Delete

                </button>

            </div>

        </div>

    );

}

export default BeneficiaryCard;