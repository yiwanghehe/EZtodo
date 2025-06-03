package com.ywtodo.backend.model;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Data
@Entity
@Table(name = "tags", uniqueConstraints = {
        // 假设标签名是全局唯一的，如果标签是用户专属的，则应加入 user_id
        // @UniqueConstraint(columnNames = {"user_id", "name"}) // 如果有 user_id
        @UniqueConstraint(columnNames = {"name"})
})
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 如果标签是用户专属的:
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id", nullable = false)
    // private User user;

    @Column(nullable = false)
    private String name;

    @Column(name = "color_hex")
    private String colorHex;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // 注意：如果标签的 name 或 colorHex 可以修改，也应该添加 updatedAt 和 @UpdateTimestamp
    // @UpdateTimestamp
    // @Column(name = "updated_at", nullable = false)
    // private Instant updatedAt;

    @ManyToMany(mappedBy = "tags", fetch = FetchType.LAZY)
    private Set<Task> tasks = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return Objects.equals(id, tag.id); // 或者比较 name 如果 name 是业务唯一键
    }

    @Override
    public int hashCode() {
        return Objects.hash(id); // 或者 hash(name)
    }
}
