package com.ywtodo.backend.controller;

import com.ywtodo.backend.dto.TaskCreationRequest;
import com.ywtodo.backend.dto.TaskCreationResponse;
import com.ywtodo.backend.dto.TaskResponse;
import com.ywtodo.backend.model.Result;
import com.ywtodo.backend.security.UserPrincipal;
import com.ywtodo.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/task")
public class TaskController {
    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }
    /**
     * 创建任务
     *
     * @param taskCreationRequest 任务创建请求
     * @param currentUser         当前用户
     * @return 任务创建结果
     */
    @PostMapping("/post/create")
    public ResponseEntity<Result<TaskResponse>> createTask(
            @Valid @RequestBody TaskCreationRequest taskCreationRequest,
            @AuthenticationPrincipal UserPrincipal currentUser) { // 注入认证用户

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> createdTaskResult = taskService.createTask(taskCreationRequest, currentUser.getId());
            if (createdTaskResult.isCreated()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(createdTaskResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(createdTaskResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("创建任务失败: " + e.getMessage()));
        }
    }


    /**
     * 获取当前用户的所有任务
     *
     * @param currentUser 当前用户
     * @return 任务列表
     */
    @GetMapping("/get/mytasks")
    public ResponseEntity<Result<List<TaskResponse>>> getMyTasks(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<List<TaskResponse>> getTasksResult = taskService.getTasksByUserId(currentUser.getId());
            if (getTasksResult.isSuccess()) {
                return ResponseEntity.ok(getTasksResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getTasksResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("获取任务失败: " + e.getMessage()));
        }

    }

    /**
     * 获取当前用户的任务
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 任务详情
     */
    @GetMapping("/get/{taskId}")
    public ResponseEntity<Result<TaskResponse>> getTaskById(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> getTaskResult = taskService.getTaskByIdAndUserId(taskId, currentUser.getId());
            if (getTaskResult.isSuccess()) {
                return ResponseEntity.ok(getTaskResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(getTaskResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("获取任务失败: " + e.getMessage()));
        }
    }
    /**
     * 更新任务完成状态
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 更新结果
     */
    @PutMapping("/put/completeStatus/{taskId}")
    public ResponseEntity<Result<TaskResponse>> updateTaskCompletionStatus(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> updateResult = taskService.updateTaskCompletionStatus(taskId, currentUser.getId());
            if (updateResult.isSuccess()) {
                return ResponseEntity.ok(updateResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("更新任务完成状态失败: " + e.getMessage()));
        }
    }

    /**
     * 更新任务提醒时间
     *
     * @param taskId      任务ID
     * @param time        提醒时间
     * @param currentUser 当前用户
     * @return 更新结果
     */
    @PutMapping("/put/reminder/{taskId}")
    public ResponseEntity<Result<TaskResponse>> updateTaskReminder(
            @PathVariable Long taskId,
            @RequestParam Instant time,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> updateResult = taskService.updateTaskReminder(time, taskId, currentUser.getId());
            if (updateResult.isSuccess()) {
                return ResponseEntity.ok(updateResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("更新任务提醒时间失败: " + e.getMessage()));
        }
    }

    /**
     * 更新任务截止日期
     *
     * @param taskId      任务ID
     * @param time        截止日期
     * @param currentUser 当前用户
     * @return 更新结果
     */
    @PutMapping("/put/dueDate/{taskId}")
    public ResponseEntity<Result<TaskResponse>> updateTaskDueDate(
            @PathVariable Long taskId,
            @RequestParam LocalDate time,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> updateResult = taskService.updateTaskDueDate(time, taskId, currentUser.getId());
            if (updateResult.isSuccess()) {
                return ResponseEntity.ok(updateResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("更新任务截止日期失败: " + e.getMessage()));
        }
    }

    /**
     * 更新任务重要性状态
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 更新结果
     */
    @PutMapping("/put/importance/{taskId}")
    public ResponseEntity<Result<TaskResponse>> updateTaskImportanceStatus(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> updateResult = taskService.updateImportanceStatus(taskId, currentUser.getId());
            if (updateResult.isSuccess()) {
                return ResponseEntity.ok(updateResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("更新任务重要性状态失败: " + e.getMessage()));
        }
    }

    /**
     * 更新任务我的一天状态
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 更新结果
     */
    @PutMapping("/put/myday/{taskId}")
    public ResponseEntity<Result<TaskResponse>> updateTaskMyDayStatus(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> updateResult = taskService.updateMyDayStatus(taskId, currentUser.getId());
            if (updateResult.isSuccess()) {
                return ResponseEntity.ok(updateResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("更新任务我的一天状态失败: " + e.getMessage()));
        }
    }

    /**
     * 更新任务备注
     *
     * @param taskId      任务ID
     * @param notes       备注内容
     * @param currentUser 当前用户
     * @return 更新结果
     */
    @PutMapping("/put/notes/{taskId}")
    public ResponseEntity<Result<TaskResponse>> updateTaskNotes(
            @PathVariable Long taskId,
            @RequestParam String notes,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<TaskResponse> addNotesResult = taskService.updateNotes(notes, taskId, currentUser.getId());
            if (addNotesResult.isSuccess()) {
                return ResponseEntity.ok(addNotesResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(addNotesResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("添加备注失败: " + e.getMessage()));
        }
    }


    /**
     * 删除任务
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 删除结果
     */
    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<Result<String>> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<String> deleteResult = taskService.deleteTask(taskId, currentUser.getId());
            if (deleteResult.isSuccess()) {
                return ResponseEntity.ok(deleteResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("删除任务失败: " + e.getMessage()));
        }
    }

    /**
     * 删除任务截止日期
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 删除结果
     */
    @DeleteMapping("/delete/dueDate/{taskId}")
    public ResponseEntity<Result<String>> deleteTaskDueDate(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<String> deleteResult = taskService.deleteTaskDueDate(taskId, currentUser.getId());
            if (deleteResult.isSuccess()) {
                return ResponseEntity.ok(deleteResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("删除任务截止日期失败: " + e.getMessage()));
        }
    }

    /**
     * 删除任务提醒时间
     *
     * @param taskId      任务ID
     * @param currentUser 当前用户
     * @return 删除结果
     */
    @DeleteMapping("/delete/reminder/{taskId}")
    public ResponseEntity<Result<String>> deleteTaskReminder(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Result.unauthorized("用户未被认证"));
        }
        try {
            Result<String> deleteResult = taskService.deleteTaskReminder(taskId, currentUser.getId());
            if (deleteResult.isSuccess()) {
                return ResponseEntity.ok(deleteResult);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteResult);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Result.fail("删除任务提醒时间失败: " + e.getMessage()));
        }
    }
}
