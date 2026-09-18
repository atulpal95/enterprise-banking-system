package com.atul.banking.dto;

import java.time.LocalDateTime;

public class TransferResponse {

    private String message;

    private Double senderBalance;

    private Double receiverBalance;

    private String reference;

    private LocalDateTime transactionTime;

    private String receiverName;

    private String receiverAccount;

    private Double amount;

    public TransferResponse() {
    }

    public TransferResponse(
            String message,
            Double senderBalance,
            Double receiverBalance,
            String reference,
            LocalDateTime transactionTime,
            String receiverName,
            String receiverAccount,
            Double amount
    ) {
        this.message = message;
        this.senderBalance = senderBalance;
        this.receiverBalance = receiverBalance;
        this.reference = reference;
        this.transactionTime = transactionTime;
        this.receiverName = receiverName;
        this.receiverAccount = receiverAccount;
        this.amount = amount;
    }

    // Getters & Setters

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Double getSenderBalance() {
        return senderBalance;
    }

    public void setSenderBalance(Double senderBalance) {
        this.senderBalance = senderBalance;
    }

    public Double getReceiverBalance() {
        return receiverBalance;
    }

    public void setReceiverBalance(Double receiverBalance) {
        this.receiverBalance = receiverBalance;
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

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverAccount() {
        return receiverAccount;
    }

    public void setReceiverAccount(String receiverAccount) {
        this.receiverAccount = receiverAccount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}