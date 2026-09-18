package com.atul.banking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import com.atul.banking.util.EmailTemplateBuilder;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // =========================================
    // Common Email Sender
    // =========================================

    private void sendEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    // =========================================
    // OTP Email
    // =========================================

    public void sendOtp(String toEmail, String otp) {

        String body = """
            <p>Your One-Time Password (OTP) for resetting your password is:</p>

            <div style="
                    text-align:center;
                    margin:25px 0;
                    padding:15px;
                    background:#f4f7fb;
                    border:2px dashed #0d6efd;
                    border-radius:10px;
                    font-size:28px;
                    font-weight:bold;
                    letter-spacing:6px;
                    color:#0d6efd;">
                %s
            </div>

            <p>
            This OTP is valid for <b>5 minutes</b>.
            </p>

            <p>
            For your security, never share this OTP with anyone.
            Enterprise Banking System employees will never ask for your OTP.
            </p>
            """
                .formatted(otp);

        String html = EmailTemplateBuilder.buildEmail(
                "Password Reset OTP",
                "Customer",
                body
        );

        sendHtmlEmail(
                toEmail,
                "Enterprise Banking System - Password Reset OTP",
                html
        );
    }

    // =========================================
    // Welcome Email
    // =========================================

    public void sendWelcomeEmail(
            String toEmail,
            String customerName) {

        String body = """
            <p>Welcome to <b>Enterprise Banking System</b>!</p>

            <p>
              Your account registration has been completed successfully and is currently awaiting bank approval.
            </p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                   <td><b>Account Status</b></td>
                   <td>PENDING APPROVAL</td>
                </tr>
                <tr>
                    <td><b>Registration</b></td>
                    <td>Successful</td>
                </tr>
            </table>

            <br>

            <p>
                Your account is currently under bank review. You will receive another email once your account has been approved and activated.
            </p>              

            <p>
            Thank you for choosing <b>Enterprise Banking System</b>. We look forward to serving all your banking needs.
            </p>
            """;

        String html = EmailTemplateBuilder.buildEmail(
                "Welcome to Enterprise Banking",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Welcome to Enterprise Banking",
                html
        );
    }

    // =========================================
// CUSTOMER ACCOUNT APPROVED EMAIL
// =========================================

public void sendAccountApprovedEmail(
        String toEmail,
        String customerName) {

    String body = """
        <p>
        Your customer account has been approved successfully.
        </p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Account Status</b></td>
                <td>ACTIVE</td>
            </tr>

            <tr>
                <td><b>Status</b></td>
                <td>Approved</td>
            </tr>
        </table>

        <br>

        <p>
        You can now log in and use the available banking services.
        </p>
        """;

    String html = EmailTemplateBuilder.buildEmail(
            "Account Approved",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "Customer Account Approved",
            html
    );
}

     // =========================================
// CUSTOMER ACCOUNT REJECTED EMAIL
// =========================================

public void sendAccountRejectedEmail(
        String toEmail,
        String customerName,
        String reason) {

    String body = """
        <p>
            We regret to inform you that your customer account registration
            has been rejected.
        </p>

        <table style="width:100%%; border-collapse:collapse;">

            <tr>
                <td><b>Account Status</b></td>
                <td>REJECTED</td>
            </tr>

            <tr>
                <td><b>Status</b></td>
                <td>Rejected</td>
            </tr>

            <tr>
                <td><b>Reason</b></td>
                <td>%s</td>
            </tr>

        </table>

        <br>

        <p>
            Unfortunately, your account registration could not be approved
            at this time.
        </p>

        <p>
            Please review the provided information and contact Enterprise
            Banking Support if you need further assistance.
        </p>
        """
        .formatted(reason);

    String html = EmailTemplateBuilder.buildEmail(
            "Account Rejected",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "Customer Account Rejected",
            html
    );
}

   // =========================================
// CUSTOMER ACCOUNT BLOCKED EMAIL
// =========================================

public void sendAccountBlockedEmail(
        String toEmail,
        String customerName) {

           

    String body = """
        <p>
            Your Enterprise Banking account has been blocked.
        </p>

        <table style="width:100%%; border-collapse:collapse;">

            <tr>
                <td><b>Account Status</b></td>
                <td>BLOCKED</td>
            </tr>

            <tr>
                <td><b>Status</b></td>
                <td>Blocked</td>
            </tr>

        </table>

        <br>

        <p>
            Your access to banking services has been temporarily restricted.
        </p>

        <p>
            If you believe this action was taken in error, please contact
            Enterprise Banking Support for assistance.
        </p>
        """;

    String html = EmailTemplateBuilder.buildEmail(
            "Account Blocked",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "Customer Account Blocked",
            html
    );
}   


    // =========================================
