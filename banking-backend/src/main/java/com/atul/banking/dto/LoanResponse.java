package com.atul.banking.dto;

import java.time.LocalDateTime;

public class LoanResponse {

    private Long id;
    private String customerEmail;

    private String loanType;
    private Double amount;
    private Double interestRate;
    private Integer tenureMonths;
    private Double emi;

    // EMI Tracking
    private Double remainingAmount;
    private Integer paidInstallments;
    private Integer remainingInstallments;
    private LocalDateTime nextEmiDate;

    // Status
    private String status;

    // Rejection Information
    private String rejectionReason;

    // Dates
    private LocalDateTime appliedDate;
    private LocalDateTime approvedDate;
    private LocalDateTime disbursedDate;
    private LocalDateTime closedDate;

    public LoanResponse() {
    }

    public LoanResponse(
            Long id,
            String customerEmail,
            String loanType,
            Double amount,
            Double interestRate,
            Integer tenureMonths,
            Double emi,
            Double remainingAmount,
            Integer paidInstallments,
            Integer remainingInstallments,
            LocalDateTime nextEmiDate,
            String status,
            String rejectionReason,
            LocalDateTime appliedDate,
            LocalDateTime approvedDate,
            LocalDateTime disbursedDate,
            LocalDateTime closedDate) {

        this.id = id;
        this.customerEmail = customerEmail;
        this.loanType = loanType;
        this.amount = amount;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.emi = emi;

        this.remainingAmount = remainingAmount;
        this.paidInstallments = paidInstallments;
        this.remainingInstallments = remainingInstallments;
        this.nextEmiDate = nextEmiDate;

        this.status = status;
        this.rejectionReason = rejectionReason;

        this.appliedDate = appliedDate;
        this.approvedDate = approvedDate;
        this.disbursedDate = disbursedDate;
        this.closedDate = closedDate;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getLoanType() {
        return loanType;
    }

    public Double getAmount() {
        return amount;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public Double getEmi() {
        return emi;
    }

    public Double getRemainingAmount() {
        return remainingAmount;
    }

    public Integer getPaidInstallments() {
        return paidInstallments;
    }

    public Integer getRemainingInstallments() {
        return remainingInstallments;
    }

    public LocalDateTime getNextEmiDate() {
        return nextEmiDate;
    }

    public String getStatus() {
        return status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }

    public LocalDateTime getDisbursedDate() {
        return disbursedDate;
    }

    public LocalDateTime getClosedDate() {
        return closedDate;
    }
}