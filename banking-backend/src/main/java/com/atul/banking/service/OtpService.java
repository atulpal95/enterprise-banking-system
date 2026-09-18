package com.atul.banking.service;

import com.atul.banking.util.OtpGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    @Autowired
    private EmailService emailService;

    // Stores OTP against email
    private final Map<String, String> otpMap = new HashMap<>();

    // Stores OTP expiry time
    private final Map<String, LocalDateTime> expiryMap = new HashMap<>();

    // ===========================
    // Send OTP
    // ===========================
    public void sendOtp(String email) {

        String otp = OtpGenerator.generateOtp();

        otpMap.put(email, otp);
        expiryMap.put(email, LocalDateTime.now().plusMinutes(5));

        emailService.sendOtp(email, otp);
    }

    // ===========================
    // Verify OTP
    // ===========================
    public boolean verifyOtp(String email, String otp) {

        // OTP not generated
        if (!otpMap.containsKey(email)) {
            return false;
        }

        // OTP expired
        if (LocalDateTime.now().isAfter(expiryMap.get(email))) {

            otpMap.remove(email);
            expiryMap.remove(email);

            return false;
        }

        // OTP mismatch
        if (!otp.equals(otpMap.get(email))) {
            return false;
        }

        return true;
    }

    // ===========================
    // Clear OTP
    // ===========================
    public void clearOtp(String email) {

        otpMap.remove(email);
        expiryMap.remove(email);
    }
}