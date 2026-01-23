package com.nvt.eurosupply.user.mappers;

import com.nvt.eurosupply.shared.enums.FileFolder;
import com.nvt.eurosupply.shared.mappers.FileMapper;
import com.nvt.eurosupply.shared.models.PagedResponse;
import com.nvt.eurosupply.user.dtos.AuthRequestDto;
import com.nvt.eurosupply.user.dtos.ManagerResponseDto;
import com.nvt.eurosupply.user.models.Person;
import com.nvt.eurosupply.user.models.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper modelMapper;
    private final FileMapper fileMapper;

    public User fromRequest(@Valid AuthRequestDto request) {
            return modelMapper.map(request, User.class);
    }

    public PagedResponse<ManagerResponseDto> toPagedResponse(Page<User> page) {
        return new PagedResponse<>(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }

    public ManagerResponseDto toResponse(User manager) {
        ManagerResponseDto response = modelMapper.map(manager, ManagerResponseDto.class);
        Person person = manager.getPerson();
        response.setFirstname(person.getFirstname());
        response.setLastname(person.getLastname());
        response.setPhoneNumber(person.getPhoneNumber());
        if (manager.getImage() != null) {
            response.setImageUrl(
                    fileMapper.toResponse(
                            FileFolder.USER,
                            manager.getId(),
                            manager.getImage()
                    )
            );
        }

        return response;
    }
}
