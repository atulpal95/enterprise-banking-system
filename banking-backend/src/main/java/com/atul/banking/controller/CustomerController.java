package com.atul.banking.controller;
import com.atul.banking.dto.ChequeBookRequestDto;
import com.atul.banking.dto.*;
import com.atul.banking.entity.Beneficiary;
import com.atul.banking.entity.Customer;
import com.atul.banking.entity.Transaction;
import com.atul.banking.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.atul.banking.dto.analytics.MonthlySpendingResponse;
import java.security.Principal;
import java.util.List;
import com.atul.banking.dto.RegisterRequest;
import java.io.IOException;
import com.atul.banking.dto.UploadProfilePictureResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.atul.banking.dto.ATMCardResponse;
import com.atul.banking.dto.ATMCardStatusResponse;
import com.atul.banking.dto.ChangePinRequest;
import org.springframework.format.annotation.DateTimeFormat;
import com.atul.banking.dto.ChequeBookRequestResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import com.atul.banking.dto.MessageResponse;
import com.atul.banking.dto.PayEmiResponse;

import com.atul.banking.entity.KYC;
import com.atul.banking.service.KYCService;
import com.atul.banking.dto.KYCResponse;
import com.atul.banking.dto.VerifyAccountRequest;
import com.atul.banking.dto.VerifyAccountResponse;
import java.time.LocalDate;
import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private KYCService kycService;

    // =========================
    // Register
    // =========================

    @PostMapping("/register")
     public MessageResponse registerCustomer(
        @Valid @RequestBody RegisterRequest request
     ) {

    customerService.registerCustomer(request);

    return new MessageResponse(
            "Registration completed successfully."
    );

  }

    // =========================
    // Login
    // =========================

    @PostMapping("/login")
    public LoginResponse loginCustomer(
            @Valid @RequestBody LoginRequest loginRequest) {

        return customerService.loginCustomer(loginRequest);
    }

    // =========================
    // Deposit
    // =========================

   @PreAuthorize("hasRole('CUSTOMER')")
   @PostMapping("/deposit")
    public BalanceResponse depositMoney(
        Principal principal,
        @Valid @RequestBody DepositRequest request) {

    return customerService.depositMoney(
            principal.getName(),
            request
    );
  }

    // =========================
    // Withdraw
    // =========================

     @PostMapping("/withdraw")
     public BalanceResponse withdrawMoney(
        Authentication authentication,
        @Valid @RequestBody WithdrawRequest request) {

        return customerService.withdrawMoney(
            authentication.getName(),
            request
        );

     }

    // =========================
    // Balance
    // =========================

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/balance")
    public BalanceResponse checkBalance(
            @Valid @RequestBody BalanceRequest request) {

        return customerService.checkBalance(request);
    }

    // =========================
    // Transfer
    // =========================

      @PreAuthorize("hasRole('CUSTOMER')")
      @PostMapping("/transfer")
      public TransferResponse transferMoney(
        Principal principal,
        @Valid @RequestBody TransferRequest request) {

         return customerService.transferMoney(
            principal.getName(),
            request
        );
      }
    // =========================
// Transfer Using Beneficiary
// =========================

@PreAuthorize("hasRole('CUSTOMER')")
@PostMapping("/transfer/beneficiary")
public TransferResponse transferToBeneficiary(
        Principal principal,
        @RequestBody BeneficiaryTransferRequest request) {

    return customerService.transferToBeneficiary(
            principal.getName(),
            request
    );
}

