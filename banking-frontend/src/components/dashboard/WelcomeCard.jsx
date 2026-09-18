import {
    FaExchangeAlt,
    FaMoneyBillWave,
    FaFileInvoice,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../../assets/styles/WelcomeCard.css";


function WelcomeCard({
    profile,
    account,
    showBalance,
    onToggleBalance
}) {

    const navigate = useNavigate();


    /* =========================================
       Greeting
    ========================================= */

    const greeting = () => {

        const hour = new Date().getHours();

        if (hour < 12) {
            return "Good Morning";
        }

        if (hour < 17) {
            return "Good Afternoon";
        }

        return "Good Evening";
    };


    /* =========================================
       Balance Formatting
    ========================================= */

    const formattedBalance = Number(
        account?.balance || 0
    ).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


    return (

        <section className="welcome-card">


            {/* =====================================
                LEFT SIDE
            ===================================== */}

            <div className="welcome-left">


                <h2>

                    👋 {greeting()},
                    {" "}
                    {profile?.fullName || "Customer"}

                </h2>


                <p>

                    Welcome back to PAL Bank.
                    Your finances are looking great today.

                </p>


                {/* =================================
                    Quick Navigation
                ================================= */}

                <div className="welcome-actions">


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/customer/transfer")
                        }
                    >

                        <FaExchangeAlt />

                        <span>
                            Transfer
                        </span>

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/customer/deposit")
                        }
                    >

                        <FaMoneyBillWave />

                        <span>
                            Deposit
                        </span>

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/customer/statement")
                        }
                    >

                        <FaFileInvoice />

                        <span>
                            Statement
                        </span>

                    </button>


                </div>


            </div>


            {/* =====================================
                BALANCE CARD
            ===================================== */}

            <div className="balance-card">


                <div className="balance-title">

                    <span>
                        Available Balance
                    </span>


                    <button
                        type="button"
                        className="balance-toggle"
                        onClick={onToggleBalance}
                        title={
                            showBalance
                                ? "Hide balance"
                                : "Show balance"
                        }
                        aria-label={
                            showBalance
                                ? "Hide account balance"
                                : "Show account balance"
                        }
                    >

                        {showBalance ? (
                            <FaEyeSlash />
                        ) : (
                            <FaEye />
                        )}

                    </button>


                </div>


                <h1 className="balance-amount">

                    ₹{" "}

                    {showBalance
                        ? formattedBalance
                        : "••••••••"
                    }

                </h1>


                <small>

                    {account?.accountType || "Savings"}
                    {" "}
                    Account

                </small>


            </div>


        </section>

    );
}


export default WelcomeCard;