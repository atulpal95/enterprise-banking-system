package com.atul.banking.dto.analytics;

public class TopCustomerDTO {

    private String fullName;
    private String accountNumber;
    private double balance;

    public TopCustomerDTO() {
    }

    public TopCustomerDTO(String fullName,
                          String accountNumber,
                          double balance) {
        this.fullName = fullName;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}