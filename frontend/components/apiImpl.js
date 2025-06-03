import api from "./api";
import {Alert} from "react-native";
import {handleApiError} from "../utils/errorHandler";

const createTask = async (taskCreationRequest) => {
    try {
        const res = await api.auth.createTask(taskCreationRequest);
        if(res.data.code === 201) {
            // console.log('添加任务成功:', res.data.data);
            return res.data;
        } else {
            console.error('添加任务失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '添加任务');
    }
}

const getMyTasks = async () => {
    try {
        const res = await api.auth.getMyTasks();
        if(res.data.code === 200) {
            // console.log('获取任务成功:', res.data.data);
            return res.data;
        } else {
            console.error('获取任务失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '获取任务');
    }
}

const getTaskById = async (taskId) => {
    try {
        const res = await api.auth.getTaskById(taskId);
        if(res.data.code === 200) {
            // console.log('获取单个任务成功:', res.data.data);
            return res.data;
        } else {
            console.error('获取单个任务失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '获取单个任务');
    }
}

const updateTaskCompletionStatus = async (taskId) => {
try {
        const res = await api.auth.updateCompletionStatus(taskId);
        if(res.data.code === 200) {
            // console.log('更新任务完成状态成功:', res.data.data);
            return res.data;
        } else {
            console.error('更新任务完成状态失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '更新任务完成状态');
    }
}

const updateTaskImportanceStatus = async (taskId) => {
    try {
        const res = await api.auth.updateImportanceStatus(taskId);
        if(res.data.code === 200) {
            // console.log('更新任务重要性状态成功:', res.data.data);
            return res.data;
        } else {
            console.error('更新任务重要性状态失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '更新任务重要性状态');
    }
}

const updateTaskDueDate = async (taskId, date) => {
    try {
        const res = await api.auth.updateDueDate(taskId, date);
        if(res.data.code === 200) {
            // console.log('更新任务截止日期成功:', res.data.data);
            return res.data;
        } else {
            console.error('更新任务截止日期失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '更新任务截止日期');
    }
}

const updateTaskMyDayStatus = async (taskId) => {
    try {
        const res = await api.auth.updateMyDayStatus(taskId);
        if(res.data.code === 200) {
            // console.log('更新任务我的一天状态成功:', res.data.data);
            return res.data;
        } else {
            console.error('更新任务我的一天状态失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '更新任务我的一天状态');
    }
}

const updateTaskNotes = async (taskId, notes) => {
    try {
        const res = await api.auth.updateNotes(taskId, notes);
        if(res.data.code === 200) {
            // console.log('更新任务备注成功:', res.data.data);
            return res.data;
        } else {
            console.error('更新任务备注失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '更新任务备注');
    }
}

const updateTaskReminder = async (taskId, reminder) => {
    try {
        const res = await api.auth.updateReminder(taskId, reminder);
        if(res.data.code === 200) {
            // console.log('更新任务提醒成功:', res.data.data);
            return res.data;
        } else {
            console.error('更新任务提醒失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '更新任务提醒');
    }
}

const deleteTask = async (taskId) => {
    try {
        const res = await api.auth.deleteTask(taskId);
        if(res.data.code === 200) {
            // console.log('删除任务成功:', res.data.data);
            return res.data;
        } else {
            console.error('删除任务失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '删除任务');
    }
}

const deleteTaskDueDate = async (taskId) => {
    try {
        const res = await api.auth.deleteTaskDueDate(taskId);
        if(res.data.code === 200) {
            // console.log('删除任务截止日期成功:', res.data.data);
            return res.data;
        } else {
            console.error('删除任务截止日期失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '删除任务截止日期');
    }
}

const deleteTaskReminder = async (taskId) => {
    try {
        const res = await api.auth.deleteTaskReminder(taskId);
        if(res.data.code === 200) {
            // console.log('删除任务提醒成功:', res.data.data);
            return res.data;
        } else {
            console.error('删除任务提醒失败:', res.data.message);
            Alert.alert('错误', res.data.message);
        }

    } catch (error) {
        handleApiError(error, '删除任务提醒');
    }
}



export default {
    createTask,

    getMyTasks,

    updateTaskCompletionStatus,
    updateTaskImportanceStatus,
    updateTaskDueDate,
    updateTaskMyDayStatus,
    updateTaskNotes,
    updateTaskReminder,

    deleteTask,
    deleteTaskDueDate,
    deleteTaskReminder,
}
