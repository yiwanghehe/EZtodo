package com.ywtodo.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.Instant;

@Data
public class TaskCreationResponse {
    private String title;
    private Instant createdAt;
}
