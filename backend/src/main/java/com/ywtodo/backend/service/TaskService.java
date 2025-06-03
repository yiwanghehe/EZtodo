package com.ywtodo.backend.service;

import com.ywtodo.backend.dto.TaskCreationRequest;
import com.ywtodo.backend.dto.TaskCreationResponse;
import com.ywtodo.backend.dto.TaskResponse;
import com.ywtodo.backend.model.Result;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public interface TaskService {
    Result<TaskResponse> createTask(TaskCreationRequest taskRequest, Long userId);

    Result<TaskResponse> getTaskByIdAndUserId(Long taskId, Long userId);
    Result<List<TaskResponse>> getTasksByUserId(Long userId);

    Result<TaskResponse> updateTaskCompletionStatus(Long taskId, Long userId);
    Result<TaskResponse> updateTaskReminder(Instant time, Long taskId, Long userId);
    Result<TaskResponse> updateTaskDueDate(LocalDate time, Long taskId, Long userId);
//    Result<TaskResponse> updateTaskRepeatRule(Long taskId, Long userId);
    Result<TaskResponse> updateImportanceStatus(Long taskId, Long userId);
    Result<TaskResponse> updateMyDayStatus(Long taskId, Long userId);
    Result<TaskResponse> updateNotes(String notes, Long taskId, Long userId);

    Result<String> deleteTask(Long taskId, Long userId);
    Result<String> deleteTaskDueDate(Long taskId, Long userId);
    Result<String> deleteTaskReminder(Long taskId, Long userId);
}
