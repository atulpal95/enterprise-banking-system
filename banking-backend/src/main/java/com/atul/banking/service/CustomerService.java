
package com.atul.banking.service;
import com.atul.banking.entity.KYC;
import com.atul.banking.entity.ATMCard;
import com.atul.banking.repository.*;

import java.time.LocalDate;
import java.util.Random;
import com.atul.banking.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import com.atul.banking.dto.*;
import com.atul.banking.entity.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.atul.banking.entity.Transaction;

import java.time.LocalDateTime;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import com.atul.banking.config.FileStorageConfig;
import com.atul.banking.entity.ChequeBookRequest;

import com.atul.banking.entity.Beneficiary;
import com.atul.banking.dto.analytics.MonthlySpendingResponse;
import java.util.ArrayList;

import com.atul.banking.entity.Loan;

import com.atul.banking.entity.FixedDeposit;
import com.atul.banking.entity.RecurringDeposit;

import java.io.ByteArrayInputStream;

import java.io.InputStream;
import javax.imageio.ImageIO;

import com.atul.banking.util.StatementPdfGenerator;


@Service
public class CustomerService {

    @Autowired
    private OtpService otpService;

    @Autowired
    private CustomerRepository customerRepository;
     
    @Value("${app.backend-url}")
    private String backendUrl;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private JwtService jwtService;

    @Autowired
    private FileStorageConfig fileStorageConfig;
    @Autowired
    private ATMCardRepository atmCardRepository;
    @Autowired
    private ChequeBookRequestRepository chequeBookRequestRepository;
    @Autowired
    private BeneficiaryRepository beneficiaryRepository;
    @Autowired
    private LoanRepository loanRepository;
    @Autowired
    private FixedDepositRepository fixedDepositRepository;
    @Autowired
    private RecurringDepositRepository recurringDepositRepository;
    @Autowired
    private EmailService emailService;
    private static final double LARGE_TRANSACTION_LIMIT = 50000;
    @Value("${file.storage.kyc-dir:uploads/kyc}")
    private String kycUploadDir;
    @Autowired
    private KYCRepository kycRepository;


   public void registerCustomer(RegisterRequest request) {

    if (customerRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already registered.");
    }

    Customer customer = new Customer();

    customer.setFullName(request.getFullName());

    customer.setEmail(request.getEmail());

    customer.setMobile(request.getMobile());

    customer.setAddress(request.getAddress());

    customer.setCity(request.getCity());

    customer.setState(request.getState());

    customer.setCountry(request.getCountry());

    customer.setPostalCode(request.getPostalCode());

    customer.setPassword(
            passwordEncoder.encode(
                    request.getPassword()
            )
    );

    customer.setBalance(0.0);

    customer.setAccountNumber(generateAccountNumber());

    customer.setIfscCode(generateIFSC());

    Customer savedCustomer = customerRepository.save(customer);

try {
    emailService.sendWelcomeEmail(
            savedCustomer.getEmail(),
            savedCustomer.getFullName()
    );
} catch (RuntimeException e) {
    org.slf4j.LoggerFactory.getLogger(CustomerService.class)
            .warn(
                    "Welcome email failed for customer id {}",
                    savedCustomer.getId(),
                    e
            );
}

}
   public LoginResponse loginCustomer(LoginRequest loginRequest) {

    Customer customer = customerRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Customer not found."));

    if (!customer.isActive()) {
        throw new RuntimeException("Your account has been blocked by Admin.");
    }

    if (!passwordEncoder.matches(
            loginRequest.getPassword(),
            customer.getPassword())) {

        throw new RuntimeException("Invalid password.");
    }

    // Generate JWT
    String token = jwtService.generateToken(customer.getEmail());

    // Login must not fail if email delivery fails
    try {
        emailService.sendLoginAlertEmail(
                customer.getEmail(),
                customer.getFullName(),
                LocalDateTime.now().toString(),
                "Unknown"
        );
    } catch (RuntimeException e) {

        org.slf4j.LoggerFactory.getLogger(CustomerService.class)
                .warn(
                        "Login alert email failed for customer id {}",
                        customer.getId(),
                        e
                );
    }

    return new LoginResponse(
            customer.getId(),
            "Login Successful",
            token,
            customer.getFullName(),
            customer.getEmail(),
            customer.getBalance()
    );
}
  private void verifyBankingEligibility(Customer customer) {

    if (!customer.isActive()) {
        throw new RuntimeException(
                "Your account has been blocked by Admin."
        );
    }

    if (!"ACTIVE".equals(customer.getAccountStatus())) {
        throw new RuntimeException(
                "Your account is pending Admin approval."
        );
    }

    if (!"VERIFIED".equals(customer.getKycStatus())) {
        throw new RuntimeException(
                "KYC verification is required before using banking services."
        );
    }
}

