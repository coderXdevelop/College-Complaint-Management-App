package com.campuscomplaint.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final String apiKey;

    public CloudinaryService(Cloudinary cloudinary, @Value("${cloudinary.api-key}") String apiKey) {
        this.cloudinary = cloudinary;
        this.apiKey = apiKey;
    }

    public String uploadFile(MultipartFile file) {
        // Bypassing real Cloudinary upload during local testing if mock credentials are set
        if ("key".equals(apiKey) || "demo".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?w=500";
        }

        try {
            Map uploadResult =
                    cloudinary.uploader()
                            .upload(
                                    file.getBytes(),
                                    Map.of());

            return uploadResult
                    .get("secure_url")
                    .toString();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "Failed to upload image: " + e.getMessage());
        }
    }
}