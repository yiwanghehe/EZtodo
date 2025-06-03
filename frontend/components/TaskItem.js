import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updateHandlers } from "./TaskDetail";


// 使用 flex 定义列比例（替代固定宽度）
const columns = [
    { title: '状态', flex: 1 },
    { title: '标题', flex: 2 },
    { title: '截止日期', flex: 2 },
    { title: '重要性', flex: 1 },
    { title: '详情', flex: 1 },
];

const TaskHeader = () => {
    return (
        <View style={styles.taskRow}>
            {columns.map((col, index) => (
                <Text key={index} style={[styles.headerText, { flex: col.flex }]}>
                    {col.title}
                </Text>
            ))}
        </View>
    );
};

const TaskItem = ({ task, showDetail, onUpdate}) => {

    const [localTask, setLocalTask] = useState(task);

    // 监听外部 task 变化
    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    // 更新任务属性的通用函数
    const updateTaskProperty = async (property, value, isToggle=true) => {
        const handler = updateHandlers[property];
        if (!handler) return;

        if(isToggle){
            const isSuccess = await handler(localTask.id);
            if (isSuccess) {
                const updatedTask = { ...localTask, [property]: value };
                setLocalTask(updatedTask);
                onUpdate?.(updatedTask);
            } else {
                Alert.alert('错误', "操作失败，请稍后再试。");
            }
        } else {
            const isSuccess = await handler(localTask.id, value);
            if (isSuccess) {
                const updatedTask = { ...localTask, [property]: value };
                setLocalTask(updatedTask);
                onUpdate?.(updatedTask);
            } else {
                Alert.alert('错误', "操作失败，请稍后再试。");
            }
        }
    };

    return (
        <View style={styles.taskRow}>
            {/* 状态 */}
            <TouchableOpacity style={styles.statusCell} onPress={() => updateTaskProperty('completed', !localTask.completed, true)}>
                {localTask.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                ) : (
                    <Ionicons name="ellipse" size={24} color="#D3D3D3" />
                )}
            </TouchableOpacity>

            {/* 标题 */}
            <View style={styles.titleCell}>
                <Text style={[styles.title, localTask.completed && styles.strikethrough]}>
                    {localTask.title}
                </Text>
            </View>

            {/* 截止日期 */}
            <Text style={styles.dueDateCell}>{localTask.dueDate}</Text>

            {/* 重要性 */}
            <TouchableOpacity style={styles.priorityCell} onPress={() => updateTaskProperty('important', !localTask.important, true)}>
                {localTask.important ? (
                    <Ionicons name="star" size={24} color="#FFD700" />
                ) : (
                    <Ionicons name="star-outline" size={24} color="#9B9B9B" />
                )}
            </TouchableOpacity>

            {/* 详情 */}
            <TouchableOpacity style={styles.detailCell} onPress={() => showDetail(localTask)}>
                <Ionicons name="information-circle-outline" size={24} color="#9B9B9B" />
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    // 表头样式
    headerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#616161',
        textAlign: 'center',
        paddingVertical: 8, // 统一内边距
        // borderWidth: 1,
    },
    // 表格行基础样式
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        // borderWidth: 1,
        paddingVertical: 20,
    },
    // 单元格样式
    statusCell: {
        flex: columns[0].flex,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleCell: {
        flex: columns[1].flex,
        marginLeft: 8,
    },
    dueDateCell: {
        flex: columns[2].flex,
        textAlign: 'center',
        color: '#616161',
        // borderWidth: 1,
    },
    priorityCell: {
        flex: columns[3].flex,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailCell: {
        flex: columns[4].flex,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { TaskItem, TaskHeader };