 private void validateKYCFile(
        MultipartFile file,
        boolean imageOnly
) {

    if (file == null || file.isEmpty()) {

        throw new RuntimeException(
                "Required KYC document is missing."
        );
    }

    // 10 MB maximum per KYC file
    final long MAX_KYC_FILE_SIZE =
            10L * 1024 * 1024;

    if (file.getSize() > MAX_KYC_FILE_SIZE) {

        double sizeMB =
                file.getSize()
                        / (1024.0 * 1024.0);

        throw new RuntimeException(
                String.format(
                        "File '%s' is too large. Maximum allowed size is 10 MB. Current size: %.2f MB.",
                        file.getOriginalFilename(),
                        sizeMB
                )
        );
    }

    String contentType =
            file.getContentType();

    if (contentType == null) {

        throw new RuntimeException(
                "Unable to determine file type."
        );
    }

    contentType =
            contentType.toLowerCase();

    // ============================================
    // SELFIE
    // ============================================

    if (imageOnly) {

        if (!contentType.equals("image/jpeg")
                && !contentType.equals("image/png")
                && !contentType.equals("image/jpg")) {

            throw new RuntimeException(
                    "Selfie must be JPG, JPEG or PNG."
            );
        }

        // Verify that the uploaded bytes are
        // actually a readable image.
        try (InputStream inputStream =
                     file.getInputStream()) {

            if (ImageIO.read(inputStream) == null) {

                throw new RuntimeException(
                        "Uploaded selfie is not a valid image."
                );
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to validate selfie file."
            );
        }

        return;
    }

    // ============================================
    // FRONT / BACK DOCUMENT
    // ============================================

    boolean image =
            contentType.equals("image/jpeg")
            || contentType.equals("image/png")
            || contentType.equals("image/jpg");

    boolean pdf =
            contentType.equals("application/pdf");

    if (!image && !pdf) {

        throw new RuntimeException(
                "Document must be JPG, JPEG, PNG or PDF."
        );
    }

    // ============================================
    // VERIFY ACTUAL FILE CONTENT
    // ============================================

    try {

        byte[] fileBytes =
                file.getBytes();

        if (image) {

            try (ByteArrayInputStream inputStream =
                         new ByteArrayInputStream(fileBytes)) {

                if (ImageIO.read(inputStream) == null) {

                    throw new RuntimeException(
                            "Uploaded document is not a valid image."
                    );
                }
            }

        } else {

            // PDF files must begin with %PDF-
            if (fileBytes.length < 5
                    || fileBytes[0] != '%'
                    || fileBytes[1] != 'P'
                    || fileBytes[2] != 'D'
                    || fileBytes[3] != 'F'
                    || fileBytes[4] != '-') {

                throw new RuntimeException(
                        "Uploaded document is not a valid PDF."
                );
            }
        }

    } catch (IOException e) {

        throw new RuntimeException(
                "Unable to validate document file."
        );
    }
}
private String saveKYCFile(
        MultipartFile file,
        String folder
) throws IOException {

    Path directory = Paths.get(
            kycUploadDir,
            folder
    );

    Files.createDirectories(directory);

    String contentType =
            file.getContentType();

    if (contentType == null) {
        throw new IOException(
                "Unable to determine file type."
        );
    }

    contentType =
            contentType.toLowerCase();

    String extension;

    // ============================================
    // DETERMINE EXTENSION FROM CONTENT TYPE
    // ============================================

    if (contentType.equals("image/jpeg")
            || contentType.equals("image/jpg")) {

        extension = ".jpg";

    } else if (contentType.equals("image/png")) {

        extension = ".png";

    } else if (contentType.equals("application/pdf")
            && !folder.equals("selfie")) {

        extension = ".pdf";

    } else {

        throw new IOException(
                "Unsupported file type."
        );
    }

    // ============================================
    // SECURE RANDOM FILE NAME
    // ============================================

    String fileName =
            UUID.randomUUID() + extension;

    Path directoryPath =
            directory
                    .toAbsolutePath()
                    .normalize();

    Path path =
            directoryPath
                    .resolve(fileName)
                    .normalize();

    // ============================================
    // PATH TRAVERSAL PROTECTION
    // ============================================

    if (!path.startsWith(directoryPath)) {

        throw new IOException(
                "Invalid file path."
        );
    }

    Files.copy(
            file.getInputStream(),
            path,
            StandardCopyOption.REPLACE_EXISTING
    );

    return fileName;
}

@Transactional
public KYCResponse submitKYCWithDocuments(
        String email,
        String documentType,
        String documentNumber,
        MultipartFile frontDocument,
        MultipartFile backDocument,
        MultipartFile selfie
) throws IOException {

    Customer customer =
            customerRepository
                    .findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Customer not found."
                            )
                    );

    // ============================================
    // ACCOUNT APPROVAL CHECK
    // ============================================

    if (!"ACTIVE".equals(
            customer.getAccountStatus())) {

        throw new RuntimeException(
                "Your account must be approved before submitting KYC."
        );
    }

    // ============================================
    // KYC STATUS CHECK
    // ============================================

    KYC existingKYC =
            kycRepository
                    .findByCustomerEmail(email)
                    .orElse(null);

    if (existingKYC != null
            && "PENDING".equals(
                    existingKYC.getStatus())) {

        throw new RuntimeException(
                "Your KYC application is already under review."
        );
    }

    if (existingKYC != null
            && "VERIFIED".equals(
                    existingKYC.getStatus())) {

        throw new RuntimeException(
                "Your KYC is already verified."
        );
    }

    // ============================================
    // VALIDATE TEXT DATA
    // ============================================

    if (documentType == null
            || documentType.isBlank()) {

        throw new RuntimeException(
                "Document type is required."
        );
    }

    if (documentNumber == null
            || documentNumber.isBlank()) {

        throw new RuntimeException(
                "Document number is required."
        );
    }

    // ============================================
    // VALIDATE FILES
    // ============================================

    validateKYCFile(
            frontDocument,
            false
    );

    validateKYCFile(
            backDocument,
            false
    );

    validateKYCFile(
            selfie,
            true
    );

    // ============================================
    // SAVE FILES
    // ============================================

    String frontFileName =
            saveKYCFile(
                    frontDocument,
                    "front"
            );

    String backFileName =
            saveKYCFile(
                    backDocument,
                    "back"
            );

    String selfieFileName =
            saveKYCFile(
                    selfie,
                    "selfie"
            );

    // ============================================
    // CREATE / REUSE KYC
    // ============================================

    KYC kyc = existingKYC;

    if (kyc == null) {

        kyc = new KYC();

        kyc.setCustomer(customer);
    }

    // ============================================
    // KYC INFORMATION
    // ============================================

    kyc.setDocumentType(
            documentType.trim()
    );

    kyc.setDocumentNumber(
            documentNumber.trim()
    );

    kyc.setFrontDocumentUrl(
            "/uploads/kyc/front/" + frontFileName
    );

    kyc.setBackDocumentUrl(
            "/uploads/kyc/back/" + backFileName
    );

    kyc.setSelfieUrl(
            "/uploads/kyc/selfie/" + selfieFileName
    );

    // ============================================
    // STATUS
    // ============================================

    kyc.setStatus("PENDING");

    kyc.setSubmittedAt(
            LocalDateTime.now()
    );

    // ============================================
    // CLEAR OLD REVIEW
    // ============================================

    kyc.setRejectionReason(null);
    kyc.setVerificationRemarks(null);
    kyc.setReviewedBy(null);
    kyc.setReviewedAt(null);
    kyc.setVerifiedAt(null);
    kyc.setExpiresAt(null);

    // ============================================
    // CUSTOMER KYC STATUS
    // ============================================

    customer.setKycStatus("PENDING");

    customerRepository.save(customer);

    KYC savedKYC =
            kycRepository.save(kyc);

            emailService.sendKYCSubmittedEmail(
        customer.getEmail(),
        customer.getFullName(),
        kyc.getDocumentType()
);

    return mapToResponse(savedKYC);
}

    private KYCResponse mapToResponse(KYC kyc) {

    if (kyc == null) {
        return null;
    }

    return new KYCResponse(
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
            kyc.getExpiresAt()
    );
}


    public BalanceResponse depositMoney(
        String email,
        DepositRequest request) {

        Customer customer =
                      customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        if (request.getAmount() <= 0) {
            throw new RuntimeException(
                    "Deposit amount must be greater than zero."
            );
        }

        customer.setBalance(
                customer.getBalance() + request.getAmount()
        );

        customerRepository.save(customer);

        Transaction transaction = new Transaction();

         transaction.setEmail(customer.getEmail());
         transaction.setType("DEPOSIT");
         transaction.setDescription("Cash Deposit");
         transaction.setReference(generateReference("DEP"));
         transaction.setAmount(request.getAmount());
         transaction.setBalanceAfterTransaction(customer.getBalance());
         transaction.setTransactionTime(LocalDateTime.now());

        transactionRepository.save(transaction);

        // Send deposit email

        emailService.sendDepositEmail(
                customer.getEmail(),
                customer.getFullName(),
                request.getAmount(),
                customer.getBalance()
        );
        if (request.getAmount() >= 50000) {
           emailService.sendLargeTransactionAlert(
            customer.getEmail(),
            customer.getFullName(),
            request.getAmount(),
            "Deposit"
    );
  }
        return new BalanceResponse(
        "Amount deposited successfully.",
        customer.getBalance(),
        transaction.getReference(),
        transaction.getTransactionTime(),
        request.getAmount()
   );
    }
    

    public BalanceResponse withdrawMoney(
        String email,
        WithdrawRequest request) {

    Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));
                    verifyBankingEligibility(customer);

    if (request.getAmount() <= 0) {
        throw new RuntimeException(
                "Amount must be greater than zero."
        );
    }

    if (customer.getBalance() < request.getAmount()) {
        throw new RuntimeException(
                "Insufficient balance."
        );
    }

    customer.setBalance(
            customer.getBalance() - request.getAmount()
    );

    customerRepository.save(customer);

    emailService.sendWithdrawalEmail(
            customer.getEmail(),
            customer.getFullName(),
            request.getAmount(),
            customer.getBalance()
    );

    if (request.getAmount() >= 50000) {
    emailService.sendLargeTransactionAlert(
            customer.getEmail(),
            customer.getFullName(),
            request.getAmount(),
            "Withdrawal"
    );
}

    Transaction transaction = new Transaction();

    transaction.setEmail(customer.getEmail());
    transaction.setType("WITHDRAW");
    transaction.setDescription("ATM Withdrawal");
    transaction.setReference(generateReference("WDR"));
    transaction.setAmount(request.getAmount());
    transaction.setBalanceAfterTransaction(customer.getBalance());
    transaction.setTransactionTime(LocalDateTime.now());

    transactionRepository.save(transaction);

    return new BalanceResponse(
            "Amount withdrawn successfully.",
            customer.getBalance(),
            transaction.getReference(),
            transaction.getTransactionTime(),
            request.getAmount()
    );
}
    public BalanceResponse checkBalance(BalanceRequest request) {

        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        return new BalanceResponse(
                "Current Balance",
                customer.getBalance()
        );
    }
    
    
    public TransferResponse transferMoney(String senderEmail,TransferRequest request) {

        Customer sender =
                   customerRepository.findByEmail(senderEmail)
                   .orElseThrow(() ->
                    new RuntimeException("Sender not found."));
                    verifyBankingEligibility(sender);

       Customer receiver;

       if (request.getToEmail() != null &&
       !request.getToEmail().isBlank()) {

       receiver = customerRepository
            .findByEmail(request.getToEmail())
            .orElseThrow(() ->
                    new RuntimeException(
                            "Receiver not found."
                    ));

        } else {

      receiver = customerRepository
            .findByAccountNumberAndIfscCode(

                    request.getAccountNumber(),

                    request.getIfscCode()

            )
            .orElseThrow(() ->
                    new RuntimeException(
                            "Receiver not found."
                    ));

        }

        if (request.getAmount() <= 0) {
            throw new RuntimeException("Amount must be greater than zero.");
        }

        if (sender.getBalance() < request.getAmount()) {
            throw new RuntimeException("Insufficient balance.");
        }

        // Update balances
        sender.setBalance(sender.getBalance() - request.getAmount());
        receiver.setBalance(receiver.getBalance() + request.getAmount());

        customerRepository.save(sender);
        customerRepository.save(receiver);

        // ============================
        // Sender Transaction
        // ============================

        Transaction senderTransaction = new Transaction();

        senderTransaction.setEmail(sender.getEmail());
        senderTransaction.setType("TRANSFER_OUT");
        senderTransaction.setDescription("Sent to " + receiver.getFullName());
        senderTransaction.setReference(generateReference("TRF"));
        senderTransaction.setAmount(request.getAmount());
        senderTransaction.setBalanceAfterTransaction(sender.getBalance());
        senderTransaction.setTransactionTime(LocalDateTime.now());

        transactionRepository.save(senderTransaction);

        // ============================
        // Receiver Transaction
        // ============================

        Transaction receiverTransaction = new Transaction();

         receiverTransaction.setEmail(receiver.getEmail());
         receiverTransaction.setType("TRANSFER_IN");
         receiverTransaction.setDescription("Received from " + sender.getFullName());
         receiverTransaction.setReference(generateReference("TRF"));
         receiverTransaction.setAmount(request.getAmount());
         receiverTransaction.setBalanceAfterTransaction(receiver.getBalance());
         receiverTransaction.setTransactionTime(LocalDateTime.now());

         transactionRepository.save(receiverTransaction);

        // ============================
        // Email Notifications
        // ============================

        emailService.sendTransferSentEmail(
                sender.getEmail(),
                sender.getFullName(),
                receiver.getEmail(),
                request.getAmount(),
                sender.getBalance()
        );

        emailService.sendTransferReceivedEmail(
                receiver.getEmail(),
                receiver.getFullName(),
                sender.getEmail(),
                request.getAmount(),
                receiver.getBalance()
        );

        // ============================
        // Large Transaction Alert
        // ============================

        if (request.getAmount() >= LARGE_TRANSACTION_LIMIT) {

            emailService.sendLargeTransactionAlert(
                    sender.getEmail(),
                    sender.getFullName(),
                    request.getAmount(),
                    "Fund Transfer"
            );
        }

        return new TransferResponse(
                "Money transferred successfully.",
                sender.getBalance(),
                receiver.getBalance(),
                senderTransaction.getReference(),

                 senderTransaction.getTransactionTime(),

                 receiver.getFullName(),

                 receiver.getAccountNumber(),

                 request.getAmount()

        );
    }

        public TransferResponse transferToBeneficiary(
        String customerEmail,
        BeneficiaryTransferRequest request) {

        Beneficiary beneficiary = beneficiaryRepository
            .findByIdAndCustomerEmail(
                    request.getBeneficiaryId(),
                    customerEmail
            )
            .orElseThrow(() ->
                    new RuntimeException("Beneficiary not found."));
                    

       TransferRequest transferRequest = new TransferRequest();

          transferRequest.setToEmail(
                  beneficiary.getBeneficiaryEmail()
          );

        transferRequest.setAmount(
                 request.getAmount()
         );

       return transferMoney(
            customerEmail,
            transferRequest
        );
      }

        public VerifyAccountResponse verifyAccount(
            VerifyAccountRequest request) {

        Customer customer =
                customerRepository
                        .findByAccountNumberAndIfscCode(
                                request.getAccountNumber(),
                                request.getIfscCode()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Account not found."
                                ));

        return new VerifyAccountResponse(
                true,
                customer.getFullName(),
                customer.getAccountNumber(),
                customer.getIfscCode()
         );
     }


      public List<Transaction> getTransactionHistory(String email) {

        if (!customerRepository.existsByEmail(email)) {
            throw new RuntimeException("Customer not found.");
        }

        return transactionRepository.findByEmailOrderByTransactionTimeDesc(email);
        }

       private String generateReference(String prefix) {

       return prefix + System.currentTimeMillis();

   }

      private String generateAccountNumber() {

        long count = customerRepository.count() + 1;

        return "2026" + String.format("%06d", count);
    }

    private String generateIFSC() {

        return "ATUL0001234";
    }

    public List<Transaction> getMiniStatement(String email) {

        if (!customerRepository.existsByEmail(email)) {
            throw new RuntimeException("Customer not found.");
        }

        return transactionRepository.findTop5ByEmailOrderByTransactionTimeDesc(email);
    }

   

   public AccountResponse getAccountDetails(String email) {

    Customer customer = customerRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found.")
            );


    // =========================
    // ATM Card Status
    // =========================

    String atmCardStatus = "NOT_REQUESTED";

    if (customer.getAtmCard() != null) {

        atmCardStatus =
                customer.getAtmCard().getStatus();
    }


    // =========================
    // Account Response
    // =========================

    return new AccountResponse(

            customer.getFullName(),

            customer.getEmail(),

            customer.getMobile(),

            customer.getAccountNumber(),

            customer.getIfscCode(),

            customer.getBalance(),

            customer.getAccountType(),

            customer.getBranchName(),

            atmCardStatus,

            customer.getKycStatus(),

            customer.isActive()
    );
}

    public ChangePasswordResponse changePassword(
            String email,
            ChangePasswordRequest request) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                customer.getPassword())) {

            throw new RuntimeException("Old password is incorrect.");
        }

        customer.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        customerRepository.save(customer);

        emailService.sendPasswordChangedEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new ChangePasswordResponse(
                "Password changed successfully.");
    }

    public void forgotPassword(String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        otpService.sendOtp(customer.getEmail());
    }

    public MessageResponse verifyOtp(VerifyOtpRequest request) {

        boolean valid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!valid) {
            throw new RuntimeException("Invalid or expired OTP.");
        }

        return new MessageResponse("OTP verified successfully.");
    }

    public MessageResponse resetPassword(ResetPasswordRequest request) {

        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        boolean valid = otpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        if (!valid) {
            throw new RuntimeException("Invalid or expired OTP.");
        }

        customer.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        customerRepository.save(customer);

        otpService.clearOtp(request.getEmail());

        return new MessageResponse("Password reset successfully.");
    }

    public CustomerProfileResponse getProfile(String email) {

    Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found"));

    String imageUrl = null;

    if (customer.getProfilePicture() != null
            && !customer.getProfilePicture().isBlank()) {

        imageUrl =  backendUrl + "/uploads/profiles/"
                + customer.getProfilePicture();
    }

    return new CustomerProfileResponse(
            customer.getId(),
            customer.getFullName(),
            customer.getEmail(),
            customer.getMobile(),

            // Address
            customer.getAddress(),
            customer.getCity(),
            customer.getState(),
            customer.getPostalCode(),
            customer.getCountry(),

            // Banking
            customer.getBalance(),
            customer.getAccountNumber(),
            customer.getIfscCode(),

            // Status
            customer.isActive(),

            // Profile Picture
            imageUrl
    );
}

    public MessageResponse addBeneficiary(
            String customerEmail,
            AddBeneficiaryRequest request) {

        // Logged-in customer
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        // Beneficiary customer
        Customer beneficiaryCustomer = customerRepository
                .findByEmail(request.getBeneficiaryEmail())
                .orElseThrow(() ->
                        new RuntimeException("Beneficiary not found."));

        // Cannot add yourself
        if (customer.getEmail().equalsIgnoreCase(
                beneficiaryCustomer.getEmail())) {

            throw new RuntimeException(
                    "You cannot add yourself as a beneficiary."
            );
        }

        // Duplicate check
        if (beneficiaryRepository
                .existsByCustomerEmailAndBeneficiaryEmail(
                        customer.getEmail(),
                        beneficiaryCustomer.getEmail())) {

            throw new RuntimeException(
                    "Beneficiary already added."
            );
        }

        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setCustomerEmail(customer.getEmail());

        beneficiary.setBeneficiaryName(
                beneficiaryCustomer.getFullName());

        beneficiary.setBeneficiaryEmail(
                beneficiaryCustomer.getEmail());

        beneficiary.setAccountNumber(
                beneficiaryCustomer.getAccountNumber());

        beneficiary.setIfscCode(
                beneficiaryCustomer.getIfscCode());

        beneficiary.setNickname(
                request.getNickname());

        beneficiary.setCreatedDate(
                LocalDateTime.now());

        beneficiaryRepository.save(beneficiary);
        emailService.sendBeneficiaryAddedEmail(
                customer.getEmail(),
                customer.getFullName(),
                beneficiary.getBeneficiaryName(),
                beneficiary.getAccountNumber()
        );

        return new MessageResponse(
                "Beneficiary added successfully."
        );
    }
    public List<Beneficiary> getBeneficiaries(String email) {

        return beneficiaryRepository.findByCustomerEmail(email);
    }

    public MessageResponse deleteBeneficiary(
            String email,
            Long id) {

        Beneficiary beneficiary =
                beneficiaryRepository
                        .findByIdAndCustomerEmail(
                                id,
                                email
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Beneficiary not found."
                                ));
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        beneficiaryRepository.delete(beneficiary);

        emailService.sendBeneficiaryDeletedEmail(
                customer.getEmail(),
                customer.getFullName(),
                beneficiary.getBeneficiaryName()
        );

        return new MessageResponse(
                "Beneficiary deleted successfully."
        );
    }

    public MessageResponse updateBeneficiary(
            String email,
            Long id,
            UpdateBeneficiaryRequest request) {

        // Find beneficiary
        Beneficiary beneficiary = beneficiaryRepository
                .findByIdAndCustomerEmail(id, email)
                .orElseThrow(() ->
                        new RuntimeException("Beneficiary not found."));

        // Find logged-in customer
        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        // Update beneficiary details
        beneficiary.setNickname(request.getNickname());

        beneficiaryRepository.save(beneficiary);

        // Send email notification
        emailService.sendBeneficiaryUpdatedEmail(
                customer.getEmail(),
                customer.getFullName(),
                beneficiary.getBeneficiaryName()
        );

        return new MessageResponse(
                "Beneficiary updated successfully."
        );
    }

    public MessageResponse updateProfile(
        String email,
        UpdateProfileRequest request) {

    Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    // ==========================
    // Duplicate Email Check
    // ==========================

    if (!customer.getEmail().equalsIgnoreCase(request.getEmail())
            && customerRepository.existsByEmail(request.getEmail())) {

        throw new RuntimeException("Email already exists.");
    }

    // ==========================
    // Update Basic Information
    // ==========================

    customer.setFullName(request.getFullName());
    customer.setEmail(request.getEmail());
    customer.setMobile(request.getMobile());

    // ==========================
    // Update Address
    // ==========================

    customer.setAddress(request.getAddress());
    customer.setCity(request.getCity());
    customer.setState(request.getState());
    customer.setPostalCode(request.getPostalCode());
    customer.setCountry(request.getCountry());

    customerRepository.save(customer);

    emailService.sendProfileUpdatedEmail(
            customer.getEmail(),
            customer.getFullName()
    );

    return new MessageResponse(
            "Profile updated successfully."
    );
}
        public UploadProfilePictureResponse uploadProfilePicture(
                String email,
                MultipartFile file) throws IOException {

            Customer customer = customerRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new RuntimeException("Customer not found."));

            if (file.isEmpty()) {
                throw new RuntimeException("Please select an image.");
            }

            String contentType = file.getContentType();

            if (contentType == null ||
                    !(contentType.equals("image/jpeg")
                            || contentType.equals("image/png")
                            || contentType.equals("image/jpg"))) {

                throw new RuntimeException(
                        "Only JPG, JPEG and PNG images are allowed."
                );
            }

            String uploadDir = fileStorageConfig.getUploadDir();

            Files.createDirectories(Paths.get(uploadDir));

            // Delete previous image
            if (customer.getProfilePicture() != null
                    && !customer.getProfilePicture().isBlank()) {

                Path oldFile = Paths.get(
                        uploadDir,
                        customer.getProfilePicture()
                );

                Files.deleteIfExists(oldFile);
            }

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir, fileName);

            Files.copy(
                    file.getInputStream(),
                    path,
                    StandardCopyOption.REPLACE_EXISTING
            );

 

            customer.setProfilePicture(fileName);

            customerRepository.save(customer);
            emailService.sendProfilePictureUpdatedEmail(
                    customer.getEmail(),
                    customer.getFullName()
            );

            String imageUrl =
                    backendUrl + "/uploads/profiles/" + fileName;

            return new UploadProfilePictureResponse(
                    "Profile picture uploaded successfully.",
                    imageUrl
            );
        }

    private String generateCVV() {

        Random random = new Random();

        return String.format("%03d", random.nextInt(1000));
    }

    private String generatePIN() {

        Random random = new Random();

        return String.format("%04d", random.nextInt(10000));
    }

    public ATMCardRequestResponse requestATMCard(String email) {

        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        if (atmCardRepository.existsByCustomerEmail(customer.getEmail())) {
            throw new RuntimeException(
                    "ATM Card request already exists.");
        }

        ATMCard card = new ATMCard();

        card.setCustomer(customer);

        card.setStatus("PENDING");


        card.setRequestDate(LocalDate.now());

        atmCardRepository.save(card);

        emailService.sendATMRequestEmail(
                customer.getEmail(),
                customer.getFullName()
        );
        return new ATMCardRequestResponse(
                "ATM Card request submitted successfully."
        );
    }
   public ATMCardResponse getATMCard(String email) {

    Customer customer = customerRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    ATMCard card = atmCardRepository
            .findByCustomerEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("ATM Card not found."));

    return new ATMCardResponse(

            customer.getFullName(),

            card.getCardNumber(),

            card.getCvv(),

            card.getExpiryDate() != null
                    ? card.getExpiryDate().toString()
                    : null,

            null,

            card.getStatus(),

            "RuPay Platinum",

            50000.0,

            card.getRequestDate() != null
                    ? card.getRequestDate().toString()
                    : null,

            card.getApprovedDate() != null
                    ? card.getApprovedDate().toString()
                    : null
    );
}

    public MessageResponse changeATMCardPin(
            String email,
            ChangePinRequest request) {

        ATMCard card = atmCardRepository
                .findByCustomerEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("ATM Card not found."));

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new RuntimeException("ATM Card is not active.");
        }

        if (!passwordEncoder.matches(
                request.getOldPin(),
                card.getPin())) {

            throw new RuntimeException("Old PIN is incorrect.");
        }

        card.setPin(
                passwordEncoder.encode(
                        request.getNewPin()
                )
        );

        atmCardRepository.save(card);

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        emailService.sendATMPinChangedEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new MessageResponse(
                "ATM PIN changed successfully."
        );
    }
    public ATMCardStatusResponse getATMCardStatus(String email) {

        ATMCard card = atmCardRepository
                .findByCustomerEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("ATM Card not found."));

        return new ATMCardStatusResponse(
                "ACTIVE".equals(card.getStatus())
        );
    }


    public MessageResponse blockATMCard(String email) {

        ATMCard card = atmCardRepository
                .findByCustomerEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("ATM Card not found."));

        if (!"ACTIVE".equals(card.getStatus())) {
            throw new RuntimeException(
                    "Only ACTIVE ATM Cards can be blocked.");
        }

        card.setStatus("BLOCKED");

        atmCardRepository.save(card);

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        emailService.sendATMBlockedEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new MessageResponse(
                "ATM Card blocked successfully."
        );
    }
    public MessageResponse unblockATMCard(String email) {

        ATMCard card = atmCardRepository
                .findByCustomerEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("ATM Card not found."));

        if (!"BLOCKED".equals(card.getStatus())) {
            throw new RuntimeException(
                    "Only BLOCKED ATM Cards can be unblocked.");
        }

        card.setStatus("ACTIVE");

        atmCardRepository.save(card);

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found."));

        emailService.sendATMUnblockedEmail(
                customer.getEmail(),
                customer.getFullName()
        );

        return new MessageResponse(
                "ATM Card unblocked successfully."
        );
    }

    public MessageResponse requestChequeBook(

        String email, ChequeBookRequestDto dto) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        // Prevent duplicate pending requests
        if (chequeBookRequestRepository
                .existsByCustomerEmailAndStatusIn(
                        customer.getEmail(),
                        List.of(
                                "REQUESTED",
                                "APPROVED",
                                "DISPATCHED"
                        ))) {

            throw new RuntimeException(
                    "You already have a pending cheque book request."
            );
        }

        ChequeBookRequest request = new ChequeBookRequest();

        request.setCustomerEmail(customer.getEmail());
        Integer leaves = dto.getNumberOfLeaves();

        if (leaves == null ||
        !(leaves == 25 || leaves == 50 || leaves == 100)) {

        throw new RuntimeException(
            "Please select 25, 50 or 100 cheque leaves."
        );
        }

        request.setNumberOfLeaves(leaves);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus("REQUESTED");

        chequeBookRequestRepository.save(request);

        // Send email
        emailService.sendChequeBookRequestEmail(
                customer.getEmail(),
                customer.getFullName(),
                request.getNumberOfLeaves()
        );

        return new MessageResponse(
                "Cheque book request submitted successfully."
        );
    }

    public List<ChequeBookRequestResponse> getChequeBookHistory(String email) {

        return chequeBookRequestRepository
        .findByCustomerEmail(email)
        .stream()
        .map(request -> new ChequeBookRequestResponse(

        request.getId(),

        request.getCustomerEmail(),

        request.getNumberOfLeaves(),

        request.getStatus(),

        request.getRequestDate(),

        request.getApprovedDate(),

        request.getApprovedBy(),

        request.getDispatchedDate(),

        request.getDeliveredDate(),

        request.getRejectionReason()

      ))
        .toList();
    }

    private Double getInterestRate(String loanType) {

        switch (loanType.toUpperCase()) {

            case "HOME":
                return 8.5;

            case "CAR":
                return 9.0;

            case "PERSONAL":
                return 12.5;

            case "EDUCATION":
                return 7.5;

            default:
                throw new RuntimeException("Invalid loan type.");
        }
    }

    private Double calculateEMI(
            Double amount,
            Double annualRate,
            Integer months) {

        double monthlyRate = annualRate / (12 * 100);

        double emi =
                (amount * monthlyRate *
                        Math.pow(1 + monthlyRate, months))
                        /
                        (Math.pow(1 + monthlyRate, months) - 1);

        return Math.round(emi * 100.0) / 100.0;
    }

    public MessageResponse applyLoan(
            String email,
            ApplyLoanRequest request) {

        Customer customer = customerRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        if (loanRepository.existsByCustomerAndStatusIn(
                customer,
                List.of(
                        "APPLIED",
                        "APPROVED",
                        "DISBURSED"
                ))) {

            throw new RuntimeException(
                    "You already have an active loan application."
            );
        }

        if (request.getAmount() <= 0) {
            throw new RuntimeException("Invalid loan amount.");
        }

        Double interest =
                getInterestRate(request.getLoanType());

        Double emi =
                calculateEMI(
                        request.getAmount(),
                        interest,
                        request.getTenureMonths());

        Loan loan = new Loan();

        loan.setCustomer(customer);

loan.setLoanType(
        request.getLoanType().toUpperCase()
);

loan.setAmount(
        request.getAmount()
);

loan.setInterestRate(
        interest
);

loan.setTenureMonths(
        request.getTenureMonths()
);

loan.setEmi(
        emi
);

// ==========================
// EMI Tracking Initialization
// ==========================

loan.setRemainingAmount(
        request.getAmount()
);

loan.setPaidInstallments(
        0
);

loan.setRemainingInstallments(
        request.getTenureMonths()
);

loan.setNextEmiDate(
        null
);

// ==========================

loan.setStatus(
        "APPLIED"
);

loan.setAppliedDate(
        LocalDateTime.now()
);

        loanRepository.save(loan);
        emailService.sendLoanAppliedEmail(
                customer.getEmail(),
                customer.getFullName(),
                loan.getLoanType(),
                loan.getAmount(),
                loan.getTenureMonths()
        );

        return new MessageResponse(
                "Loan application submitted successfully."
        );
    }

    public PayEmiResponse payEmi(String email, Long loanId) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        Loan loan = loanRepository
                .findByIdAndCustomerEmail(loanId, email)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found."));

        if (!"DISBURSED".equals(loan.getStatus())) {
    throw new RuntimeException(
            "Only disbursed loans can receive EMI payments.");
}

