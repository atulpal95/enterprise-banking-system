package com.atul.banking.dto;

public class AddBeneficiaryRequest {

    private String beneficiaryEmail;

    private String nickname;

    public AddBeneficiaryRequest() {
    }

    public String getBeneficiaryEmail() {
        return beneficiaryEmail;
    }

    public void setBeneficiaryEmail(String beneficiaryEmail) {
        this.beneficiaryEmail = beneficiaryEmail;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}