// CUSTOMER ACCOUNT UNBLOCKED EMAIL
// =========================================

public void sendAccountUnblockedEmail(
        String toEmail,
        String customerName) {

    String body = """
        <p>
            Your Enterprise Banking account has been unblocked successfully.
        </p>

        <table style="width:100%%; border-collapse:collapse;">

            <tr>
                <td><b>Account Status</b></td>
                <td>ACTIVE</td>
            </tr>

            <tr>
                <td><b>Status</b></td>
                <td>Unblocked</td>
            </tr>

        </table>

        <br>

        <p>
            You can now access your banking account and use the available
            banking services.
        </p>

        <p>
            If you have any questions or notice anything unusual, please
            contact Enterprise Banking Support.
        </p>
        """;

    String html = EmailTemplateBuilder.buildEmail(
            "Account Unblocked",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "Customer Account Unblocked",
            html
    );
}
    // =========================================
// KYC SUBMITTED EMAIL
// =========================================

public void sendKYCSubmittedEmail(
        String toEmail,
        String customerName,
        String documentType) {

    String body = """
        <p>
            Your KYC application has been submitted successfully.
        </p>

        <table style="width:100%%; border-collapse:collapse;">

            <tr>
                <td><b>Document Type</b></td>
                <td>%s</td>
            </tr>

            <tr>
                <td><b>KYC Status</b></td>
                <td>PENDING</td>
            </tr>

            <tr>
                <td><b>Submission Status</b></td>
                <td>Successfully Submitted</td>
            </tr>

        </table>

        <br>

        <p>
            Your KYC documents have been received successfully and are
            currently under review by our bank.
        </p>

        <p>
            You will receive another email once your KYC has been
            verified or rejected.
        </p>

        <p>
            Thank you for choosing <b>Enterprise Banking System</b>.
        </p>
        """
        .formatted(documentType);

    String html = EmailTemplateBuilder.buildEmail(
            "KYC Submitted Successfully",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "KYC Application Submitted",
            html
    );
}

// =========================================
// KYC REJECTED EMAIL
// =========================================

public void sendKYCRejectedEmail(
        String toEmail,
        String customerName,
        String documentType,
        String rejectionReason) {

    String body = """
        <p>
            We regret to inform you that your KYC application
            could not be verified.
        </p>

        <table style="width:100%%; border-collapse:collapse;">

            <tr>
                <td><b>Document Type</b></td>
                <td>%s</td>
            </tr>

            <tr>
                <td><b>KYC Status</b></td>
                <td>REJECTED</td>
            </tr>

            <tr>
                <td><b>Rejection Reason</b></td>
                <td>%s</td>
            </tr>

        </table>

        <br>

        <p>
            Please review the rejection reason carefully and
            submit your KYC documents again with the required
            corrections.
        </p>

        <p>
            If you need further assistance, please contact
            Enterprise Banking Support.
        </p>

        <p>
            Thank you for choosing <b>Enterprise Banking System</b>.
        </p>
        """
        .formatted(
                documentType,
                rejectionReason
        );

    String html = EmailTemplateBuilder.buildEmail(
            "KYC Application Rejected",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "KYC Verification Rejected",
            html
    );
}


// =========================================
// KYC VERIFIED EMAIL
// =========================================

