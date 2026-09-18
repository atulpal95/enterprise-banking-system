package com.atul.banking.dto;

public class VerifyAccountResponse {

    private boolean verified;

    private String fullName;

    private String accountNumber;

    private String ifscCode;

    public VerifyAccountResponse() {
    }

    public VerifyAccountResponse(
            boolean verified,
            String fullName,
            String accountNumber,
            String ifscCode) {

        this.verified = verified;
        this.fullName = fullName;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
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

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }
}