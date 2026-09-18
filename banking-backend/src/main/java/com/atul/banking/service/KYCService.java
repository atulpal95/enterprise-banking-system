package com.atul.banking.service;
import com.atul.banking.dto.KYCResponse;
import com.atul.banking.entity.Customer;
import com.atul.banking.entity.KYC;
import com.atul.banking.repository.CustomerRepository;
import com.atul.banking.repository.KYCRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KYCService {

    private final KYCRepository kycRepository;
    private final CustomerRepository customerRepository;
    private final EmailService emailService;

    public KYCService(
            KYCRepository kycRepository,
            CustomerRepository customerRepository,
            EmailService emailService
    ) {
        this.kycRepository = kycRepository;
        this.customerRepository = customerRepository;
        this.emailService = emailService;
    }

    // =====================================================
    // CUSTOMER - GET KYC
    // =====================================================

    public KYCResponse getKYC(String email) {

    return kycRepository
            .findByCustomerEmail(email)
            .map(this::mapToResponse)
            .orElse(null);
     }

    // =====================================================
    // CUSTOMER - SUBMIT KYC
    // =====================================================

    @Transactional
    public KYC submitKYC(
            String email,
            String documentType,
            String documentNumber,
            String frontDocumentUrl,
            String backDocumentUrl,
            String selfieUrl
    ) {

        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Customer not found."
                        )
                );

        // =================================================
        // ACCOUNT MUST BE APPROVED FIRST
        // =================================================

        if (!"ACTIVE".equals(customer.getAccountStatus())) {

            throw new RuntimeException(
                    "Your account must be approved before submitting KYC."
            );
        }

        // =================================================
        // CHECK EXISTING KYC
        // =================================================

        KYC kyc = kycRepository
                .findByCustomerEmail(email)
                .orElse(null);

        // =================================================
        // ALREADY PENDING
        // =================================================

        if (kyc != null &&
                "PENDING".equals(kyc.getStatus())) {

            throw new RuntimeException(
                    "Your KYC application is already under review."
            );
        }

        // =================================================
        // ALREADY VERIFIED
        // =================================================

        if (kyc != null &&
                "VERIFIED".equals(kyc.getStatus())) {

            throw new RuntimeException(
                    "Your KYC is already verified."
            );
        }

        // =================================================
        // CREATE KYC
        // =================================================

        if (kyc == null) {

            kyc = new KYC();

            kyc.setCustomer(customer);
        }

        // =================================================
        // DOCUMENT INFORMATION
        // =================================================

        kyc.setDocumentType(documentType);

        kyc.setDocumentNumber(documentNumber);

        kyc.setFrontDocumentUrl(frontDocumentUrl);

        kyc.setBackDocumentUrl(backDocumentUrl);

        kyc.setSelfieUrl(selfieUrl);

        // =================================================
        // STATUS
        // =================================================

        kyc.setStatus("PENDING");

        kyc.setSubmittedAt(
                LocalDateTime.now()
        );

        // =================================================
        // CLEAR PREVIOUS REVIEW
        // =================================================

        kyc.setRejectionReason(null);

        kyc.setVerificationRemarks(null);

        kyc.setReviewedBy(null);

        kyc.setReviewedAt(null);

        kyc.setVerifiedAt(null);

        kyc.setExpiresAt(null);

        // =================================================
        // UPDATE CUSTOMER KYC STATUS
        // =================================================

        customer.setKycStatus("PENDING");

        customerRepository.save(customer);

       KYC savedKyc = kycRepository.save(kyc);

        emailService.sendKYCSubmittedEmail(
        customer.getEmail(),
        customer.getFullName(),
        kyc.getDocumentType()
        );

        return savedKyc;
      }

    // =====================================================
    // ADMIN - GET ALL KYC
    // =====================================================

    @Transactional(readOnly = true)
     public List<KYCResponse> getAllKYC() {

       return kycRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .toList();
        }

    // =====================================================
    // ADMIN - GET KYC BY STATUS
    // =====================================================

