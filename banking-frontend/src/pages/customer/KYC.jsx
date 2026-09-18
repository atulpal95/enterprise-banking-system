import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import customerService from "../../services/customerService";

function KYC() {

    const [status, setStatus] = useState("NOT_SUBMITTED");
    const [rejectionReason, setRejectionReason] = useState(null);
    const [verificationRemarks, setVerificationRemarks] = useState(null);

    const [documentType, setDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");

    const [frontDocument, setFrontDocument] = useState(null);
    const [backDocument, setBackDocument] = useState(null);
    const [selfie, setSelfie] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // =====================================================
    // LOAD KYC STATUS
    // =====================================================

    const loadKYCStatus = async () => {

        try {

            setLoading(true);

            const response =
                await customerService.getKYCStatus();

            setStatus(
                response.data?.status ||
                "NOT_SUBMITTED"
            );

            setRejectionReason(
                response.data?.rejectionReason || null
            );

            setVerificationRemarks(
                response.data?.verificationRemarks || null
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load KYC status."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadKYCStatus();

    }, []);


    // =====================================================
    // SUBMIT KYC
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!documentType) {

            toast.error(
                "Please select document type."
            );

            return;
        }

        if (!documentNumber.trim()) {

            toast.error(
                "Please enter document number."
            );

            return;
        }

        if (!frontDocument) {

            toast.error(
                "Please upload front document."
            );

            return;
        }

        if (!backDocument) {

            toast.error(
                "Please upload back document."
            );

            return;
        }

        if (!selfie) {

            toast.error(
                "Please upload selfie."
            );

            return;
        }

        try {

            setSubmitting(true);

            const formData = new FormData();

            formData.append(
                "documentType",
                documentType
            );

            formData.append(
                "documentNumber",
                documentNumber
            );

            formData.append(
                "frontDocument",
                frontDocument
            );

            formData.append(
                "backDocument",
                backDocument
            );

            formData.append(
                "selfie",
                selfie
            );

            await customerService.submitKYC(
                formData
            );

            toast.success(
                "KYC submitted successfully."
            );

            // Clear form

            setDocumentType("");
            setDocumentNumber("");
            setFrontDocument(null);
            setBackDocument(null);
            setSelfie(null);

            // Reload status

            await loadKYCStatus();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "KYC submission failed."
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="container py-5">

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <p className="mt-3 text-muted">
                        Loading KYC status...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // VERIFIED
    // =====================================================

    if (status === "VERIFIED") {

        return (

            <div className="container py-5">

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center p-5">

                        <div className="text-success mb-3">

                            <i className="bi bi-patch-check-fill fs-1"></i>

                        </div>

                        <h2 className="fw-bold">
                            KYC Verified
                        </h2>

                        <p className="text-muted mb-0">
                            Your KYC has been successfully verified.
                        </p>

                        {verificationRemarks && (

                            <div className="alert alert-success mt-4">

                                <strong>
                                    Verification Remarks:
                                </strong>

                                <div className="mt-1">
                                    {verificationRemarks}
                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // PENDING
    // =====================================================

    if (status === "PENDING") {

        return (

            <div className="container py-5">

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center p-5">

                        <div className="text-warning mb-3">

                            <i className="bi bi-hourglass-split fs-1"></i>

                        </div>

                        <h2 className="fw-bold">
                            KYC Under Review
                        </h2>

                        <p className="text-muted mb-0">

                            Your KYC application has been submitted
                            and is currently being reviewed by the bank.

                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // REJECTED
    // =====================================================

    if (status === "REJECTED") {

        return (

            <div className="container py-4">

                <div className="card border-0 shadow-sm">

                    <div className="card-body p-4">

                        <div className="text-center mb-4">

                            <div className="text-danger">

                                <i className="bi bi-x-circle-fill fs-1"></i>

                            </div>

                            <h2 className="fw-bold mt-2">
                                KYC Rejected
                            </h2>

                            <p className="text-muted">
                                Your previous KYC application was rejected.
                            </p>

                        </div>

                        {rejectionReason && (

                            <div className="alert alert-danger">

                                <strong>
                                    Rejection Reason:
                                </strong>

                                <div className="mt-1">
                                    {rejectionReason}
                                </div>

                            </div>

                        )}

                        {verificationRemarks && (

                            <div className="alert alert-secondary">

                                <strong>
                                    Admin Remarks:
                                </strong>

                                <div className="mt-1">
                                    {verificationRemarks}
                                </div>

                            </div>

                        )}

                        <hr />

                        <h4 className="mb-3">
                            Resubmit KYC
                        </h4>

                        {renderKYCForm(
                            documentType,
                            setDocumentType,
                            documentNumber,
                            setDocumentNumber,
                            frontDocument,
                            setFrontDocument,
                            backDocument,
                            setBackDocument,
                            selfie,
                            setSelfie,
                            handleSubmit,
                            submitting
                        )}

                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // NOT SUBMITTED
    // =====================================================

    return (

        <div className="container py-4">

            <div className="card border-0 shadow-sm">

                <div className="card-body p-4">

                    <div className="mb-4">

                        <h2 className="fw-bold">
                            KYC Verification
                        </h2>

                        <p className="text-muted">
                            Submit your identity documents for verification.
                        </p>

                    </div>

                    {renderKYCForm(
                        documentType,
                        setDocumentType,
                        documentNumber,
                        setDocumentNumber,
                        frontDocument,
                        setFrontDocument,
                        backDocument,
                        setBackDocument,
                        selfie,
                        setSelfie,
                        handleSubmit,
                        submitting
                    )}

                </div>

            </div>

        </div>

    );

}


// =====================================================
// KYC FORM
// =====================================================

function renderKYCForm(
    documentType,
    setDocumentType,
    documentNumber,
    setDocumentNumber,
    frontDocument,
    setFrontDocument,
    backDocument,
    setBackDocument,
    selfie,
    setSelfie,
    handleSubmit,
    submitting
) {

    return (

        <form onSubmit={handleSubmit}>

            {/* Document Type */}

            <div className="mb-3">

                <label className="form-label fw-semibold">
                    Document Type
                </label>

                <select
                    className="form-select"
                    value={documentType}
                    onChange={(e) =>
                        setDocumentType(e.target.value)
                    }
                    disabled={submitting}
                >

                    <option value="">
                        Select document
                    </option>

                    <option value="AADHAAR">
                        Aadhaar Card
                    </option>

                    <option value="PAN">
                        PAN Card
                    </option>

                    <option value="PASSPORT">
                        Passport
                    </option>

                    <option value="DRIVING_LICENSE">
                        Driving License
                    </option>

                </select>

            </div>


            {/* Document Number */}

            <div className="mb-3">

                <label className="form-label fw-semibold">
                    Document Number
                </label>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter document number"
                    value={documentNumber}
                    onChange={(e) =>
                        setDocumentNumber(e.target.value)
                    }
                    disabled={submitting}
                />

            </div>


            {/* Front */}

            <div className="mb-3">

                <label className="form-label fw-semibold">
                    Front Document
                </label>

                <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                        setFrontDocument(
                            e.target.files[0]
                        )
                    }
                    disabled={submitting}
                />

            </div>


            {/* Back */}

            <div className="mb-3">

                <label className="form-label fw-semibold">
                    Back Document
                </label>

                <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                        setBackDocument(
                            e.target.files[0]
                        )
                    }
                    disabled={submitting}
                />

            </div>


            {/* Selfie */}

            <div className="mb-4">

                <label className="form-label fw-semibold">
                    Selfie
                </label>

                <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                        setSelfie(
                            e.target.files[0]
                        )
                    }
                    disabled={submitting}
                />

            </div>


            <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={submitting}
            >

                {submitting ? (

                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                        />

                        Submitting...

                    </>

                ) : (

                    <>
                        <i className="bi bi-send me-2"></i>
                        Submit KYC
                    </>

                )}

            </button>

        </form>

    );
}

export default KYC;