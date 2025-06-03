import axios from 'axios';
import config from './config';
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
    baseURL: config.BACKEND_URL,
    timeout: 5000,
});

// 请求拦截器
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('获取 Token 失败:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 封装认证请求（带用户身份）
const authApi = {
    // 创建任务
    createTask: (taskCreationRequest) =>
        apiClient.post('/task/post/create', taskCreationRequest),

    // 获取所有任务
    getMyTasks: () =>
        apiClient.get('/task/get/mytasks'),

    // 获取单个任务
    getTaskById: (taskId) =>
        apiClient.get(`/task/get/${taskId}`),

    // 更新完成状态
    updateCompletionStatus: (taskId) =>
        apiClient.put(`/task/put/completeStatus/${taskId}`),

    // 更新提醒时间
    updateReminder: (taskId, time) =>
        apiClient.put(`/task/put/reminder/${taskId}?time=${time}`),

    // 更新截止日期
    updateDueDate: (taskId, date) =>
        apiClient.put(`/task/put/dueDate/${taskId}?time=${date}`),

    // 更新重要性状态
    updateImportanceStatus: (taskId) =>
        apiClient.put(`/task/put/importance/${taskId}`),

    // 更新"我的一天"状态
    updateMyDayStatus: (taskId) =>
        apiClient.put(`/task/put/myday/${taskId}`),

    // 更新备注
    updateNotes: (taskId, notes) =>
        apiClient.put(`/task/put/notes/${taskId}?notes=${notes}`),

    // 删除任务
    deleteTask: (taskId) =>
        apiClient.delete(`/task/delete/${taskId}`),
    // 删除任务截止日期
    deleteTaskDueDate: (taskId) =>
        apiClient.delete(`/task/delete/dueDate/${taskId}`),

    deleteTaskReminder: (taskId) =>
        apiClient.delete(`/task/delete/reminder/${taskId}`),
};

const publicApi = {
    // 登录
    login: (loginRequest) =>
        apiClient.post('/user/login', loginRequest),

    // 注册
    register: (registrationRequest) =>
        apiClient.post('/user/register', registrationRequest)
}
// 导出接口
export default {
    // 认证相关接口
    auth: authApi,

    // 无需认证的接口（如果有的话）
    public: publicApi
};
