package com.atul.banking.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "kyc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KYC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================
    // Document Information
    // ==========================

    @Column(nullable = false, length = 30)
    private String documentType;

    @Column(nullable = false, length = 50)
    private String documentNumber;

    // ==========================
    // Uploaded Documents
    // ==========================

    @Column(length = 500)
    private String frontDocumentUrl;

    @Column(length = 500)
    private String backDocumentUrl;

    @Column(length = 500)
    private String selfieUrl;

    // ==========================
    // Verification Status
    // ==========================

    @Column(nullable = false, length = 20)
    private String status = "NOT_SUBMITTED";

    /*
        NOT_SUBMITTED
        PENDING
        VERIFIED
        REJECTED
    */

    // ==========================
    // Admin Review
    // ==========================

    @Column(length = 500)
    private String rejectionReason;

    @Column(length = 1000)
    private String verificationRemarks;

    private String reviewedBy;

    private LocalDateTime reviewedAt;

    // ==========================
    // Dates
    // ==========================

    private LocalDateTime submittedAt;

    private LocalDateTime verifiedAt;

    private LocalDateTime expiresAt;

    // ==========================
    // Customer
    // ==========================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;
}