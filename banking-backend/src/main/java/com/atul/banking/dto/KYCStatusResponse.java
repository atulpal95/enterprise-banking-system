package com.atul.banking.dto;

public class KYCStatusResponse {

    private String status;

    private String rejectionReason;

    private String verificationRemarks;

    public KYCStatusResponse() {
    }

    public KYCStatusResponse(
            String status,
            String rejectionReason,
            String verificationRemarks
    ) {

        this.status = status;
        this.rejectionReason = rejectionReason;
        this.verificationRemarks = verificationRemarks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getVerificationRemarks() {
        return verificationRemarks;
    }

    public void setVerificationRemarks(String verificationRemarks) {
        this.verificationRemarks = verificationRemarks;
    }
}