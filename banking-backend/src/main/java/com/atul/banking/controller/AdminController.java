package com.atul.banking.controller;

import com.atul.banking.dto.*;
import com.atul.banking.entity.Admin;
import com.atul.banking.service.AdminService;
import com.atul.banking.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;
import java.time.LocalDate;
import java.util.Map;
import com.atul.banking.dto.ChequeBookRequestResponse;
import com.atul.banking.dto.MessageResponse;
import com.atul.banking.dto.LoanResponse;

import com.atul.banking.dto.RejectFDRequest;
import com.atul.banking.dto.RejectRDRequest;

import com.atul.banking.dto.analytics.DashboardAnalyticsResponse;
import org.springframework.core.io.InputStreamResource;

import com.atul.banking.report.ExcelReportService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import com.atul.banking.entity.KYC;
import com.atul.banking.service.KYCService;
import com.atul.banking.dto.AdminChangePasswordRequest;
import com.atul.banking.dto.AdminProfileResponse;
import com.atul.banking.dto.AdminUpdateProfileRequest;

import java.util.List;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CustomerService customerService;
    @Autowired
    private ExcelReportService excelReportService;
    @Autowired
    private KYCService kycService;

    @PostMapping("/login")
    public AdminLoginResponse login(
            @Valid @RequestBody AdminLoginRequest request) {

        return adminService.login(request);
    }
    // =====================================================
// ADMIN FORGOT PASSWORD
// =====================================================

@PostMapping("/forgot-password")
public ResponseEntity<?> forgotAdminPassword(
        @RequestParam String email) {

    adminService.forgotAdminPassword(email);

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "OTP sent successfully to your registered email."
            )
    );
}
  // =====================================================
// ADMIN VERIFY OTP
// =====================================================

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyAdminOtp(
        @RequestParam String email,
        @RequestParam String otp) {

    adminService.verifyAdminOtp(
            email,
            otp
    );

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "OTP verified successfully."
            )
    );
}


// =====================================================
// ADMIN RESET PASSWORD
// =====================================================

@PostMapping("/reset-password")
public ResponseEntity<?> resetAdminPassword(
        @RequestBody AdminResetPasswordRequest request) {

    adminService.resetAdminPassword(
            request.getEmail(),
            request.getOtp(),
            request.getNewPassword(),
            request.getConfirmPassword()
    );

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Admin password reset successfully."
            )
    );
}
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public Admin register(@RequestBody Admin admin) {

        return adminService.register(admin);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/customers")
    public List<CustomerResponse> getAllCustomers() {

        return adminService.getAllCustomers();
    }

    // =====================================================
// CUSTOMER DETAILS
// Admin Customer Full Profile
// =====================================================

@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/customers/{id}/details")
public ResponseEntity<AdminCustomerDetailsResponse> getCustomerDetails(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            adminService.getCustomerDetails(id)
    );
}

// =====================================================
// CUSTOMER ACCOUNT APPROVAL
// =====================================================

@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/customers/{id}/approve")
public ResponseEntity<MessageResponse> approveCustomer(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            adminService.approveCustomer(id)
    );
}


// =====================================================
// CUSTOMER ACCOUNT REJECTION
// =====================================================

