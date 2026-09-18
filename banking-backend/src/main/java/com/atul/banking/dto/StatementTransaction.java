package com.atul.banking.dto;

import java.time.LocalDateTime;

public class StatementTransaction {

    private LocalDateTime date;
    private String type;
    private Double amount;
    private Double balance;

    public StatementTransaction() {
    }

    public StatementTransaction(LocalDateTime date,
                                String type,
                                Double amount,
                                Double balance) {
        this.date = date;
        this.type = type;
        this.amount = amount;
        this.balance = balance;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}