package com.atul.banking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUpdateProfileRequest {

    private String fullName;
    private String email;
}