package com.atul.banking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminResetPasswordRequest {

    private String email;

    private String otp;

    private String newPassword;

    private String confirmPassword;
}