package com.atul.banking.dto;

public class UploadProfilePictureResponse {

    private String message;
    private String imageUrl;

    public UploadProfilePictureResponse() {
    }

    public UploadProfilePictureResponse(String message, String imageUrl) {
        this.message = message;
        this.imageUrl = imageUrl;
    }

    public String getMessage() {
        return message;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}