package com.atul.banking.dto;

import java.time.LocalDateTime;

public class KYCResponse {

    // ==========================
    // KYC Information
    // ==========================

    private Long id;

    private String documentType;

    private String documentNumber;

    private String frontDocumentUrl;

    private String backDocumentUrl;

    private String selfieUrl;

    private String status;

    private String rejectionReason;

    private String verificationRemarks;

    private String reviewedBy;

    private LocalDateTime submittedAt;

    private LocalDateTime verifiedAt;

    private LocalDateTime reviewedAt;

    private LocalDateTime expiresAt;


    // ==========================
    // Customer Information
    // ==========================

    private String fullName;

    private String email;

    private String mobile;

    private String accountStatus;

    private String kycStatus;


    // ==========================
    // Default Constructor
    // ==========================

    public KYCResponse() {
    }


    // ==========================
    // Full Constructor
    // ==========================

    public KYCResponse(
            Long id,
            String documentType,
            String documentNumber,
            String frontDocumentUrl,
            String backDocumentUrl,
            String selfieUrl,
            String status,
            String rejectionReason,
            String verificationRemarks,
            String reviewedBy,
            LocalDateTime submittedAt,
            LocalDateTime verifiedAt,
            LocalDateTime reviewedAt,
            LocalDateTime expiresAt,
            String fullName,
            String email,
            String mobile,
            String accountStatus,
            String kycStatus
    ) {

        this.id = id;
        this.documentType = documentType;
        this.documentNumber = documentNumber;
        this.frontDocumentUrl = frontDocumentUrl;
        this.backDocumentUrl = backDocumentUrl;
        this.selfieUrl = selfieUrl;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.verificationRemarks = verificationRemarks;
        this.reviewedBy = reviewedBy;
        this.submittedAt = submittedAt;
        this.verifiedAt = verifiedAt;
        this.reviewedAt = reviewedAt;
        this.expiresAt = expiresAt;

        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.accountStatus = accountStatus;
        this.kycStatus = kycStatus;
    }
    public KYCResponse(
        Long id,
        String documentType,
        String documentNumber,
        String frontDocumentUrl,
        String backDocumentUrl,
        String selfieUrl,
        String status,
        String rejectionReason,
        String verificationRemarks,
        String reviewedBy,
        LocalDateTime submittedAt,
        LocalDateTime verifiedAt,
        LocalDateTime reviewedAt,
        LocalDateTime expiresAt
) {
    this.id = id;
    this.documentType = documentType;
    this.documentNumber = documentNumber;
    this.frontDocumentUrl = frontDocumentUrl;
    this.backDocumentUrl = backDocumentUrl;
    this.selfieUrl = selfieUrl;
    this.status = status;
    this.rejectionReason = rejectionReason;
    this.verificationRemarks = verificationRemarks;
    this.reviewedBy = reviewedBy;
    this.submittedAt = submittedAt;
    this.verifiedAt = verifiedAt;
    this.reviewedAt = reviewedAt;
    this.expiresAt = expiresAt;
}


    // ==========================
    // KYC Getters & Setters
    // ==========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public String getFrontDocumentUrl() {
        return frontDocumentUrl;
    }

    public void setFrontDocumentUrl(String frontDocumentUrl) {
        this.frontDocumentUrl = frontDocumentUrl;
    }

    public String getBackDocumentUrl() {
        return backDocumentUrl;
    }

    public void setBackDocumentUrl(String backDocumentUrl) {
        this.backDocumentUrl = backDocumentUrl;
    }

    public String getSelfieUrl() {
        return selfieUrl;
    }

    public void setSelfieUrl(String selfieUrl) {
        this.selfieUrl = selfieUrl;
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

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }


    // ==========================
    // Customer Getters & Setters
    // ==========================

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }
}