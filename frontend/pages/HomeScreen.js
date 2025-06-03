import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useAuthStore from '../store/useAuthStore'; // 引入 store
import LoginSection from '../components/LoginSection';
import {useFocusEffect} from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
    const { user, isLoading, initializeAuth, signOut } = useAuthStore();

    useFocusEffect(
        React.useCallback(() => {
            initializeAuth(); // 每次进入页面都重新初始化
        }, [])
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={[styles.welcome,
                    {
                        width: '50%',
                        padding: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}>
                    加载中...
                </Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#999' }]}
                    onPress={signOut}>
                    <Text style={styles.buttonText}>退出登录</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {user ? (
                <>
                    <Text style={styles.welcome}>欢迎回来👋{'\n'}{user.name}</Text>
                    <View style={{ alignItems: 'center', gap: 40 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Today')}>
                            <Text style={styles.buttonText}>开始新任务</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#999' }]}
                            onPress={signOut}>
                            <Text style={styles.buttonText}>退出登录</Text>
                        </TouchableOpacity>
                    </View>

                </>
            ) : (
                <>
                    <Text style={styles.title}>🥵👇登录以继续👇🥵</Text>
                    <LoginSection />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1097ec',
    },
    welcome: {
        textAlign: 'center',
        fontSize: 35,
        color: '#181719',
        marginBottom: 30,
    },
    button: {
        width: '30%',
        padding: 15,
        backgroundColor: '#841584',
        borderRadius: 20,
        alignItems: 'center', // 水平居中
        justifyContent: 'center', // 垂直居中
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default HomeScreen;
