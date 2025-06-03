package com.ywtodo.backend.dto;

import java.time.Instant;
import java.time.LocalDate;
import lombok.Data;

@Data
public class TaskCreationRequest {
    private String title;
    private LocalDate dueDate;
    private Instant reminderAt;
    private String repeatRule;
}
