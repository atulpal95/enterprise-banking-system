package com.atul.banking.dto;

public class BeneficiaryTransferRequest {

    private Long beneficiaryId;

    private Double amount;

    public BeneficiaryTransferRequest() {
    }

    public Long getBeneficiaryId() {
        return beneficiaryId;
    }

    public void setBeneficiaryId(Long beneficiaryId) {
        this.beneficiaryId = beneficiaryId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}