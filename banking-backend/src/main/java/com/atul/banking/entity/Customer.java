package com.atul.banking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================
    // Basic Information
    // ==========================

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private String password;

    // ==========================
    // Address Information
    // ==========================

    @Column(length = 255)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 20)
    private String postalCode;

    @Column(length = 100)
    private String country;

    // ==========================
    // Banking Information
    // ==========================

    @Column(nullable = false)
    private Double balance = 0.0;

    @Column(unique = true)
    private String accountNumber;

    private String ifscCode;

    private String accountType = "Savings";

    private String branchName = "Maharajganj";


   // ==========================
  // Account Approval
 // ==========================

    @Column(nullable = false)
    private String accountStatus = "PENDING";


    // ==========================
   // KYC
   // ==========================

     @Column(nullable = false)
     private String kycStatus = "NOT_SUBMITTED";

    // ==========================
    // Security
    // ==========================

    @Column(nullable = false)
    private String role = "ROLE_CUSTOMER";

    @Column(nullable = false)
    private boolean active = true;

    // ==========================
    // Profile Picture
    // ==========================

    @Column(name = "profile_picture")
    private String profilePicture;

    // ==========================
    // Relationships
    // ==========================

    @OneToOne(mappedBy = "customer")
    private ATMCard atmCard;
}