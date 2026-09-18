package com.atul.banking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class WithdrawRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Withdrawal amount must be greater than zero")
    private Double amount;

    public WithdrawRequest() {
    }

    public WithdrawRequest(Double amount) {
        this.amount = amount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}