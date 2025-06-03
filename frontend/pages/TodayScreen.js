import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import FeatureIcon from '../components/FeatureIcon';
import AddTaskForm from '../components/AddTaskForm';

const TodayScreen = () => {
    const [tasks, setTasks] = useState([]);

    const handleTaskAdded = (newTask) => {
        setTasks((prev) => Array.isArray(newTask) ? newTask : [...prev, newTask]);
    };


    return (
        <View style={styles.container}>
            {/* 添加任务表单 */}
            <AddTaskForm onTaskAdded={handleTaskAdded} />

            {/* 任务列表 */}
            <View style={styles.taskList}>
                {tasks.map((t, index) => (
                    <Text key={t.id || index} style={styles.taskItem}>{t.title || t}</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
    },
    taskList: {
        flex: 1,
        marginTop: 20,
    },
    taskItem: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default TodayScreen;
