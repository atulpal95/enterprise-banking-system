package com.atul.banking.dto.analytics;

public class MonthlySpendingResponse {

    private String month;
    private Double amount;

    public MonthlySpendingResponse() {
    }

    public MonthlySpendingResponse(String month, Double amount) {
        this.month = month;
        this.amount = amount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}