public void sendKYCVerifiedEmail(
        String toEmail,
        String customerName,
        String documentType) {

    String body = """
        <p>
            Congratulations! Your KYC application has been
            successfully verified.
        </p>

        <table style="width:100%%; border-collapse:collapse;">

            <tr>
                <td><b>Document Type</b></td>
                <td>%s</td>
            </tr>

            <tr>
                <td><b>KYC Status</b></td>
                <td>VERIFIED</td>
            </tr>

            <tr>
                <td><b>Verification Status</b></td>
                <td>Successfully Verified</td>
            </tr>

        </table>

        <br>

        <p>
            Your KYC documents have been reviewed and verified
            successfully by the bank.
        </p>

        <p>
            You can now continue using the eligible banking
            services available on your account.
        </p>

        <p>
            Thank you for choosing <b>Enterprise Banking System</b>.
        </p>
        """
        .formatted(documentType);

    String html = EmailTemplateBuilder.buildEmail(
            "KYC Verified Successfully",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "KYC Verification Successful",
            html
    );
}



    public void sendLoginAlertEmail(
            String toEmail,
            String customerName,
            String loginTime,
            String ipAddress) {

        String body = """
            <p>A successful login to your account has been detected.</p>

            <table style="border-collapse:collapse;width:100%%;">
                <tr>
                    <td><b>Login Time</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>IP Address</b></td>
                    <td>%s</td>
                </tr>
            </table>

            <br>

            <p>
            If this login was performed by you, no further action is required.
            </p>

            <p>
            If you do not recognize this activity, please change your password immediately
            and contact Enterprise Banking Support.
            </p>
            """.formatted(loginTime, ipAddress);

        String html = EmailTemplateBuilder.buildEmail(
                "Login Alert",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Login Alert",
                html
        );
    }

    // =========================================
    // Deposit Email
    // =========================================

    public void sendDepositEmail(
            String toEmail,
            String customerName,
            double amount,
            double balance) {

        String body = """
            <p>Your deposit transaction has been completed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Transaction Type</b></td>
                    <td>Deposit</td>
                </tr>
                <tr>
                    <td><b>Amount Deposited</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
            </table>

            <br>

            <p>
            Thank you for banking with Enterprise Banking System.
            </p>
            """.formatted(amount, balance);

        String html = EmailTemplateBuilder.buildEmail(
                "Deposit Successful",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Deposit Successful",
                html
        );
    }

    // =========================================
    // Withdrawal Email
    // =========================================

    public void sendWithdrawalEmail(
            String toEmail,
            String customerName,
            double amount,
            double balance) {

        String body = """
            <p>Your withdrawal transaction has been completed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Transaction Type</b></td>
                    <td>Withdrawal</td>
                </tr>
                <tr>
                    <td><b>Amount Withdrawn</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
            </table>

            <br>

            <p>If you did not perform this transaction, please contact Enterprise Banking Support immediately.</p>

            <p>Thank you for banking with Enterprise Banking System.</p>
            """
                .formatted(amount, balance);

        String html = EmailTemplateBuilder.buildEmail(
                "Withdrawal Successful",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Withdrawal Successful",
                html
        );
    }
    // =========================================
// Transfer - Sender
// =========================================

    public void sendTransferSentEmail(
            String toEmail,
            String customerName,
            String receiverEmail,
            double amount,
            double balance) {

        String body = """
            <p>Your fund transfer has been completed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Transaction Type</b></td>
                    <td>Fund Transfer</td>
                </tr>
                <tr>
                    <td><b>Transferred To</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
            </table>

            <br>

            <p>Your transaction has been processed successfully.</p>
            """
                .formatted(receiverEmail, amount, balance);

        String html = EmailTemplateBuilder.buildEmail(
                "Transfer Successful",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Transfer Successful",
                html
        );
    }

