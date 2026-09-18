package com.atul.banking.dto.analytics;

public class MonthlyTransactionDTO {

    private String month;
    private long totalTransactions;

    public MonthlyTransactionDTO() {
    }

    public MonthlyTransactionDTO(String month, long totalTransactions) {
        this.month = month;
        this.totalTransactions = totalTransactions;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
}