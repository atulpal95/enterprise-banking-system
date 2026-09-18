package com.atul.banking.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private FileStorageConfig fileStorageConfig;

    @Value("${file.storage.kyc-dir:uploads/kyc}")
    private String kycUploadDir;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {

        // ==========================================
        // PROFILE PICTURE STORAGE
        // ==========================================

        String uploadPath =
                Paths.get(
                        fileStorageConfig.getUploadDir()
                )
                .toAbsolutePath()
                .toUri()
                .toString();

        registry.addResourceHandler(
                "/uploads/profiles/**"
        )
        .addResourceLocations(uploadPath);


        // ==========================================
        // KYC DOCUMENT STORAGE
        // ==========================================

        String kycPath =
                Paths.get(
                        kycUploadDir
                )
                .toAbsolutePath()
                .toUri()
                .toString();



        registry.addResourceHandler(
                "/uploads/kyc/**"
        )
        .addResourceLocations(kycPath);
    }

    @Override
    public void addCorsMappings(
            CorsRegistry registry) {

        registry.addMapping("/**")
        .allowedOrigins(frontendUrl)
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowCredentials(true);
    }
}