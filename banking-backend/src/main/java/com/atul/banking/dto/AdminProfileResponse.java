package com.atul.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String profilePictureUrl;
}