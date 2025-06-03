import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import apiImpl from "./apiImpl";
import DatePickerModal, {formatReminderDisplay} from "./DatePickerModal";

const handleToggleMyDay = async (taskId) => {
    const res = await apiImpl.updateTaskMyDayStatus(taskId);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleToggleComplete = async (taskId) => {
    const res = await apiImpl.updateTaskCompletionStatus(taskId);
    if(res && res.code === 200) {
        return true;
    }
    return false;

};
const handleMarkImportant = async (taskId) => {
    const res = await apiImpl.updateTaskImportanceStatus(taskId);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleUpdateTaskDueDate = async (taskId, date) => {
    const res = await apiImpl.updateTaskDueDate(taskId, date);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleDeleteTask = async (taskId) => {
    const res = await apiImpl.deleteTask(taskId);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleDeleteTaskDueDate = async (taskId) => {
    const res = await apiImpl.deleteTaskDueDate(taskId);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleDeleteTaskReminder = async (taskId) => {
    const res = await apiImpl.deleteTaskReminder(taskId);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleUpdateTaskNotes = async (taskId, notes) => {
    const res = await apiImpl.updateTaskNotes(taskId, notes);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const handleUpdateTaskReminder = async (taskId, reminderAt) => {
    const res = await apiImpl.updateTaskReminder(taskId, reminderAt);
    if(res && res.code === 200) {
        return true;
    }
    return false;
}

const updateHandlers = {
    'myDay' : handleToggleMyDay,
    'completed': handleToggleComplete,
    'important': handleMarkImportant,
    'dueDate': handleUpdateTaskDueDate,
    'notes': handleUpdateTaskNotes,
    'reminderAt': handleUpdateTaskReminder,
};

const deleteHandlers = {
    'dueDate': handleDeleteTaskDueDate,
    'reminderAt': handleDeleteTaskReminder,
}

const TaskDetail = ({ task,  onClose, onUpdate}) => {
    const [localTask, setLocalTask] = useState(task);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [showReminderPicker, setShowReminderPicker] = useState(false);
    const [noteTimer, setNoteTimer] = useState(null); // 输入防抖机制


    // 使用 useEffect 同步外部 task 变化
    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    // 更新任务属性的通用函数, isToggle 用于判断是否是切换状态(如完成状态或重要性就是切换状态，不需要传递值给后端)
    const updateTaskProperty = async (property, value, isToggle) => {
        const handler = updateHandlers[property];
        if (!handler) return;

        if(isToggle) {
            const isSuccess = await handler(localTask.id);
            if (isSuccess) {
                const updatedTask = { ...localTask, [property]: value };
                setLocalTask(updatedTask);
                onUpdate?.(updatedTask); // 调用回调传递更新后的任务
            } else {
                Alert.alert('错误', "操作失败，请稍后再试。");
            }
        } else {
            const isSuccess = await handler(localTask.id, value);
            if (isSuccess) {
                const updatedTask = { ...localTask, [property]: value };
                setLocalTask(updatedTask);
                onUpdate?.(updatedTask); // 调用回调传递更新后的任务
            } else {
                Alert.alert('错误', "操作失败，请稍后再试。");
            }
        }
    };

    const deleteTaskProperty = async (property) => {
        // 根据属性名生成提示信息
        const propertyNameMap = {
            dueDate: '截止日期',
            reminderAt: '提醒时间',
        };

        const propertyName = propertyNameMap[property] || '该属性';

        Alert.alert(
            '确认删除',
            `确定要删除 ${propertyName} 吗？`,
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '确定',
                    onPress: async () => {
                        const handler = deleteHandlers[property];
                        if (!handler) return;

                        const isSuccess = await handler(localTask.id);
                        if (isSuccess) {
                            const updatedTask = { ...localTask, [property]: '' };
                            setLocalTask(updatedTask);
                            onUpdate?.(updatedTask); // 通知父组件更新
                        } else {
                            Alert.alert('错误', '操作失败，请稍后再试。');
                        }
                    }
                }
            ],
            {
                cancelable: true
            }
        );
    }

    const deleteTask = async () => {
        Alert.alert(
            '确认删除',
            `确定要删除任务"${localTask.title}"吗？`,
            [
                {
                    text: '取消',
                    style: 'cancel'
                },
                {
                    text: '确定',
                    onPress: async () => {
                        const isSuccess = await handleDeleteTask(localTask.id);
                        if (isSuccess) {
                            onClose?.(); // 关闭详情
                            onUpdate?.(null); // 通知父组件任务已删除
                        } else {
                            Alert.alert('错误', "删除任务失败，请稍后再试。");
                        }
                    }
                }
            ],
            {
                cancelable: true
            }
        );
    }


    return (
        <View style={styles.modalOverlay} onPress={onClose}>
            {/* 关闭按钮 */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
            >
                <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>

            <ScrollView style={styles.modalContent}>
                <View style={styles.header}>
                    {/* 完成状态 */}
                    <TouchableOpacity
                        onPress={() => updateTaskProperty('completed', !localTask.completed, true)}
                        style={styles.completionStatus}
                    >
                        {localTask.completed ? (
                            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                        ) : (
                            <Ionicons name="ellipse" size={24} color="#D3D3D3" />
                        )}
                    </TouchableOpacity>

                    {/* 星标重要性 */}
                    <TouchableOpacity
                        onPress={() => updateTaskProperty('important', !localTask.important, true)}
                        style={styles.importanceStatus}
                    >
                        <Ionicons
                            name={localTask.important ? "star" : "star-outline"}
                            size={24}
                            color={localTask.important ? "#FFD700" : "#9B9B9B"}
                        />
                    </TouchableOpacity>
                </View>

                {/* 任务标题 */}
                <Text style={styles.title}>{localTask.title}</Text>

                {/* 添加步骤按钮 */}
                <TouchableOpacity style={styles.actionItem} onPress={() => console.log('添加步骤')}>
                    <Ionicons name="add-circle" size={24} color="#007AFF" />
                    <Text style={styles.actionText}>添加步骤</Text>
                </TouchableOpacity>

                {/* 功能选项 */}
                <View style={styles.optionsContainer}>
                    {/* 添加到“我的一天” */}
                    <TouchableOpacity style={styles.optionItem} onPress={() => updateTaskProperty('myDay', !localTask.myDay, true)}>
                        <Ionicons
                            name="sunny"
                            size={24}
                            color={localTask.myDay ? '#007AFF' : '#9B9B9B'}
                        />
                        <Text style={[
                            styles.optionText,
                            localTask.myDay ? { color: '#007AFF' } : null
                        ]}>
                            {localTask.myDay ?
                                `已添加到“我的一天”` :
                                '添加到“我的一天”'}
                        </Text>
                    </TouchableOpacity>

                    {/* 提醒我 */}
                    <TouchableOpacity style={styles.optionItem} onPress={() => setShowReminderPicker(true)}>
                        <Ionicons
                            name="alarm"
                            size={24}
                            color={localTask.reminderAt ? '#007AFF' : '#9B9B9B'} />
                        <Text style={[
                            styles.optionText,
                            localTask.reminderAt ? { color: '#007AFF' } : null
                        ]}>
                            {localTask.reminderAt ?
                                `提醒时间: ${formatReminderDisplay(localTask.reminderAt)}` :
                                '提醒我'}
                        </Text>
                        {localTask.reminderAt && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteTaskProperty('reminderAt')}
                            >
                                <Ionicons name="trash" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    {/* 截止日期 */}
                    <TouchableOpacity style={styles.optionItem} onPress={() => setShowDueDatePicker(true)}>
                        <Ionicons
                            name="calendar"
                            size={24}
                            color={localTask.dueDate ? '#007AFF' : '#9B9B9B'}
                        />
                        <Text style={[
                            styles.optionText,
                            localTask.dueDate ? { color: '#007AFF' } : null
                        ]}>
                            {localTask.dueDate ?
                                `截止日期: ${localTask.dueDate}` :
                                '添加截止日期'}
                        </Text>
                        {localTask.dueDate && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => deleteTaskProperty('dueDate')}
                            >
                                <Ionicons name="trash" size={24} color="#FF3B30" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem} onPress={() => console.log('设置重复')}>
                        <Ionicons name="repeat" size={24} color="#9B9B9B" />
                        <Text style={styles.optionText}>重复</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem} onPress={() => console.log('选择类别')}>
                        <Ionicons name="pricetags" size={24} color="#9B9B9B" />
                        <Text style={styles.optionText}>选择类别</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem} onPress={() => console.log('添加文件')}>
                        <Ionicons name="attach" size={24} color="#9B9B9B" />
                        <Text style={styles.optionText}>添加文件</Text>
                    </TouchableOpacity>

                    {/* 删除任务 */}
                    <TouchableOpacity style={styles.optionItem} onPress={() => deleteTask()}>
                        <Ionicons name="trash" size={24} color="#9B9B9B" />
                        <Text style={styles.optionText}>删除任务</Text>
                    </TouchableOpacity>
                </View>

                {/* 备注区域 */}
                <View style={styles.notesSection}>
                    <Text style={styles.notesLabel}>添加备注</Text>
                    <TextInput
                        multiline
                        style={styles.notesInput}
                        placeholder="在此输入备注..."
                        value={localTask.notes || ''}
                        onChangeText={(text) => {
                            // 即时更新本地状态保证输入流畅
                            setLocalTask(prev => ({ ...prev, notes: text }));

                            // 清除之前的定时器
                            if (noteTimer) clearTimeout(noteTimer);

                            // 创建新定时器（500ms防抖）
                            const timer = setTimeout(async () => {
                                await updateTaskProperty('notes', text, false);
                            }, 500);
                            setNoteTimer(timer);
                        }}
                    />
                </View>

                {/* 截止日期选择器 */}
                <DatePickerModal
                    visible={showDueDatePicker}
                    initialDate={localTask.dueDate}
                    onConfirm={(date) => {
                        setShowDueDatePicker(false);
                        updateTaskProperty('dueDate', date, false);
                        }}
                    onCancel={() => setShowDueDatePicker(false)}
                />
                {/* 提醒时间选择器 */}
                <DatePickerModal
                    visible={showReminderPicker}
                    initialDate={localTask.reminderAt}
                    onConfirm={(date) => {
                        setShowReminderPicker(false);
                        updateTaskProperty('reminderAt', date, false);
                    }}
                    onCancel={() => setShowReminderPicker(false)}
                    mode='datetime'
                />

            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        maxHeight: '90%',
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    completionStatus: {
        marginRight: 16,
    },
    importanceStatus: {
        marginLeft: 'auto',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    actionText: {
        marginLeft: 8,
        color: '#007AFF',
        fontSize: 16,
    },
    optionsContainer: {
        marginTop: 16,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    optionText: {
        marginLeft: 8,
        color: '#616161',
        fontSize: 16,
    },
    notesSection: {
        marginTop: 24,
    },
    notesLabel: {
        fontSize: 16,
        color: '#616161',
        marginBottom: 8,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        minHeight: 60,
        marginBottom: 80,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,            // 设置固定宽度
        height: 32,           // 设置固定高度
        borderRadius: 16,     // 宽高的一半，形成圆形
        backgroundColor: '#007AFF', // 蓝色背景
        justifyContent: 'center',   // 垂直居中
        alignItems: 'center',       // 水平居中
    },
    deleteButton: {
        marginLeft: 8,
        padding: 4,
        alignSelf: 'center', // 垂直居中
    }

});

export default React.memo(TaskDetail);
export { updateHandlers }; // 导出处理函数和对象