// =========================================
// Transfer - Receiver
// =========================================

    public void sendTransferReceivedEmail(
            String toEmail,
            String customerName,
            String senderEmail,
            double amount,
            double balance) {

        String body = """
            <p>You have received a fund transfer successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Received From</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Amount Received</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
            </table>

            <br>

            <p>The amount has been credited to your account successfully.</p>

            <p>Thank you for banking with Enterprise Banking System.</p>
            """
                .formatted(senderEmail, amount, balance);

        String html = EmailTemplateBuilder.buildEmail(
                "Money Received",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Money Received",
                html
        );
    }

    public void sendLoanAppliedEmail(
            String toEmail,
            String customerName,
            String loanType,
            Double amount,
            Integer tenureMonths) {

        String body = """
            <p>Your loan application has been submitted successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Loan Type</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Loan Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Tenure</b></td>
                    <td>%d Months</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>APPLIED</td>
                </tr>
            </table>

            <br>

            <p>
            Your loan application has been received successfully and is currently under review by our bank.
            </p>

            <p>
            You will receive another email once your application has been approved or rejected.
            </p>
            """
                .formatted(
                        loanType,
                        amount,
                        tenureMonths
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Loan Application Submitted",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Loan Application Submitted",
                html
        );
    }

    public void sendLoanApprovedEmail(
            String toEmail,
            String customerName,
            String loanType,
            Double amount) {

        String body = """
            <p>Congratulations! Your loan application has been approved successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Loan Type</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Loan Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>APPROVED</td>
                </tr>
            </table>

            <br>

            <p>
            Your loan application has been approved by our bank.
            </p>

            <p>
            The loan amount will be disbursed to your registered bank account shortly. You will receive another confirmation email once the funds have been credited.
            </p>
            """
                .formatted(
                        loanType,
                        amount
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Loan Approved",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Loan Approved",
                html
        );
    }

    public void sendLoanRejectedEmail(
            String toEmail,
            String customerName,
            String loanType,
            Double amount,
            String reason) {

        String body = """
            <p>We regret to inform you that your loan application has been rejected.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Loan Type</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Loan Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>REJECTED</td>
                </tr>
                <tr>
                    <td><b>Reason</b></td>
                    <td>%s</td>
                </tr>
            </table>

            <br>

            <p>
            Unfortunately, your loan application could not be approved at this time.
            </p>

            <p>
            You may submit a new loan application after resolving the above issue. For further assistance, please contact our customer support or visit your nearest branch.
            </p>
            """
                .formatted(
                        loanType,
                        amount,
                        reason
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Loan Rejected",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Loan Rejected",
                html
        );
    }
    public void sendLoanDisbursedEmail(
            String toEmail,
            String customerName,
            String loanType,
            Double loanAmount,
            Double accountBalance) {

        String body = """
            <p>Congratulations! Your loan has been disbursed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Loan Type</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Loan Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Amount Credited</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>DISBURSED</td>
                </tr>
            </table>

            <br>

            <p>
            The approved loan amount has been successfully credited to your bank account and is now available for use.
            </p>

            <p>
            Please ensure that your EMI payments are made on time to maintain a healthy credit history. Thank you for choosing <b>Enterprise Banking System</b>.
            </p>
            """
                .formatted(
                        loanType,
                        loanAmount,
                        loanAmount,
                        accountBalance
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Loan Disbursed",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Loan Disbursed Successfully",
                html
        );
    }

    public void sendLoanEmiPaidEmail(
            String toEmail,
            String customerName,
            String loanType,
            Double emiAmount,
            Double remainingLoan,
            Integer remainingInstallments,
            Double accountBalance) {

        String body = """
        <p>Your loan EMI has been paid successfully.</p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Loan Type</b></td>
                <td>%s</td>
            </tr>
            <tr>
                <td><b>EMI Paid</b></td>
                <td>₹%.2f</td>
            </tr>
            <tr>
                <td><b>Outstanding Loan</b></td>
                <td>₹%.2f</td>
            </tr>
            <tr>
                <td><b>Remaining Installments</b></td>
                <td>%d</td>
            </tr>
            <tr>
                <td><b>Available Balance</b></td>
                <td>₹%.2f</td>
            </tr>
        </table>

        <br>

        <p>
        Thank you for making your EMI payment on time.
        Timely repayments help maintain a healthy credit history.
        </p>
        """
                .formatted(
                        loanType,
                        emiAmount,
                        remainingLoan,
                        remainingInstallments,
                        accountBalance
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Loan EMI Paid",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Loan EMI Payment Successful",
                html
        );
    }

    public void sendLoanClosedEmail(
            String toEmail,
            String customerName,
            String loanType,
            Double loanAmount) {

        String body = """
            <p>Congratulations! Your loan has been closed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Loan Type</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Loan Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>CLOSED</td>
                </tr>
            </table>

            <br>

            <p>
            We are pleased to inform you that your loan has been fully repaid and officially closed.
            </p>

            <p>
            Thank you for maintaining your repayment commitments. We sincerely appreciate your trust in <b>Enterprise Banking System</b> and look forward to serving your future financial needs.
            </p>
            """
                .formatted(
                        loanType,
                        loanAmount
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Loan Closed",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Loan Closed Successfully",
                html
        );
    }

    public void sendFDOpenedEmail(
            String toEmail,
            String customerName,
            Double principalAmount,
            Integer tenureMonths,
            Double interestRate) {

        String body = """
            <p>Your Fixed Deposit request has been created successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Principal Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Interest Rate</b></td>
                    <td>%.2f%%</td>
                </tr>
                <tr>
                    <td><b>Tenure</b></td>
                    <td>%d Months</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>PENDING</td>
                </tr>
            </table>

            <br>

            <p>
            Your Fixed Deposit request has been submitted successfully and is awaiting bank approval.
            </p>

            <p>
            You will receive another email once your Fixed Deposit has been approved.
            </p>
            """
                .formatted(
                        principalAmount,
                        interestRate,
                        tenureMonths
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Fixed Deposit Opened",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Fixed Deposit Opened Successfully",
                html
        );
    }
    public void sendFDApprovedEmail(
            String toEmail,
            String customerName,
            Double principalAmount,
            Double maturityAmount) {

        String body = """
            <p>Congratulations! Your Fixed Deposit has been approved successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Principal Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Maturity Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>ACTIVE</td>
                </tr>
            </table>

            <br>

            <p>
            Your Fixed Deposit is now active and earning interest as per the selected tenure.
            </p>

            <p>
            The maturity amount will be credited to your account upon successful closure of the Fixed Deposit.
            </p>
            """
                .formatted(
                        principalAmount,
                        maturityAmount
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Fixed Deposit Approved",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Fixed Deposit Approved",
                html
        );
    }

    public void sendFDRejectedEmail(
            String toEmail,
            String customerName,
            Double principalAmount,
            String reason) {

        String body = """
            <p>We regret to inform you that your Fixed Deposit request has been rejected.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Principal Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>REJECTED</td>
                </tr>
                <tr>
                    <td><b>Reason</b></td>
                    <td>%s</td>
                </tr>
            </table>

            <br>

            <p>
            The principal amount has been refunded to your bank account successfully.
            </p>

            <p>
            If you need further clarification, please contact our customer support or visit your nearest branch.
            </p>
            """
                .formatted(
                        principalAmount,
                        reason
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Fixed Deposit Rejected",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Fixed Deposit Rejected",
                html
        );
    }

    public void sendFDClosedEmail(
            String toEmail,
            String customerName,
            Double principalAmount,
            Double maturityAmount,
            Double accountBalance) {

        String body = """
            <p>Congratulations! Your Fixed Deposit has been closed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Principal Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Maturity Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Amount Credited</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>CLOSED</td>
                </tr>
            </table>

            <br>

            <p>
            Your Fixed Deposit has matured successfully, and the maturity amount has been credited to your bank account.
            </p>

            <p>
            Thank you for choosing <b>Enterprise Banking System</b>. We appreciate your trust and look forward to serving you again.
            </p>
            """
                .formatted(
                        principalAmount,
                        maturityAmount,
                        maturityAmount,
                        accountBalance
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Fixed Deposit Closed",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Fixed Deposit Closed",
                html
        );
    }

    public void sendRDOpenedEmail(
            String toEmail,
            String customerName,
            Double monthlyInstallment,
            Integer tenureMonths) {

        String body = """
            <p>Your Recurring Deposit request has been submitted successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Monthly Installment</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Tenure</b></td>
                    <td>%d Months</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>PENDING</td>
                </tr>
            </table>

            <br>

            <p>
            Your Recurring Deposit request has been submitted successfully and is awaiting bank approval.
            </p>

            <p>
            You will receive another email once your Recurring Deposit has been approved.
            </p>
            """
                .formatted(
                        monthlyInstallment,
                        tenureMonths
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Recurring Deposit Opened",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Recurring Deposit Request Submitted",
                html
        );
    }
    public void sendRDApprovedEmail(
            String toEmail,
            String customerName,
            Double monthlyInstallment,
            Double maturityAmount) {

        String body = """
            <p>Congratulations! Your Recurring Deposit has been approved successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Monthly Installment</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Maturity Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>ACTIVE</td>
                </tr>
            </table>

            <br>

            <p>
            Your Recurring Deposit is now active and earning interest according to the selected tenure.
            </p>

            <p>
            The maturity amount will be credited to your account when the Recurring Deposit is successfully closed.
            </p>
            """
                .formatted(
                        monthlyInstallment,
                        maturityAmount
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Recurring Deposit Approved",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Recurring Deposit Approved",
                html
        );
    }
    public void sendRDRejectedEmail(
            String toEmail,
            String customerName,
            Double monthlyInstallment,
            String reason) {

        String body = """
            <p>We regret to inform you that your Recurring Deposit request has been rejected.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Monthly Installment</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>REJECTED</td>
                </tr>
                <tr>
                    <td><b>Reason</b></td>
                    <td>%s</td>
                </tr>
            </table>

            <br>

            <p>
            The deducted installment has been refunded successfully to your bank account.
            </p>

            <p>
            If you have any questions regarding this decision, please contact our customer support or visit your nearest branch.
            </p>
            """
                .formatted(
                        monthlyInstallment,
                        reason
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Recurring Deposit Rejected",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Recurring Deposit Rejected",
                html
        );
    }

    public void sendRDClosedEmail(
            String toEmail,
            String customerName,
            Double totalDeposited,
            Double maturityAmount,
            Double accountBalance) {

        String body = """
            <p>Congratulations! Your Recurring Deposit has been closed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Total Deposited</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Maturity Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Amount Credited</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Available Balance</b></td>
                    <td>₹%.2f</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>CLOSED</td>
                </tr>
            </table>

            <br>

            <p>
            Your Recurring Deposit has matured successfully, and the maturity amount has been credited to your bank account.
            </p>

            <p>
            Thank you for choosing <b>Enterprise Banking System</b>. We appreciate your trust and look forward to serving you again.
            </p>
            """
                .formatted(
                        totalDeposited,
                        maturityAmount,
                        maturityAmount,
                        accountBalance
                );

        String html = EmailTemplateBuilder.buildEmail(
                "Recurring Deposit Closed",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Recurring Deposit Closed",
                html
        );
    }

    public void sendRDInstallmentPaidEmail(
        String toEmail,
        String customerName,
        double installment,
        int paidInstallments,
        int remainingInstallments,
        double remainingBalance) {

    String body = """
        <p>Your Recurring Deposit installment has been paid successfully.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Transaction</b></td>
                <td>RD Installment Paid</td>
            </tr>
            <tr>
                <td><b>Installment Amount</b></td>
                <td>₹%.2f</td>
            </tr>
            <tr>
                <td><b>Paid Installments</b></td>
                <td>%d</td>
            </tr>
            <tr>
                <td><b>Remaining Installments</b></td>
                <td>%d</td>
            </tr>
            <tr>
                <td><b>Remaining Account Balance</b></td>
                <td>₹%.2f</td>
            </tr>
        </table>

        <br>

        <p>
        Your RD installment has been successfully processed.
        </p>

        <p style="color:red;">
        <b>If you did NOT perform this transaction, please contact Enterprise Banking Support immediately.</b>
        </p>
        """
            .formatted(
                    installment,
                    paidInstallments,
                    remainingInstallments,
                    remainingBalance
            );

    String html = EmailTemplateBuilder.buildEmail(
            "RD Installment Paid",
            customerName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "RD Installment Paid",
            html
    );
}

    public void sendATMRequestEmail(
            String toEmail,
            String customerName) {

        String body = """
            <p>Your ATM Card request has been received successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Service</b></td>
                    <td>ATM Card Request</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>Request Submitted</td>
                </tr>
            </table>

            <br>

            <p>
            Your request has been forwarded for verification.
            You will receive another email once your request is processed.
            </p>
            """;

        String html = EmailTemplateBuilder.buildEmail(
                "ATM Card Request Submitted",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "ATM Card Request Submitted",
                html
        );
    }
    public void sendATMApprovedEmail(
            String toEmail,
            String customerName,
            String pin) {

        String body = """
        <p>Congratulations! Your ATM Card has been approved successfully.</p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Card Status</b></td>
                <td>ACTIVE</td>
            </tr>

            <tr>
                <td><b>ATM PIN</b></td>
                <td>
                    <b style="font-size:20px; letter-spacing:4px;">
                        %s
                    </b>
                </td>
            </tr>

            <tr>
                <td><b>Next Step</b></td>
                <td>Card Printing / Dispatch</td>
            </tr>
        </table>

        <br>

        <p>
            Your ATM Card has been activated successfully and is now being
            prepared for dispatch.
        </p>

        <div style="
            padding:15px;
            background:#fff3cd;
            border:1px solid #ffe69c;
            border-radius:8px;
            margin:20px 0;
        ">
            <b>Security Notice:</b><br>
            Please keep your ATM PIN confidential.
            Never share your PIN with anyone, including bank employees.
        </div>

        <p>
            You can change your ATM PIN anytime from the ATM Card section
            of your Internet Banking account.
        </p>
        """
        .formatted(pin);

        String html = EmailTemplateBuilder.buildEmail(
                "ATM Card Approved",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "ATM Card Approved",
                html
        );
    }

    public void sendATMRejectedEmail(
            String toEmail,
            String customerName,
            String reason) {

        String body = """
            <p>We regret to inform you that your ATM Card request has been rejected.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Status</b></td>
                    <td>Rejected</td>
                </tr>
                <tr>
                    <td><b>Reason</b></td>
                    <td>%s</td>
                </tr>
            </table>

            <br>

            <p>
            If you have any questions, please contact Enterprise Banking Support.
            </p>
            """.formatted(reason);

        String html = EmailTemplateBuilder.buildEmail(
                "ATM Card Request Rejected",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "ATM Card Request Rejected",
                html
        );
    }
    public void sendATMPinChangedEmail(
            String toEmail,
            String customerName) {

        String body = """
        <p>Your ATM Card PIN has been changed successfully.</p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Action</b></td>
                <td>ATM PIN Changed</td>
            </tr>
            <tr>
                <td><b>Status</b></td>
                <td>Successful</td>
            </tr>
        </table>

        <br>

        <p>
        Your ATM PIN has been updated successfully.
        </p>

        <p style="color:red;">
        <b>If you did NOT perform this action, please block your ATM card immediately and contact Enterprise Banking Support.</b>
        </p>
        """;

        String html = EmailTemplateBuilder.buildEmail(
                "ATM PIN Changed",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "ATM PIN Changed",
                html
        );
    }
    public void sendATMBlockedEmail(
            String toEmail,
            String customerName) {

        String body = """
        <p>Your ATM Card has been blocked successfully.</p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Blocked</td>
            </tr>
            <tr>
                <td><b>Card Usage</b></td>
                <td>Disabled</td>
            </tr>
        </table>

        <br>

        <p>
        Your ATM Card can no longer be used for transactions.
        </p>

        <p>
        You may unblock it anytime through Internet Banking.
        </p>
        """;

        String html = EmailTemplateBuilder.buildEmail(
                "ATM Card Blocked",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "ATM Card Blocked",
                html
        );
    }

    public void sendATMUnblockedEmail(
            String toEmail,
            String customerName) {

        String body = """
        <p>Your ATM Card has been unblocked successfully.</p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Active</td>
            </tr>
            <tr>
                <td><b>Card Usage</b></td>
                <td>Enabled</td>
            </tr>
        </table>

        <br>

        <p>
        Your ATM Card is active again and can now be used normally.
        </p>

        <p>
        Thank you for banking with Enterprise Banking System.
        </p>
        """;

        String html = EmailTemplateBuilder.buildEmail(
                "ATM Card Unblocked",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "ATM Card Unblocked",
                html
        );
    }
    public void sendChequeBookRequestEmail(
            String toEmail,
            String customerName,
            int numberOfLeaves) {

        String body = """
        <p>Your cheque book request has been submitted successfully.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Request Submitted</td>
            </tr>
            <tr>
                <td><b>Cheque Leaves</b></td>
                <td>%d</td>
            </tr>
        </table>

        <br>

        <p>Your request has been forwarded for verification.</p>
        """
                .formatted(numberOfLeaves);

        String html = EmailTemplateBuilder.buildEmail(
                "Cheque Book Request Submitted",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Cheque Book Request Submitted",
                html
        );
    }

    public void sendChequeBookApprovedEmail(
            String toEmail,
            String customerName) {

        String body = """
        <p>Your cheque book request has been approved.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Approved</td>
            </tr>
        </table>

        <br>

        <p>Your cheque book is now being prepared.</p>
        """;

        String html = EmailTemplateBuilder.buildEmail(
                "Cheque Book Approved",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Cheque Book Approved",
                html
        );
    }
    public void sendChequeBookRejectedEmail(
            String toEmail,
            String customerName,
            String reason) {

        String body = """
        <p>Your cheque book request has been rejected.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Rejected</td>
            </tr>
            <tr>
                <td><b>Reason</b></td>
                <td>%s</td>
            </tr>
        </table>

        <br>

        <p>Please contact Enterprise Banking Support for assistance.</p>
        """
                .formatted(reason);

        String html = EmailTemplateBuilder.buildEmail(
                "Cheque Book Request Rejected",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Cheque Book Request Rejected",
                html
        );
    }
    public void sendChequeBookDispatchedEmail(
            String toEmail,
            String customerName) {

        String body = """
        <p>Your cheque book has been dispatched.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Dispatched</td>
            </tr>
        </table>

        <br>

        <p>Your cheque book is on its way to your registered address.</p>
        """;

        String html = EmailTemplateBuilder.buildEmail(
                "Cheque Book Dispatched",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Cheque Book Dispatched",
                html
        );
    }

    public void sendChequeBookDeliveredEmail(
            String toEmail,
            String customerName) {

        String body = """
        <p>Your cheque book has been delivered successfully.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Status</b></td>
                <td>Delivered</td>
            </tr>
        </table>

        <br>

        <p>Thank you for banking with Enterprise Banking System.</p>
        """;

        String html = EmailTemplateBuilder.buildEmail(
                "Cheque Book Delivered",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Cheque Book Delivered",
                html
        );
    }

    public void sendBeneficiaryAddedEmail(
            String toEmail,
            String customerName,
            String beneficiaryName,
            String beneficiaryAccount) {

        String body = """
        <p>A new beneficiary has been added successfully.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Beneficiary Name</b></td>
                <td>%s</td>
            </tr>
            <tr>
                <td><b>Account Number</b></td>
                <td>%s</td>
            </tr>
            <tr>
                <td><b>Status</b></td>
                <td>Added Successfully</td>
            </tr>
        </table>

        <br>

        <p>You can now transfer funds to this beneficiary.</p>
        """
                .formatted(beneficiaryName, beneficiaryAccount);

        String html = EmailTemplateBuilder.buildEmail(
                "Beneficiary Added",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Beneficiary Added",
                html
        );
    }

    public void sendBeneficiaryDeletedEmail(
            String toEmail,
            String customerName,
            String beneficiaryName) {

        String body = """
        <p>A beneficiary has been removed from your account.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Beneficiary</b></td>
                <td>%s</td>
            </tr>
            <tr>
                <td><b>Status</b></td>
                <td>Deleted</td>
            </tr>
        </table>

        <br>

        <p>If you did not perform this action, please contact Enterprise Banking Support immediately.</p>
        """
                .formatted(beneficiaryName);

        String html = EmailTemplateBuilder.buildEmail(
                "Beneficiary Deleted",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Beneficiary Deleted",
                html
        );
    }

    public void sendBeneficiaryUpdatedEmail(
            String toEmail,
            String customerName,
            String beneficiaryName) {

        String body = """
        <p>Your beneficiary details have been updated successfully.</p>

        <table style="width:100%%;border-collapse:collapse;">
            <tr>
                <td><b>Beneficiary</b></td>
                <td>%s</td>
            </tr>
            <tr>
                <td><b>Status</b></td>
                <td>Updated</td>
            </tr>
        </table>

        <br>

        <p>If you did not perform this update, please contact Enterprise Banking Support immediately.</p>
        """
                .formatted(beneficiaryName);

        String html = EmailTemplateBuilder.buildEmail(
                "Beneficiary Updated",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Beneficiary Updated",
                html
        );
    }

    public void sendPasswordChangedEmail(
            String toEmail,
            String customerName) {

        String body = """
            <p>Your Internet Banking password has been changed successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Action</b></td>
                    <td>Password Changed</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>Successful</td>
                </tr>
            </table>

            <br>

            <p>
            If you changed your password, no further action is required.
            </p>

            <p style="color:red;">
            <b>If you did NOT change your password, please contact Enterprise Banking Support immediately and secure your account.</b>
            </p>
            """
                .formatted();

        String html = EmailTemplateBuilder.buildEmail(
                "Password Changed Successfully",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Password Changed Successfully",
                html
        );
    }
    // =========================================
