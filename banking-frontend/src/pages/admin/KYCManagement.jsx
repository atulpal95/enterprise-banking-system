import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../assets/styles/KYCManagement.css";

import {
    getAllKYC,
    getPendingKYC,
    verifyKYC,
    rejectKYC,
    getKYCDocument,
} from "../../api/adminApi";

function KYCManagement() {

  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const [selectedKYC, setSelectedKYC] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionRemarks, setRejectionRemarks] = useState(""); 

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationRemarks, setVerificationRemarks] = useState("");

  const [documentUrls, setDocumentUrls] = useState({
    front: null,
    back: null,
    selfie: null,
  });

  const [documentLoading, setDocumentLoading] = useState(false);

    const loadKYC = async () => {

        try {

            setLoading(true);

            const response = showPendingOnly
                ? await getPendingKYC()
                : await getAllKYC();

            setKycList(response.data || []);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load KYC records."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadKYC();
    }, [showPendingOnly]);

   const handleVerify = async () => {

    if (!selectedKYC) {
        return;
    }

    try {

        await verifyKYC(selectedKYC.id, {
            remarks: verificationRemarks.trim(),
        });

        toast.success("KYC verified successfully.");

        setShowVerifyModal(false);
        setShowReviewModal(false);

        setSelectedKYC(null);
        setVerificationRemarks("");

        loadKYC();

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to verify KYC."
        );

    }
};
    const handleReject = async () => {

    if (!selectedKYC) {
        return;
    }

    if (!rejectionReason.trim()) {
        toast.error("Please enter a rejection reason.");
        return;
    }

    try {

        await rejectKYC(selectedKYC.id, {
            rejectionReason: rejectionReason.trim(),
            remarks: rejectionRemarks.trim(),
        });

        toast.success("KYC rejected successfully.");

        setShowRejectModal(false);
        setShowReviewModal(false);

        setSelectedKYC(null);
        setRejectionReason("");
        setRejectionRemarks("");

        loadKYC();

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to reject KYC."
        );

    }
};
      const handleReview = async (kyc) => {

    setSelectedKYC(kyc);

    setDocumentUrls({
        front: null,
        back: null,
        selfie: null,
    });

    setShowReviewModal(true);

    await loadKYCDocuments(kyc);
};

    const loadKYCDocuments = async (kyc) => {

    if (!kyc) {
        return;
    }

    setDocumentLoading(true);

    try {

        const documents = {};

        const documentRequests = [
            ["front", kyc.frontDocumentUrl],
            ["back", kyc.backDocumentUrl],
            ["selfie", kyc.selfieUrl],
        ];

        for (const [type, url] of documentRequests) {

            if (!url) {
                documents[type] = null;
                continue;
            }

            const response = await getKYCDocument(url);

            documents[type] = URL.createObjectURL(
                response.data
            );
        }

        setDocumentUrls(documents);

    } catch (error) {

        console.error("Failed to load KYC documents.");

        setDocumentUrls({
            front: null,
            back: null,
            selfie: null,
        });

        toast.error("Failed to load KYC documents.");

    } finally {

        setDocumentLoading(false);
    }
};

    const isPdfDocument = (url) => {
        if (!url) {
            return false;
        }

        return url.toLowerCase().includes(".pdf");
    };

    const getStatusClass = (status) => {

        switch (status) {

            case "VERIFIED":
                return "bg-success";

            case "REJECTED":
                return "bg-danger";

            case "PENDING":
                return "bg-warning text-dark";

            case "NOT_SUBMITTED":
                return "bg-secondary";

            default:
                return "bg-secondary";
        }
    };

    return (

        <div className="container-fluid py-4 admin-kyc-page">

            {/* Header */}

            {/* =========================================================
    KYC HEADER
========================================================= */}

<div className="admin-kyc-hero">

    <div className="admin-kyc-hero-content">

        <span className="admin-kyc-label">
            KYC MANAGEMENT
        </span>

        <h1>
            KYC Management
        </h1>

        <p>
            Review and manage customer KYC applications.
        </p>

    </div>


    <div className="admin-kyc-actions">

        <button
            className={`btn ${
                showPendingOnly
                    ? "btn-warning"
                    : "btn-outline-warning"
            }`}
            onClick={() =>
                setShowPendingOnly(!showPendingOnly)
            }
        >
            <i className="bi bi-hourglass-split me-2"></i>

            {showPendingOnly
                ? "Showing Pending"
                : "Pending Only"}
        </button>


        <button
            className="btn btn-outline-primary"
            onClick={loadKYC}
        >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
        </button>

    </div>

</div>


            {/* KYC Table */}

            <div className="card border-0 shadow-sm admin-kyc-table-card">

                <div className="card-body p-0">

                    {loading ? (

                        <div className="text-center py-5">

                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                            </div>

                            <p className="mt-3 text-muted">
                                Loading KYC records...
                            </p>

                        </div>

                    ) : kycList.length === 0 ? (

                        <div className="text-center py-5">

                            <i
                                className="bi bi-file-earmark-check fs-1 text-muted"
                            ></i>

                            <h5 className="mt-3">
                                No KYC records found
                            </h5>

                            <p className="text-muted">
                                There are currently no KYC applications.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>#</th>

                                        <th>Customer</th>

                                        <th>Email</th>

                                        <th>Mobile</th>

                                        <th>KYC Status</th>

                                        <th>Account Status</th>

                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {kycList.map((customer, index) => (

                                        <tr key={customer.id}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {customer.fullName}
                                                </strong>
                                            </td>

                                            <td>
                                                {customer.email}
                                            </td>

                                            <td>
                                                {customer.mobile || "—"}
                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${getStatusClass(
                                                        customer.kycStatus
                                                    )}`}
                                                >
                                                    {customer.kycStatus ||
                                                        "NOT_SUBMITTED"}
                                                </span>

                                            </td>

                                            <td>

                                                <span className="badge bg-secondary">

                                                    {customer.accountStatus ||
                                                        "UNKNOWN"}

                                                </span>

                                            </td>

                                            <td>

                                                {customer.kycStatus === "PENDING" ? (
                                                     <button
                                                       className="btn btn-sm btn-primary"
                                                         onClick={() => handleReview(customer)}
                                                           >
                                                           <i className="bi bi-eye me-1"></i>
                                                              Review KYC
                                                               </button>
                                                            ) : (
                                                        <span className="text-muted">
                                                         No Action
                                                    </span>
                                                )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

                       </div>


            {/* =========================================
                KYC REVIEW MODAL
            ========================================= */}

            {showReviewModal && selectedKYC && (

                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.6)"
                    }}
                >

                    <div className="modal-dialog modal-xl modal-dialog-scrollable">

                        <div className="modal-content">


                            {/* =========================
                                MODAL HEADER
                            ========================= */}

                            <div className="modal-header">

                                <div>

                                    <h4 className="modal-title fw-bold">
                                        KYC Review
                                    </h4>

                                    <small className="text-muted">
                                        Review customer documents before verification
                                    </small>

                                </div>


                                <button
                                   type="button"
                                   className="btn btn-success"
                                   onClick={() => {
                                   setVerificationRemarks("");
                                   setShowVerifyModal(true);
                                   }}
                                 >

                                   <i className="bi bi-check-lg me-1"></i>

                                    Verify KYC

                                </button>

                            </div>


                            {/* =========================
                                MODAL BODY
                            ========================= */}

                            <div className="modal-body">


                                {/* =========================
                                    CUSTOMER INFORMATION
                                ========================= */}

                                <div className="card mb-4 border-0 shadow-sm">

                                    <div className="card-body">

                                        <h5 className="fw-bold mb-3">
                                            Customer Information
                                        </h5>


                                        <div className="row">


                                            <div className="col-md-4 mb-3">

                                                <small className="text-muted">
                                                    Full Name
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedKYC.fullName}
                                                </div>

                                            </div>


                                            <div className="col-md-4 mb-3">

                                                <small className="text-muted">
                                                    Email
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedKYC.email}
                                                </div>

                                            </div>


                                            <div className="col-md-4 mb-3">

                                                <small className="text-muted">
                                                    Mobile
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedKYC.mobile || "—"}
                                                </div>

                                            </div>


                                        </div>

                                    </div>

                                </div>



                                {/* =========================
                                    DOCUMENT INFORMATION
                                ========================= */}

                                <div className="card mb-4 border-0 shadow-sm">

                                    <div className="card-body">

                                        <h5 className="fw-bold mb-3">
                                            Document Information
                                        </h5>


                                        <div className="row">


                                            <div className="col-md-6 mb-3">

                                                <small className="text-muted">
                                                    Document Type
                                                </small>

                                                <div className="fw-semibold">
                                                    {selectedKYC.documentType}
                                                </div>

                                            </div>


                                            <div className="col-md-6 mb-3">

                                                <small className="text-muted">
                                                    Document Number
                                                </small>

                                                <div className="fw-semibold">

                                                    {selectedKYC.documentNumber
                                                        ? `${"*".repeat(
                                                            Math.max(
                                                                0,
                                                                selectedKYC.documentNumber.length - 4
                                                            )
                                                        )}${selectedKYC.documentNumber.slice(-4)}`
                                                        : "—"
                                                    }

                                                </div>

                                            </div>


                                        </div>

                                    </div>

                                </div>



                                {/* =========================
                                    SUBMITTED DOCUMENTS
                                ========================= */}

                                <div className="card border-0 shadow-sm">

                                    <div className="card-body">

                                        <h5 className="fw-bold mb-4">
                                            Submitted Documents
                                        </h5>


                                        <div className="row">


                                            {/* =========================
                                                FRONT DOCUMENT
                                            ========================= */}

                                            <div className="col-md-6 mb-4">

                                                <h6 className="fw-bold">
                                                    Front Document
                                                </h6>


                                                {selectedKYC.frontDocumentUrl ? (

                                                    <div className="border rounded p-2 bg-light">

                                                        {documentLoading ? (
                                                            <div className="text-center py-5 text-muted">
                                                                Loading document...
                                                            </div>
                                                        ) : documentUrls.front ? (
                                                            isPdfDocument(selectedKYC.frontDocumentUrl) ? (
                                                                <iframe
                                                                    src={documentUrls.front}
                                                                    title="Front Document PDF"
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "400px",
                                                                        border: "none",
                                                                        borderRadius: "10px"
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={documentUrls.front}
                                                                    alt="Front Document"
                                                                    className="img-fluid rounded"
                                                                    style={{
                                                                        maxHeight: "400px",
                                                                        width: "100%",
                                                                        objectFit: "contain"
                                                                    }}
                                                                />
                                                            )
                                                        ) : (
                                                            <div className="alert alert-warning mb-0">
                                                                Front document not available.
                                                            </div>
                                                        )}

                                                    </div>

                                                ) : (

                                                    <div className="alert alert-warning">
                                                        Front document not available.
                                                    </div>

                                                )}

                                            </div>



                                            {/* =========================
                                                BACK DOCUMENT
                                            ========================= */}

                                            <div className="col-md-6 mb-4">

                                                <h6 className="fw-bold">
                                                    Back Document
                                                </h6>


                                                {selectedKYC.backDocumentUrl ? (

                                                    <div className="border rounded p-2 bg-light">

                                                        {documentLoading ? (
                                                            <div className="text-center py-5 text-muted">
                                                                Loading document...
                                                            </div>
                                                        ) : documentUrls.back ? (
                                                            isPdfDocument(selectedKYC.backDocumentUrl) ? (
                                                                <iframe
                                                                    src={documentUrls.back}
                                                                    title="Back Document PDF"
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "400px",
                                                                        border: "none",
                                                                        borderRadius: "10px"
                                                                    }}
                                                                />
                                                            ) : (
                                                                <img
                                                                    src={documentUrls.back}
                                                                    alt="Back Document"
                                                                    className="img-fluid rounded"
                                                                    style={{
                                                                        maxHeight: "400px",
                                                                        width: "100%",
                                                                        objectFit: "contain"
                                                                    }}
                                                                />
                                                            )
                                                        ) : (
                                                            <div className="alert alert-warning mb-0">
                                                                Back document not available.
                                                            </div>
                                                        )}

                                                    </div>

                                                ) : (

                                                    <div className="alert alert-warning">
                                                        Back document not available.
                                                    </div>

                                                )}

                                            </div>



                                            {/* =========================
                                                SELFIE
                                            ========================= */}

                                            <div className="col-md-6 mb-4">

                                                <h6 className="fw-bold">
                                                    Customer Selfie
                                                </h6>


                                                {selectedKYC.selfieUrl ? (

                                                    <div className="border rounded p-2 bg-light">

                                                        <img
                                                            src={documentUrls.selfie}
                                                            alt="Customer Selfie"
                                                            className="img-fluid rounded"
                                                            style={{
                                                                maxHeight: "400px",
                                                                width: "100%",
                                                                objectFit: "contain"
                                                            }}
                                                        />

                                                    </div>

                                                ) : (

                                                    <div className="alert alert-warning">
                                                        Selfie not available.
                                                    </div>

                                                )}

                                            </div>


                                        </div>

                                    </div>

                                </div>


                            </div>



                            {/* =========================
                                MODAL FOOTER
                            ========================= */}

                            <div className="modal-footer">


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {

                                        setShowReviewModal(false);
                                        setSelectedKYC(null);

                                    }}
                                >
                                    Close
                                </button>


                                <button
                                     type="button"
                                     className="btn btn-outline-danger"
                                     onClick={() => {
                                      setRejectionReason("");
                                      setRejectionRemarks("");
                                     setShowRejectModal(true);
                                   }}
                                    >

                                   <i className="bi bi-x-lg me-1"></i>

                                    Reject KYC

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => {
                                     setVerificationRemarks("");
                                     setShowVerifyModal(true);
                                    }}
                                >

                                    <i className="bi bi-check-lg me-1"></i>

                                    Verify KYC

                                </button>


                            </div>


                        </div>

                    </div>

                </div>

            )}

            {/* =========================================
    REJECT KYC MODAL
========================================= */}

{showRejectModal && selectedKYC && (

    <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{
            backgroundColor: "rgba(0,0,0,0.6)"
        }}
    >

        <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

                {/* MODAL HEADER */}

                <div className="modal-header">

                    <div>

                        <h5 className="modal-title fw-bold">
                            Reject KYC Application
                        </h5>

                        <small className="text-muted">
                            {selectedKYC.fullName}
                        </small>

                    </div>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                            setShowRejectModal(false);
                            setRejectionReason("");
                            setRejectionRemarks("");
                        }}
                    ></button>

                </div>


                {/* MODAL BODY */}

                <div className="modal-body">

                    {/* REJECTION REASON */}

                    <div className="mb-3">

                        <label className="form-label fw-semibold">
                            Rejection Reason
                            <span className="text-danger"> *</span>
                        </label>

                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Enter reason for rejecting this KYC application..."
                            value={rejectionReason}
                            onChange={(e) =>
                                setRejectionReason(e.target.value)
                            }
                        ></textarea>

                        <small className="text-muted">
                            Please provide a clear reason that the customer
                            can understand and correct during resubmission.
                        </small>

                    </div>


                    {/* ADMIN REMARKS */}

                    <div className="mb-2">

                        <label className="form-label fw-semibold">
                            Admin Remarks
                            <span className="text-muted">
                                {" "} (Optional)
                            </span>
                        </label>

                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Add any additional remarks..."
                            value={rejectionRemarks}
                            onChange={(e) =>
                                setRejectionRemarks(e.target.value)
                            }
                        ></textarea>

                    </div>

                </div>


                {/* MODAL FOOTER */}

                <div className="modal-footer">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setShowRejectModal(false);
                            setRejectionReason("");
                            setRejectionRemarks("");
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger"
                        disabled={!rejectionReason.trim()}
                        onClick={handleReject}
                    >

                        <i className="bi bi-x-circle me-1"></i>

                        Reject KYC

                    </button>

                </div>

            </div>

        </div>

    </div>

)}
     {/* =========================================
    VERIFY KYC MODAL
========================================= */}

{showVerifyModal && selectedKYC && (

    <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{
            backgroundColor: "rgba(0,0,0,0.6)"
        }}
    >

        <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

                {/* MODAL HEADER */}

                <div className="modal-header">

                    <div>

                        <h5 className="modal-title fw-bold">
                            Confirm KYC Verification
                        </h5>

                        <small className="text-muted">
                            {selectedKYC.fullName}
                        </small>

                    </div>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                            setShowVerifyModal(false);
                            setVerificationRemarks("");
                        }}
                    ></button>

                </div>


                {/* MODAL BODY */}

                <div className="modal-body">

                    <div className="alert alert-success">

                        <div className="d-flex align-items-start">

                            <i className="bi bi-shield-check fs-4 me-3"></i>

                            <div>

                                <strong>
                                    Confirm KYC verification
                                </strong>

                                <div className="mt-1">
                                    Please confirm that you have reviewed
                                    the customer's submitted documents
                                    before verifying this KYC application.
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* VERIFICATION REMARKS */}

                    <div className="mb-2">

                        <label className="form-label fw-semibold">
                            Verification Remarks
                            <span className="text-muted">
                                {" "} (Optional)
                            </span>
                        </label>

                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Add verification remarks..."
                            value={verificationRemarks}
                            onChange={(e) =>
                                setVerificationRemarks(e.target.value)
                            }
                        ></textarea>

                        <small className="text-muted">
                            These remarks will be stored with the KYC
                            verification record.
                        </small>

                    </div>

                </div>


                {/* MODAL FOOTER */}

                <div className="modal-footer">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setShowVerifyModal(false);
                            setVerificationRemarks("");
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleVerify}
                    >

                        <i className="bi bi-check-circle me-1"></i>

                        Verify KYC

                    </button>

                </div>

            </div>

        </div>

    </div>

)}


        </div>

    );
}

export default KYCManagement;