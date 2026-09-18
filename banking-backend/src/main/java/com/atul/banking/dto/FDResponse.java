package com.atul.banking.dto;

import java.time.LocalDateTime;

public class FDResponse {

    private Long id;
    private Double principalAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private Double maturityAmount;
    private String status;
    private LocalDateTime createdDate;
    private String rejectionReason;

    public FDResponse() {
    }

    public FDResponse(
        Long id,
        Double principalAmount,
        Double interestRate,
        Integer tenureMonths,
        Double maturityAmount,
        String status,
        LocalDateTime createdDate,
        String rejectionReason) {

    this.id = id;
    this.principalAmount = principalAmount;
    this.interestRate = interestRate;
    this.tenureMonths = tenureMonths;
    this.maturityAmount = maturityAmount;
    this.status = status;
    this.createdDate = createdDate;
    this.rejectionReason = rejectionReason;
}

    public Long getId() {
        return id;
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

    public String getRejectionReason() {
    return rejectionReason;
}
}