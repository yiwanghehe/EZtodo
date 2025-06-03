package com.ywtodo.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result<T> {
    private int code; // 规范: 200 成功, 4xx 客户端错误, 5xx 服务器错误
    private String message; // 提示信息
    private T data; // 数据载荷

    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", null); // 默认成功消息
    }

    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }

    // 带自定义成功消息的方法
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }

    public static <T> Result<T> created(String message, T data) {
        return new Result<>(201, message, data);
    }

    public static <T> Result<T> fail(String message) {
        // 500 代表通用服务器错误
        return new Result<>(500, message, null);
    }

    public static <T> Result<T> fail(int code, String message) {
        return new Result<>(code, message, null);
    }

    public static <T> Result<T> notFound(String message) {
        return new Result<>(404, message, null); // 404: 未找到资源
    }

    public static <T> Result<T> badRequest(String message) {
        return new Result<>(400, message, null); // 400: 客户端请求错误
    }

    public static <T> Result<T> unauthorized(String message) {
        return new Result<>(401, message, null); // 401: 未授权
    }

    public static <T> Result<T> forbidden(String message) {
        return new Result<>(403, message, null); // 403: 禁止访问
    }

    @JsonIgnore
    public boolean isSuccess() {
        return this.code == 200;
    }
    @JsonIgnore
    public boolean isCreated() {
        return this.code == 201;
    }
}