//transfer by account
@PreAuthorize("hasRole('CUSTOMER')")
@PostMapping("/verify-account")
public VerifyAccountResponse verifyAccount(

        @Valid @RequestBody
        VerifyAccountRequest request) {

    return customerService.verifyAccount(request);
}


    // =========================
    // Transaction History
    // =========================

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/transactions")
    public List<Transaction> getTransactionHistory(
            Principal principal) {

        return customerService.getTransactionHistory(
                principal.getName()
        );
    }

    // =========================
    // Mini Statement
    // =========================

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/ministatement")
    public List<Transaction> getMiniStatement(
            Principal principal) {

        return customerService.getMiniStatement(
                principal.getName()
        );
    }

    // =========================
    // Account Details
    // =========================

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/account")
    public AccountResponse getAccountDetails(
            Principal principal) {

        return customerService.getAccountDetails(
                principal.getName()
        );
    }

    // =========================
    // Change Password
    // =========================

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ChangePasswordResponse changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {

        return customerService.changePassword(
                authentication.getName(),
                request
        );
    }
    // =========================
    // Forgot Password
    // =========================

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        customerService.forgotPassword(request.getEmail());

        return new MessageResponse("OTP sent successfully.");
    }

    // =========================
    // Verify OTP
    // =========================

    @PostMapping("/verify-otp")
    public MessageResponse verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {

        return customerService.verifyOtp(request);
    }

    // =========================
    // Reset Password
    // =========================

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return customerService.resetPassword(request);
    }

    // =========================
    // Customer Profile
    // =========================

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/profile")
    public CustomerProfileResponse getProfile(
            Principal principal) {

        return customerService.getProfile(
                principal.getName()
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/profile")
    public MessageResponse updateProfile(
            Principal principal,
            @Valid @RequestBody UpdateProfileRequest request) {

        return customerService.updateProfile(
                principal.getName(),
                request
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/profile-picture")
    public UploadProfilePictureResponse uploadProfilePicture(
            Principal principal,
            @RequestParam("file") MultipartFile file) throws IOException {

        return customerService.uploadProfilePicture(
                principal.getName(),
                file
        );
    }


@PreAuthorize("hasRole('CUSTOMER')")
@GetMapping("/kyc")
public ResponseEntity<?> getKYC(
        Principal principal) {

    return ResponseEntity.ok(
            kycService.getKYC(
                    principal.getName()
            )
    );
}

@PreAuthorize("hasRole('CUSTOMER')")
@GetMapping("/kyc/status")
public ResponseEntity<?> getKYCStatus(
        Principal principal) {

    KYCResponse kyc = kycService.getKYC(
            principal.getName()
    );

    if (kyc == null) {
        return ResponseEntity.ok(
                new KYCStatusResponse(
                        "NOT_SUBMITTED",
                        null,
                        null
                )
        );
    }

    return ResponseEntity.ok(
            new KYCStatusResponse(
                    kyc.getStatus(),
                    kyc.getRejectionReason(),
                    kyc.getVerificationRemarks()
            )
    );
}

@PreAuthorize("hasRole('CUSTOMER')")
@PostMapping(
        value = "/kyc/submit",
        consumes = "multipart/form-data"
)
public KYCResponse submitKYC(
        Principal principal,

        @RequestParam("documentType")
        String documentType,

        @RequestParam("documentNumber")
        String documentNumber,

        @RequestParam("frontDocument")
        MultipartFile frontDocument,

        @RequestParam("backDocument")
        MultipartFile backDocument,

        @RequestParam("selfie")
        MultipartFile selfie
) throws IOException {

    return customerService.submitKYCWithDocuments(
            principal.getName(),
            documentType,
            documentNumber,
            frontDocument,
            backDocument,
            selfie
    );
}

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/atm-card/request")
    public ResponseEntity<?> requestATMCard(
            Principal principal) {

        return ResponseEntity.ok(
                customerService.requestATMCard(
                        principal.getName()
                )
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/atm-card")
    public ATMCardResponse getATMCard(
            Principal principal) {

        return customerService.getATMCard(
                principal.getName()
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/atm-card/change-pin")
    public MessageResponse changeATMCardPin(
            Principal principal,
            @Valid @RequestBody ChangePinRequest request) {

        return customerService.changeATMCardPin(
                principal.getName(),
                request
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/atm-card/status")
    public ATMCardStatusResponse getATMCardStatus(
            Principal principal) {

        return customerService.getATMCardStatus(
                principal.getName()
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/atm-card/block")
     public MessageResponse blockATMCard(
        Principal principal) {

    return customerService.blockATMCard(
            principal.getName()
    );
   }

   @PreAuthorize("hasRole('CUSTOMER')")
   @PutMapping("/atm-card/unblock")
   public MessageResponse unblockATMCard(
        Principal principal) {

    return customerService.unblockATMCard(
            principal.getName()
    );
   }

     @PreAuthorize("hasRole('CUSTOMER')")
     @PostMapping("/cheque-book/request")
     public MessageResponse requestChequeBook(

        @RequestBody ChequeBookRequestDto request,

        Principal principal

     ) {

    return customerService.requestChequeBook(

            principal.getName(),

            request

        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/cheque-book/history")
    public List<ChequeBookRequestResponse> getChequeBookHistory(
            Principal principal) {

        return customerService.getChequeBookHistory(
                principal.getName()
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/beneficiaries")
    public MessageResponse addBeneficiary(
            Principal principal,
            @RequestBody AddBeneficiaryRequest request) {

        return customerService.addBeneficiary(
                principal.getName(),
                request
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/beneficiaries")
    public List<Beneficiary> getBeneficiaries(
            Principal principal) {

        return customerService.getBeneficiaries(
                principal.getName()
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/beneficiaries/{id}")
    public MessageResponse deleteBeneficiary(
            @PathVariable Long id,
            Principal principal) {

        return customerService.deleteBeneficiary(
                principal.getName(),
                id
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/beneficiaries/{id}")
    public MessageResponse updateBeneficiary(
            @PathVariable Long id,
            @RequestBody UpdateBeneficiaryRequest request,
            Principal principal) {

        return customerService.updateBeneficiary(
                principal.getName(),
                id,
                request
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/loan/apply")
    public MessageResponse applyLoan(
            Principal principal,
            @RequestBody ApplyLoanRequest request) {

        return customerService.applyLoan(
                principal.getName(),
                request
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/fixed-deposits/open")
    public ResponseEntity<?> openFixedDeposit(
            @Valid @RequestBody OpenFDRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                customerService.openFixedDeposit(request, principal.getName())
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/fixed-deposits")
    public ResponseEntity<?> getMyFixedDeposits(
            Principal principal) {

        return ResponseEntity.ok(
                customerService.getMyFixedDeposits(principal.getName())
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/recurring-deposits/open")
    public ResponseEntity<?> openRecurringDeposit(
            @Valid @RequestBody OpenRDRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                customerService.openRecurringDeposit(
                        request,
                        principal.getName()
                )
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/recurring-deposits")
    public ResponseEntity<?> getMyRecurringDeposits(
            Principal principal) {

        return ResponseEntity.ok(
                customerService.getMyRecurringDeposits(
                        principal.getName()
                )
        );
    }
    @PreAuthorize("hasRole('CUSTOMER')")
@PostMapping("/recurring-deposits/{id}/installment")
public ResponseEntity<?> payRecurringDepositInstallment(
        @PathVariable Long id,
        Principal principal) {

    return ResponseEntity.ok(
            customerService.payRecurringDepositInstallment(
                    id,
                    principal.getName()
            )
    );
}
   @GetMapping("/statement/pdf")
   @PreAuthorize("hasRole('CUSTOMER')")
   public ResponseEntity<InputStreamResource> downloadStatement(

        Principal principal,

        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate fromDate,

        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate toDate

     ) {

    ByteArrayInputStream pdf =
            customerService.generateStatementPdf(
                    principal.getName(),
                    fromDate,
                    toDate
            );

    HttpHeaders headers = new HttpHeaders();

    headers.add(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=bank_statement.pdf"
    );

    return ResponseEntity
            .ok()
            .headers(headers)
            .contentType(MediaType.APPLICATION_PDF)
            .body(new InputStreamResource(pdf));
}

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/dashboard/spending")
    public ResponseEntity<List<MonthlySpendingResponse>> getMonthlySpending(
            Principal principal) {

        return ResponseEntity.ok(
                customerService.getMonthlySpending(
                        principal.getName()
                )
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/loan/pay-emi/{loanId}")
    public ResponseEntity<PayEmiResponse> payEmi(
            @PathVariable Long loanId,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                customerService.payEmi(email, loanId)
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/loans")
    public ResponseEntity<List<LoanResponse>> getMyLoans(
            Authentication authentication) {

        return ResponseEntity.ok(
                customerService.getMyLoans(authentication.getName())
        );
    }

    @GetMapping("/dashboard/stats")
public DashboardStatsResponse getDashboardStats(
        Principal principal) {

    return customerService.getDashboardStats(
            principal.getName()
    );
}
}