@Transactional(readOnly = true)
public List<KYCResponse> getKYCByStatus(String status) {

    return kycRepository.findByStatus(status)
            .stream()
            .map(this::mapToResponse)
            .toList();
}

    // =====================================================
    // ADMIN - COUNT KYC BY STATUS
    // =====================================================

    public long countKYCByStatus(
            String status
    ) {

        return kycRepository.countByStatus(
                status
        );
    }

    // =====================================================
    // ADMIN - VERIFY KYC
    // =====================================================

    @Transactional
    public KYCResponse verifyKYC(
            Long kycId,
            String adminEmail,
            String remarks
    ) {

        KYC kyc = kycRepository
                .findById(kycId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "KYC application not found."
                        )
                );

        // =================================================
        // ONLY PENDING CAN BE VERIFIED
        // =================================================

        if (!"PENDING".equals(kyc.getStatus())) {

            throw new RuntimeException(
                    "Only pending KYC applications can be verified."
            );
        }

        Customer customer = kyc.getCustomer();

        // =================================================
        // UPDATE KYC
        // =================================================

        kyc.setStatus("VERIFIED");

        kyc.setReviewedBy(adminEmail);

        kyc.setReviewedAt(
                LocalDateTime.now()
        );

        kyc.setVerifiedAt(
                LocalDateTime.now()
        );

        kyc.setVerificationRemarks(
                remarks
        );

        kyc.setRejectionReason(null);

        // =================================================
        // KYC EXPIRY
        // =================================================

        kyc.setExpiresAt(
                LocalDateTime.now().plusYears(1)
        );

        // =================================================
        // UPDATE CUSTOMER
        // =================================================

        customer.setKycStatus("VERIFIED");

        customerRepository.save(customer);

        KYC savedKyc = kycRepository.save(kyc);

        emailService.sendKYCVerifiedEmail(
        customer.getEmail(),
        customer.getFullName(),
        kyc.getDocumentType()
        );

        return mapToResponse(savedKyc);
    }

    // =====================================================
    // ADMIN - REJECT KYC
    // =====================================================

    @Transactional
    public KYCResponse rejectKYC(
            Long kycId,
            String adminEmail,
            String rejectionReason,
            String remarks
    ) {

        KYC kyc = kycRepository
                .findById(kycId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "KYC application not found."
                        )
                );

        // =================================================
        // ONLY PENDING CAN BE REJECTED
        // =================================================

        if (!"PENDING".equals(kyc.getStatus())) {

            throw new RuntimeException(
                    "Only pending KYC applications can be rejected."
            );
        }

        Customer customer = kyc.getCustomer();

        // =================================================
        // UPDATE KYC
        // =================================================

        kyc.setStatus("REJECTED");

        kyc.setRejectionReason(
                rejectionReason
        );

        kyc.setVerificationRemarks(
                remarks
        );

        kyc.setReviewedBy(
                adminEmail
        );

        kyc.setReviewedAt(
                LocalDateTime.now()
        );

        kyc.setVerifiedAt(null);

        kyc.setExpiresAt(null);

        // =================================================
        // UPDATE CUSTOMER
        // =================================================

        customer.setKycStatus("REJECTED");

        customerRepository.save(customer);

        KYC savedKyc = kycRepository.save(kyc);

        emailService.sendKYCRejectedEmail(
        customer.getEmail(),
        customer.getFullName(),
        kyc.getDocumentType(),
        rejectionReason
        );

        return mapToResponse(savedKyc);
    }

    private KYCResponse mapToResponse(KYC kyc) {

    Customer customer = kyc.getCustomer();

    return new KYCResponse(

            // ==========================
            // KYC Information
            // ==========================

            kyc.getId(),
            kyc.getDocumentType(),
            kyc.getDocumentNumber(),
            kyc.getFrontDocumentUrl(),
            kyc.getBackDocumentUrl(),
            kyc.getSelfieUrl(),
            kyc.getStatus(),
            kyc.getRejectionReason(),
            kyc.getVerificationRemarks(),
            kyc.getReviewedBy(),
            kyc.getSubmittedAt(),
            kyc.getVerifiedAt(),
            kyc.getReviewedAt(),
            kyc.getExpiresAt(),

            // ==========================
            // Customer Information
            // ==========================

            customer.getFullName(),
            customer.getEmail(),
            customer.getMobile(),
            customer.getAccountStatus(),
            customer.getKycStatus()
    );
}
}