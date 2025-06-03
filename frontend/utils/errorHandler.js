import { navigate } from './RootNavigation';
import { clearAuthData } from '../store/useAuthStore';
import {Alert} from "react-native";

const handleUnauthorizedError = async () => {
    await clearAuthData();
    navigate('Home');
}

export const handleApiError = async (error, apiName) => {

    if (error.response && error.response.data) {
        // 后端返回结构化错误信息
        console.error(apiName + '出错:', error.response.data);
        Alert.alert('错误', error.response.data.message || apiName + '失败');
        if( error.response.data.code === 401) {
            await handleUnauthorizedError();
            return Promise.reject(new Error('身份验证失败，请重新登录'));
        }
    } else {
        // 网络错误或其他异常
        console.error(apiName + '失败:', error.message);
        Alert.alert('错误', apiName + '失败: ' + error.message);
    }
};
