import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getAllCustomers,
    getCustomerDetails,
    approveCustomer,
    rejectCustomer,
    blockCustomer,
    unblockCustomer,
} from "../../api/adminApi";

import "../../assets/styles/admin-customers.css";


function Customers() {

    const [searchParams] = useSearchParams();

const initialStatus =
    searchParams.get("status")?.toUpperCase() || "ALL";

const [customers, setCustomers] = useState([]);

const [loading, setLoading] = useState(true);

const [processingId, setProcessingId] = useState(null);

const [searchTerm, setSearchTerm] = useState("");

const [accountFilter, setAccountFilter] = useState("ALL");

const [kycFilter, setKycFilter] = useState("ALL");

const [statusFilter, setStatusFilter] = useState(
    ["ALL", "ACTIVE", "BLOCKED"].includes(initialStatus)
        ? initialStatus
        : "ALL"
);

const [selectedCustomer, setSelectedCustomer] = useState(null);
const [customerDetails, setCustomerDetails] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);

const [previewImage, setPreviewImage] = useState(null);

const [summaryType, setSummaryType] = useState(null);

    useEffect(() => {
    const status =
        searchParams.get("status")?.toUpperCase() || "ALL";

    setStatusFilter(
        ["ALL", "ACTIVE", "BLOCKED"].includes(status)
            ? status
            : "ALL"
    );
}, [searchParams]);


    // =====================================================
    // LOAD CUSTOMERS
    // =====================================================

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {

    const handleEscape = (event) => {

        if (event.key === "Escape") {
            setPreviewImage(null);
        }

    };

    document.addEventListener("keydown", handleEscape);

    return () => {
        document.removeEventListener(
            "keydown",
            handleEscape
        );
    };

}, []);


    const loadCustomers = async () => {

        try {

            setLoading(true);

            const response = await getAllCustomers();

            setCustomers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Customer loading error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load customers."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // APPROVE CUSTOMER
    // =====================================================

    const handleApprove = async (id) => {

        try {

            setProcessingId(id);

            await approveCustomer(id);

            toast.success(
                "Customer account approved successfully."
            );

            await loadCustomers();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to approve customer."
            );

        } finally {

            setProcessingId(null);

        }
    };


    // =====================================================
    // REJECT CUSTOMER
    // =====================================================

    const handleReject = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to reject this customer account?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setProcessingId(id);

            await rejectCustomer(id);

            toast.success(
                "Customer account rejected."
            );

            await loadCustomers();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to reject customer."
            );

        } finally {

            setProcessingId(null);

        }
    };


    // =====================================================
    // BLOCK CUSTOMER
    // =====================================================

    const handleBlock = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to block this customer?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setProcessingId(id);

            await blockCustomer(id);

            toast.success(
                "Customer blocked successfully."
            );

            await loadCustomers();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to block customer."
            );

        } finally {

            setProcessingId(null);

        }
    };


    // =====================================================
    // UNBLOCK CUSTOMER
    // =====================================================

    const handleUnblock = async (id) => {

        try {

            setProcessingId(id);

            await unblockCustomer(id);

            toast.success(
                "Customer unblocked successfully."
            );

            await loadCustomers();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to unblock customer."
            );

        } finally {

            setProcessingId(null);

        }
    };


    // =====================================================
    // FILTER CUSTOMERS
    // =====================================================

    const filteredCustomers = useMemo(() => {

        const keyword =
            searchTerm.trim().toLowerCase();

        return customers.filter((customer) => {

            const matchesSearch =
                !keyword ||
                String(customer.fullName || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(customer.email || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(customer.mobile || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(customer.accountNumber || "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(customer.ifscCode || "")
                    .toLowerCase()
                    .includes(keyword);


            const matchesAccount =
                accountFilter === "ALL" ||
                String(customer.accountStatus || "")
                    .toUpperCase() === accountFilter;


            const matchesKyc =
                kycFilter === "ALL" ||
                String(customer.kycStatus || "")
                    .toUpperCase() === kycFilter;


            const matchesStatus =
                statusFilter === "ALL" ||
                (
                    statusFilter === "ACTIVE" &&
                    customer.active === true
                ) ||
                (
                    statusFilter === "BLOCKED" &&
                    customer.active === false
                );


            return (
                matchesSearch &&
                matchesAccount &&
                matchesKyc &&
                matchesStatus
            );

        });

    }, [
        customers,
        searchTerm,
        accountFilter,
        kycFilter,
        statusFilter
    ]);


    // =====================================================
    // SUMMARY STATISTICS
    // =====================================================

    const totalCustomers =
        customers.length;


    const activeCustomers =
        customers.filter(
            customer => customer.active === true
        ).length;


    const blockedCustomers =
        customers.filter(
            customer => customer.active === false
        ).length;


    const pendingAccounts =
        customers.filter(
            customer =>
                String(customer.accountStatus)
                    .toUpperCase() === "PENDING"
        ).length;


    const verifiedKyc =
        customers.filter(
            customer =>
                String(customer.kycStatus)
                    .toUpperCase() === "VERIFIED"
        ).length;


    const totalBalance =
        customers.reduce(
            (total, customer) =>
                total +
                Number(customer.balance || 0),
            0
        );

    const handleSummaryClick = (type) => {
    setSummaryType(type);
    };

     const closeSummaryModal = () => {
     setSummaryType(null);
    };
    
    const handleViewCustomer = async (id) => {
    try {
        setDetailsLoading(true);
        setSelectedCustomer(null);
        setCustomerDetails(null);

        const response = await getCustomerDetails(id);

        setCustomerDetails(response.data);
        setSelectedCustomer(response.data.customer);

    } catch (error) {
        console.error("Customer details loading error:", error);

        toast.error(
            error.response?.data?.message ||
            "Unable to load customer details."
        );
    } finally {
        setDetailsLoading(false);
    }
};


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="admin-customers-page">

                <div className="admin-customers-loading">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p>
                        Loading customers...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-customers-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-customers-header">

                <div>

                    <span className="admin-customers-eyebrow">
                        CUSTOMER MANAGEMENT
                    </span>

                    <h2>
                        Customers
                    </h2>

                    <p>
                        Manage customer accounts, verification
                        status and banking information.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-customers-refresh"
                    onClick={loadCustomers}
                    disabled={loading}
                >

                    <i className="bi bi-arrow-clockwise" />

                    Refresh

                </button>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

           <div className="admin-customer-stat-grid">

    <CustomerStatCard
        title="Total Customers"
        value={totalCustomers}
        icon="bi-people-fill"
        type="blue"
        onClick={() => handleSummaryClick("TOTAL")}
    />

    <CustomerStatCard
        title="Active Customers"
        value={activeCustomers}
        icon="bi-person-check-fill"
        type="green"
        onClick={() => handleSummaryClick("ACTIVE")}
    />

    <CustomerStatCard
        title="Blocked Customers"
        value={blockedCustomers}
        icon="bi-person-x-fill"
        type="red"
        onClick={() => handleSummaryClick("BLOCKED")}
    />

    <CustomerStatCard
        title="Pending Accounts"
        value={pendingAccounts}
        icon="bi-hourglass-split"
        type="orange"
        onClick={() => handleSummaryClick("PENDING")}
    />

    <CustomerStatCard
        title="KYC Verified"
        value={verifiedKyc}
        icon="bi-shield-check"
        type="purple"
        onClick={() => handleSummaryClick("KYC_VERIFIED")}
    />

    <CustomerStatCard
        title="Total Balance"
        value={formatCurrency(totalBalance)}
        icon="bi-wallet2"
        type="teal"
        onClick={() => handleSummaryClick("BALANCE")}
    />

</div>


            {/* =================================================
                FILTER PANEL
            ================================================= */}

            <div className="admin-customer-filter-card">


                <div className="admin-customer-search">

                    <i className="bi bi-search" />

                    <input
                        type="text"
                        placeholder="Search name, email, mobile, account number..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                    {searchTerm && (

                        <button
                            type="button"
                            className="admin-search-clear"
                            onClick={() =>
                                setSearchTerm("")
                            }
                        >
                            ×
                        </button>

                    )}

                </div>


                <div className="admin-customer-filter">


                    <label>
                        Account
                    </label>

                    <select
                        value={accountFilter}
                        onChange={(event) =>
                            setAccountFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Accounts
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                    </select>

                </div>


                <div className="admin-customer-filter">

                    <label>
                        KYC
                    </label>

                    <select
                        value={kycFilter}
                        onChange={(event) =>
                            setKycFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All KYC
                        </option>

                        <option value="VERIFIED">
                            Verified
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                        <option value="NOT_SUBMITTED">
                            Not Submitted
                        </option>

                    </select>

                </div>


                <div className="admin-customer-filter">

                    <label>
                        Customer
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Customers
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="BLOCKED">
                            Blocked
                        </option>

                    </select>

                </div>


                <button
                    type="button"
                    className="admin-filter-reset"
                    onClick={() => {

                        setSearchTerm("");
                        setAccountFilter("ALL");
                        setKycFilter("ALL");
                        setStatusFilter("ALL");

                    }}
                >

                    <i className="bi bi-arrow-counterclockwise" />

                    Reset

                </button>

            </div>


            {/* =================================================
                RESULT INFORMATION
            ================================================= */}

            <div className="admin-customer-result-info">

                <div>

                    Showing{" "}
                    <strong>
                        {filteredCustomers.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                        {customers.length}
                    </strong>{" "}
                    customers

                </div>

            </div>


            {/* =================================================
                CUSTOMER TABLE
            ================================================= */}

            <div className="admin-customer-table-card">

                <div className="admin-customer-table-wrapper">

                    <table className="admin-customer-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Contact
                                </th>

                                <th>
                                    Account
                                </th>

                                <th>
                                    Balance
                                </th>

                                <th>
                                    Account Status
                                </th>

                                <th>
                                    KYC
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredCustomers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        className="admin-customer-empty"
                                    >

                                        <div>

                                            <i className="bi bi-people" />

                                            <h5>
                                                No customers found
                                            </h5>

                                            <p>
                                                Try changing your search
                                                or filters.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredCustomers.map(
                                    (customer, index) => (

                                        <tr
                                            key={customer.id}
                                        >

                                            {/* NUMBER */}

                                            <td>
                                                <span className="admin-customer-number">
                                                    {index + 1}
                                                </span>
                                            </td>


                                            {/* CUSTOMER */}

                                            <td>

                                                <div className="admin-customer-identity">

                                                    <CustomerAvatar
                                                        customer={
                                                            customer
                                                        }
                                                        onImageClick={setPreviewImage}
                                                    />

                                                    <div>

                                                        <strong>
                                                            {
                                                                customer.fullName ||
                                                                "-"
                                                            }
                                                        </strong>

                                                        <span>
                                                            ID: #
                                                            {
                                                                customer.id
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACT */}

                                            <td>

                                                <div className="admin-customer-contact">

                                                    <span>
                                                        <i className="bi bi-envelope" />

                                                        {
                                                            customer.email ||
                                                            "-"
                                                        }
                                                    </span>

                                                    <span>
                                                        <i className="bi bi-telephone" />

                                                        {
                                                            customer.mobile ||
                                                            "-"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* ACCOUNT */}

                                            <td>

                                                <div className="admin-customer-account">

                                                    <strong>
                                                        {
                                                            customer.accountNumber ||
                                                            "Not Assigned"
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            customer.ifscCode ||
                                                            "IFSC not assigned"
                                                        }
                                                    </span>

                                                </div>

                                            </td>


                                            {/* BALANCE */}

                                            <td>

                                                <strong className="admin-customer-balance">
                                                    {
                                                        formatCurrency(
                                                            customer.balance
                                                        )
                                                    }
                                                </strong>

                                            </td>


                                            {/* ACCOUNT STATUS */}

                                            <td>

                                                <StatusBadge
                                                    status={
                                                        customer.accountStatus ||
                                                        "UNKNOWN"
                                                    }
                                                />

                                            </td>


                                            {/* KYC */}

                                            <td>

                                                <StatusBadge
                                                    status={
                                                        customer.kycStatus ||
                                                        "NOT_SUBMITTED"
                                                    }
                                                />

                                            </td>


                                            {/* ACTIVE */}

                                            <td>

                                                <StatusBadge
                                                    status={
                                                        customer.active
                                                            ? "ACTIVE"
                                                            : "BLOCKED"
                                                    }
                                                />

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="admin-customer-actions">


                                                    <button
                                                        type="button"
                                                        className="admin-action-view"
                                                        onClick={() => handleViewCustomer(customer.id)}
                                                        title="View customer"
                                                    >

                                                        <i className="bi bi-eye" />

                                                        <span>
                                                            View
                                                        </span>

                                                    </button>


                                                    {customer.accountStatus ===
                                                        "PENDING" && (

                                                        <>

                                                            <button
                                                                type="button"
                                                                className="admin-action-approve"
                                                                disabled={
                                                                    processingId ===
                                                                    customer.id
                                                                }
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        customer.id
                                                                    )
                                                                }
                                                            >

                                                                {
                                                                    processingId ===
                                                                    customer.id ? (
                                                                        <span
                                                                            className="spinner-border spinner-border-sm"
                                                                        />
                                                                    ) : (
                                                                        <>
                                                                            <i className="bi bi-check-lg" />

                                                                            <span>
                                                                                Approve
                                                                            </span>
                                                                        </>
                                                                    )
                                                                }

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="admin-action-reject"
                                                                disabled={
                                                                    processingId ===
                                                                    customer.id
                                                                }
                                                                onClick={() =>
                                                                    handleReject(
                                                                        customer.id
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-x-lg" />

                                                                <span>
                                                                    Reject
                                                                </span>

                                                            </button>

                                                        </>

                                                    )}


                                                    {customer.active ? (

                                                        <button
                                                            type="button"
                                                            className="admin-action-block"
                                                            disabled={
                                                                processingId ===
                                                                customer.id
                                                            }
                                                            onClick={() =>
                                                                handleBlock(
                                                                    customer.id
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-person-x" />

                                                            <span>
                                                                Block
                                                            </span>

                                                        </button>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            className="admin-action-unblock"
                                                            disabled={
                                                                processingId ===
                                                                customer.id
                                                            }
                                                            onClick={() =>
                                                                handleUnblock(
                                                                    customer.id
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-person-check" />

                                                            <span>
                                                                Unblock
                                                            </span>

                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
    CUSTOMER DETAILS MODAL
================================================= */}

{detailsLoading && (

    <div className="admin-customer-modal-overlay">

        <div className="admin-customer-modal-loading">

            <div
                className="spinner-border text-primary"
                role="status"
            />

            <p>
                Loading customer details...
            </p>

        </div>

    </div>

)}


{customerDetails && (

    <CustomerDetailsModal
        details={customerDetails}
        onClose={() => {

            setCustomerDetails(null);
            setSelectedCustomer(null);

        }}
        onImageClick={setPreviewImage}
    />

)}

            {summaryType && (

             <CustomerSummaryModal
    type={summaryType}
    customers={customers}
    onClose={closeSummaryModal}
    onCustomerClick={(customer) => {
        setSummaryType(null);
        handleViewCustomer(customer.id);
    }}
 
              onImageClick={setPreviewImage}

              processingId={processingId}

              onApprove={handleApprove}
              onReject={handleReject}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
              />

            )}


            {/* =================================================
                PROFILE IMAGE PREVIEW
            ================================================= */}

            {previewImage && (

                <ProfileImagePreview
                    image={previewImage}
                    onClose={() =>
                        setPreviewImage(null)
                    }
                />

            )}

        </div>
    );
}


/* =========================================================
   CUSTOMER STAT CARD
========================================================= */

function CustomerStatCard({
    title,
    value,
    icon,
    type,
    onClick
}) {

    return (

        <button
            type="button"
            className={`admin-customer-stat-card admin-customer-stat-card-clickable ${type}`}
            onClick={onClick}
        >

            <div className="admin-customer-stat-icon">

                <i className={`bi ${icon}`} />

            </div>

            <div className="admin-customer-stat-info">

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </button>

    );
}

/* =========================================================
   CUSTOMER AVATAR
========================================================= */

function CustomerAvatar({
    customer,
    onImageClick
}) {

    const firstLetter =
        String(customer.fullName || "C")
            .trim()
            .charAt(0)
            .toUpperCase();

    const profileImageUrl = customer.profilePicture
        ? (
            customer.profilePicture.startsWith("http://") ||
            customer.profilePicture.startsWith("https://")
                ? customer.profilePicture
                : `${import.meta.env.VITE_API_URL}/uploads/profiles/${customer.profilePicture}`
        )
        : null;


    return (

        <div className="admin-customer-avatar">

            {profileImageUrl ? (

                <img
                    src={profileImageUrl}
                    alt={customer.fullName || "Customer"}
                    className="admin-customer-avatar-image"
                    onClick={(event) => {

                        event.stopPropagation();

                        if (onImageClick) {
                            onImageClick(profileImageUrl);
                        }

                    }}
                    onError={(event) => {

                        event.currentTarget.style.display =
                            "none";

                    }}
                />

            ) : (

                firstLetter

            )}

        </div>

    );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {

    const normalized =
        String(status || "UNKNOWN")
            .toUpperCase();


    let className =
        "admin-status-badge neutral";


    if (
        normalized === "ACTIVE" ||
        normalized === "APPROVED" ||
        normalized === "VERIFIED"
    ) {
        className =
            "admin-status-badge success";
    }


    if (
        normalized === "PENDING" ||
        normalized === "NOT_SUBMITTED"
    ) {
        className =
            "admin-status-badge warning";
    }


    if (
        normalized === "REJECTED" ||
        normalized === "BLOCKED"
    ) {
        className =
            "admin-status-badge danger";
    }


    return (

        <span className={className}>

            <span className="admin-status-dot" />

            {
                normalized
                    .replaceAll("_", " ")
            }

        </span>
    );
}


function CustomerSummaryModal({
    type,
    customers,
    onClose,
    onCustomerClick,
    onImageClick,
    processingId,
    onApprove,
    onReject,
    onBlock,
    onUnblock
}) {

    let title = "";
    let description = "";
    let icon = "";
    let filteredCustomers = customers;

    switch (type) {

        case "TOTAL":

            title = "All Customers";
            description =
                "Complete list of registered customer accounts.";
            icon = "bi-people-fill";

            break;

        case "ACTIVE":

            title = "Active Customers";
            description =
                "Customers with active banking accounts.";
            icon = "bi-person-check-fill";

            filteredCustomers = customers.filter(
                customer => customer.active === true
            );

            break;

        case "BLOCKED":

            title = "Blocked Customers";
            description =
                "Customers whose accounts are currently blocked.";
            icon = "bi-person-x-fill";

            filteredCustomers = customers.filter(
                customer => customer.active === false
            );

            break;

        case "PENDING":

            title = "Pending Accounts";
            description =
                "Customer accounts waiting for approval.";
            icon = "bi-hourglass-split";

            filteredCustomers = customers.filter(
                customer =>
                    String(customer.accountStatus || "")
                        .toUpperCase() === "PENDING"
            );

            break;

        case "KYC_VERIFIED":

            title = "KYC Verified Customers";
            description =
                "Customers whose KYC verification is complete.";
            icon = "bi-shield-check";

            filteredCustomers = customers.filter(
                customer =>
                    String(customer.kycStatus || "")
                        .toUpperCase() === "VERIFIED"
            );

            break;

        case "BALANCE":

            title = "Customer Balances";
            description =
                "Balance information for all customer accounts.";
            icon = "bi-wallet2";

            break;

        default:

            return null;
    }

    const totalBalance = filteredCustomers.reduce(
        (total, customer) =>
            total + Number(customer.balance || 0),
        0
    );

    return (

        <div
            className="admin-summary-modal-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div className="admin-summary-modal">

                {/* HEADER */}

                <div className="admin-summary-modal-header">

                    <div>

                        <span className="admin-summary-modal-eyebrow">

                            <i className={`bi ${icon}`} />{" "}

                            CUSTOMER SUMMARY

                        </span>

                        <h3>
                            {title}
                        </h3>

                        <p>
                            {description}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="admin-modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* BODY */}

                <div className="admin-summary-modal-body">

                    <div className="admin-summary-overview">

                        <div className="admin-summary-overview-card">

                            <span>
                                Customers
                            </span>

                            <strong>
                                {filteredCustomers.length}
                            </strong>

                        </div>


                        <div className="admin-summary-overview-card">

                            <span>
                                Total Balance
                            </span>

                            <strong>
                                {formatCurrency(totalBalance)}
                            </strong>

                        </div>


                        <div className="admin-summary-overview-card">

                            <span>
                                Status
                            </span>

                            <strong>
                                {title}
                            </strong>

                        </div>

                    </div>


                    {filteredCustomers.length === 0 ? (

                        <div className="admin-summary-empty">

                            <i className="bi bi-people" />

                            <strong>
                                No customers found
                            </strong>

                            <span>
                                There are no customers in this category.
                            </span>

                        </div>

                    ) : (

                        <div className="admin-summary-customer-list">

    {/* HEADER */}

    <div className="admin-summary-list-header">

        <span>
           #
        </span>

        <span>
            Customer
        </span>

        <span>
            Contact
        </span>

        <span>
            Account
        </span>

        <span>
            Balance
        </span>

        <span>
            Account Status
        </span>

        <span>
            KYC
        </span>

        <span>
            Status
        </span>

        <span>
            Actions
        </span>

    </div>


    {/* CUSTOMERS */}

    {filteredCustomers.map((customer, index) => (

        <div
            className="admin-summary-customer-row"
            key={customer.id}
        >
             {/* NUMBER */}
             <span className="admin-summary-number">
             {index + 1}
             </span>
             
            {/* CUSTOMER */}

            <div className="admin-summary-customer-name">

                <CustomerAvatar
                 customer={customer}
                 onImageClick={onImageClick}
                />

                <span>

                    <strong>
                        {customer.fullName || "-"}
                    </strong>

                    <small>
                        ID: #{customer.id}
                    </small>

                </span>

            </div>


            {/* CONTACT */}

            <span className="admin-summary-contact">

                <small>
                    <i className="bi bi-envelope" />
                    {customer.email || "-"}
                </small>

                <small>
                    <i className="bi bi-telephone" />
                    {customer.mobile || "-"}
                </small>

            </span>


            {/* ACCOUNT */}

            <span className="admin-summary-account">

                <strong>
                    {customer.accountNumber ||
                        "Not Assigned"}
                </strong>

                <small>
                    {customer.ifscCode ||
                        "IFSC not assigned"}
                </small>

            </span>


            {/* BALANCE */}

            <span className="admin-summary-balance">

                {formatCurrency(
                    customer.balance
                )}

            </span>


            {/* ACCOUNT STATUS */}

            <span>

                <StatusBadge
                    status={
                        customer.accountStatus ||
                        "UNKNOWN"
                    }
                />

            </span>


            {/* KYC */}

            <span>

                <StatusBadge
                    status={
                        customer.kycStatus ||
                        "NOT_SUBMITTED"
                    }
                />

            </span>


            {/* ACTIVE / BLOCKED */}

            <span>

                <StatusBadge
                    status={
                        customer.active
                            ? "ACTIVE"
                            : "BLOCKED"
                    }
                />

            </span>


            {/* ACTIONS */}

            <div className="admin-summary-actions">

                {/* VIEW */}

                <button
                    type="button"
                    className="admin-action-view"
                    onClick={() =>
                        onCustomerClick(customer)
                    }
                    title="View customer"
                >

                    <i className="bi bi-eye" />

                    <span>
                        View
                    </span>

                </button>


                {/* APPROVE / REJECT */}

                {customer.accountStatus ===
                    "PENDING" && (

                    <>

                        <button
                            type="button"
                            className="admin-action-approve"
                            disabled={
                                processingId ===
                                customer.id
                            }
                            onClick={() =>
                                handleApprove(
                                    customer.id
                                )
                            }
                        >

                            {processingId ===
                            customer.id ? (

                                <span
                                    className="spinner-border spinner-border-sm"
                                />

                            ) : (

                                <>
                                    <i className="bi bi-check-lg" />

                                    <span>
                                        Approve
                                    </span>
                                </>

                            )}

                        </button>


                        <button
                            type="button"
                            className="admin-action-reject"
                            disabled={
                                processingId ===
                                customer.id
                            }
                            onClick={() =>
                                handleReject(
                                    customer.id
                                )
                            }
                        >

                            <i className="bi bi-x-lg" />

                            <span>
                                Reject
                            </span>

                        </button>

                    </>

                )}


                {/* BLOCK / UNBLOCK */}

                {customer.active ? (

                    <button
                        type="button"
                        className="admin-action-block"
                        disabled={
                            processingId ===
                            customer.id
                        }
                        onClick={() =>
                            handleBlock(
                                customer.id
                            )
                        }
                    >

                        <i className="bi bi-person-x" />

                        <span>
                            Block
                        </span>

                    </button>

                ) : (

                    <button
                        type="button"
                        className="admin-action-unblock"
                        disabled={
                            processingId ===
                            customer.id
                        }
                        onClick={() =>
                            handleUnblock(
                                customer.id
                            )
                        }
                    >

                        <i className="bi bi-person-check" />

                        <span>
                            Unblock
                        </span>

                    </button>

                )}

            </div>

        </div>

    ))}

</div>

                    )}

                </div>


                {/* FOOTER */}

                <div className="admin-summary-modal-footer">

                    <button
                        type="button"
                        className="admin-modal-done"
                        onClick={onClose}
                    >

                        <i className="bi bi-check2" />

                        Done

                    </button>

                </div>

            </div>

        </div>

    );
}


/* =========================================================
   CUSTOMER DETAILS MODAL
========================================================= */

function CustomerDetailsModal({
    details,
    onClose,
    onImageClick
}) {

    const customer = details?.customer;

    const atmCard = details?.atmCard;

    const chequeBooks = details?.chequeBooks || [];

    const loans = details?.loans || [];

    const fixedDeposits = details?.fixedDeposits || [];

    const recurringDeposits = details?.recurringDeposits || [];

    const transactions = details?.transactions || [];

    return (

        <div
            className="admin-customer-modal-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div className="admin-customer-modal">


                {/* HEADER */}

                <div className="admin-customer-modal-header">

                    <div className="admin-customer-modal-profile">

                        <CustomerAvatar
                            customer={customer}
                            onImageClick={onImageClick}
                        />

                        <div>

                            <span>
                                CUSTOMER PROFILE
                            </span>

                            <h3>
                                {
                                    customer.fullName ||
                                    "Customer"
                                }
                            </h3>

                            <p>
                                Customer ID: #{customer.id}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="admin-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* BODY */}

                <div className="admin-customer-modal-body">


                    {/* PERSONAL */}

                    <DetailSection
                        icon="bi-person"
                        title="Personal Information"
                    >

                        <DetailItem
                            label="Full Name"
                            value={
                                customer.fullName
                            }
                        />

                        <DetailItem
                            label="Email"
                            value={
                                customer.email
                            }
                        />

                        <DetailItem
                            label="Mobile"
                            value={
                                customer.mobile
                            }
                        />

                    </DetailSection>


                    {/* ADDRESS */}

                    <DetailSection
                        icon="bi-geo-alt"
                        title="Address Information"
                    >

                        <DetailItem
                            label="Address"
                            value={
                                customer.address
                            }
                        />

                        <DetailItem
                            label="City"
                            value={
                                customer.city
                            }
                        />

                        <DetailItem
                            label="State"
                            value={
                                customer.state
                            }
                        />

                        <DetailItem
                            label="Postal Code"
                            value={
                                customer.postalCode
                            }
                        />

                        <DetailItem
                            label="Country"
                            value={
                                customer.country
                            }
                        />

                    </DetailSection>


                    {/* BANKING */}

                    <DetailSection
                        icon="bi-bank"
                        title="Banking Information"
                    >

                        <DetailItem
                            label="Account Number"
                            value={
                                customer.accountNumber
                            }
                        />

                        <DetailItem
                            label="IFSC Code"
                            value={
                                customer.ifscCode
                            }
                        />

                        <DetailItem
                            label="Account Type"
                            value={
                                customer.accountType
                            }
                        />

                        <DetailItem
                            label="Branch"
                            value={
                                customer.branchName
                            }
                        />

                        <DetailItem
                            label="Balance"
                            value={
                                formatCurrency(
                                    customer.balance
                                )
                            }
                        />

                    </DetailSection>


                    {/* VERIFICATION */}

                    <DetailSection
                        icon="bi-shield-check"
                        title="Verification & Status"
                    >

                        <div className="admin-detail-status-row">

                            <div>

                                <span>
                                    Account Status
                                </span>

                                <StatusBadge
                                    status={
                                        customer.accountStatus
                                    }
                                />

                            </div>


                            <div>

                                <span>
                                    KYC Status
                                </span>

                                <StatusBadge
                                    status={
                                        customer.kycStatus
                                    }
                                />

                            </div>


                            <div>

                                <span>
                                    Customer Status
                                </span>

                                <StatusBadge
                                    status={
                                        customer.active
                                            ? "ACTIVE"
                                            : "BLOCKED"
                                    }
                                />

                            </div>

                        </div>

                    </DetailSection>
                    {/* ATM CARD */}

<DetailSection
    icon="bi-credit-card"
    title="ATM Card"
>

    {atmCard ? (

        <>
            <DetailItem
                label="Card Status"
                value={atmCard.status}
            />

            <DetailItem
                label="Card Number"
                value={atmCard.cardNumber}
            />

            <DetailItem
                label="Request Date"
                value={atmCard.requestDate}
            />

            <DetailItem
                label="Expiry Date"
                value={atmCard.expiryDate}
            />

            <DetailItem
                label="Approved Date"
                value={atmCard.approvedDate}
            />

            <DetailItem
                label="Approved By"
                value={atmCard.approvedBy}
            />

            <DetailItem
                label="Rejected Date"
                value={atmCard.rejectedDate}
            />

            <DetailItem
                label="Rejection Reason"
                value={atmCard.rejectionReason}
            />
        </>

    ) : (

        <div className="admin-detail-empty">
            <i className="bi bi-credit-card"></i>
            <span>No ATM card application found.</span>
        </div>

    )}

</DetailSection>

{/* CHEQUE BOOKS */}

<DetailSection
    icon="bi-journal-text"
    title="Cheque Book Requests"
>

    {chequeBooks.length > 0 ? (

        chequeBooks.map((cheque) => (

            <div
                className="admin-detail-record"
                key={cheque.id}
            >

                <DetailItem
                    label="Leaves"
                    value={cheque.numberOfLeaves}
                />

                <DetailItem
                    label="Status"
                    value={cheque.status}
                />

                <DetailItem
                    label="Request Date"
                    value={cheque.requestDate}
                />

                <DetailItem
                    label="Approved Date"
                    value={cheque.approvedDate}
                />

                <DetailItem
                    label="Approved By"
                    value={cheque.approvedBy}
                />

                <DetailItem
                    label="Dispatched Date"
                    value={cheque.dispatchedDate}
                />

                <DetailItem
                    label="Delivered Date"
                    value={cheque.deliveredDate}
                />

                <DetailItem
                    label="Rejection Reason"
                    value={cheque.rejectionReason}
                />

            </div>

        ))

    ) : (

        <div className="admin-detail-empty">
            <i className="bi bi-journal-text"></i>
            <span>No cheque book requests found.</span>
        </div>

    )}

</DetailSection>

{/* LOANS */}

<DetailSection
    icon="bi-cash-stack"
    title="Loans"
>

    {loans.length > 0 ? (

        loans.map((loan) => (

            <div
                className="admin-detail-record"
                key={loan.id}
            >

                <DetailItem
                    label="Loan Type"
                    value={loan.loanType}
                />

                <DetailItem
                    label="Amount"
                    value={formatCurrency(loan.amount)}
                />

                <DetailItem
                    label="Interest Rate"
                    value={
                        loan.interestRate !== null &&
                        loan.interestRate !== undefined
                            ? `${loan.interestRate}%`
                            : null
                    }
                />

                <DetailItem
                    label="Tenure"
                    value={
                        loan.tenureMonths
                            ? `${loan.tenureMonths} months`
                            : null
                    }
                />

                <DetailItem
                    label="EMI"
                    value={formatCurrency(loan.emi)}
                />

                <DetailItem
                    label="Remaining Amount"
                    value={formatCurrency(loan.remainingAmount)}
                />

                <DetailItem
                    label="Paid Installments"
                    value={loan.paidInstallments}
                />

                <DetailItem
                    label="Remaining Installments"
                    value={loan.remainingInstallments}
                />

                <DetailItem
                    label="Status"
                    value={loan.status}
                />

                <DetailItem
                    label="Applied Date"
                    value={loan.appliedDate}
                />

                <DetailItem
                    label="Approved Date"
                    value={loan.approvedDate}
                />

                <DetailItem
                    label="Disbursed Date"
                    value={loan.disbursedDate}
                />

                <DetailItem
                    label="Closed Date"
                    value={loan.closedDate}
                />

                <DetailItem
                    label="Rejection Reason"
                    value={loan.rejectionReason}
                />

            </div>

        ))

    ) : (

        <div className="admin-detail-empty">
            <i className="bi bi-cash-stack"></i>
            <span>No loan records found.</span>
        </div>

    )}

</DetailSection>

{/* FIXED DEPOSITS */}

<DetailSection
    icon="bi-safe"
    title="Fixed Deposits"
>

    {fixedDeposits.length > 0 ? (

        fixedDeposits.map((fd) => (

            <div
                className="admin-detail-record"
                key={fd.id}
            >

                <DetailItem
                    label="Principal Amount"
                    value={formatCurrency(fd.principalAmount)}
                />

                <DetailItem
                    label="Interest Rate"
                    value={
                        fd.interestRate !== null &&
                        fd.interestRate !== undefined
                            ? `${fd.interestRate}%`
                            : null
                    }
                />

                <DetailItem
                    label="Tenure"
                    value={
                        fd.tenureMonths
                            ? `${fd.tenureMonths} months`
                            : null
                    }
                />

                <DetailItem
                    label="Maturity Amount"
                    value={formatCurrency(fd.maturityAmount)}
                />

                <DetailItem
                    label="Status"
                    value={fd.status}
                />

                <DetailItem
                    label="Created Date"
                    value={fd.createdDate}
                />

                <DetailItem
                    label="Approved Date"
                    value={fd.approvedDate}
                />

                <DetailItem
                    label="Approved By"
                    value={fd.approvedBy}
                />

                <DetailItem
                    label="Maturity Date"
                    value={fd.maturityDate}
                />

                <DetailItem
                    label="Closed Date"
                    value={fd.closedDate}
                />

                <DetailItem
                    label="Rejection Reason"
                    value={fd.rejectionReason}
                />

            </div>

        ))

    ) : (

        <div className="admin-detail-empty">
            <i className="bi bi-safe"></i>
            <span>No fixed deposit records found.</span>
        </div>

    )}

</DetailSection>

{/* RECURRING DEPOSITS */}

<DetailSection
    icon="bi-calendar2-check"
    title="Recurring Deposits"
>

    {recurringDeposits.length > 0 ? (

        recurringDeposits.map((rd) => (

            <div
                className="admin-detail-record"
                key={rd.id}
            >

                <DetailItem
                    label="Monthly Installment"
                    value={formatCurrency(rd.monthlyInstallment)}
                />

                <DetailItem
                    label="Interest Rate"
                    value={
                        rd.interestRate !== null &&
                        rd.interestRate !== undefined
                            ? `${rd.interestRate}%`
                            : null
                    }
                />

                <DetailItem
                    label="Tenure"
                    value={
                        rd.tenureMonths
                            ? `${rd.tenureMonths} months`
                            : null
                    }
                />

                <DetailItem
                    label="Total Deposited"
                    value={formatCurrency(rd.totalDeposited)}
                />

                <DetailItem
                    label="Maturity Amount"
                    value={formatCurrency(rd.maturityAmount)}
                />

                <DetailItem
                    label="Status"
                    value={rd.status}
                />

                <DetailItem
                    label="Created Date"
                    value={rd.createdDate}
                />

            </div>

        ))

    ) : (

        <div className="admin-detail-empty">
            <i className="bi bi-calendar2-check"></i>
            <span>No recurring deposit records found.</span>
        </div>

    )}

</DetailSection>

{/* TRANSACTIONS */}

<DetailSection
    icon="bi-arrow-left-right"
    title="Transaction History"
>

    {transactions.length > 0 ? (

        <div className="admin-customer-transactions">

            {transactions.map((transaction) => (

                <div
                    className="admin-transaction-row"
                    key={transaction.transactionId}
                >

                    <div className="admin-transaction-icon">

                        <i className="bi bi-arrow-left-right"></i>

                    </div>

                    <div className="admin-transaction-info">

                        <strong>
                            {transaction.transactionType}
                        </strong>

                        <span>
                            Reference ID: #
                            {transaction.transactionId}
                        </span>

                        <small>
                            {transaction.transactionTime}
                        </small>

                    </div>

                    <div className="admin-transaction-amount">

                        <strong>
                            {formatCurrency(
                                transaction.amount
                            )}
                        </strong>

                        <span>
                            Balance:{" "}
                            {formatCurrency(
                                transaction.balanceAfterTransaction
                            )}
                        </span>

                    </div>

                </div>

            ))}

        </div>

    ) : (

        <div className="admin-detail-empty">

            <i className="bi bi-receipt"></i>

            <span>
                No transactions found for this customer.
            </span>

        </div>

    )}

</DetailSection>

                </div>


                {/* FOOTER */}

                <div className="admin-customer-modal-footer">

                    <button
                        type="button"
                        className="admin-modal-done"
                        onClick={onClose}
                    >

                        <i className="bi bi-check2" />

                        Done

                    </button>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   PROFILE IMAGE PREVIEW
========================================================= */

function ProfileImagePreview({
    image,
    onClose
}) {

    if (!image) {
        return null;
    }

    return (

        <div
            className="admin-profile-image-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <button
                type="button"
                className="admin-profile-image-close"
                onClick={onClose}
                aria-label="Close image preview"
            >
                ×
            </button>


            <div className="admin-profile-image-container">

                <img
                    src={image}
                    alt="Customer profile"
                    className="admin-profile-image-large"
                />

            </div>

        </div>

    );
}


/* =========================================================
   DETAIL SECTION
========================================================= */

function DetailSection({
    icon,
    title,
    children
}) {

    return (

        <section className="admin-detail-section">

            <div className="admin-detail-section-title">

                <span>

                    <i className={`bi ${icon}`} />

                </span>

                <h4>
                    {title}
                </h4>

            </div>


            <div className="admin-detail-grid">

                {children}

            </div>

        </section>
    );
}


/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
    label,
    value
}) {

    return (

        <div className="admin-detail-item">

            <span>
                {label}
            </span>

            <strong>
                {
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
                        ? value
                        : "Not provided"
                }
            </strong>

        </div>
    );
}


/* =========================================================
   CURRENCY FORMATTER
========================================================= */

function formatCurrency(amount) {

    const value =
        Number(amount || 0);


    return value.toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


export default Customers;