package com.atul.banking.dto;

public class CustomerResponse {

    private Long id;

    // ==========================
    // Basic Information
    // ==========================

    private String fullName;

    private String email;

    private String mobile;


    // ==========================
    // Address Information
    // ==========================

    private String address;

    private String city;

    private String state;

    private String postalCode;

    private String country;


    // ==========================
    // Banking Information
    // ==========================

    private Double balance;

    private String accountNumber;

    private String ifscCode;

    private String accountType;

    private String branchName;


    // ==========================
    // Security
    // ==========================

    private String role;

    private boolean active;


    // ==========================
    // Account & KYC Status
    // ==========================

    private String accountStatus;

    private String kycStatus;


    // ==========================
    // Profile Picture
    // ==========================

    private String profilePicture;


    // ==========================
    // Default Constructor
    // ==========================

    public CustomerResponse() {
    }


    // ==========================
    // Full Constructor
    // ==========================

    public CustomerResponse(
            Long id,
            String fullName,
            String email,
            String mobile,

            String address,
            String city,
            String state,
            String postalCode,
            String country,

            Double balance,
            String accountNumber,
            String ifscCode,
            String accountType,
            String branchName,

            String role,
            boolean active,

            String accountStatus,
            String kycStatus,

            String profilePicture) {

        this.id = id;

        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;

        this.address = address;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.country = country;

        this.balance = balance;
        this.accountNumber = accountNumber;
        this.ifscCode = ifscCode;
        this.accountType = accountType;
        this.branchName = branchName;

        this.role = role;
        this.active = active;

        this.accountStatus = accountStatus;
        this.kycStatus = kycStatus;

        this.profilePicture = profilePicture;
    }


    // ==========================
    // ID
    // ==========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // ==========================
    // Basic Information
    // ==========================

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


    // ==========================
    // Address Information
    // ==========================

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }


    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }


    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }


    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }


    // ==========================
    // Banking Information
    // ==========================

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
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


    // ==========================
    // Security
    // ==========================

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


    // ==========================
    // Account Status
    // ==========================

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }


    // ==========================
    // KYC Status
    // ==========================

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }


    // ==========================
    // Profile Picture
    // ==========================

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}