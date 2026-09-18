import { FaUniversity } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Logo() {
    return (
        <div className="compact-bank-logo">

            <div className="compact-bank-icon">
                🏦
            </div>

            <div className="compact-bank-text">

                <div className="compact-bank-name">
                    PAL Bank
                </div>

                <div className="compact-bank-subtitle">
                    Enterprise Banking
                </div>

            </div>

        </div>
    );
}

export default Logo;