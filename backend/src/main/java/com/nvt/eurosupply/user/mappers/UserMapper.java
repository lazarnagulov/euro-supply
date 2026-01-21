package com.nvt.eurosupply.user.mappers;

import com.nvt.eurosupply.user.dtos.AuthRequestDto;
import com.nvt.eurosupply.user.models.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper modelMapper;

    public User fromRequest(@Valid AuthRequestDto request) {
            return modelMapper.map(request, User.class);
    }
}
