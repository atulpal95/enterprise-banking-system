import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";

import "../../assets/styles/ATMCard.css";

import RequestATMCardModal from "../../components/customer/RequestATMCardModal";
import BlockATMCardModal from "../../components/customer/BlockATMCardModal";
import UnblockATMCardModal from "../../components/customer/UnblockATMCardModal";

function ATMCard() {

    const [card, setCard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [noCard, setNoCard] = useState(false);

    const [showCardNumber, setShowCardNumber] = useState(false);

    const [showCVV, setShowCVV] = useState(false);

    const [requestOpen, setRequestOpen] = useState(false);

    const [blockOpen, setBlockOpen] = useState(false);

    const [unblockOpen, setUnblockOpen] = useState(false);

    const [actionLoading, setActionLoading] = useState(false);

    const [oldPin, setOldPin] = useState("");

    const [newPin, setNewPin] = useState("");

    const [confirmPin, setConfirmPin] = useState("");

    const [changingPin, setChangingPin] = useState(false);

    useEffect(() => {

        loadATMCard();

    }, []);

    const loadATMCard = async () => {

        try {

            setLoading(true);

            const response = await customerService.getATMCard();

            setCard(response.data);

            setNoCard(false);

        }

        catch (error) {

            if (
                error.response &&
                error.response.data &&
                (
                    error.response.data.message === "ATM Card not found." ||
                    error.response.data.message === "ATM Card request not found."
                )
            ) {

                setNoCard(true);

            }

            else {

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load ATM Card."
                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    const handleRequestATMCard = async () => {

        try {

            setActionLoading(true);

            await customerService.requestATMCard();

            toast.success("ATM Card request submitted successfully.");

            setRequestOpen(false);

            loadATMCard();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to request ATM Card."

            );

        }

        finally {

            setActionLoading(false);

        }

    };

    const handleBlockCard = async () => {

        try {

            setActionLoading(true);

            await customerService.blockATMCard();

            toast.success("ATM Card blocked successfully.");

            setBlockOpen(false);

            loadATMCard();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to block ATM Card."

            );

        }

        finally {

            setActionLoading(false);

        }

    };

    const handleUnblockCard = async () => {

        try {

            setActionLoading(true);

            await customerService.unblockATMCard();

            toast.success("ATM Card unblocked successfully.");

            setUnblockOpen(false);

            loadATMCard();

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to unblock ATM Card."

            );

        }

        finally {

            setActionLoading(false);

        }

    };

    const handleChangePin = async () => {

        if (!oldPin || !newPin || !confirmPin) {

            toast.error("Please fill all fields.");

            return;

        }

        if (newPin !== confirmPin) {

            toast.error("PIN does not match.");

            return;

        }

        try {

            setChangingPin(true);

            await customerService.changeATMPin({

                oldPin,

                newPin

            });

            toast.success("ATM PIN changed successfully.");

            setOldPin("");

            setNewPin("");

            setConfirmPin("");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Unable to change PIN."

            );

        }

        finally {

            setChangingPin(false);

        }

    };

    if (loading) {

        return <h2>Loading ATM Card...</h2>;

    }

    return (
<div className="atm-page">

    {/* ---------------- NO CARD ---------------- */}

    {noCard ? (

        <>

            <div className="atm-request-page">

                <div className="no-card">

                    <div className="no-card-icon">

                        💳

                    </div>

                    <h2>

                        No ATM Card

                    </h2>

                    <p>

                        You haven't requested an ATM Card yet.

                    </p>

                    <button

                        className="request-btn"

                        onClick={() => setRequestOpen(true)}

                    >

                        Request ATM Card

                    </button>

                </div>

            </div>

            <RequestATMCardModal

                open={requestOpen}

                onClose={() => setRequestOpen(false)}

                onConfirm={handleRequestATMCard}

            />

        </>

    ) : (

        <>

            <div className="atm-card-page">

                {/* LEFT */}

                <div className="left-section">

                <div className="virtual-card">
                    <div className="shine"></div>

    <div className="card-bg-circle one"></div>
    <div className="card-bg-circle two"></div>

    <div className="card-header">

        <div>

            <h2 className="bank-title">
                PAL BANK
            </h2>

            <span className="bank-subtitle">
                Enterprise Banking
            </span>

        </div>

        <div className="card-brand">
            RuPay
        </div>

    </div>

    <div className="card-middle">

        <div className="chip"></div>

        <div className="wifi">
            )))
        </div>

    </div>

    <div className="card-number">

    {

        card.status === "PENDING"

        ?

        <>

            <div className="pending-title">

                CARD PENDING

            </div>

            <div className="pending-subtitle">

                Waiting for Admin Approval

            </div>

        </>

        :

        (

            showCardNumber

            ?

            card.cardNumber.replace(/(.{4})/g, "$1 ")

            :

            `**** **** **** ${card.cardNumber.slice(-4)}`

        )

    }

</div>

    <div className="card-footer">

        <div className="footer-left">

            <span>
                Card Holder
            </span>

            <h4>
                {card.holderName}
            </h4>

        </div>

        <div className="footer-right">

            <span>
                Expiry
            </span>

            <h4>

                {

                    card.expiryDate

                        ?

                        card.expiryDate

                        :

                        "--/--"

                }

            </h4>

        </div>

    </div>

</div>

     </div>

                {/* RIGHT */}

                <div className="right-section">

                    <div className="atm-details">

                        <h2>

                            ATM Card Details

                        </h2>

                        <div className="detail">

                            <span>Status</span>

                            <strong

                                className={

                                    card.status === "ACTIVE"

                                        ?

                                        "status-active"

                                        :

                                        card.status === "PENDING"

                                            ?

                                            "status-pending"

                                            :

                                            card.status === "BLOCKED"

                                                ?

                                                "status-blocked"

                                                :

                                                "status-rejected"

                                }

                            >

                                {card.status}

                            </strong>

                        </div>

                        <div className="detail">

                            <span>

                                Card Type

                            </span>

                            <strong>

                                {card.cardType}

                            </strong>

                        </div>

                        <div className="detail">

                            <span>

                                Daily Limit

                            </span>

                            <strong>

                                ₹ {card.dailyLimit?.toLocaleString()}

                            </strong>

                        </div>

                        <div className="detail">

                            <span>

                                Request Date

                            </span>

                            <strong>

                                {card.requestDate}

                            </strong>

                        </div>

                    </div>

                </div>

            </div>

            {/* CARD INFO */}

            {

                card.status === "ACTIVE" && (

                    <div className="card-info">

                        <h2>

                            Card Information

                        </h2>

                        <div className="info-row">

                            <span>

                                Card Number

                            </span>

                            <strong>

                                {

                                    showCardNumber

                                        ?

                                        card.cardNumber.replace(

                                            /(.{4})/g,

                                            "$1 "

                                        )

                                        :

                                        `**** **** **** ${card.cardNumber.slice(-4)}`

                                }

                            </strong>

                            <button

                                className="show-btn"

                                onClick={() =>

                                    setShowCardNumber(

                                        !showCardNumber

                                    )

                                }

                            >

                                {

                                    showCardNumber

                                        ?

                                        "Hide"

                                        :

                                        "Show"

                                }

                            </button>

                        </div>

                        <div className="info-row">

                            <span>

                                CVV

                            </span>

                            <strong>

                                {

                                    showCVV

                                        ?

                                        card.cvv

                                        :

                                        "***"

                                }

                            </strong>

                            <button

                                className="show-btn"

                                onClick={() =>

                                    setShowCVV(

                                        !showCVV

                                    )

                                }

                            >

                                {

                                    showCVV

                                        ?

                                        "Hide"

                                        :

                                        "Show"

                                }

                            </button>

                        </div>

                        <div className="info-row">

                            <span>

                                Expiry

                            </span>

                            <strong>

                                {card.expiryDate}

                            </strong>

                        </div>

                    </div>

                )

            }
               {/* PIN SECTION */}

            {card.status === "ACTIVE" && (

                <div className="pin-card">

                    <h2>

                        Change ATM PIN

                    </h2>

                    <p>

                        Update your ATM PIN securely.

                    </p>

                    <div className="pin-form">

                        <input

                            type="password"

                            placeholder="Current PIN"

                            value={oldPin}

                            onChange={(e) =>

                                setOldPin(e.target.value)

                            }

                        />

                        <input

                            type="password"

                            placeholder="New PIN"

                            value={newPin}

                            onChange={(e) =>

                                setNewPin(e.target.value)

                            }

                        />

                        <input

                            type="password"

                            placeholder="Confirm New PIN"

                            value={confirmPin}

                            onChange={(e) =>

                                setConfirmPin(e.target.value)

                            }

                        />

                        <button

                            className="pin-btn"

                            onClick={handleChangePin}

                            disabled={changingPin}

                        >

                            {

                                changingPin

                                    ?

                                    "Changing..."

                                    :

                                    "Change PIN"

                            }

                        </button>

                    </div>

                </div>

            )}

            {/* ACTIONS */}

            {(card.status === "ACTIVE" ||

                card.status === "BLOCKED") && (

                <div className="atm-actions">

                    {card.status === "ACTIVE" && (

                        <button

                            className="block-btn"

                            disabled={actionLoading}

                            onClick={() =>

                                setBlockOpen(true)

                            }

                        >

                            {

                                actionLoading

                                    ?

                                    "Please Wait..."

                                    :

                                    "Block Card"

                            }

                        </button>

                    )}

                    {card.status === "BLOCKED" && (

                        <button

                            className="unblock-btn"

                            disabled={actionLoading}

                            onClick={() =>

                                setUnblockOpen(true)

                            }

                        >

                            {

                                actionLoading

                                    ?

                                    "Please Wait..."

                                    :

                                    "Unblock Card"

                            }

                        </button>

                    )}

                </div>

            )}

            {/* MODALS */}

            <RequestATMCardModal

                open={requestOpen}

                onClose={() =>

                    setRequestOpen(false)

                }

                onConfirm={handleRequestATMCard}

            />

            <BlockATMCardModal

                open={blockOpen}

                onClose={() =>

                    setBlockOpen(false)

                }

                onConfirm={handleBlockCard}

            />

            <UnblockATMCardModal

                open={unblockOpen}

                onClose={() =>

                    setUnblockOpen(false)

                }

                onConfirm={handleUnblockCard}

            />

        </>

    )}

</div>

);

}

export default ATMCard;