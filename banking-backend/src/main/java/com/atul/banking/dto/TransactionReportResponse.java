package com.atul.banking.dto;

import java.time.LocalDateTime;

public class TransactionReportResponse {

    private Long transactionId;
    private String customerEmail;
    private String transactionType;
    private Double amount;
    private Double balanceAfterTransaction;
    private LocalDateTime transactionTime;

    public TransactionReportResponse() {
    }

    public TransactionReportResponse(
            Long transactionId,
            String customerEmail,
            String transactionType,
            Double amount,
            Double balanceAfterTransaction,
            LocalDateTime transactionTime) {

        this.transactionId = transactionId;
        this.customerEmail = customerEmail;
        this.transactionType = transactionType;
        this.amount = amount;
        this.balanceAfterTransaction = balanceAfterTransaction;
        this.transactionTime = transactionTime;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getBalanceAfterTransaction() {
        return balanceAfterTransaction;
    }

    public void setBalanceAfterTransaction(Double balanceAfterTransaction) {
        this.balanceAfterTransaction = balanceAfterTransaction;
    }

    public LocalDateTime getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(LocalDateTime transactionTime) {
        this.transactionTime = transactionTime;
    }
}