// ADMIN PASSWORD RESET SUCCESS EMAIL
// =========================================

public void sendAdminPasswordResetEmail(
        String toEmail,
        String adminName) {

    String body = """
        <p>
            Your administrator account password has been reset successfully.
        </p>

        <table style="width:100%%; border-collapse:collapse;">
            <tr>
                <td><b>Account Type</b></td>
                <td>Administrator</td>
            </tr>
            <tr>
                <td><b>Action</b></td>
                <td>Password Reset</td>
            </tr>
            <tr>
                <td><b>Status</b></td>
                <td>Successful</td>
            </tr>
        </table>

        <br>

        <p>
            You can now log in to your administrator account using your new password.
        </p>

        <p style="color:red;">
            <b>
            If you did NOT perform this password reset, please contact
            Enterprise Banking Support immediately and secure your account.
            </b>
        </p>
        """;

    String html = EmailTemplateBuilder.buildEmail(
            "Admin Password Reset Successful",
            adminName,
            body
    );

    sendHtmlEmail(
            toEmail,
            "Admin Password Reset Successful",
            html
    );
}

    public void sendProfileUpdatedEmail(
            String toEmail,
            String customerName) {

        String body = """
            <p>Your profile information has been updated successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Action</b></td>
                    <td>Profile Updated</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>Successful</td>
                </tr>
            </table>

            <br>

            <p>
            Your personal information has been updated successfully.
            </p>

            <p style="color:red;">
            <b>If you did not make this change, please contact Enterprise Banking Support immediately.</b>
            </p>
            """;

        String html = EmailTemplateBuilder.buildEmail(
                "Profile Updated",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Profile Updated",
                html
        );
    }

    public void sendProfilePictureUpdatedEmail(
            String toEmail,
            String customerName) {

        String body = """
            <p>Your profile picture has been updated successfully.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Action</b></td>
                    <td>Profile Picture Updated</td>
                </tr>
                <tr>
                    <td><b>Status</b></td>
                    <td>Successful</td>
                </tr>
            </table>

            <br>

            <p>
            Your profile picture has been changed successfully.
            </p>

            <p style="color:red;">
            <b>If you did not perform this action, please contact Enterprise Banking Support immediately.</b>
            </p>
            """;

        String html = EmailTemplateBuilder.buildEmail(
                "Profile Picture Updated",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Profile Picture Updated",
                html
        );
    }

    public void sendLargeTransactionAlert(
            String toEmail,
            String customerName,
            double amount,
            String transactionType) {

        String body = """
            <p>A large transaction has been detected on your account.</p>

            <table style="width:100%%; border-collapse:collapse;">
                <tr>
                    <td><b>Transaction Type</b></td>
                    <td>%s</td>
                </tr>
                <tr>
                    <td><b>Amount</b></td>
                    <td>₹%.2f</td>
                </tr>
            </table>

            <br>

            <p>
            If you performed this transaction, no further action is required.
            </p>

            <p style="color:red;">
            <b>If you do NOT recognize this transaction, immediately change your password and contact Enterprise Banking Support.</b>
            </p>
            """
                .formatted(transactionType, amount);

        String html = EmailTemplateBuilder.buildEmail(
                "Large Transaction Alert",
                customerName,
                body
        );

        sendHtmlEmail(
                toEmail,
                "Large Transaction Alert",
                html
        );
    }

    private void sendHtmlEmail(
            String toEmail,
            String subject,
            String htmlContent) {

        try {

            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {

            throw new RuntimeException(
                    "Unable to send email.",
                    e
            );
        }
    }
}