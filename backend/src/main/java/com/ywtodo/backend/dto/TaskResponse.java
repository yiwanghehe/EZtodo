package com.ywtodo.backend.dto;

import com.ywtodo.backend.model.Tag;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String notes;
    private boolean myDay;
    private boolean completed;
    private boolean important;
    private LocalDate dueDate;
    private Instant reminderAt;
    private String repeatRule;
    private Set<Tag> tags;
    private Instant completedAt;
    private Instant createdAt;
    private Instant updatedAt;
    private Long listId;

}
