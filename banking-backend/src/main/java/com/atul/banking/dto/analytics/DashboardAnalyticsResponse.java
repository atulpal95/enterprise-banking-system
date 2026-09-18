package com.atul.banking.dto.analytics;

import java.util.List;

public class DashboardAnalyticsResponse {

    private List<MonthlyTransactionDTO> monthlyTransactions;

    private List<TransactionTypeDTO> transactionTypes;

    private List<LoanStatusDTO> loanStatus;

    private List<DepositStatusDTO> fixedDepositStatus;

    private List<DepositStatusDTO> recurringDepositStatus;

    private List<TopCustomerDTO> topCustomers;

    public DashboardAnalyticsResponse() {
    }

    public DashboardAnalyticsResponse(
            List<MonthlyTransactionDTO> monthlyTransactions,
            List<TransactionTypeDTO> transactionTypes,
            List<LoanStatusDTO> loanStatus,
            List<DepositStatusDTO> fixedDepositStatus,
            List<DepositStatusDTO> recurringDepositStatus,
            List<TopCustomerDTO> topCustomers) {

        this.monthlyTransactions = monthlyTransactions;
        this.transactionTypes = transactionTypes;
        this.loanStatus = loanStatus;
        this.fixedDepositStatus = fixedDepositStatus;
        this.recurringDepositStatus = recurringDepositStatus;
        this.topCustomers = topCustomers;
    }

    public List<MonthlyTransactionDTO> getMonthlyTransactions() {
        return monthlyTransactions;
    }

    public void setMonthlyTransactions(List<MonthlyTransactionDTO> monthlyTransactions) {
        this.monthlyTransactions = monthlyTransactions;
    }

    public List<TransactionTypeDTO> getTransactionTypes() {
        return transactionTypes;
    }

    public void setTransactionTypes(List<TransactionTypeDTO> transactionTypes) {
        this.transactionTypes = transactionTypes;
    }

    public List<LoanStatusDTO> getLoanStatus() {
        return loanStatus;
    }

    public void setLoanStatus(List<LoanStatusDTO> loanStatus) {
        this.loanStatus = loanStatus;
    }

    public List<DepositStatusDTO> getFixedDepositStatus() {
        return fixedDepositStatus;
    }

    public void setFixedDepositStatus(List<DepositStatusDTO> fixedDepositStatus) {
        this.fixedDepositStatus = fixedDepositStatus;
    }

    public List<DepositStatusDTO> getRecurringDepositStatus() {
        return recurringDepositStatus;
    }

    public void setRecurringDepositStatus(List<DepositStatusDTO> recurringDepositStatus) {
        this.recurringDepositStatus = recurringDepositStatus;
    }

    public List<TopCustomerDTO> getTopCustomers() {
        return topCustomers;
    }

    public void setTopCustomers(List<TopCustomerDTO> topCustomers) {
        this.topCustomers = topCustomers;
    }
}