import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import customerService from "../../services/customerService";
import "../../assets/styles/Withdraw.css";
import WithdrawConfirmModal from "../../components/customer/WithdrawConfirmModal";
import WithdrawReceiptModal from "../../components/customer/WithdrawReceiptModal";

function Withdraw() {

    const { user, updateUser } = useAuth();

    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [receiptOpen, setReceiptOpen] = useState(false);

    const [receipt, setReceipt] = useState(null);

    const availableBalance = user?.balance || 0;

    const insufficientBalance =
        Number(amount) > availableBalance;

    const handleWithdraw = async (e) => {

        e.preventDefault();

        if (!amount || Number(amount) <= 0) {

            toast.error("Enter a valid amount.");

            return;
        }

        setConfirmOpen(true);

    };

     const confirmWithdraw = async () => {

    try {

        setLoading(true);

        setConfirmOpen(false);

        const response =
            await customerService.withdraw({

                amount: Number(amount)

            });

         const profile =
         await customerService.getProfile();

         updateUser(profile.data);

         setReceipt(response.data);

         setReceiptOpen(true);

         setAmount("");

      }

    catch (error) {

        toast.error(

            error.response?.data?.message ||

            "Withdrawal failed."

        );

    }

    finally {

        setLoading(false);

    }

};

    return (

        <div className="withdraw-page">

            <div className="withdraw-card">

                <h2>

                    Cash Withdrawal

                </h2>

                <p>

                    Withdraw money securely from your account.

                </p>

                <div className="current-balance">

                    <span>

                        Available Balance

                    </span>

                    <strong>

                        ₹ {availableBalance.toLocaleString()}

                    </strong>

                </div>

                <form onSubmit={handleWithdraw}>

                    <div className="form-group">

                        <label>

                            Withdrawal Amount

                        </label>

                        <input
                            type="number"
                            min="1"
                            className={
                                insufficientBalance
                                    ? "input-error"
                                    : ""
                            }
                            value={amount}
                            onChange={(e) =>
                                setAmount(e.target.value)
                            }
                            placeholder="Enter amount"
                        />

                        {

                            insufficientBalance && (

                                <p className="balance-error">

                                    Insufficient balance.

                                </p>

                            )

                        }

                    </div>

                    <button
                        className="withdraw-btn"
                        disabled={
                            loading ||
                            !amount ||
                            insufficientBalance
                        }
                    >

                        {

                            loading

                                ?

                                "Processing..."

                                :

                                "Withdraw Money"

                        }

                    </button>

                </form>

            </div>
            
              <WithdrawConfirmModal

              open={confirmOpen}

              onClose={() => setConfirmOpen(false)}

              onConfirm={confirmWithdraw}

              amount={amount}

              balance={availableBalance}

            />

            <WithdrawReceiptModal

              open={receiptOpen}

              onClose={() => setReceiptOpen(false)}

              receipt={receipt}

            />

        </div>

    );

}

export default Withdraw;