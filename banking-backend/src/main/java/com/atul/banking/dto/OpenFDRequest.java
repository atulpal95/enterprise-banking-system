package com.atul.banking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OpenFDRequest {

    @NotNull(message = "Amount is required")
    @Min(value = 1000, message = "Minimum FD amount is ₹1000")
    private Double amount;

    @NotNull(message = "Tenure is required")
    @Min(value = 1, message = "Minimum tenure is 1 month")
    private Integer tenureMonths;

    public OpenFDRequest() {
    }

    public OpenFDRequest(Double amount, Integer tenureMonths) {
        this.amount = amount;
        this.tenureMonths = tenureMonths;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }
}