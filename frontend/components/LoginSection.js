import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import useAuthStore from '../store/useAuthStore';

const LoginSection = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuthStore();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('错误', '请输入邮箱和密码');
            return;
        }

        const result = await signIn(email, password);
        if (!result.success) {
            Alert.alert('登录失败', result.message);
        }
    };

    return (
        <View style={styles.loginContainer}>
            <TextInput placeholder="邮箱" value={email} onChangeText={setEmail} style={styles.input} />
            <TextInput placeholder="密码" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>立即登录</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    button: {
        width: '80%',
        padding: 10,
        backgroundColor: '#841584',
        borderRadius: 8,
        alignItems: 'center', // 水平居中
        justifyContent: 'center', // 垂直居中
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        height: 250,
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center'
    },
    loginTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
        color: '#555',
    },
    input: {
        height: 55,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 6,
        fontSize: 16,
    },
})
export default LoginSection;
