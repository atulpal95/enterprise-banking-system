import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";
import { useAuth } from "../../context/AuthContext";

import "../../assets/styles/Transfer.css";

import TransferConfirmModal from "../../components/customer/TransferConfirmModal";
import TransferReceiptModal from "../../components/customer/TransferReceiptModal";

function Transfer() {

    const [beneficiaries, setBeneficiaries] = useState([]);
    const [selectedData, setSelectedData] = useState(null);

    const { user, updateUser } = useAuth();

    const availableBalance = Number(user?.balance || 0);

    const [transferMode, setTransferMode] =
        useState("beneficiary");

    const [accountNumber, setAccountNumber] =
        useState("");

    const [ifscCode, setIfscCode] =
        useState("");

    const [verifiedAccount, setVerifiedAccount] =
        useState(null);

    const [verifying, setVerifying] =
        useState(false);

    const [amount, setAmount] =
        useState("");

    const [confirmOpen, setConfirmOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [selectedBeneficiary, setSelectedBeneficiary] =
        useState("");

    const [receiptOpen, setReceiptOpen] =
        useState(false);

    const [receiptData, setReceiptData] =
        useState(null);


    const insufficientBalance =
        Number(amount) > availableBalance;


    /* =========================
       LOAD BENEFICIARIES
    ========================= */

    const loadBeneficiaries = async () => {

        try {

            const response =
                await customerService.getBeneficiaries();

            setBeneficiaries(response.data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to load beneficiaries."
            );

        }

    };


    useEffect(() => {

        loadBeneficiaries();

    }, []);


    /* =========================
       VERIFY NEW ACCOUNT
    ========================= */

    const verifyAccount = async () => {

        if (!accountNumber || !ifscCode) {

            toast.error(
                "Enter Account Number and IFSC Code."
            );

            return;
        }

        try {

            setVerifying(true);

            const response =
                await customerService.verifyAccount({

                    accountNumber,

                    ifscCode

                });

            setVerifiedAccount(response.data);

            toast.success(
                "Account Verified Successfully."
            );

        } catch (error) {

            setVerifiedAccount(null);

            toast.error(

                error.response?.data?.message ||

                "Account not found."

            );

        } finally {

            setVerifying(false);

        }

    };


    /* =========================
       CHANGE TRANSFER MODE
    ========================= */

    const handleModeChange = (mode) => {

        setTransferMode(mode);

        setSelectedBeneficiary("");
        setSelectedData(null);

        setAccountNumber("");
        setIfscCode("");
        setVerifiedAccount(null);

    };


    /* =========================
       OPEN CONFIRMATION
    ========================= */

    const handleTransfer = (e) => {

        e.preventDefault();

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            toast.error(
                "Enter a valid amount."
            );

            return;
        }

        if (insufficientBalance) {

            toast.error(
                "Insufficient balance."
            );

            return;
        }


        if (transferMode === "beneficiary") {

            if (!selectedBeneficiary) {

                toast.error(
                    "Please select a beneficiary."
                );

                return;
            }

        } else {

            if (!verifiedAccount) {

                toast.error(
                    "Please verify the account first."
                );

                return;
            }

        }


        setConfirmOpen(true);

    };


    /* =========================
       CONFIRM TRANSFER
    ========================= */

    const confirmTransfer = async () => {

        try {

            setLoading(true);

            setConfirmOpen(false);

            let response;


            if (transferMode === "beneficiary") {

                response =
                    await customerService.transferToBeneficiary({

                        beneficiaryId:
                            Number(selectedBeneficiary),

                        amount:
                            Number(amount)

                    });

            } else {

                response =
                    await customerService.transfer({

                        accountNumber,

                        ifscCode,

                        amount:
                            Number(amount)

                    });

            }


            toast.success(
                response.data.message
            );


            /* =========================
               RECEIPT
            ========================= */

            setReceiptData(
                response.data
            );

            setReceiptOpen(true);


            /* =========================
               REFRESH USER BALANCE
            ========================= */

            const profile =
                await customerService.getProfile();

            updateUser(profile.data);


            /* =========================
               RESET FORM
            ========================= */

            setAmount("");

            setSelectedBeneficiary("");

            setSelectedData(null);

            setVerifiedAccount(null);

            setAccountNumber("");

            setIfscCode("");


        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Transfer failed."

            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="transfer-page">

            <div className="transfer-card">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="transfer-header">

                    <span className="transfer-label">
                        SECURE BANKING
                    </span>

                    <h2>
                        Money Transfer
                    </h2>

                    <p>
                        Transfer money securely to your
                        beneficiaries or another bank account.
                    </p>

                </div>


                {/* =========================
                    TRANSFER MODE
                ========================= */}

                <div className="transfer-mode">

                    <label
                        className={
                            transferMode === "beneficiary"
                                ? "mode-option active"
                                : "mode-option"
                        }
                    >

                        <input
                            type="radio"
                            value="beneficiary"
                            checked={
                                transferMode === "beneficiary"
                            }
                            onChange={() =>
                                handleModeChange(
                                    "beneficiary"
                                )
                            }
                        />

                        <span>
                            Existing Beneficiary
                        </span>

                    </label>


                    <label
                        className={
                            transferMode === "new"
                                ? "mode-option active"
                                : "mode-option"
                        }
                    >

                        <input
                            type="radio"
                            value="new"
                            checked={
                                transferMode === "new"
                            }
                            onChange={() =>
                                handleModeChange("new")
                            }
                        />

                        <span>
                            New Account
                        </span>

                    </label>

                </div>


                <form onSubmit={handleTransfer}>


                    {/* =========================
                        NEW ACCOUNT
                    ========================= */}

                    {transferMode === "new" && (

                        <div className="verify-account-card">

                            <div className="section-heading">

                                <h3>
                                    Account Verification
                                </h3>

                                <p>
                                    Verify the recipient account
                                    before making the transfer.
                                </p>

                            </div>


                            <div className="form-group">

                                <label>
                                    Account Number
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Enter account number"
                                    value={accountNumber}
                                    onChange={(e) =>
                                        setAccountNumber(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    IFSC Code
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. SBIN0001234"
                                    value={ifscCode}
                                    maxLength={11}
                                    onChange={(e) =>
                                        setIfscCode(
                                            e.target.value
                                                .toUpperCase()
                                                .replace(
                                                    /\s/g,
                                                    ""
                                                )
                                        )
                                    }
                                />

                            </div>


                            <button
                                type="button"
                                className="verify-btn"
                                onClick={verifyAccount}
                                disabled={verifying}
                            >

                                {verifying
                                    ? "Verifying..."
                                    : "Verify Account"
                                }

                            </button>


                            {verifiedAccount && (

                                <div className="verified-card">

                                    <div className="verified-title">
                                        <span className="verified-check">
                                            ✓
                                        </span>

                                        <h4>
                                            Account Verified
                                        </h4>
                                    </div>


                                    <div className="verified-info">

                                        <div>
                                            <span>
                                                Name
                                            </span>

                                            <strong>
                                                {
                                                    verifiedAccount.fullName
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Account
                                            </span>

                                            <strong>
                                                {
                                                    verifiedAccount.accountNumber
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                IFSC
                                            </span>

                                            <strong>
                                                {
                                                    verifiedAccount.ifscCode
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =========================
                        BENEFICIARY
                    ========================= */}

                    {transferMode === "beneficiary" && (

                        <div className="form-group beneficiary-group">

                            <label>
                                Select Beneficiary
                            </label>

                            <select
                                value={selectedBeneficiary}
                                onChange={(e) => {

                                    const id =
                                        Number(e.target.value);

                                    setSelectedBeneficiary(
                                        e.target.value
                                    );

                                    const beneficiary =
                                        beneficiaries.find(
                                            item =>
                                                item.id === id
                                        );

                                    setSelectedData(
                                        beneficiary || null
                                    );

                                }}
                            >

                                <option value="">
                                    -- Select Beneficiary --
                                </option>

                                {beneficiaries.map(
                                    (item) => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {
                                                item.beneficiaryName
                                            }

                                            {" - "}

                                            {
                                                item.accountNumber
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            {selectedData && (

                                <div className="beneficiary-info">

                                    <div className="info-header">

                                        <h4>
                                            Selected Beneficiary
                                        </h4>

                                        <span>
                                            Verified
                                        </span>

                                    </div>


                                    <div className="beneficiary-details">

                                        <div>
                                            <span>
                                                Name
                                            </span>

                                            <strong>
                                                {
                                                    selectedData.beneficiaryName
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Email
                                            </span>

                                            <strong>
                                                {
                                                    selectedData.beneficiaryEmail
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Account
                                            </span>

                                            <strong>
                                                {
                                                    selectedData.accountNumber
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                IFSC
                                            </span>

                                            <strong>
                                                {
                                                    selectedData.ifscCode
                                                }
                                            </strong>
                                        </div>


                                        <div>
                                            <span>
                                                Nickname
                                            </span>

                                            <strong>
                                                {
                                                    selectedData.nickname ||
                                                    "-"
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>

                    )}


                    {/* =========================
                        BALANCE
                    ========================= */}

                    <div className="current-balance">

                        <div>

                            <span>
                                Available Balance
                            </span>

                            <small>
                                Your current account balance
                            </small>

                        </div>

                        <strong>
                            ₹{" "}
                            {availableBalance.toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </strong>

                    </div>


                    {/* =========================
                        AMOUNT
                    ========================= */}

                    <div className="form-group">

                        <label>
                            Transfer Amount
                        </label>

                        <div className="amount-input-wrapper">

                            <span>
                                ₹
                            </span>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                className={
                                    insufficientBalance
                                        ? "input-error"
                                        : ""
                                }
                                value={amount}
                                onChange={(e) =>
                                    setAmount(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter amount"
                            />

                        </div>


                        {insufficientBalance && (

                            <p className="balance-error">
                                Insufficient balance.
                            </p>

                        )}

                    </div>


                    {/* =========================
                        TRANSFER BUTTON
                    ========================= */}

                    <button
                        type="submit"
                        className="transfer-btn"
                        disabled={
                            loading ||
                            insufficientBalance ||
                            !amount ||
                            Number(amount) <= 0 ||
                            (
                                transferMode === "beneficiary"
                                    ? !selectedBeneficiary
                                    : !verifiedAccount
                            )
                        }
                    >

                        {loading
                            ? "Transferring..."
                            : "Continue to Transfer"
                        }

                        {!loading && (
                            <span>
                                →
                            </span>
                        )}

                    </button>


                    <div className="secure-note">
                        🔒 Your transfer is protected by secure
                        banking authentication.
                    </div>

                </form>

            </div>


            {/* =========================
                CONFIRM MODAL
            ========================= */}

            <TransferConfirmModal
                open={confirmOpen}
                onClose={() =>
                    setConfirmOpen(false)
                }
                onConfirm={confirmTransfer}
                beneficiary={
                    transferMode === "beneficiary"
                        ? selectedData
                        : verifiedAccount
                }
                amount={amount}
                balance={availableBalance}
            />


            {/* =========================
                RECEIPT MODAL
            ========================= */}

            <TransferReceiptModal
                open={receiptOpen}
                receipt={receiptData}
                onClose={() =>
                    setReceiptOpen(false)
                }
            />

        </div>

    );

}

export default Transfer;