if (loan.getRemainingInstallments() <= 0) {
    throw new RuntimeException(
            "Loan has already been completed.");
}

// ==========================
// EMI Due Date Check
// ==========================

if (loan.getNextEmiDate() != null
         && LocalDateTime.now().isBefore(loan.getNextEmiDate())) {

    throw new RuntimeException(
            "EMI is not due yet. Your next EMI is due on "
                    + loan.getNextEmiDate());
}

double emi = loan.getEmi();
        if (customer.getBalance() < emi) {
            throw new RuntimeException("Insufficient balance.");
        }

        // ==========================
        // Deduct EMI
        // ==========================

        customer.setBalance(customer.getBalance() - emi);

        customerRepository.save(customer);

        // ==========================
        // Update Loan
        // ==========================

        int remainingInstallments =
                loan.getRemainingInstallments() - 1;

        loan.setPaidInstallments(
                loan.getPaidInstallments() + 1);

        loan.setRemainingInstallments(
                remainingInstallments);

        if (remainingInstallments == 0) {

            loan.setRemainingAmount(0.0);

        } else {

            loan.setRemainingAmount(
                    Math.max(
                            0.0,
                            loan.getRemainingAmount() - emi
                    )
            );

            loan.setNextEmiDate(
                    loan.getNextEmiDate().plusMonths(1)
            );
        }

        // ==========================
        // Loan Completed
        // ==========================

        if (loan.getRemainingInstallments() == 0) {

            loan.setStatus("CLOSED");

            loan.setClosedDate(LocalDateTime.now());

            loan.setRemainingAmount(0.0);

            loan.setNextEmiDate(null);

            emailService.sendLoanClosedEmail(
                    customer.getEmail(),
                    customer.getFullName(),
                    loan.getLoanType(),
                    loan.getAmount());
        }

        loanRepository.save(loan);

        // ==========================
        // Transaction
        // ==========================

        Transaction transaction = new Transaction();

        transaction.setEmail(customer.getEmail());

        transaction.setType("LOAN_EMI");

        transaction.setDescription(
                loan.getLoanType() + " Loan EMI");

        transaction.setReference(
                generateReference("EMI"));

        transaction.setAmount(emi);

        transaction.setBalanceAfterTransaction(
                customer.getBalance());

        transaction.setTransactionTime(
                LocalDateTime.now());

        transactionRepository.save(transaction);

        // ==========================
        // Email
        // ==========================

        emailService.sendLoanEmiPaidEmail(
                customer.getEmail(),
                customer.getFullName(),
                loan.getLoanType(),
                emi,
                loan.getRemainingAmount(),
                loan.getRemainingInstallments(),
                customer.getBalance());

        return new PayEmiResponse(
                "EMI paid successfully.",
                emi,
                loan.getRemainingAmount(),
                loan.getRemainingInstallments(),
                loan.getNextEmiDate(),
                customer.getBalance());
    }
    public List<LoanResponse> getMyLoans(String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));

        return loanRepository.findByCustomerEmail(customer.getEmail())
                .stream()
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
    }

    public FDResponse openFixedDeposit(
            OpenFDRequest request,
            String email) {

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found."));
                        verifyBankingEligibility(customer);

        if (request.getAmount() <= 0) {
            throw new RuntimeException("Invalid amount.");
        }

        if (customer.getBalance() < request.getAmount()) {
            throw new RuntimeException("Insufficient balance.");
        }

        // Deduct balance
        customer.setBalance(customer.getBalance() - request.getAmount());
        customerRepository.save(customer);

        // Calculate maturity amount
        double interestRate = 7.5;

        double maturityAmount =
                request.getAmount()
                        + (request.getAmount()
                        * interestRate
                        * request.getTenureMonths()
                        / (12 * 100));

        // Create FD
        FixedDeposit fd = new FixedDeposit();

        fd.setCustomerEmail(email);
        fd.setPrincipalAmount(request.getAmount());
        fd.setInterestRate(interestRate);
        fd.setTenureMonths(request.getTenureMonths());
        fd.setMaturityAmount(maturityAmount);
        fd.setStatus("PENDING");
        fd.setCreatedDate(LocalDateTime.now());
        fd.setMaturityDate(
                LocalDateTime.now().plusMonths(request.getTenureMonths()));

        fixedDepositRepository.save(fd);

        // Save transaction
       Transaction transaction = new Transaction();

transaction.setEmail(customer.getEmail());
transaction.setType("FIXED_DEPOSIT");
transaction.setDescription(
        "Fixed Deposit (" + request.getTenureMonths() + " Months)"
);
transaction.setReference(generateReference("FD"));
transaction.setAmount(request.getAmount());
transaction.setBalanceAfterTransaction(customer.getBalance());
transaction.setTransactionTime(LocalDateTime.now());

transactionRepository.save(transaction);
        emailService.sendFDOpenedEmail(
                customer.getEmail(),
                customer.getFullName(),
                fd.getPrincipalAmount(),
                fd.getTenureMonths(),
                fd.getInterestRate()
        );

        // Response
        return new FDResponse(
                fd.getId(),
                fd.getPrincipalAmount(),
                fd.getInterestRate(),
                fd.getTenureMonths(),
                fd.getMaturityAmount(),
                fd.getStatus(),
                fd.getCreatedDate(),
                fd.getRejectionReason()
        );
    }
    public List<FDResponse> getMyFixedDeposits(String email) {

        return fixedDepositRepository.findByCustomerEmail(email)
                .stream()
                .map(fd -> new FDResponse(
                        fd.getId(),
                        fd.getPrincipalAmount(),
                        fd.getInterestRate(),
                        fd.getTenureMonths(),
                        fd.getMaturityAmount(),
                        fd.getStatus(),
                        fd.getCreatedDate(),
                        fd.getRejectionReason()
                ))
                .toList();
    }
    public RDResponse openRecurringDeposit(
        OpenRDRequest request,
        String email) {

    Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    verifyBankingEligibility(customer);

    if (request.getMonthlyInstallment() == null ||
            request.getMonthlyInstallment() <= 0) {

        throw new RuntimeException("Invalid monthly installment.");
    }

    if (request.getTenureMonths() == null ||
            request.getTenureMonths() < 6) {

        throw new RuntimeException("Minimum RD tenure is 6 months.");
    }

    if (customer.getBalance() < request.getMonthlyInstallment()) {
        throw new RuntimeException("Insufficient balance.");
    }

    // -------------------------------------------------
    // Deduct FIRST installment
    // -------------------------------------------------

    customer.setBalance(
            customer.getBalance()
                    - request.getMonthlyInstallment()
    );

    customerRepository.save(customer);

    // -------------------------------------------------
    // Create RD
    // -------------------------------------------------

    RecurringDeposit rd = new RecurringDeposit();

    rd.setCustomerEmail(email);

    rd.setMonthlyInstallment(
            request.getMonthlyInstallment()
    );

    rd.setInterestRate(7.0);

    rd.setTenureMonths(
            request.getTenureMonths()
    );

    // First installment is already paid
    rd.setPaidInstallments(1);

    // Actual amount deposited so far
    rd.setTotalDeposited(
            request.getMonthlyInstallment()
    );

    // -------------------------------------------------
    // Maturity calculation
    // -------------------------------------------------

    double plannedTotal =
            request.getMonthlyInstallment()
                    * request.getTenureMonths();

    double maturityAmount =
            plannedTotal
                    + (
                    plannedTotal
                            * 7.0
                            * request.getTenureMonths()
                            / (12 * 100)
            );

    rd.setMaturityAmount(maturityAmount);

    // -------------------------------------------------
    // Dates
    // -------------------------------------------------

    LocalDateTime now = LocalDateTime.now();

    rd.setCreatedDate(now);

    rd.setMaturityDate(
            now.plusMonths(request.getTenureMonths())
    );

    /*
     * Do NOT start the next installment clock while
     * the RD is still pending.
     *
     * It will be set when admin approves the RD.
     */
    rd.setNextInstallmentDate(null);

    // -------------------------------------------------
    // Initial status
    // -------------------------------------------------

    rd.setStatus("PENDING");

    // -------------------------------------------------
    // Save RD
    // -------------------------------------------------

    RecurringDeposit savedRD =
            recurringDepositRepository.save(rd);

    // -------------------------------------------------
    // Email
    // -------------------------------------------------

    emailService.sendRDOpenedEmail(
            customer.getEmail(),
            customer.getFullName(),
            rd.getMonthlyInstallment(),
            rd.getTenureMonths()
    );

    // -------------------------------------------------
    // Transaction
    // -------------------------------------------------

    Transaction transaction = new Transaction();

    transaction.setEmail(customer.getEmail());

    transaction.setType("RD_OPEN");

    transaction.setDescription(
            "Recurring Deposit Opening - "
                    + request.getTenureMonths()
                    + " Months"
    );

    transaction.setReference(
            generateReference("RD")
    );

    transaction.setAmount(
            request.getMonthlyInstallment()
    );

    transaction.setBalanceAfterTransaction(
            customer.getBalance()
    );

    transaction.setTransactionTime(
            LocalDateTime.now()
    );

    transactionRepository.save(transaction);

    emailService.sendRDInstallmentPaidEmail(
        customer.getEmail(),
        customer.getFullName(),
        rd.getMonthlyInstallment(),
        rd.getPaidInstallments(),
        rd.getTenureMonths() - rd.getPaidInstallments(),
        customer.getBalance()
        );

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return new RDResponse(
            savedRD.getId(),
            savedRD.getMonthlyInstallment(),
            savedRD.getInterestRate(),
            savedRD.getTenureMonths(),
            savedRD.getTotalDeposited(),
            savedRD.getMaturityAmount(),
            savedRD.getPaidInstallments(),
            savedRD.getStatus(),
            savedRD.getCreatedDate(),
            savedRD.getNextInstallmentDate(),
            savedRD.getMaturityDate(),
            savedRD.getRejectionReason()
    );
}
    public List<RDResponse> getMyRecurringDeposits(String email) {

    return recurringDepositRepository
            .findByCustomerEmail(email)
            .stream()
            .map(rd -> new RDResponse(
                    rd.getId(),
                    rd.getMonthlyInstallment(),
                    rd.getInterestRate(),
                    rd.getTenureMonths(),
                    rd.getTotalDeposited(),
                    rd.getMaturityAmount(),
                    rd.getPaidInstallments(),
                    rd.getStatus(),
                    rd.getCreatedDate(),
                    rd.getNextInstallmentDate(),
                    rd.getMaturityDate(),
                    rd.getRejectionReason()
            ))
            .toList();
}
   

   @Transactional
