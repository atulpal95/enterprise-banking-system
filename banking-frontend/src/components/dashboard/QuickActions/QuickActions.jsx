import {
    FaExchangeAlt,
    FaMoneyBillWave,
    FaUniversity,
    FaUsers,
    FaFileInvoice,
    FaCreditCard,
    FaIdCard
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "./QuickActions.css";

const actions = [

    {
        title: "Transfer",
        icon: <FaExchangeAlt />,
        path: "/customer/transfer"
    },

    {
        title: "Deposit",
        icon: <FaMoneyBillWave />,
        path: "/customer/deposit"
    },

    {
        title: "Withdraw",
        icon: <FaUniversity />,
        path: "/customer/withdraw"
    },

    {
        title: "Statement",
        icon: <FaFileInvoice />,
        path: "/customer/statement"
    },

    {
        title: "ATM Card",
        icon: <FaCreditCard />,
        path: "/customer/atm-card"
    },

     {
        title: "KYC Verification",
        icon: <FaIdCard />,
        path: "/customer/kyc"
    }

];

function QuickActions() {

    const navigate = useNavigate();

    return (

        <section className="quick-actions">

            <h2>Quick Actions</h2>

            <div className="quick-actions-grid">

                {actions.map((action) => (

                    <div
                        key={action.title}
                        className="action-card"
                        onClick={() => navigate(action.path)}
                    >

                        <div className="action-icon">

                            {action.icon}

                        </div>

                        <span>{action.title}</span>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default QuickActions;