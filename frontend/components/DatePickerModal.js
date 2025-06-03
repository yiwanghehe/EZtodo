// components/DatePickerModal.js
import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';

function formatDateTime(date, mode) {
    if (mode === 'date') {
        return date.toLocaleDateString('en-CA');
    } else if (mode === 'datetime') {
        return date.toISOString();
    }
}
function formatReminderDisplay(dateStr) {
    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// onDelete移除当前选择的日期(仅用于添加任务AddTaskForm组件)
const DatePickerModal = ({ visible, initialDate, onConfirm, onCancel, onDelete, mode="date", ...props }) => {

    // 根据 mode 调整日期对象
    function adjustDateByMode(date, mode) {
        if (mode === 'date') {
            const adjusted = new Date(date);
            adjusted.setHours(0, 0, 0, 0); // 清除时间部分
            return adjusted;
        }
        return new Date(date); // 保留原始时间
    }

    const [date, setDate] = useState(
        adjustDateByMode(initialDate || new Date(), mode)
    );

    // 监听 initialDate 变化并更新内部状态
    useEffect(() => {
        if (visible) {
            setDate(adjustDateByMode(initialDate || new Date(), mode));
        }
    }, [initialDate, visible, mode]); // 添加 mode 作为依赖项



    return (
        visible && (
            <View style={[styles.overlay, props.style]} pointerEvents="box-none">
                <View style={styles.container} pointerEvents="box-none">
                    <DatePicker
                        mode={mode}
                        date={date}
                        onDateChange={setDate}
                        locale="zh"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {onCancel();}}
                        >
                            <Text style={styles.cancelText}>取消</Text>
                        </TouchableOpacity>

                        { onDelete && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {onCancel();onDelete();}}
                            >
                                <Text style={styles.cancelText}>删除</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => onConfirm(formatDateTime(date, mode))}
                        >
                            <Text style={styles.confirmText}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
        borderTopWidth: 1,
        borderColor: '#F0F0F0',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    confirmText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    cancelText: {
        fontSize: 16,
        color: '#616161',
        fontWeight: '500',
    },
});

export default DatePickerModal;
export { formatReminderDisplay };
