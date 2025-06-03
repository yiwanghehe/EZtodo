package com.ywtodo.backend.service.impl;

import com.ywtodo.backend.dto.TaskCreationRequest;
import com.ywtodo.backend.dto.TaskCreationResponse;
import com.ywtodo.backend.dto.TaskResponse;
import com.ywtodo.backend.exception.ResourceNotFoundException;
import com.ywtodo.backend.model.Result;
import com.ywtodo.backend.model.Task;
import com.ywtodo.backend.model.User;
import com.ywtodo.backend.repository.TaskListRepository;
import com.ywtodo.backend.repository.TaskRepository;
import com.ywtodo.backend.repository.UserRepository;
import com.ywtodo.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskListRepository taskListRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.taskListRepository = taskListRepository;
    }

    @Override
    @Transactional
    public Result<TaskResponse> createTask(TaskCreationRequest taskRequest, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("无法找到用户ID: " + userId));

        try{
            Task task = new Task();
            task.setTitle(taskRequest.getTitle());
            task.setDueDate(taskRequest.getDueDate());
            task.setReminderAt(taskRequest.getReminderAt());
            task.setRepeatRule(taskRequest.getRepeatRule());
            task.setUser(user);
            task.setCompleted(false); // 默认未完成

            Task savedTask = taskRepository.save(task);
            return Result.created("创建任务成功", mapToTaskResponse(savedTask));
        }catch (Exception e){
            return Result.fail("创建任务失败，发生错误" + e.getMessage());
        }

    }


    @Override
    public Result<TaskResponse> getTaskByIdAndUserId(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("获取任务成功", taskResponse);
        }catch (Exception e){
            return Result.fail("获取任务失败，发生错误" + e.getMessage());
        }
    }

    @Override
    public Result<List<TaskResponse>> getTasksByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("无法找到用户ID: " + userId);
        }

        try{
            List<Task> tasks = taskRepository.findByUserId(userId);
            List<TaskResponse> taskResponse = tasks.stream().map(this::mapToTaskResponse).toList();
            return Result.success("获取任务成功", taskResponse);
        }catch (Exception e){
            return Result.fail("获取任务失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<TaskResponse> updateTaskCompletionStatus(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setCompleted(!task.isCompleted());
            task.setCompletedAt(task.isCompleted() ? Instant.now() : null);
            taskRepository.save(task);

            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("更新任务完成状态成功", taskResponse);
        }catch (Exception e){
            return Result.fail("更新任务完成状态失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<TaskResponse> updateTaskReminder(Instant time, Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setReminderAt(time);
            taskRepository.save(task);

            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("更新任务提醒成功", taskResponse);
        }catch (Exception e){
            return Result.fail("更新任务提醒失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<TaskResponse> updateTaskDueDate(LocalDate time, Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setDueDate(time);
            taskRepository.save(task);

            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("更新任务截止日期成功", taskResponse);
        }catch (Exception e){
            return Result.fail("更新任务截止日期失败，发生错误" + e.getMessage());
        }
    }


    @Override
    @Transactional
    public Result<TaskResponse> updateImportanceStatus(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));
        try{
            task.setIsImportant(!task.getIsImportant());
            taskRepository.save(task);

            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("更新任务重要性状态成功", taskResponse);
        } catch (Exception e){
            return Result.fail("更新任务重要性状态失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<TaskResponse> updateMyDayStatus(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setIsMyDay(!task.getIsMyDay());
            task.setMyDayAddedAt(task.getIsMyDay() ? Instant.now() : null);
            taskRepository.save(task);

            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("更新任务我的一天状态成功", taskResponse);
        } catch (Exception e){
            return Result.fail("更新任务我的一天状态失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<TaskResponse> updateNotes(String notes, Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setNotes(notes);
            taskRepository.save(task);

            TaskResponse taskResponse = mapToTaskResponse(task);
            return Result.success("添加备注成功", taskResponse);
        }catch (Exception e){
            return Result.fail("添加备注失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<String> deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            taskRepository.delete(task);
            return Result.success("删除任务成功", "任务ID: " + taskId + " 已删除");
        }catch (Exception e){
            return Result.fail("删除任务失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<String> deleteTaskDueDate(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setDueDate(null);
            taskRepository.save(task);
            return Result.success("删除任务截止日期成功", "任务ID: " + taskId + " 的截止日期已删除");
        }catch (Exception e){
            return Result.fail("删除任务截止日期失败，发生错误" + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Result<String> deleteTaskReminder(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("对于当前的用户，无法找到任务ID: " + taskId));

        try{
            task.setReminderAt(null);
            taskRepository.save(task);
            return Result.success("删除任务提醒成功", "任务ID: " + taskId + " 的提醒已删除");
        }catch (Exception e){
            return Result.fail("删除任务提醒失败，发生错误" + e.getMessage());
        }
    }



    private TaskCreationResponse mapToTaskCreationResponse(Task task) {
        TaskCreationResponse response = new TaskCreationResponse();
        response.setTitle(task.getTitle());
        response.setCreatedAt(task.getCreatedAt());
        return response;
    }

    private TaskResponse mapToTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setNotes(task.getNotes());
        response.setMyDay(task.getIsMyDay());
        response.setCompleted(task.getCompleted());
        response.setImportant(task.getIsImportant());
        response.setDueDate(task.getDueDate());
        response.setReminderAt(task.getReminderAt());
        response.setRepeatRule(task.getRepeatRule());
        response.setTags(task.getTags());
        response.setCompletedAt(task.getCompletedAt());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        if (task.getTaskList() != null) {
            response.setListId(task.getTaskList().getId());
        }
        return response;
    }
}
