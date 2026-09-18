package com.atul.banking.dto;

import java.time.LocalDateTime;

public class FDAdminResponse {

    private Long id;

    private String customerEmail;

    private Double principalAmount;

    private Double interestRate;

    private Integer tenureMonths;

    private Double maturityAmount;

    private String status;

    private LocalDateTime createdDate;

    private LocalDateTime approvedDate;

    private String approvedBy;

    private LocalDateTime rejectedDate;

    private String rejectedBy;

    private LocalDateTime maturityDate;

    private LocalDateTime closedDate;

    private String rejectionReason;


    public FDAdminResponse() {
    }


    public FDAdminResponse(
            Long id,
            String customerEmail,
            Double principalAmount,
            Double interestRate,
            Integer tenureMonths,
            Double maturityAmount,
            String status,
            LocalDateTime createdDate,
            LocalDateTime approvedDate,
            String approvedBy,
            LocalDateTime rejectedDate,
            String rejectedBy,
            LocalDateTime maturityDate,
            LocalDateTime closedDate,
            String rejectionReason) {

        this.id = id;
        this.customerEmail = customerEmail;
        this.principalAmount = principalAmount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.maturityAmount = maturityAmount;
        this.status = status;
        this.createdDate = createdDate;
        this.approvedDate = approvedDate;
        this.approvedBy = approvedBy;
        this.rejectedDate = rejectedDate;
        this.rejectedBy = rejectedBy;
        this.maturityDate = maturityDate;
        this.closedDate = closedDate;
        this.rejectionReason = rejectionReason;
    }


    public Long getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public Double getPrincipalAmount() {
        return principalAmount;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public Double getMaturityAmount() {
        return maturityAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public LocalDateTime getRejectedDate() {
        return rejectedDate;
    }

    public String getRejectedBy() {
        return rejectedBy;
    }

    public LocalDateTime getMaturityDate() {
        return maturityDate;
    }

    public LocalDateTime getClosedDate() {
        return closedDate;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }
}