import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import customerService from "../../services/customerService";
import "../../assets/styles/Deposit.css";
import DepositConfirmModal from "../../components/customer/DepositConfirmModal";
import DepositReceiptModal from "../../components/customer/DepositReceiptModal";

function Deposit() {

    const { user, updateUser } = useAuth();

    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [receiptOpen, setReceiptOpen] = useState(false);

    const [receipt, setReceipt] = useState(null);

    const availableBalance = user?.balance || 0;

    const handleDeposit = async (e) => {

    e.preventDefault();

    if (!amount || Number(amount) <= 0) {

        toast.error("Enter a valid amount.");

        return;

    }

    // Open confirmation modal only
    setConfirmOpen(true);

};

    const confirmDeposit = async () => {

    try {

        setLoading(true);

        setConfirmOpen(false);

        const response =
            await customerService.deposit({

                amount: Number(amount)

            });

        const profile =
         await customerService.getProfile();

         updateUser(profile.data);

         setReceipt(response.data);

         setReceiptOpen(true);

         setAmount("");

         setConfirmOpen(false);

       }

       catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Deposit failed."

        );

    }

    finally {

        setLoading(false);

    }

};

    return (

        <div className="deposit-page">

            <div className="deposit-card">

                <h2>

                    Cash Deposit

                </h2>

                <p>

                    Deposit money into your account securely.

                </p>

                <div className="current-balance">

                    <span>

                        Available Balance

                    </span>

                    <strong>

                        ₹ {availableBalance.toLocaleString()}

                    </strong>

                </div>

                <form onSubmit={handleDeposit}>

                    <div className="form-group">

                        <label>

                            Deposit Amount

                        </label>

                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="Enter amount"
                        />

                    </div>

                    <button
                        type="submit"
                        className="deposit-btn"

                        disabled={loading || !amount}

                    >

                        {

                            loading

                                ?

                                "Depositing..."

                                :

                                "Deposit Money"

                        }

                    </button>

                </form>

            </div>
            
            <DepositConfirmModal

            open={confirmOpen}

            onClose={() => setConfirmOpen(false)}
    
            onConfirm={confirmDeposit}

            amount={amount}

            balance={availableBalance}

           />

           <DepositReceiptModal

           open={receiptOpen}

           onClose={() => setReceiptOpen(false)}

           receipt={receipt}

          />

        </div>

    );

}

export default Deposit;