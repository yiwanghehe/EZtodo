import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../components/api';
import apiImpl from '../components/apiImpl';
import {Alert} from "react-native";

// 解析 JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// 导出清除方法供外部使用
export const clearAuthData = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
    } catch (error) {
        console.error('清除缓存失败:', error);
    }
};

const createAuthStore = require('zustand').create;

const useAuthStore = createAuthStore((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    // 登录方法
    signIn: async (email, password) => {
        try {
            const loginRequest = { email, password };
            const res = await api.public.login(loginRequest);

            if (res.data.code === 200) {
                await AsyncStorage.setItem('accessToken', res.data.data.accessToken);
                await AsyncStorage.setItem('userId', res.data.data.userId.toString());
                await AsyncStorage.setItem('username', res.data.data.username);

                set({
                    user: { name: res.data.data.username },
                    isAuthenticated: true,
                });
                return { success: true, user: { name: res.data.data.username } };
            } else {
                return { success: false, message: res.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || '登录失败，请检查网络并稍后再试';
            return { success: false, message: errorMessage };
        }
    },

    // 自动登录检查
    initializeAuth: async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            set({ user:  null, isLoading: false, isAuthenticated: false });
            return;
        }

        // 检查 token 是否过期
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.exp < Date.now() / 1000) {
            await clearAuthData();
            set({ user:  null, isLoading: false, isAuthenticated: false });
            return;
        }

        try{
            // 获取用户任务以验证 token 是否生效
            // const tasks = await apiImpl.getMyTasks();
            const res = await api.auth.getMyTasks();
            const tasks = res.data;
            if (!tasks || tasks.code !== 200) {
                set({ user:  null, isLoading: false, isAuthenticated: false });
                return;
            }

            if(tasks.code === 200) {
                const username = await AsyncStorage.getItem('username');
                set({
                    user: { name: username },
                    isAuthenticated: true,
                    isLoading: false,
                });
            }

        } catch(error) {
            Alert.alert('错误', '自动登录失败，请检查网络连接或重新登录');
        }
    },

    // 清除认证数据
    signOut: async () => {
        await clearAuthData();
        set({ user: null, isLoading: false, isAuthenticated: false });
    },
}));

export default useAuthStore;
