package com.atul.banking.service;

import com.atul.banking.dto.*;
import com.atul.banking.entity.Admin;
import com.atul.banking.entity.Customer;
import com.atul.banking.report.ExcelReportService;
import com.atul.banking.repository.*;
import com.atul.banking.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.atul.banking.entity.Transaction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import com.atul.banking.entity.ChequeBookRequest;
import com.atul.banking.entity.Loan;

import java.util.Map;
import com.atul.banking.entity.FixedDeposit;
import com.atul.banking.entity.RecurringDeposit;

import com.atul.banking.dto.analytics.DashboardAnalyticsResponse;
import com.atul.banking.dto.analytics.DepositStatusDTO;
import com.atul.banking.dto.analytics.LoanStatusDTO;
import com.atul.banking.dto.analytics.MonthlyTransactionDTO;
import com.atul.banking.dto.analytics.TopCustomerDTO;
import com.atul.banking.dto.analytics.TransactionTypeDTO;

import java.time.Month;
import java.time.Year;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Locale;

import com.atul.banking.util.CustomerReportPdfGenerator;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import com.atul.banking.report.LoanExcelReportService;

import com.atul.banking.report.FixedDepositExcelReportService;
import com.atul.banking.util.FixedDepositReportPdfGenerator;
import com.atul.banking.util.RecurringDepositReportPdfGenerator;
import com.atul.banking.report.RecurringDepositExcelReportService;
import java.io.ByteArrayInputStream;

import com.atul.banking.util.TransactionReportPdfGenerator;
import com.atul.banking.report.TransactionExcelReportService;
import com.atul.banking.entity.ATMCard;
import java.util.Random;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import com.atul.banking.service.OtpService;
import com.atul.banking.config.FileStorageConfig;
import java.util.List;


@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Value("${app.backend-url}")
    private String backendUrl;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private ChequeBookRequestRepository chequeBookRequestRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private FixedDepositRepository fixedDepositRepository;
    @Autowired
    private RecurringDepositRepository recurringDepositRepository;
    @Autowired
    private ATMCardRepository atmCardRepository;
    @Autowired
    private ExcelReportService excelReportService;
    @Autowired
    private LoanExcelReportService loanExcelReportService;
    @Autowired
    private FixedDepositExcelReportService fixedDepositExcelReportService;
    @Autowired
    private RecurringDepositExcelReportService recurringDepositExcelReportService;
    @Autowired
    private TransactionExcelReportService transactionExcelReportService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private OtpService otpService;
    @Autowired
    private FileStorageConfig fileStorageConfig;

    // Register Admin
    public Admin register(Admin admin) {

        if (adminRepository.existsByEmail(admin.getEmail())) {
            throw new RuntimeException("Admin already exists.");
        }

        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ROLE_ADMIN");

        return adminRepository.save(admin);
    }

    // Admin Login
    public AdminLoginResponse login(AdminLoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword())) {

            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(admin.getEmail());

        return new AdminLoginResponse(
                "Admin Login Successful",
                token,
                admin.getFullName()
        );
    }

    // =====================================================
   // ADMIN FORGOT PASSWORD - SEND OTP
  // =====================================================

     public void forgotAdminPassword(String email) {

             Admin admin = adminRepository.findByEmail(email)
                    .orElseThrow(() ->
                    new RuntimeException("Admin not found."));

                     otpService.sendOtp(admin.getEmail());
        } 

        // =====================================================
// ADMIN VERIFY OTP
// =====================================================

public void verifyAdminOtp(String email, String otp) {

    Admin admin = adminRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Admin not found.")
            );

    boolean valid = otpService.verifyOtp(email, otp);

    if (!valid) {
        throw new RuntimeException(
                "Invalid or expired OTP."
        );
    }
}


// =====================================================
// ADMIN RESET PASSWORD
// =====================================================

public void resetAdminPassword(
        String email,
        String otp,
        String newPassword,
        String confirmPassword) {

    Admin admin = adminRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Admin not found.")
            );

    if (newPassword == null ||
            newPassword.isBlank()) {

        throw new IllegalArgumentException(
                "New password is required."
        );
    }

    if (confirmPassword == null ||
            confirmPassword.isBlank()) {

        throw new IllegalArgumentException(
                "Confirm password is required."
        );
    }

    if (newPassword.length() < 6) {

        throw new IllegalArgumentException(
                "New password must be at least 6 characters."
        );
    }

    if (!newPassword.equals(confirmPassword)) {

        throw new IllegalArgumentException(
                "New password and confirm password do not match."
        );
    }

    // Verify OTP again before changing password
    boolean valid = otpService.verifyOtp(
            email,
            otp
    );

    if (!valid) {

        throw new RuntimeException(
                "Invalid or expired OTP."
        );
    }

    // Prevent using the same password
    if (passwordEncoder.matches(
            newPassword,
            admin.getPassword())) {

        throw new IllegalArgumentException(
                "New password must be different from current password."
        );
    }

    admin.setPassword(
            passwordEncoder.encode(newPassword)
    );

    adminRepository.save(admin);

    // Send password reset confirmation email
        emailService.sendAdminPasswordResetEmail(
        admin.getEmail(),
        admin.getFullName()
        );

    // OTP can no longer be reused
    otpService.clearOtp(email);
}

   // =====================================================
// GET ALL CUSTOMERS
// Safe Response DTO
// =====================================================

public List<CustomerResponse> getAllCustomers() {

    return customerRepository.findAll()
            .stream()
            .map(customer -> new CustomerResponse(

                    // ==========================
                    // Basic Information
                    // ==========================

                    customer.getId(),
                    customer.getFullName(),
                    customer.getEmail(),
                    customer.getMobile(),

                    // ==========================
                    // Address Information
                    // ==========================

                    customer.getAddress(),
                    customer.getCity(),
                    customer.getState(),
                    customer.getPostalCode(),
                    customer.getCountry(),

                    // ==========================
                    // Banking Information
                    // ==========================

                    customer.getBalance(),
                    customer.getAccountNumber(),
                    customer.getIfscCode(),
                    customer.getAccountType(),
                    customer.getBranchName(),

                    // ==========================
                    // Security
                    // ==========================

                    customer.getRole(),
                    customer.isActive(),

                    // ==========================
                    // Account & KYC Status
                    // ==========================

                    customer.getAccountStatus(),
                    customer.getKycStatus(),

                    // ==========================
                    // Profile Picture
                    // ==========================

                    customer.getProfilePicture()
            ))
            .toList();
}

// =====================================================
// GET CUSTOMER DETAILS
// Admin Customer Details
// =====================================================

