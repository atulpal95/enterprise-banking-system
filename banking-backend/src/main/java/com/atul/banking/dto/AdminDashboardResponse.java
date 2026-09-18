package com.atul.banking.dto;

public class AdminDashboardResponse {

    // Customer Statistics
    private long totalCustomers;
    private long activeCustomers;
    private long blockedCustomers;

    // Financial Statistics
    private double totalBalance;

    // Transaction Statistics
    private long totalTransactions;
    private long totalDeposits;
    private long totalWithdrawals;

    // Loan Statistics
    private long totalLoans;
    private long approvedLoans;
    private long rejectedLoans;
    private long disbursedLoans;
    private long closedLoans;
    private long pendingLoans;

    // Fixed Deposit Statistics
    private long totalFixedDeposits;
    private long activeFixedDeposits;
    private long pendingFixedDeposits;

    // Recurring Deposit Statistics
    private long totalRecurringDeposits;
    private long activeRecurringDeposits;
    private long pendingRecurringDeposits;

    // Other Statistics
    private long totalAdmins;
    private long totalATMCards;
    private long totalChequeBookRequests;

    public AdminDashboardResponse() {
    }

    public AdminDashboardResponse(
            long totalCustomers,
            long activeCustomers,
            long blockedCustomers,
            double totalBalance,
            long totalTransactions,
            long totalDeposits,
            long totalWithdrawals,
            long totalLoans,
            long totalFixedDeposits,
            long totalRecurringDeposits,
            long totalATMCards,
            long totalChequeBookRequests,
            long pendingLoans,
            long pendingFixedDeposits,
            long pendingRecurringDeposits) {

        this.totalCustomers = totalCustomers;
        this.activeCustomers = activeCustomers;
        this.blockedCustomers = blockedCustomers;
        this.totalBalance = totalBalance;
        this.totalTransactions = totalTransactions;
        this.totalDeposits = totalDeposits;
        this.totalWithdrawals = totalWithdrawals;
        this.totalLoans = totalLoans;
        this.totalFixedDeposits = totalFixedDeposits;
        this.totalRecurringDeposits = totalRecurringDeposits;
        this.totalATMCards = totalATMCards;
        this.totalChequeBookRequests = totalChequeBookRequests;
        this.pendingLoans = pendingLoans;
        this.pendingFixedDeposits = pendingFixedDeposits;
        this.pendingRecurringDeposits = pendingRecurringDeposits;
    }

    // ================= Customer =================

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getActiveCustomers() {
        return activeCustomers;
    }

    public void setActiveCustomers(long activeCustomers) {
        this.activeCustomers = activeCustomers;
    }

    public long getBlockedCustomers() {
        return blockedCustomers;
    }

    public void setBlockedCustomers(long blockedCustomers) {
        this.blockedCustomers = blockedCustomers;
    }

    // ================= Balance =================

    public double getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(double totalBalance) {
        this.totalBalance = totalBalance;
    }

    // ================= Transactions =================

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getTotalDeposits() {
        return totalDeposits;
    }

    public void setTotalDeposits(long totalDeposits) {
        this.totalDeposits = totalDeposits;
    }

    public long getTotalWithdrawals() {
        return totalWithdrawals;
    }

    public void setTotalWithdrawals(long totalWithdrawals) {
        this.totalWithdrawals = totalWithdrawals;
    }

    // ================= Loans =================

    public long getTotalLoans() {
        return totalLoans;
    }

    public void setTotalLoans(long totalLoans) {
        this.totalLoans = totalLoans;
    }

    public long getApprovedLoans() {
        return approvedLoans;
    }

    public void setApprovedLoans(long approvedLoans) {
        this.approvedLoans = approvedLoans;
    }

    public long getRejectedLoans() {
        return rejectedLoans;
    }

    public void setRejectedLoans(long rejectedLoans) {
        this.rejectedLoans = rejectedLoans;
    }

    public long getDisbursedLoans() {
        return disbursedLoans;
    }

    public void setDisbursedLoans(long disbursedLoans) {
        this.disbursedLoans = disbursedLoans;
    }

    public long getClosedLoans() {
        return closedLoans;
    }

    public void setClosedLoans(long closedLoans) {
        this.closedLoans = closedLoans;
    }

    public long getPendingLoans() {
        return pendingLoans;
    }

    public void setPendingLoans(long pendingLoans) {
        this.pendingLoans = pendingLoans;
    }

    // ================= Fixed Deposits =================

    public long getTotalFixedDeposits() {
        return totalFixedDeposits;
    }

    public void setTotalFixedDeposits(long totalFixedDeposits) {
        this.totalFixedDeposits = totalFixedDeposits;
    }

    public long getActiveFixedDeposits() {
        return activeFixedDeposits;
    }

    public void setActiveFixedDeposits(long activeFixedDeposits) {
        this.activeFixedDeposits = activeFixedDeposits;
    }

    public long getPendingFixedDeposits() {
        return pendingFixedDeposits;
    }

    public void setPendingFixedDeposits(long pendingFixedDeposits) {
        this.pendingFixedDeposits = pendingFixedDeposits;
    }

    // ================= Recurring Deposits =================

    public long getTotalRecurringDeposits() {
        return totalRecurringDeposits;
    }

    public void setTotalRecurringDeposits(long totalRecurringDeposits) {
        this.totalRecurringDeposits = totalRecurringDeposits;
    }

    public long getActiveRecurringDeposits() {
        return activeRecurringDeposits;
    }

    public void setActiveRecurringDeposits(long activeRecurringDeposits) {
        this.activeRecurringDeposits = activeRecurringDeposits;
    }

    public long getPendingRecurringDeposits() {
        return pendingRecurringDeposits;
    }

    public void setPendingRecurringDeposits(long pendingRecurringDeposits) {
        this.pendingRecurringDeposits = pendingRecurringDeposits;
    }

    // ================= Other =================

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalATMCards() {
        return totalATMCards;
    }

    public void setTotalATMCards(long totalATMCards) {
        this.totalATMCards = totalATMCards;
    }

    public long getTotalChequeBookRequests() {
        return totalChequeBookRequests;
    }

    public void setTotalChequeBookRequests(long totalChequeBookRequests) {
        this.totalChequeBookRequests = totalChequeBookRequests;
    }
}