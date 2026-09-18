package com.atul.banking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DepositRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Deposit amount must be greater than zero")
    private Double amount;

    public DepositRequest() {
    }

    public DepositRequest(Double amount) {
        this.amount = amount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}