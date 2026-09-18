package com.atul.banking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminChangePasswordRequest {

    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}