public RDResponse payRecurringDepositInstallment(
        Long id,
        String email) {

    // -------------------------------------------------
    // Find customer
    // -------------------------------------------------

    Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Customer not found."));

    verifyBankingEligibility(customer);

    // -------------------------------------------------
    // Find RD
    // -------------------------------------------------

    RecurringDeposit rd = recurringDepositRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException(
                            "Recurring Deposit not found."));

    // -------------------------------------------------
    // Security check
    // -------------------------------------------------

    if (!email.equalsIgnoreCase(rd.getCustomerEmail())) {
        throw new RuntimeException(
                "You are not authorized to pay this Recurring Deposit.");
    }

    // -------------------------------------------------
    // RD must be ACTIVE
    // -------------------------------------------------

    if (!"ACTIVE".equals(rd.getStatus())) {
        throw new RuntimeException(
                "Only ACTIVE Recurring Deposits can receive installments.");
    }

    // -------------------------------------------------
    // Installment count
    // -------------------------------------------------

    int paidInstallments =
            rd.getPaidInstallments() == null
                    ? 0
                    : rd.getPaidInstallments();

    int requiredInstallments =
            rd.getTenureMonths() == null
                    ? 0
                    : rd.getTenureMonths();

    if (paidInstallments >= requiredInstallments) {
        throw new RuntimeException(
                "All RD installments have already been paid.");
    }

    // -------------------------------------------------
    // Next installment date
    // -------------------------------------------------

    LocalDateTime now = LocalDateTime.now();

    if (rd.getNextInstallmentDate() == null) {
        throw new RuntimeException(
                "Next installment date is not available.");
    }

    if (now.isBefore(rd.getNextInstallmentDate())) {
        throw new RuntimeException(
                "Next installment is not due yet. Due date: "
                        + rd.getNextInstallmentDate());
    }

    // -------------------------------------------------
    // Installment amount
    // -------------------------------------------------

    double installment =
            rd.getMonthlyInstallment();

    if (installment <= 0) {
        throw new RuntimeException(
                "Invalid RD installment amount.");
    }

    // -------------------------------------------------
    // Check balance
    // -------------------------------------------------

    if (customer.getBalance() < installment) {
        throw new RuntimeException(
                "Insufficient balance for RD installment.");
    }

    // -------------------------------------------------
    // Deduct installment
    // -------------------------------------------------

    customer.setBalance(
            customer.getBalance() - installment
    );

    customerRepository.save(customer);

    // -------------------------------------------------
    // Update RD
    // -------------------------------------------------

    paidInstallments++;

    rd.setPaidInstallments(paidInstallments);

    double totalDeposited =
            rd.getTotalDeposited() == null
                    ? 0.0
                    : rd.getTotalDeposited();

    rd.setTotalDeposited(
            totalDeposited + installment
    );

    // -------------------------------------------------
    // Final installment
    // -------------------------------------------------

    if (paidInstallments >= requiredInstallments) {

        rd.setNextInstallmentDate(null);

    } else {

        // Keep the original monthly schedule.
        rd.setNextInstallmentDate(
                rd.getNextInstallmentDate()
                        .plusMonths(1)
        );
    }

    RecurringDeposit savedRD =
            recurringDepositRepository.save(rd);

    // -------------------------------------------------
    // Transaction
    // -------------------------------------------------

    Transaction transaction = new Transaction();

    transaction.setEmail(customer.getEmail());

    transaction.setType("RD_INSTALLMENT");

    transaction.setDescription(
            "Recurring Deposit Installment - "
                    + paidInstallments
                    + "/"
                    + requiredInstallments
    );

    transaction.setReference(
            generateReference("RDI")
    );

    transaction.setAmount(installment);

    transaction.setBalanceAfterTransaction(
            customer.getBalance()
    );

    transaction.setTransactionTime(now);

    transactionRepository.save(transaction);

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return new RDResponse(
            savedRD.getId(),
            savedRD.getMonthlyInstallment(),
            savedRD.getInterestRate(),
            savedRD.getTenureMonths(),
            savedRD.getTotalDeposited(),
            savedRD.getMaturityAmount(),
            savedRD.getPaidInstallments(),
            savedRD.getStatus(),
            savedRD.getCreatedDate(),
            savedRD.getNextInstallmentDate(),
            savedRD.getMaturityDate(),
            savedRD.getRejectionReason()
    );
}    

   public ByteArrayInputStream generateStatementPdf(
        String email,
        LocalDate fromDate,
        LocalDate toDate
        ) {
           if (fromDate == null || toDate == null) {

          throw new IllegalArgumentException(
                "From date and To date are required."
        );

       }

          if (fromDate.isAfter(toDate)) {

           throw new IllegalArgumentException(
                 "From date cannot be after To date."
          );

        }

         Customer customer =
            customerRepository
                    .findByEmail(email)
                    .orElseThrow(
                            () -> new RuntimeException(
                                    "Customer not found"
                            )
                    );


         LocalDateTime fromDateTime =
            fromDate.atStartOfDay();


         LocalDateTime toDateTime =
            toDate
                    .plusDays(1)
                    .atStartOfDay();


         List<StatementTransaction> list =
            transactionRepository
                    .findByEmailAndTransactionTimeGreaterThanEqualAndTransactionTimeLessThanOrderByTransactionTimeAsc(
                            email,
                            fromDateTime,
                            toDateTime
                    )
                    .stream()
                    .map(tx ->
                            new StatementTransaction(
                                    tx.getTransactionTime(),
                                    tx.getType(),
                                    tx.getAmount(),
                                    tx.getBalanceAfterTransaction()
                            )
                    )
                    .toList();
                    


         return StatementPdfGenerator.generateStatement(
            customer.getFullName(),
            customer.getAccountNumber(),
            customer.getEmail(),
            customer.getBalance(),
            list
         );
   }

    public List<MonthlySpendingResponse> getMonthlySpending(String email) {

        if (!customerRepository.existsByEmail(email)) {
            throw new RuntimeException("Customer not found.");
        }

        List<Object[]> results =
                transactionRepository.getMonthlySpending(email);

        List<MonthlySpendingResponse> response = new ArrayList<>();

        for (Object[] row : results) {

            String month = (String) row[0];

            Double amount = ((Number) row[1]).doubleValue();

            response.add(
                    new MonthlySpendingResponse(
                            month,
                            amount
                    )
            );
        }

        return response;
    }

    public DashboardStatsResponse getDashboardStats(String email) {

    Double deposits =
            transactionRepository.getTotalDeposits(email);

    Double withdrawals =
            transactionRepository.getTotalWithdrawals(email);

    Long totalTransactions =
            transactionRepository.countByEmail(email);

    return new DashboardStatsResponse(
            deposits,
            withdrawals,
            totalTransactions
    );
}


}