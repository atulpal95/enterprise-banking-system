package com.atul.banking.dto;

import java.time.LocalDateTime;

public class BalanceResponse {

    private String message;

    private Double balance;

    private String reference;

    private LocalDateTime transactionTime;

    private Double amount;

    public BalanceResponse() {
    }

    public BalanceResponse(
        String message,
        Double balance
) {

    this.message = message;
    this.balance = balance;

}

    public BalanceResponse(
            String message,
            Double balance,
            String reference,
            LocalDateTime transactionTime,
            Double amount
    ) {

        this.message = message;
        this.balance = balance;
        this.reference = reference;
        this.transactionTime = transactionTime;
        this.amount = amount;
    }

    // ------------------------
    // Getters & Setters
    // ------------------------

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public LocalDateTime getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(LocalDateTime transactionTime) {
        this.transactionTime = transactionTime;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}