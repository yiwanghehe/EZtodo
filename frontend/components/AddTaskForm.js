import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import FeatureIcon from "./FeatureIcon";
import apiImpl from "./apiImpl";
import DatePickerModal, {formatReminderDisplay} from "./DatePickerModal";

const AddTaskForm = ({onUpdate}) => {
    const [task, setTask] = useState('');
    const [dueDate, setDueDate] = useState(null);
    const [reminder, setReminder] = useState(null);
    const [repeatRule, setRepeatRule] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);
    const [showReminderPicker, setShowReminderPicker] = useState(false);

    const addTaskToBackend = async () => {
        if (!task.trim()) {
            Alert.alert('输入错误', '任务内容不能为空');
            return;
        }
        const taskCreationRequest = {
            title: task.trim(),
            dueDate: dueDate,
            reminderAt: reminder,
            repeatRule: null,
        }
        if (!taskCreationRequest) return;
        setLoading(true);

        apiImpl.createTask(taskCreationRequest).then(res => {
            setLoading(false);
            if (res && res.code === 201) {
                onUpdate(res.data); // 回调任务给父组件
                setTask(''); // 清空输入框
                setDueDate(null); // 清空日期选择
                setReminder(null); // 清空提醒选择
            }
        })
    };


    return (
        <View style={styles.container}>
            {/* 输入框和按钮横向排列 */}
            <View style={styles.formRow}>
                <Ionicons name={"document-text-outline"} size={24} color={'#3498db'} />
                <TextInput
                    placeholder="添加任务"
                    value={task}
                    onChangeText={setTask}
                    style={styles.input}
                />
                <Button
                    title={loading ? '添加中...' : '添加'}
                    onPress={addTaskToBackend}
                    disabled={loading}
                />
            </View>

            {/* 功能图标栏：纵向排列在按钮下方 */}
            <View style={styles.iconBar}>
                <FeatureIcon
                    name="calendar-outline"
                    label= {dueDate ? dueDate : "添加截止日期"}
                    onPress={() => setShowDueDatePicker(true)}
                />
                <FeatureIcon
                    name="notifications-circle-outline"
                    label={reminder ? formatReminderDisplay(reminder) : "提醒我"}
                    onPress={() => setShowReminderPicker(true)}
                />
                <FeatureIcon
                    name="repeat-outline"
                    label="重复"
                />
            </View>
            { /* 截止日期选择器 */}
            <DatePickerModal
                visible={showDueDatePicker}
                initialDate={dueDate}
                onConfirm={(date) => {
                    setShowDueDatePicker(false);
                    setDueDate(date);
                }}
                onCancel={() => setShowDueDatePicker(false)}
                onDelete={() => setDueDate(null)}
                style={styles.datePickerModal}
            />
            { /* 提醒时间选择器 */}
            <DatePickerModal
                visible={showReminderPicker}
                initialDate={reminder}
                onConfirm={(date) => {
                    setShowReminderPicker(false);
                    setReminder(date);
                }}
                onCancel={() => setShowReminderPicker(false)}
                onDelete={() => setReminder(null)}
                mode="datetime"
                style={styles.datePickerModal}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        // borderWidth: 1, // 调试用
        // borderColor: 'red'
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 10,
    },
    input: {
        height: 50,
        flex: 1,
        marginHorizontal: 10,
        fontSize: 16,
        color: '#000000',
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        paddingVertical: 8,
    },
    iconBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        paddingBottom: 10,
        marginBottom: 20,
    },
    datePickerModal: {
        flex: 1,
        width: '100%',
        height: '80%',
        padding: 20,
    }

});

export default AddTaskForm;
