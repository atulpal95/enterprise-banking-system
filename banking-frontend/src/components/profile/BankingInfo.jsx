import {
    FaIdCard,
    FaUniversity,
    FaMoneyBillWave,
    FaBuilding,
} from "react-icons/fa";

function BankingInfo({ profile }) {

    // Show complete account number
    const account = profile.accountNumber || "N/A";

    const BankCard = ({ icon, title, value }) => (
        <div className="bank-card">

            <div className="bank-icon">
                {icon}
            </div>

            <div className="bank-content">

                <span>{title}</span>

                <h3>{value}</h3>

            </div>

        </div>
    );

    return (

        <div className="card">

            <h2>Banking Information</h2>

            <div className="banking-grid">

                {/* CUSTOMER ID */}
                <BankCard
                    icon={<FaIdCard />}
                    title="Customer ID"
                    value={`#${profile.id}`}
                />


                {/* ACCOUNT NUMBER */}
                <BankCard
                    icon={<FaUniversity />}
                    title="Account Number"
                    value={account}
                />


                {/* IFSC CODE */}
                <BankCard
                    icon={<FaBuilding />}
                    title="IFSC Code"
                    value={profile.ifscCode || "N/A"}
                />


                {/* AVAILABLE BALANCE */}
                <BankCard
                    icon={<FaMoneyBillWave />}
                    title="Available Balance"
                    value={`₹ ${Number(
                        profile.balance || 0
                    ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                    })}`}
                />

            </div>

        </div>
    );
}

export default BankingInfo;