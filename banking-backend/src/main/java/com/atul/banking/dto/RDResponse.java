package com.atul.banking.dto;

import java.time.LocalDateTime;

public class RDResponse {

    private Long id;

    private Double monthlyInstallment;

    private Double interestRate;

    private Integer tenureMonths;

    private Double totalDeposited;

    private Double maturityAmount;

    private Integer paidInstallments;

    private String status;

    private LocalDateTime createdDate;

    private LocalDateTime nextInstallmentDate;

    private LocalDateTime maturityDate;

    private String rejectionReason;

    public RDResponse(
            Long id,
            Double monthlyInstallment,
            Double interestRate,
            Integer tenureMonths,
            Double totalDeposited,
            Double maturityAmount,
            Integer paidInstallments,
            String status,
            LocalDateTime createdDate,
            LocalDateTime nextInstallmentDate,
            LocalDateTime maturityDate,
            String rejectionReason) {

        this.id = id;
        this.monthlyInstallment = monthlyInstallment;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.totalDeposited = totalDeposited;
        this.maturityAmount = maturityAmount;
        this.paidInstallments = paidInstallments;
        this.status = status;
        this.createdDate = createdDate;
        this.nextInstallmentDate = nextInstallmentDate;
        this.maturityDate = maturityDate;
        this.rejectionReason = rejectionReason;
    }

    public Long getId() {
        return id;
    }

    public Double getMonthlyInstallment() {
        return monthlyInstallment;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public Double getTotalDeposited() {
        return totalDeposited;
    }

    public Double getMaturityAmount() {
        return maturityAmount;
    }

    public Integer getPaidInstallments() {
        return paidInstallments;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getNextInstallmentDate() {
        return nextInstallmentDate;
    }

    public LocalDateTime getMaturityDate() {
        return maturityDate;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }
}