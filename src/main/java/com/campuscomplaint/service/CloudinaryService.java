package com.campuscomplaint.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {

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