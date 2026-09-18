package com.atul.banking.dto;

public class DashboardStatsResponse {

    private Double totalDeposits;
    private Double totalWithdrawals;
    private Long totalTransactions;

    public DashboardStatsResponse() {}

    public DashboardStatsResponse(
            Double totalDeposits,
            Double totalWithdrawals,
            Long totalTransactions) {

        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.totalTransactions = totalTransactions;
    }

    public Double getTotalDeposits() {
        return totalDeposits;
    }

    public void setTotalDeposits(Double totalDeposits) {
        this.totalDeposits = totalDeposits;
    }

    public Double getTotalWithdrawals() {
        return totalWithdrawals;
    }

    public void setTotalWithdrawals(Double totalWithdrawals) {
        this.totalWithdrawals = totalWithdrawals;
    }

    public Long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(Long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
}