public AdminCustomerDetailsResponse getCustomerDetails(Long id) {

    Customer customer = customerRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    // =====================================================
    // CUSTOMER
    // =====================================================

    CustomerResponse customerResponse =
            new CustomerResponse(
                    customer.getId(),
                    customer.getFullName(),
                    customer.getEmail(),
                    customer.getMobile(),

                    customer.getAddress(),
                    customer.getCity(),
                    customer.getState(),
                    customer.getPostalCode(),
                    customer.getCountry(),

                    customer.getBalance(),
                    customer.getAccountNumber(),
                    customer.getIfscCode(),
                    customer.getAccountType(),
                    customer.getBranchName(),

                    customer.getRole(),
                    customer.isActive(),

                    customer.getAccountStatus(),
                    customer.getKycStatus(),

                    customer.getProfilePicture()
            );

    // =====================================================
    // ATM CARD
    // =====================================================

    ATMAdminResponse atmCard = atmCardRepository
            .findAllByOrderByRequestDateDesc()
            .stream()
            .filter(card ->
                    card.getCustomer() != null
                    && card.getCustomer().getId().equals(customer.getId())
            )
            .findFirst()
            .map(card -> new ATMAdminResponse(
                    card.getId(),
                    card.getCustomer().getEmail(),
                    card.getStatus(),
                    card.getRequestDate(),
                    card.getCardNumber(),
                    card.getExpiryDate(),
                    card.getApprovedDate(),
                    card.getApprovedBy(),
                    card.getRejectedDate(),
                    card.getRejectedBy(),
                    card.getRejectionReason()
            ))
            .orElse(null);

    // =====================================================
    // CHEQUE BOOKS
    // =====================================================

    List<ChequeBookRequestResponse> chequeBooks =
            chequeBookRequestRepository.findAll()
                    .stream()
                    .filter(request ->
                            customer.getEmail().equals(
                                    request.getCustomerEmail()
                            )
                    )
                    .map(request -> new ChequeBookRequestResponse(
                            request.getId(),
                            request.getCustomerEmail(),
                            request.getNumberOfLeaves(),
                            request.getStatus(),
                            request.getRequestDate(),
                            request.getApprovedDate(),
                            request.getApprovedBy(),
                            request.getRejectedDate(),
                            request.getRejectedBy(),
                            request.getDispatchedDate(),
                            request.getDeliveredDate(),
                            request.getRejectionReason()
                    ))
                    .toList();

    // =====================================================
    // LOANS
    // =====================================================

    List<LoanResponse> loans =
            loanRepository.findAll()
                    .stream()
                    .filter(loan ->
                            loan.getCustomer() != null
                            && loan.getCustomer().getId().equals(customer.getId())
                    )
                    .map(loan -> new LoanResponse(
                            loan.getId(),
                            customer.getEmail(),
                            loan.getLoanType(),
                            loan.getAmount(),
                            loan.getInterestRate(),
                            loan.getTenureMonths(),
                            loan.getEmi(),
                            loan.getRemainingAmount(),
                            loan.getPaidInstallments(),
                            loan.getRemainingInstallments(),
                            loan.getNextEmiDate(),
                            loan.getStatus(),
                            loan.getRejectionReason(),
                            loan.getAppliedDate(),
                            loan.getApprovedDate(),
                            loan.getDisbursedDate(),
                            loan.getClosedDate()
                    ))
                    .toList();

    // =====================================================
    // FIXED DEPOSITS
    // =====================================================

    List<FDAdminResponse> fixedDeposits =
            fixedDepositRepository.findAll()
                    .stream()
                    .filter(fd ->
                            customer.getEmail().equals(
                                    fd.getCustomerEmail()
                            )
                    )
                    .map(fd -> new FDAdminResponse(
                            fd.getId(),
                            fd.getCustomerEmail(),
                            fd.getPrincipalAmount(),
                            fd.getInterestRate(),
                            fd.getTenureMonths(),
                            fd.getMaturityAmount(),
                            fd.getStatus(),
                            fd.getCreatedDate(),
                            fd.getApprovedDate(),
                            fd.getApprovedBy(),
                            fd.getRejectedDate(),
                            fd.getRejectedBy(),
                            fd.getMaturityDate(),
                            fd.getClosedDate(),
                            fd.getRejectionReason()
                    ))
                    .toList();

    // =====================================================
    // RECURRING DEPOSITS
    // =====================================================

    List<RDAdminResponse> recurringDeposits =
            recurringDepositRepository.findAll()
                    .stream()
                    .filter(rd ->
                            customer.getEmail().equals(
                                    rd.getCustomerEmail()
                            )
                    )
                    .map(rd -> new RDAdminResponse(
                            rd.getId(),
                            rd.getCustomerEmail(),
                            rd.getMonthlyInstallment(),
                            rd.getInterestRate(),
                            rd.getTenureMonths(),
                            rd.getTotalDeposited(),
                            rd.getMaturityAmount(),
                            rd.getStatus(),
                            rd.getCreatedDate()
                    ))
                    .toList();

    // =====================================================
    // TRANSACTIONS
    // =====================================================

    List<TransactionReportResponse> transactions =
            transactionRepository.findAll()
                    .stream()
                    .filter(transaction ->
                            customer.getEmail().equals(
                                    transaction.getEmail()
                            )
                    )
                    .map(transaction -> new TransactionReportResponse(
                            transaction.getId(),
                            transaction.getEmail(),
                            transaction.getType(),
                            transaction.getAmount(),
                            transaction.getBalanceAfterTransaction(),
                            transaction.getTransactionTime()
                    ))
                    .toList();

    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return new AdminCustomerDetailsResponse(
            customerResponse,
            atmCard,
            chequeBooks,
            loans,
            fixedDeposits,
            recurringDeposits,
            transactions
    );
}

    // Block Customer
    public String blockCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        customer.setActive(false);

        customerRepository.save(customer);

        emailService.sendAccountBlockedEmail(
            customer.getEmail(),
            customer.getFullName()
        );

        return "Customer blocked successfully.";
    }

    // Unblock Customer
    public String unblockCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        customer.setActive(true);

        customerRepository.save(customer);

        emailService.sendAccountUnblockedEmail(
            customer.getEmail(),
            customer.getFullName()
        );

        return "Customer unblocked successfully.";
    }

    // =====================================================
// APPROVE CUSTOMER ACCOUNT
// =====================================================

    public MessageResponse approveCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        // Only PENDING accounts can be approved
        if (!"PENDING".equals(customer.getAccountStatus())) {

            throw new RuntimeException(
                    "Only PENDING customer accounts can be approved."
            );
        }

       customer.setAccountStatus("ACTIVE");

