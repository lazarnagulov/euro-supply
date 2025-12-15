package com.nvt.eurosupply.shared.mappers;

import com.nvt.eurosupply.shared.dtos.FileResponseDto;
import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.models.StoredFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FileMapper {

    public FileResponseDto toResponse(FileFolder folder, Long entityId, StoredFile file) {
        return FileResponseDto.builder()
                .id(file.getId())
                .filename(file.getFilename())
                .contentType(file.getContentType())
                .type(file.getType())
                .url(generatePublicUrl(folder.getPath(), entityId, file.getPath()))
                .build();
    }

    public String generatePublicUrl(String folder, Long entityId, String storedName) {
        return "/files/" + folder + "/" + entityId + "/" + storedName;
    }

}