@PreAuthorize("hasRole('ADMIN')")
@PutMapping("/customers/{id}/reject")
public ResponseEntity<MessageResponse> rejectCustomer(
        @PathVariable Long id) {

    return ResponseEntity.ok(
            adminService.rejectCustomer(id)
    );
}
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/kyc")
    public ResponseEntity<List<KYCResponse>> getAllKYC() {

        return ResponseEntity.ok(
            kycService.getAllKYC()
        );
       }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/kyc/pending")
    public ResponseEntity<List<KYCResponse>> getPendingKYC() {

         return ResponseEntity.ok(
            kycService.getKYCByStatus("PENDING")
      );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/kyc/{id}/verify")
     public ResponseEntity<?> verifyKYC(
        @PathVariable Long id,
        @RequestBody KYCReviewRequest request,
        Principal principal) {

    return ResponseEntity.ok(
            kycService.verifyKYC(
                    id,
                    principal.getName(),
                    request.getRemarks()
            )
    );
     }

     @PreAuthorize("hasRole('ADMIN')")
     @PutMapping("/kyc/{id}/reject")
     public ResponseEntity<?> rejectKYC(
        @PathVariable Long id,
        @RequestBody KYCReviewRequest request,
        Principal principal) {

        return ResponseEntity.ok(
            kycService.rejectKYC(
                    id,
                    principal.getName(),
                    request.getRejectionReason(),
                    request.getRemarks()
            )
    );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/block/{id}")
    public String blockCustomer(@PathVariable Long id) {

        return adminService.blockCustomer(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/unblock/{id}")
    public String unblockCustomer(@PathVariable Long id) {

        return adminService.unblockCustomer(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {

        return adminService.getDashboard();

    }
    @GetMapping("/dashboard/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardAnalyticsResponse getAnalyticsDashboard() {

        return adminService.getAnalyticsDashboard();

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/reports/daily")
    public List<TransactionReportResponse> getDailyReport() {

        return adminService.getDailyReport();

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/reports/monthly")
    public List<TransactionReportResponse> getMonthlyReport() {

        return adminService.getMonthlyReport();

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/reports")
    public List<TransactionReportResponse> getReportBetweenDates(

            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        return adminService.getReportBetweenDates(
                startDate,
                endDate
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/atm-cards")
    public ResponseEntity<List<ATMAdminResponse>> getAllATMRequests() {

        return ResponseEntity.ok(
                adminService.getAllATMRequests()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/atm-cards/{id}/approve")
    public ResponseEntity<MessageResponse> approveATMCard(
            @PathVariable Long id,
            Principal principal) {

        return ResponseEntity.ok(
                adminService.approveATMCard(
                        id,
                        principal.getName()
                )
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/atm-cards/{id}/reject")
    public ResponseEntity<MessageResponse> rejectATMCard(
            @PathVariable Long id,
            @Valid @RequestBody RejectATMRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                adminService.rejectATMCard(
                        id,
                        request,
                        principal.getName()
                )
        );
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/atm-card/block/{email}")
    public MessageResponse blockATMCard(
            @PathVariable String email) {

        return customerService.blockATMCard(email);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/atm-card/unblock/{email}")
    public MessageResponse unblockATMCard(
            @PathVariable String email) {

        return customerService.unblockATMCard(email);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cheque-book")
    public List<ChequeBookRequestResponse> getAllChequeBookRequests() {

        return adminService.getAllChequeBookRequests();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cheque-book/approve/{id}")
    public MessageResponse approveChequeBook(
            @PathVariable Long id,
            Principal principal) {

        return adminService.approveChequeBook(
                id,
                principal.getName()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cheque-book/reject/{id}")
    public MessageResponse rejectChequeBook(
            @PathVariable Long id,
            @RequestBody RejectChequeBookRequest request,
            Principal principal) {

        return adminService.rejectChequeBook(
                id,
                principal.getName(),
                request.getReason()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cheque-book/dispatch/{id}")
    public MessageResponse dispatchChequeBook(
            @PathVariable Long id) {

        return adminService.dispatchChequeBook(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cheque-book/deliver/{id}")
    public MessageResponse deliverChequeBook(
            @PathVariable Long id) {

        return adminService.deliverChequeBook(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/loans")
    public List<LoanResponse> getAllLoans() {

        return adminService.getAllLoans();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/loan/approve/{id}")
    public MessageResponse approveLoan(
            @PathVariable Long id,
            Principal principal) {

        return adminService.approveLoan(
                id,
                principal.getName()
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/loan/reject/{id}")
    public MessageResponse rejectLoan(
            @PathVariable Long id,
            @RequestBody RejectLoanRequest request,
            Principal principal) {

        return adminService.rejectLoan(
                id,
                principal.getName(),
                request.getReason()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/loan/disburse/{id}")
    public MessageResponse disburseLoan(
            @PathVariable Long id) {

        return adminService.disburseLoan(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/loan/close/{id}")
    public MessageResponse closeLoan(
            @PathVariable Long id) {

        return adminService.closeLoan(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/fixed-deposits")
    public ResponseEntity<?> getAllFixedDeposits() {

        return ResponseEntity.ok(
                adminService.getAllFixedDeposits()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/fixed-deposits/approve/{id}")
    public ResponseEntity<?> approveFixedDeposit(
            @PathVariable Long id,
            Principal principal) {

        return ResponseEntity.ok(
                adminService.approveFixedDeposit(id, principal.getName()));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/fixed-deposits/reject/{id}")
    public ResponseEntity<?> rejectFixedDeposit(
            @PathVariable Long id,
            @Valid @RequestBody RejectFDRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                adminService.rejectFixedDeposit(
                        id,
                        request,
                        principal.getName()));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/fixed-deposits/close/{id}")
    public ResponseEntity<?> closeFixedDeposit(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.closeFixedDeposit(id));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/recurring-deposits/approve/{id}")
    public ResponseEntity<?> approveRecurringDeposit(
            @PathVariable Long id,
            Principal principal) {

        return ResponseEntity.ok(
                adminService.approveRecurringDeposit(
                        id,
                        principal.getName()
                )
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/recurring-deposits")
    public ResponseEntity<?> getAllRecurringDeposits() {

        return ResponseEntity.ok(
                adminService.getAllRecurringDeposits()
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/recurring-deposits/close/{id}")
    public ResponseEntity<?> closeRecurringDeposit(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminService.closeRecurringDeposit(id)
        );
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/recurring-deposits/reject/{id}")
    public ResponseEntity<?> rejectRecurringDeposit(
            @PathVariable Long id,
            @Valid @RequestBody RejectRDRequest request,
            Principal principal) {

        return ResponseEntity.ok(
                adminService.rejectRecurringDeposit(
                        id,
                        request,
                        principal.getName()
                )
        );
    }
    @GetMapping("/reports/customers/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportCustomerReportPdf() {

        return adminService.exportCustomerReportPdf();

    }

    @GetMapping("/reports/customers/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadCustomerExcel() throws IOException {

        byte[] excel = adminService.downloadCustomerExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=customer_report.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }
    @GetMapping("/reports/loans/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadLoanExcel() throws IOException {

        byte[] excel = adminService.downloadLoanExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=loan_report.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }

    @GetMapping("/reports/fixed-deposits/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportFixedDepositReportPdf() {

        return adminService.exportFixedDepositReportPdf();
    }

    @GetMapping("/reports/fixed-deposits/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadFixedDepositExcel()
            throws IOException {

        byte[] excel = adminService.downloadFixedDepositExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=fixed_deposit_report.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }
    @GetMapping("/reports/recurring-deposits/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportRecurringDepositReportPdf() {

        return adminService.exportRecurringDepositReportPdf();
    }
    @GetMapping("/reports/recurring-deposits/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadRecurringDepositExcel()
            throws IOException {

        byte[] excel = adminService.downloadRecurringDepositExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=recurring_deposit_report.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }
    @GetMapping("/reports/transactions/pdf")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportTransactionReportPdf() {

        return adminService.exportTransactionReportPdf();
    }
    @GetMapping("/reports/transactions/excel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadTransactionExcel()
            throws IOException {

        byte[] excel = adminService.downloadTransactionExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=transaction_report.xlsx"
                )
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                )
                .body(excel);
    }

    // =====================================================
// ADMIN PROFILE
// =====================================================

@GetMapping("/profile")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<AdminProfileResponse> getAdminProfile(
        Principal principal) {

    return ResponseEntity.ok(
            adminService.getAdminProfile(
                    principal.getName()
            )
    );
}


// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

@PutMapping("/profile")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<AdminProfileResponse> updateAdminProfile(
        @RequestBody AdminUpdateProfileRequest request,
        Principal principal) {

    return ResponseEntity.ok(
            adminService.updateAdminProfile(
                    principal.getName(),
                    request
            )
    );
}


// =====================================================
// UPLOAD ADMIN PROFILE PICTURE
// =====================================================

@PostMapping("/profile/picture")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<AdminProfileResponse> uploadAdminProfilePicture(
        @RequestParam("file") MultipartFile file,
        Principal principal) throws IOException {

    return ResponseEntity.ok(
            adminService.uploadAdminProfilePicture(
                    principal.getName(),
                    file
            )
    );
}


// =====================================================
// CHANGE ADMIN PASSWORD
// =====================================================

@PutMapping("/change-password")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> changeAdminPassword(
        @RequestBody AdminChangePasswordRequest request,
        Principal principal) {

    adminService.changeAdminPassword(
            principal.getName(),
            request
    );

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Admin password changed successfully."
            )
    );
}

}