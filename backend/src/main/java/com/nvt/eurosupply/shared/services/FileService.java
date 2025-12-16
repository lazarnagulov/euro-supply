package com.nvt.eurosupply.shared.services;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.exceptions.FileUploadException;
import com.nvt.eurosupply.shared.enums.FileType;
import com.nvt.eurosupply.shared.models.StoredFile;
import com.nvt.eurosupply.shared.repositories.StoredFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.*;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file-storage-path}")
    private String fileStoragePath;

    private final StoredFileRepository storedFileRepository;

    public List<StoredFile> uploadFiles(FileFolder folder, Long entityId, List<MultipartFile> files) {
        return files.stream()
                .map(file -> saveFile(folder, entityId, file))
                .collect(Collectors.toList());
    }

    public StoredFile saveFile(FileFolder folder, Long entityId, MultipartFile file) {
        try {
            String safeOriginalName = StringUtils.cleanPath(
                    Objects.requireNonNull(file.getOriginalFilename())
            );

            String storedName = Instant.now().toEpochMilli() + "_" + safeOriginalName;

            String relativeDir = folder.getPath() + "/" + entityId;
            Path uploadDir = Paths.get(fileStoragePath)
                    .resolve(relativeDir)
                    .normalize()
                    .toAbsolutePath();

            Files.createDirectories(uploadDir);

            Path filePath = uploadDir.resolve(storedName);

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            FileType type = detectType(file.getContentType());

            StoredFile stored = StoredFile.builder()
                    .path(filePath.toString())
                    .filename(storedName)
                    .contentType(file.getContentType())
                    .type(type)
                    .createdAt(Instant.now())
                    .build();

            return storedFileRepository.save(stored);

        } catch (Exception e) {
            throw new FileUploadException("Failed to upload file");
        }
    }

    private FileType detectType(String contentType) {
        if (contentType == null) return FileType.OTHER;

        if (contentType.startsWith("image/")) return FileType.IMAGE;

        if (contentType.equals("application/pdf")) return FileType.PDF;

        return FileType.OTHER;
    }
}
