import {
    BsArrowLeftRight,
    BsCashStack,
    BsBank,
    BsPeople,
    BsFileText,
    BsCurrencyRupee
} from "react-icons/bs";

function QuickActions() {

    const actions = [

        {
            title: "Transfer",
            icon: <BsArrowLeftRight />,
            color: "#2563eb"
        },

        {
            title: "Deposit",
            icon: <BsCashStack />,
            color: "#16a34a"
        },

        {
            title: "Withdraw",
            icon: <BsBank />,
            color: "#dc2626"
        },

        {
            title: "Loan",
            icon: <BsCurrencyRupee />,
            color: "#f59e0b"
        },

        {
            title: "Beneficiary",
            icon: <BsPeople />,
            color: "#7c3aed"
        },

        {
            title: "Statement",
            icon: <BsFileText />,
            color: "#0891b2"
        }

    ];

    return (

        <div className="quick-actions">

            <h4 className="section-title">

                Quick Actions

            </h4>

            <div className="actions-grid">

                {actions.map((action) => (

                    <button
                        key={action.title}
                        className="action-card"
                    >

                        <div
                            className="action-icon"
                            style={{
                                background: action.color
                            }}
                        >
                            {action.icon}
                        </div>

                        <span>

                            {action.title}

                        </span>

                    </button>

                ))}

            </div>

        </div>

    );

}

export default QuickActions;