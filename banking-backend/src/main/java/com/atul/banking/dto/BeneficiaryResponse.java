package com.atul.banking.dto;

public class BeneficiaryResponse {

    private Long id;

    private String beneficiaryName;

    private String beneficiaryEmail;

    private String accountNumber;

    private String ifscCode;

    private String nickname;

    public BeneficiaryResponse() {
    }

    public BeneficiaryResponse(
            Long id,
            String beneficiaryName,
            String beneficiaryEmail,
            String accountNumber,
            String ifscCode,
            String nickname) {

        this.id = id;
        this.beneficiaryName = beneficiaryName;
        this.beneficiaryEmail = beneficiaryEmail;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.nickname = nickname;
    }

    public Long getId() {
        return id;
    }

    public String getBeneficiaryName() {
        return beneficiaryName;
    }

    public String getBeneficiaryEmail() {
        return beneficiaryEmail;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public String getNickname() {
        return nickname;
    }
}