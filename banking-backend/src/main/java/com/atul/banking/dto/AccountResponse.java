package com.atul.banking.dto;

public class AccountResponse {

    private String fullName;
    private String email;
    private String mobile;

    private String accountNumber;
    private String ifscCode;
    private Double balance;

    private String accountType;
    private String branchName;

    private String atmCardStatus;
    private String kycStatus;

    private boolean active;


    // =========================
    // Constructor
    // =========================

    public AccountResponse() {
    }

    public AccountResponse(
            String fullName,
            String email,
            String mobile,
            String accountNumber,
            String ifscCode,
            Double balance,
            String accountType,
            String branchName,
            String atmCardStatus,
            String kycStatus,
            boolean active
    ) {

        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.balance = balance;

        this.accountType = accountType;
        this.branchName = branchName;

        this.atmCardStatus = atmCardStatus;
        this.kycStatus = kycStatus;

        this.active = active;
    }


    // =========================
    // Getters & Setters
    // =========================

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }


    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }


    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }


    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }


    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }


    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }


    public String getAtmCardStatus() {
        return atmCardStatus;
    }

    public void setAtmCardStatus(String atmCardStatus) {
        this.atmCardStatus = atmCardStatus;
    }


    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }


    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}