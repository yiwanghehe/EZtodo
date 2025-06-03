package com.ywtodo.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

@Data
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 任务创建者

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "list_id") // 可为空，允许任务不属于任何特定列表
    private TaskList taskList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_task_id") // 自关联，用于子任务
    private Task parentTask;

    @OneToMany(mappedBy = "parentTask", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Task> subTasks = new ArrayList<>(); // 子任务列表

    @Column(nullable = false)
    private String title;

//    @Lob
    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(name = "completed_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Instant completedAt;

    @Column(name = "due_date")
    @Temporal(TemporalType.DATE) // 仅日期
    private LocalDate dueDate;

    @Column(name = "reminder_at")
    @Temporal(TemporalType.TIMESTAMP) // 日期和时间
    private Instant reminderAt;

    @Column(name = "repeat_rule")
    private String repeatRule;

    @Column
    private Integer priority = 0;

    @Column(name = "is_important", nullable = false)
    private Boolean isImportant = false;

    @Column(name = "is_my_day", nullable = false)
    private Boolean isMyDay = false;

    @Column(name = "my_day_added_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Instant myDayAddedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // 一对多关系：一个任务可以有多个步骤
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC") // 步骤可以按 sortOrder 排序
    private List<Step> steps = new ArrayList<>();

    // 多对多关系：一个任务可以有多个标签
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "task_tags",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tag> tags = new HashSet<>();

    // 一对多关系：一个任务可以有多个自定义提醒
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<TaskReminder> reminders = new ArrayList<>();

    public void addTag(Tag tag) {
        this.tags.add(tag);
        tag.getTasks().add(this);
    }

    public void removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getTasks().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public boolean isCompleted() {
        return completed != null && completed;
    }
}
