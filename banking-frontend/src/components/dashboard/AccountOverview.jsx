import {
    BsBank,
    BsCheckCircleFill,
    BsCreditCard,
    BsShieldCheck,
    BsHash,
    BsGeoAlt
} from "react-icons/bs";

import "../../assets/styles/AccountOverview.css";

function AccountOverview({ account }) {

    const getStatusClass = (status) => {

        switch (status?.toUpperCase()) {

            case "ACTIVE":
            case "VERIFIED":
                return "success";

            case "PENDING":
                return "pending";

            case "BLOCKED":
            case "REJECTED":
            case "INACTIVE":
                return "danger";

            case "NOT_REQUESTED":
                return "neutral";

            default:
                return "neutral";
        }
    };


    const formatStatus = (status) => {

        if (!status) {
            return "N/A";
        }

        if (status === "NOT_REQUESTED") {
            return "Not Requested";
        }

        return status
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, char =>
                char.toUpperCase()
            );
    };


    return (

        <div className="account-card">

            <div className="account-card-header">

                <h3>Account Overview</h3>

                <span>Primary Account</span>

            </div>


            <div className="account-info">


                {/* ACCOUNT TYPE */}

                <div className="info-row">

                    <div className="info-left">

                        <BsBank />

                        <span>Account Type</span>

                    </div>

                    <strong>

                        {account?.accountType || "N/A"}

                    </strong>

                </div>


                {/* ACCOUNT NUMBER */}

                <div className="info-row">

                    <div className="info-left">

                        <BsHash />

                        <span>Account Number</span>

                    </div>

                    <strong>

                        {account?.accountNumber
                            ? `****${account.accountNumber.slice(-4)}`
                            : "N/A"
                        }

                    </strong>

                </div>


                {/* BRANCH */}

                <div className="info-row">

                    <div className="info-left">

                        <BsGeoAlt />

                        <span>Branch</span>

                    </div>

                    <strong>

                        {account?.branchName || "N/A"}

                    </strong>

                </div>


                {/* ATM CARD */}

                <div className="info-row">

                    <div className="info-left">

                        <BsCreditCard />

                        <span>ATM Card</span>

                    </div>

                    <span
                        className={`status-badge ${getStatusClass(
                            account?.atmCardStatus
                        )}`}
                    >

                        {formatStatus(
                            account?.atmCardStatus
                        )}

                    </span>

                </div>


                {/* KYC */}

                <div className="info-row">

                    <div className="info-left">

                        <BsShieldCheck />

                        <span>KYC Status</span>

                    </div>

                    <span
                        className={`status-badge ${getStatusClass(
                            account?.kycStatus
                        )}`}
                    >

                        {formatStatus(
                            account?.kycStatus
                        )}

                    </span>

                </div>


                {/* ACCOUNT STATUS */}

                <div className="info-row">

                    <div className="info-left">

                        <BsCheckCircleFill />

                        <span>Account Status</span>

                    </div>

                    <span
                        className={`status-badge ${
                            account?.active
                                ? "success"
                                : "danger"
                        }`}
                    >

                        {account?.active
                            ? "Active"
                            : "Inactive"
                        }

                    </span>

                </div>


            </div>

        </div>

    );
}

export default AccountOverview;