customerRepository.save(customer);

try {
    emailService.sendAccountApprovedEmail(
            customer.getEmail(),
            customer.getFullName()
    );
} catch (RuntimeException e) {
    // Approval should not fail just because email delivery failed.
    org.slf4j.LoggerFactory.getLogger(AdminService.class)
            .warn("Account approval email failed for customer id {}", id, e);
}

return new MessageResponse(
        "Customer account approved successfully."
);
}


// =====================================================
// REJECT CUSTOMER ACCOUNT
// =====================================================

    public MessageResponse rejectCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        // Only PENDING accounts can be rejected
        if (!"PENDING".equals(customer.getAccountStatus())) {

            throw new RuntimeException(
                    "Only PENDING customer accounts can be rejected."
            );
        }

        customer.setAccountStatus("REJECTED");

        customerRepository.save(customer);

        emailService.sendAccountRejectedEmail(
            customer.getEmail(),
            customer.getFullName(),
            "Your account registration did not meet the approval requirements."
        );


        return new MessageResponse(
                "Customer account rejected successfully."
        );
    }

    public AdminDashboardResponse getDashboard() {

        long totalCustomers = customerRepository.count();

        long activeCustomers = customerRepository.countByActiveTrue();

        long blockedCustomers = customerRepository.countByActiveFalse();

        Double totalBalance = customerRepository.getTotalBalance();
        if (totalBalance == null) {
            totalBalance = 0.0;
        }

        long totalTransactions = transactionRepository.count();

        long totalDeposits = transactionRepository.countByType("DEPOSIT");

        long totalWithdrawals = transactionRepository.countByType("WITHDRAW");

        long totalLoans = loanRepository.count();

        long totalFixedDeposits = fixedDepositRepository.count();

        long totalRecurringDeposits = recurringDepositRepository.count();

        long totalATMCards = atmCardRepository.count();

        long totalChequeBookRequests = chequeBookRequestRepository.count();

        // Pending
        long pendingLoans = loanRepository.findByStatus("APPLIED").size();

        long pendingFixedDeposits =
                fixedDepositRepository.findByStatus("PENDING").size();

        long pendingRecurringDeposits =
                recurringDepositRepository.findByStatus("PENDING").size();

        // New Statistics
        long totalAdmins = adminRepository.count();

        long approvedLoans =
                loanRepository.countByStatus("APPROVED");

        long rejectedLoans =
                loanRepository.countByStatus("REJECTED");

        long disbursedLoans =
                loanRepository.countByStatus("DISBURSED");

        long closedLoans =
                loanRepository.countByStatus("CLOSED");

        long activeFixedDeposits =
                fixedDepositRepository.countByStatus("ACTIVE");

        long activeRecurringDeposits =
                recurringDepositRepository.countByStatus("ACTIVE");

        AdminDashboardResponse dashboard =
                new AdminDashboardResponse(
                        totalCustomers,
                        activeCustomers,
                        blockedCustomers,
                        totalBalance,
                        totalTransactions,
                        totalDeposits,
                        totalWithdrawals,
                        totalLoans,
                        totalFixedDeposits,
                        totalRecurringDeposits,
                        totalATMCards,
                        totalChequeBookRequests,
                        pendingLoans,
                        pendingFixedDeposits,
                        pendingRecurringDeposits
                );

        dashboard.setTotalAdmins(totalAdmins);

        dashboard.setApprovedLoans(approvedLoans);

        dashboard.setRejectedLoans(rejectedLoans);

        dashboard.setDisbursedLoans(disbursedLoans);

        dashboard.setClosedLoans(closedLoans);

        dashboard.setActiveFixedDeposits(activeFixedDeposits);

        dashboard.setActiveRecurringDeposits(activeRecurringDeposits);

        return dashboard;
    }

    public DashboardAnalyticsResponse getAnalyticsDashboard() {

    // =====================================================
    // MONTHLY TRANSACTIONS - CURRENT YEAR
    // =====================================================

    List<MonthlyTransactionDTO> monthlyTransactions =
            new ArrayList<>();

    int currentYear = Year.now().getValue();

    List<Transaction> allTransactions =
            transactionRepository.findAll();

    for (Month month : Month.values()) {

        long count = allTransactions
                .stream()
                .filter(t -> t.getTransactionTime() != null)
                .filter(t ->
                        t.getTransactionTime().getYear() == currentYear
                )
                .filter(t ->
                        t.getTransactionTime().getMonth() == month
                )
                .count();

        monthlyTransactions.add(
                new MonthlyTransactionDTO(
                        month.getDisplayName(
                                TextStyle.SHORT,
                                Locale.ENGLISH
                        ),
                        count
                )
        );
    }


    // =====================================================
    // TRANSACTION TYPES
    // =====================================================

    List<TransactionTypeDTO> transactionTypes =
            new ArrayList<>();

    for (Object[] row :
            transactionRepository.countTransactionsByType()) {

        transactionTypes.add(
                new TransactionTypeDTO(
                        (String) row[0],
                        ((Long) row[1])
                )
        );
    }


    // =====================================================
    // LOAN STATUS
    // =====================================================

    List<LoanStatusDTO> loanStatus =
            new ArrayList<>();

    String[] loanStatuses = {
            "APPLIED",
            "APPROVED",
            "DISBURSED",
            "REJECTED",
            "CLOSED"
    };

    for (String status : loanStatuses) {

        loanStatus.add(
                new LoanStatusDTO(
                        status,
                        loanRepository.countByStatus(status)
                )
        );
    }


    // =====================================================
    // FIXED DEPOSIT STATUS
    // =====================================================

    List<DepositStatusDTO> fixedDeposits =
            new ArrayList<>();

    String[] fdStatuses = {
            "PENDING",
            "ACTIVE",
            "REJECTED",
            "CLOSED"
    };

    for (String status : fdStatuses) {

        fixedDeposits.add(
                new DepositStatusDTO(
                        status,
                        fixedDepositRepository.countByStatus(status)
                )
        );
    }


    // =====================================================
    // RECURRING DEPOSIT STATUS
    // =====================================================

    List<DepositStatusDTO> recurringDeposits =
            new ArrayList<>();

    String[] rdStatuses = {
            "PENDING",
            "ACTIVE",
            "REJECTED",
            "CLOSED"
    };

    for (String status : rdStatuses) {

        recurringDeposits.add(
                new DepositStatusDTO(
                        status,
                        recurringDepositRepository.countByStatus(status)
                )
        );
    }


    // =====================================================
    // TOP 5 CUSTOMERS
    // =====================================================

    List<TopCustomerDTO> topCustomers =
            new ArrayList<>();

    customerRepository
            .findTop5ByOrderByBalanceDesc()
            .forEach(customer -> {

                topCustomers.add(
                        new TopCustomerDTO(
                                customer.getFullName(),
                                customer.getAccountNumber(),
                                customer.getBalance()
                        )
                );

            });


    // =====================================================
    // FINAL RESPONSE
    // =====================================================

    return new DashboardAnalyticsResponse(
            monthlyTransactions,
            transactionTypes,
            loanStatus,
            fixedDeposits,
            recurringDeposits,
            topCustomers
    );
}

    public List<TransactionReportResponse> getDailyReport() {

        LocalDate today = LocalDate.now();

        LocalDateTime start = today.atStartOfDay();

        LocalDateTime end = today.atTime(LocalTime.MAX);

        List<Transaction> transactions =
                transactionRepository.findTransactionsBetween(start, end);

        return mapTransactions(transactions);
    }

    public List<TransactionReportResponse> getMonthlyReport() {

        LocalDate today = LocalDate.now();

        LocalDateTime start =
                today.withDayOfMonth(1).atStartOfDay();

        LocalDateTime end =
                today.withDayOfMonth(today.lengthOfMonth())
                        .atTime(LocalTime.MAX);

        List<Transaction> transactions =
                transactionRepository.findTransactionsBetween(start, end);

        return mapTransactions(transactions);
    }

    public List<TransactionReportResponse> getReportBetweenDates(
            LocalDate startDate,
            LocalDate endDate) {

        LocalDateTime start =
                startDate.atStartOfDay();

        LocalDateTime end =
                endDate.atTime(LocalTime.MAX);

        List<Transaction> transactions =
                transactionRepository.findTransactionsBetween(start, end);

        return mapTransactions(transactions);
    }

    private List<TransactionReportResponse> mapTransactions(
            List<Transaction> transactions) {

        return transactions.stream()
                .map(transaction -> new TransactionReportResponse(
                        transaction.getId(),
                        transaction.getEmail(),
                        transaction.getType(),
                        transaction.getAmount(),
                        transaction.getBalanceAfterTransaction(),
                        transaction.getTransactionTime()
                ))
                .toList();
    }

    public List<ChequeBookRequestResponse> getAllChequeBookRequests() {

        return chequeBookRequestRepository.findAll()
        .stream()
        .map(request -> new ChequeBookRequestResponse(

                request.getId(),

                request.getCustomerEmail(),

                request.getNumberOfLeaves(),

                request.getStatus(),

                request.getRequestDate(),

                request.getApprovedDate(),

                request.getApprovedBy(),

                request.getRejectedDate(),

                request.getRejectedBy(),

                request.getDispatchedDate(),

                request.getDeliveredDate(),

                request.getRejectionReason()

        ))
        .toList();
        }

    public MessageResponse approveChequeBook(
            Long id,
            String adminEmail) {

        ChequeBookRequest request =
                chequeBookRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Request not found."));

        if (!request.getStatus().equals("REQUESTED")) {

            throw new RuntimeException(
                    "Only REQUESTED cheque books can be approved."
            );
        }

        request.setStatus("APPROVED");
request.setApprovedDate(LocalDateTime.now());
request.setApprovedBy(adminEmail);

request.setRejectedDate(null);
request.setRejectedBy(null);
request.setRejectionReason(null);

        chequeBookRequestRepository.save(request);

        Customer customer = customerRepository
                .findByEmail(request.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        emailService.sendChequeBookApprovedEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new MessageResponse(
                "Cheque book request approved."
        );
    }

    public MessageResponse rejectChequeBook(
            Long id,
            String adminEmail,
            String reason) {

        ChequeBookRequest request =
                chequeBookRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Request not found."));

        if (!request.getStatus().equals("REQUESTED")) {

            throw new RuntimeException(
                    "Only REQUESTED cheque books can be rejected."
            );
        }

        request.setStatus("REJECTED");

request.setRejectedDate(LocalDateTime.now());
request.setRejectedBy(adminEmail);

request.setApprovedDate(null);
request.setApprovedBy(null);

request.setDispatchedDate(null);
request.setDeliveredDate(null);

request.setRejectionReason(reason);

        chequeBookRequestRepository.save(request);

        Customer customer = customerRepository
                .findByEmail(request.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        emailService.sendChequeBookRejectedEmail(
                customer.getEmail(),
                customer.getFullName(),
                reason
        );

        return new MessageResponse(
                "Cheque book request rejected."
        );
    }
    public MessageResponse dispatchChequeBook(Long id) {

        ChequeBookRequest request =
                chequeBookRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Request not found."));

        if (!request.getStatus().equals("APPROVED")) {

            throw new RuntimeException(
                    "Only APPROVED cheque books can be dispatched."
            );
        }

        request.setStatus("DISPATCHED");
        request.setDispatchedDate(LocalDateTime.now());

        chequeBookRequestRepository.save(request);

        Customer customer = customerRepository
                .findByEmail(request.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        emailService.sendChequeBookDispatchedEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new MessageResponse(
                "Cheque book dispatched."
        );
    }

    public MessageResponse deliverChequeBook(Long id) {

        ChequeBookRequest request =
                chequeBookRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Request not found."));

        if (!request.getStatus().equals("DISPATCHED")) {

            throw new RuntimeException(
                    "Only DISPATCHED cheque books can be delivered."
            );
        }

        request.setStatus("DELIVERED");
        request.setDeliveredDate(LocalDateTime.now());

        chequeBookRequestRepository.save(request);

        Customer customer = customerRepository
                .findByEmail(request.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        emailService.sendChequeBookDeliveredEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new MessageResponse(
                "Cheque book delivered."
        );
    }

    public List<LoanResponse> getAllLoans() {

        return loanRepository.findAll()
                .stream()
                .map(loan -> new LoanResponse(
                        loan.getId(),
                        loan.getCustomer() != null ? loan.getCustomer().getEmail() : null,
                        loan.getLoanType(),
                        loan.getAmount(),
                        loan.getInterestRate(),
                        loan.getTenureMonths(),
                        loan.getEmi(),
                        loan.getRemainingAmount(),
                        loan.getPaidInstallments(),
                        loan.getRemainingInstallments(),
                        loan.getNextEmiDate(),
                        loan.getStatus(),
                        loan.getRejectionReason(),
                        loan.getAppliedDate(),
                        loan.getApprovedDate(),
                        loan.getDisbursedDate(),
                        loan.getClosedDate()
                ))
                .toList();
    }

    public MessageResponse approveLoan(
            Long id,
            String adminEmail) {

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found."));

        if (!"APPLIED".equals(loan.getStatus())) {

            throw new RuntimeException(
                    "Only APPLIED loans can be approved."
            );
        }

        loan.setStatus("APPROVED");
        loan.setApprovedDate(LocalDateTime.now());
        loan.setApprovedBy(adminEmail);
        loan.setRejectedBy(null);
        loan.setRejectedDate(null);
        loan.setRejectionReason(null);

        loanRepository.save(loan);

// Send Email
        emailService.sendLoanApprovedEmail(
                loan.getCustomer().getEmail(),
                loan.getCustomer().getFullName(),
                loan.getLoanType(),
                loan.getAmount()
        );

        return new MessageResponse(
                "Loan approved successfully."
        );
    }
    public MessageResponse rejectLoan(
            Long id,
            String adminEmail,
            String reason) {

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found."));

        if (!"APPLIED".equals(loan.getStatus())) {

            throw new RuntimeException(
                    "Only APPLIED loans can be rejected."
            );
        }

        loan.setStatus("REJECTED");
        loan.setRejectedBy(adminEmail);
        loan.setRejectionReason(reason);
        loan.setRejectedDate(LocalDateTime.now());
        loan.setApprovedBy(null);

        loan.setApprovedDate(null);

        loanRepository.save(loan);

// Send Email
        emailService.sendLoanRejectedEmail(
                loan.getCustomer().getEmail(),
                loan.getCustomer().getFullName(),
                loan.getLoanType(),
                loan.getAmount(),
                reason
        );

        return new MessageResponse(
                "Loan rejected successfully."
        );
    }
    public MessageResponse disburseLoan(Long id) {

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found."));

        if (!loan.getStatus().equals("APPROVED")) {

            throw new RuntimeException(
                    "Only APPROVED loans can be disbursed."
            );
        }

        Customer customer = loan.getCustomer();

        if (customer == null) {
            throw new RuntimeException("Customer not found.");
        }

        // Credit loan amount
        customer.setBalance(
                customer.getBalance() + loan.getAmount()
        );

        customerRepository.save(customer);

        Transaction transaction = new Transaction();

transaction.setEmail(customer.getEmail());

transaction.setType("LOAN_CREDIT");

transaction.setDescription(
        loan.getLoanType() + " Loan Disbursed"
);

transaction.setReference(
        generateReference("LON")
);

transaction.setAmount(
        loan.getAmount()
);

transaction.setBalanceAfterTransaction(
        customer.getBalance()
);

transaction.setTransactionTime(
        LocalDateTime.now()
);

transactionRepository.save(transaction);
        // Update loan
        // ==========================
// Activate Loan
// ==========================

        loan.setStatus("DISBURSED");

        loan.setDisbursedDate(
                LocalDateTime.now()
        );

// Initialize EMI Schedule
        loan.setNextEmiDate(
                LocalDateTime.now().plusMonths(1)
        );

// Safety Initialization
        if (loan.getRemainingAmount() == null) {
            loan.setRemainingAmount(
                    loan.getAmount()
            );
        }

        if (loan.getPaidInstallments() == null) {
            loan.setPaidInstallments(0);
        }

        if (loan.getRemainingInstallments() == null) {
            loan.setRemainingInstallments(
                    loan.getTenureMonths()
            );
        }

        loanRepository.save(loan);
// Send Email
        emailService.sendLoanDisbursedEmail(
                customer.getEmail(),
                customer.getFullName(),
                loan.getLoanType(),
                loan.getAmount(),
                customer.getBalance()
        );

        return new MessageResponse(
                "Loan disbursed successfully."
        );
    }
    public MessageResponse closeLoan(Long id) {

        Loan loan = loanRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found."));

        if (!loan.getStatus().equals("DISBURSED")) {

            throw new RuntimeException(
                    "Only DISBURSED loans can be closed."
            );
        }

        loan.setStatus("CLOSED");

        loan.setClosedDate(LocalDateTime.now());

        loanRepository.save(loan);

// Send Email
        emailService.sendLoanClosedEmail(
                loan.getCustomer().getEmail(),
                loan.getCustomer().getFullName(),
                loan.getLoanType(),
                loan.getAmount()
        );

        return new MessageResponse(
                "Loan closed successfully."
        );
    }
    public List<FDAdminResponse> getAllFixedDeposits() {

        return fixedDepositRepository.findAll()
                .stream()
                .map(fd -> new FDAdminResponse(
        fd.getId(),
        fd.getCustomerEmail(),
        fd.getPrincipalAmount(),
        fd.getInterestRate(),
        fd.getTenureMonths(),
        fd.getMaturityAmount(),
        fd.getStatus(),
        fd.getCreatedDate(),
        fd.getApprovedDate(),
        fd.getApprovedBy(),
        fd.getRejectedDate(),
        fd.getRejectedBy(),
        fd.getMaturityDate(),
        fd.getClosedDate(),
        fd.getRejectionReason()
               ))
                .toList();
    }
    public Map<String, String> approveFixedDeposit(
            Long id,
            String adminEmail) {

        FixedDeposit fd = fixedDepositRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Fixed Deposit not found."));

        if (!"PENDING".equals(fd.getStatus())) {
            throw new RuntimeException(
                    "Only PENDING Fixed Deposits can be approved.");
        }

        fd.setStatus("ACTIVE");
        fd.setApprovedDate(LocalDateTime.now());
        fd.setApprovedBy(adminEmail);

        fixedDepositRepository.save(fd);
        Customer customer = customerRepository
                .findByEmail(fd.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        emailService.sendFDApprovedEmail(
                customer.getEmail(),
                customer.getFullName(),
                fd.getPrincipalAmount(),
                fd.getMaturityAmount()
        );

        return Map.of(
                "message",
                "Fixed Deposit approved successfully.");
    }
    public Map<String, String> rejectFixedDeposit(
            Long id,
            RejectFDRequest request,
            String adminEmail) {

        FixedDeposit fd = fixedDepositRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Fixed Deposit not found."));

        if (!"PENDING".equals(fd.getStatus())) {
            throw new RuntimeException(
                    "Only PENDING Fixed Deposits can be rejected.");
        }

        Customer customer = customerRepository
                .findByEmail(fd.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        // Refund principal amount
        customer.setBalance(
                customer.getBalance() + fd.getPrincipalAmount());

        customerRepository.save(customer);

        // Update FD
        fd.setStatus("REJECTED");
        fd.setRejectedBy(adminEmail);
        fd.setRejectedDate(LocalDateTime.now());
        fd.setRejectionReason(request.getReason());

        fixedDepositRepository.save(fd);

        // Transaction
        Transaction transaction = new Transaction();

           transaction.setEmail(customer.getEmail());

          transaction.setType("FD_REFUND");

            transaction.setDescription(
               "Fixed Deposit Refund"
               );

                   transaction.setReference(
                  generateReference("FDR")
               );

               transaction.setAmount(
             fd.getPrincipalAmount()
                 );

                transaction.setBalanceAfterTransaction(
                customer.getBalance()
               );

                transaction.setTransactionTime(
                LocalDateTime.now()
                );

       transactionRepository.save(transaction);
        emailService.sendFDRejectedEmail(
                customer.getEmail(),
                customer.getFullName(),
                fd.getPrincipalAmount(),
                request.getReason()
        );

        return Map.of(
                "message",
                "Fixed Deposit rejected successfully.");
    }

    public Map<String, String> closeFixedDeposit(Long id) {

        FixedDeposit fd = fixedDepositRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Fixed Deposit not found."));

        if (!"ACTIVE".equals(fd.getStatus())) {
            throw new RuntimeException(
                    "Only ACTIVE Fixed Deposits can be closed.");
        }

        Customer customer = customerRepository
                .findByEmail(fd.getCustomerEmail())
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        // Credit maturity amount
        customer.setBalance(
                customer.getBalance() + fd.getMaturityAmount());

        customerRepository.save(customer);

        fd.setStatus("CLOSED");
        fd.setClosedDate(LocalDateTime.now());

        fixedDepositRepository.save(fd);

        // Transaction
        Transaction transaction = new Transaction();

transaction.setEmail(customer.getEmail());

transaction.setType("FD_MATURITY");

transaction.setDescription(
        "Fixed Deposit Maturity Amount Credited"
);

transaction.setReference(
        generateReference("FDM")
);

transaction.setAmount(
        fd.getMaturityAmount()
);

transaction.setBalanceAfterTransaction(
        customer.getBalance()
);

transaction.setTransactionTime(
        LocalDateTime.now()
);

transactionRepository.save(transaction);
        emailService.sendFDClosedEmail(
                customer.getEmail(),
                customer.getFullName(),
                fd.getPrincipalAmount(),
                fd.getMaturityAmount(),
                customer.getBalance()
        );

        return Map.of(
                "message",
                "Fixed Deposit closed successfully.");
    }
    public List<RDAdminResponse> getAllRecurringDeposits() {

    return recurringDepositRepository
            .findAllByOrderByCreatedDateDesc()
            .stream()
            .map(rd -> new RDAdminResponse(
                    rd.getId(),
                    rd.getCustomerEmail(),
                    rd.getMonthlyInstallment(),
                    rd.getInterestRate(),
                    rd.getTenureMonths(),
                    rd.getTotalDeposited(),
                    rd.getMaturityAmount(),
                    rd.getStatus(),
                    rd.getCreatedDate()
            ))
            .toList();
}
    public MessageResponse approveRecurringDeposit(
        Long id,
        String adminEmail) {

    RecurringDeposit rd = recurringDepositRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Recurring Deposit not found."));

    if (!"PENDING".equals(rd.getStatus())) {
        throw new RuntimeException(
                "Only PENDING Recurring Deposits can be approved.");
    }

    LocalDateTime now = LocalDateTime.now();

    rd.setStatus("ACTIVE");
    rd.setApprovedBy(adminEmail);
    rd.setApprovedDate(now);
    rd.setMaturityDate(
        now.plusMonths(rd.getTenureMonths())
     );

    // First installment was already paid during opening.
    // Next installment becomes due one month after approval.
    rd.setNextInstallmentDate(
            now.plusMonths(1)
    );

    recurringDepositRepository.save(rd);

    Customer customer = customerRepository
            .findByEmail(rd.getCustomerEmail())
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    emailService.sendRDApprovedEmail(
            customer.getEmail(),
            customer.getFullName(),
            rd.getMonthlyInstallment(),
            rd.getMaturityAmount()
    );

    return new MessageResponse(
            "Recurring Deposit approved successfully."
    );
}

   public MessageResponse rejectRecurringDeposit(
        Long id,
        RejectRDRequest request,
        String adminEmail) {

    RecurringDeposit rd = recurringDepositRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Recurring Deposit not found."));

    if (!"PENDING".equals(rd.getStatus())) {
        throw new RuntimeException(
                "Only PENDING Recurring Deposits can be rejected.");
    }

    Customer customer = customerRepository
            .findByEmail(rd.getCustomerEmail())
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    // -------------------------------------------------
    // Refund FIRST installment
    // -------------------------------------------------

    double refundAmount = rd.getMonthlyInstallment();

    customer.setBalance(
            customer.getBalance() + refundAmount
    );

    customerRepository.save(customer);

    // -------------------------------------------------
    // Update RD
    // -------------------------------------------------

    rd.setStatus("REJECTED");
    rd.setRejectedBy(adminEmail);
    rd.setRejectedDate(LocalDateTime.now());
    rd.setRejectionReason(request.getReason());

    recurringDepositRepository.save(rd);

    // -------------------------------------------------
    // Transaction
    // -------------------------------------------------

    Transaction transaction = new Transaction();

    transaction.setEmail(customer.getEmail());

    transaction.setType("RD_REFUND");

    transaction.setDescription(
            "Recurring Deposit Refund"
    );

    transaction.setReference(
            generateReference("RDR")
    );

    transaction.setAmount(
            refundAmount
    );

    transaction.setBalanceAfterTransaction(
            customer.getBalance()
    );

    transaction.setTransactionTime(
            LocalDateTime.now()
    );

    transactionRepository.save(transaction);

    // -------------------------------------------------
    // Email
    // -------------------------------------------------

    emailService.sendRDRejectedEmail(
            customer.getEmail(),
            customer.getFullName(),
            refundAmount,
            request.getReason()
    );

    return new MessageResponse(
            "Recurring Deposit rejected successfully."
    );
}

   public MessageResponse closeRecurringDeposit(Long id) {

    RecurringDeposit rd = recurringDepositRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Recurring Deposit not found."));

    if (!"ACTIVE".equals(rd.getStatus())) {
        throw new RuntimeException(
                "Only ACTIVE Recurring Deposits can be closed.");
    }

    int paidInstallments =
            rd.getPaidInstallments() == null
                    ? 0
                    : rd.getPaidInstallments();

    int requiredInstallments =
            rd.getTenureMonths() == null
                    ? 0
                    : rd.getTenureMonths();

    // -------------------------------------------------
    // Make sure all installments are paid
    // -------------------------------------------------

    if (paidInstallments < requiredInstallments) {
        throw new RuntimeException(
                "Recurring Deposit cannot be closed before all installments are paid. "
                        + "Paid: "
                        + paidInstallments
                        + "/"
                        + requiredInstallments
        );
    }

    Customer customer = customerRepository
            .findByEmail(rd.getCustomerEmail())
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    // -------------------------------------------------
    // Credit maturity amount
    // -------------------------------------------------

    customer.setBalance(
            customer.getBalance()
                    + rd.getMaturityAmount()
    );

    customerRepository.save(customer);

    // -------------------------------------------------
    // Update RD
    // -------------------------------------------------

    rd.setStatus("CLOSED");
    rd.setClosedDate(LocalDateTime.now());
    rd.setNextInstallmentDate(null);

    recurringDepositRepository.save(rd);

    // -------------------------------------------------
    // Transaction
    // -------------------------------------------------

    Transaction transaction = new Transaction();

    transaction.setEmail(customer.getEmail());

    transaction.setType("RD_MATURITY");

    transaction.setDescription(
            "Recurring Deposit Maturity Amount Credited"
    );

    transaction.setReference(
            generateReference("RDM")
    );

    transaction.setAmount(
            rd.getMaturityAmount()
    );

    transaction.setBalanceAfterTransaction(
            customer.getBalance()
    );

    transaction.setTransactionTime(
            LocalDateTime.now()
    );

    transactionRepository.save(transaction);

    // -------------------------------------------------
    // Email
    // -------------------------------------------------

    emailService.sendRDClosedEmail(
            customer.getEmail(),
            customer.getFullName(),
            rd.getTotalDeposited(),
            rd.getMaturityAmount(),
            customer.getBalance()
    );

    return new MessageResponse(
            "Recurring Deposit closed successfully."
    );
}
    public ResponseEntity<InputStreamResource> exportCustomerReportPdf() {

        List<Customer> customers = customerRepository.findAll();

        ByteArrayInputStream pdf =
                CustomerReportPdfGenerator.generate(customers);

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=customer_report.pdf"
        );

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
    public byte[] downloadCustomerExcel() throws IOException {

        List<Customer> customers = customerRepository.findAll();

        return excelReportService.generateCustomerReport(customers);
    }
    public byte[] downloadLoanExcel() throws IOException {

        List<Loan> loans = loanRepository.findAll();

        return loanExcelReportService.generateLoanReport(loans);
    }

    public ResponseEntity<InputStreamResource> exportFixedDepositReportPdf() {

        List<FixedDeposit> deposits = fixedDepositRepository.findAll();

        ByteArrayInputStream pdf =
                new ByteArrayInputStream(
                        FixedDepositReportPdfGenerator.generate(deposits)
                );

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=fixed_deposit_report.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    public byte[] downloadFixedDepositExcel() throws IOException {

        List<FixedDeposit> deposits =
                fixedDepositRepository.findAll();

        return fixedDepositExcelReportService
                .generateFixedDepositReport(deposits);
    }
    public ResponseEntity<InputStreamResource> exportRecurringDepositReportPdf() {

        List<RecurringDeposit> deposits =
                recurringDepositRepository.findAll();

        ByteArrayInputStream pdf =
                new ByteArrayInputStream(
                        RecurringDepositReportPdfGenerator.generate(deposits)
                );

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=recurring_deposit_report.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
    public byte[] downloadRecurringDepositExcel() throws IOException {

        List<RecurringDeposit> deposits =
                recurringDepositRepository.findAll();

        return recurringDepositExcelReportService.generateReport(deposits);
    }

    public ResponseEntity<InputStreamResource> exportTransactionReportPdf() {

        List<Transaction> transactions =
                transactionRepository.findAll();

        ByteArrayInputStream pdf =
                new ByteArrayInputStream(
                        TransactionReportPdfGenerator.generate(transactions)
                );

        HttpHeaders headers = new HttpHeaders();

        headers.add(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=transaction_report.pdf"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }
    public byte[] downloadTransactionExcel() throws IOException {

        List<Transaction> transactions =
                transactionRepository.findAll();

        return transactionExcelReportService.generateReport(transactions);
    }

    public List<ATMAdminResponse> getAllATMRequests() {

        return atmCardRepository.findAllByOrderByRequestDateDesc()
                .stream()
                .map(card -> new ATMAdminResponse(
                 card.getId(),
                  card.getCustomer().getEmail(),
                 card.getStatus(),
                 card.getRequestDate(),
                 card.getCardNumber(),
                 card.getExpiryDate(),
                 card.getApprovedDate(),
                 card.getApprovedBy(),
                 card.getRejectedDate(),
                 card.getRejectedBy(),
                 card.getRejectionReason()
              ))
              .toList();
    }

    public MessageResponse approveATMCard(
            Long id,
            String adminEmail) {

        ATMCard card = atmCardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("ATM Card request not found."));

        if (!"PENDING".equals(card.getStatus())) {
            throw new RuntimeException(
                    "Only PENDING ATM requests can be approved.");
        }

        String generatedPin = generatePIN();

        card.setCardNumber(generateCardNumber());
        card.setCvv(generateCVV());
        card.setPin(passwordEncoder.encode(generatedPin));
        card.setExpiryDate(LocalDate.now().plusYears(5));

        card.setStatus("ACTIVE");

        card.setApprovedBy(adminEmail);
        card.setApprovedDate(LocalDate.now());
        card.setRejectedBy(null);
        card.setRejectedDate(null);
        card.setRejectionReason(null);

        atmCardRepository.save(card);

        emailService.sendATMApprovedEmail(
                card.getCustomer().getEmail(),
                card.getCustomer().getFullName(),
                generatedPin
        );

        return new MessageResponse(
                "ATM Card approved successfully."
        );
    }
    private String generateCardNumber() {

        Random random = new Random();

        StringBuilder card = new StringBuilder("5244");

        while (card.length() < 16) {
            card.append(random.nextInt(10));
        }

        return card.toString();
    }

    private String generateCVV() {

        Random random = new Random();

        return String.format("%03d",
                random.nextInt(1000));
    }

    private String generatePIN() {

        Random random = new Random();

        return String.format("%04d",
                random.nextInt(10000));
    }

    public MessageResponse rejectATMCard(
            Long id,
            RejectATMRequest request,
            String adminEmail) {

        ATMCard card = atmCardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("ATM Card request not found."));

        if (!"PENDING".equals(card.getStatus())) {
            throw new RuntimeException(
                    "Only PENDING ATM requests can be rejected.");
        }

        card.setStatus("REJECTED");
        card.setRejectedBy(adminEmail);
        card.setRejectedDate(LocalDate.now());
        card.setRejectionReason(request.getReason());
        card.setApprovedBy(null);
        card.setApprovedDate(null);
        card.setCardNumber(null);
        card.setCvv(null);
        card.setPin(null);
        card.setExpiryDate(null);

        atmCardRepository.save(card);

        emailService.sendATMRejectedEmail(
                card.getCustomer().getEmail(),
                card.getCustomer().getFullName(),
                request.getReason()
        );

        return new MessageResponse(
                "ATM Card rejected successfully."
        );
    }

    private String generateReference(String prefix) {
        return prefix + System.currentTimeMillis();
    }



// =====================================================
// GET ADMIN PROFILE
// =====================================================

public AdminProfileResponse getAdminProfile(String email) {

    Admin admin = adminRepository.findByEmail(email)
            .orElseThrow(() ->
                    new UsernameNotFoundException(
                            "Admin not found."
                    )
            );

    String imageUrl = null;

    if (admin.getProfilePicture() != null
            && !admin.getProfilePicture().isBlank()) {

        imageUrl =
                backendUrl + "/uploads/profiles/"
                        + admin.getProfilePicture();
    }

    return new AdminProfileResponse(
            admin.getId(),
            admin.getFullName(),
            admin.getEmail(),
            admin.getRole(),
            imageUrl
    );
}

// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

public AdminProfileResponse updateAdminProfile(
        String currentEmail,
        AdminUpdateProfileRequest request) {

    Admin admin = adminRepository.findByEmail(currentEmail)
            .orElseThrow(() ->
                    new UsernameNotFoundException(
                            "Admin not found."
                    )
            );

    if (request.getFullName() == null ||
            request.getFullName().trim().isEmpty()) {

        throw new IllegalArgumentException(
                "Full name is required."
        );
    }

    if (request.getEmail() == null ||
            request.getEmail().trim().isEmpty()) {

        throw new IllegalArgumentException(
                "Email is required."
        );
    }

    String newEmail =
            request.getEmail().trim().toLowerCase();

    if (!newEmail.equalsIgnoreCase(currentEmail)) {

        if (adminRepository.existsByEmail(newEmail)) {

            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }
    }

    admin.setFullName(
            request.getFullName().trim()
    );

    admin.setEmail(newEmail);

    Admin savedAdmin =
            adminRepository.save(admin);

    String imageUrl = null;

if (savedAdmin.getProfilePicture() != null
        && !savedAdmin.getProfilePicture().isBlank()) {

    imageUrl =
            backendUrl + "/uploads/profiles/"
                    + savedAdmin.getProfilePicture();
}

return new AdminProfileResponse(
        savedAdmin.getId(),
        savedAdmin.getFullName(),
        savedAdmin.getEmail(),
        savedAdmin.getRole(),
        imageUrl
);
}

// =====================================================
// UPLOAD ADMIN PROFILE PICTURE
// =====================================================

public AdminProfileResponse uploadAdminProfilePicture(
        String email,
        MultipartFile file) throws IOException {

    Admin admin = adminRepository.findByEmail(email)
            .orElseThrow(() ->
                    new UsernameNotFoundException(
                            "Admin not found."
                    )
            );

    // ==========================
    // Validate file
    // ==========================

    if (file == null || file.isEmpty()) {
        throw new IllegalArgumentException(
                "Please select an image."
        );
    }

    String contentType = file.getContentType();

    if (contentType == null ||
            !(contentType.equals("image/jpeg")
                    || contentType.equals("image/png")
                    || contentType.equals("image/jpg"))) {

        throw new IllegalArgumentException(
                "Only JPG, JPEG and PNG images are allowed."
        );
    }

    // ==========================
    // Upload directory
    // ==========================

    String uploadDir =
            fileStorageConfig.getUploadDir();

    Files.createDirectories(
            Paths.get(uploadDir)
    );

    // ==========================
    // Delete previous admin image
    // ==========================

    if (admin.getProfilePicture() != null
            && !admin.getProfilePicture().isBlank()) {

        Path oldFile = Paths.get(
                uploadDir,
                admin.getProfilePicture()
        );

        Files.deleteIfExists(oldFile);
    }

    // ==========================
    // Generate unique filename
    // ==========================

    String originalName =
            file.getOriginalFilename();

    String fileName =
            UUID.randomUUID()
                    + "_"
                    + (originalName != null
                    ? originalName
                    : "admin-profile.jpg");

    Path path =
            Paths.get(uploadDir, fileName);

    // ==========================
    // Save file
    // ==========================

    Files.copy(
            file.getInputStream(),
            path,
            StandardCopyOption.REPLACE_EXISTING
    );

    // ==========================
    // Save filename in database
    // ==========================

    admin.setProfilePicture(fileName);

    Admin savedAdmin =
            adminRepository.save(admin);

    // ==========================
    // Image URL
    // ==========================

    String imageUrl =
            backendUrl + "/uploads/profiles/"
                    + fileName;

    return new AdminProfileResponse(
            savedAdmin.getId(),
            savedAdmin.getFullName(),
            savedAdmin.getEmail(),
            savedAdmin.getRole(),
            imageUrl
    );
}


// =====================================================
// CHANGE ADMIN PASSWORD
// =====================================================

public void changeAdminPassword(
        String email,
        AdminChangePasswordRequest request) {

    Admin admin = adminRepository.findByEmail(email)
            .orElseThrow(() ->
                    new UsernameNotFoundException(
                            "Admin not found."
                    )
            );

    if (request.getCurrentPassword() == null ||
            request.getCurrentPassword().isBlank()) {

        throw new IllegalArgumentException(
                "Current password is required."
        );
    }

    if (request.getNewPassword() == null ||
            request.getNewPassword().isBlank()) {

        throw new IllegalArgumentException(
                "New password is required."
        );
    }

    if (request.getConfirmPassword() == null ||
            request.getConfirmPassword().isBlank()) {

        throw new IllegalArgumentException(
                "Confirm password is required."
        );
    }

    if (!passwordEncoder.matches(
            request.getCurrentPassword(),
            admin.getPassword())) {

        throw new IllegalArgumentException(
                "Current password is incorrect."
        );
    }

    if (request.getNewPassword().length() < 6) {

        throw new IllegalArgumentException(
                "New password must be at least 6 characters."
        );
    }

    if (!request.getNewPassword().equals(
            request.getConfirmPassword())) {

        throw new IllegalArgumentException(
                "New password and confirm password do not match."
        );
    }

    if (passwordEncoder.matches(
            request.getNewPassword(),
            admin.getPassword())) {

        throw new IllegalArgumentException(
                "New password must be different from current password."
        );
    }

    admin.setPassword(
            passwordEncoder.encode(
                    request.getNewPassword()
            )
    );

    adminRepository.save(admin);
}


}