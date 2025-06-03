import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import AddTaskForm from '../components/AddTaskForm';
import apiImpl from '../components/apiImpl';
import { TaskItem, TaskHeader } from '../components/TaskItem';
import {useFocusEffect} from "@react-navigation/native";
import TaskDetail from "../components/TaskDetail";


const TaskScreen = () => {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false); // 刷新任务列表

    const showTasks = async (isRefresh = false) => {
        if (isRefresh) setIsRefreshing(true);

        try {
            const res = await apiImpl.getMyTasks();
            if(res?.code === 200) {
                setTasks(res.data);
            } else {
                setTasks([]);
            }
        } finally {
            if (isRefresh) setIsRefreshing(false);
        }
    }


    useFocusEffect(
        React.useCallback(() => {showTasks(true)}, [])
    );

    return (
        <View style={styles.container}>
            {/* 添加任务表单 */}
            <AddTaskForm onUpdate={(newTask) => {
                if (newTask) {setTasks(prevTasks => [...prevTasks, newTask]);}
            }}/>

            {/* 表头 */}
            <TaskHeader />

            {/* 任务列表 */}
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => showTasks(true)}
                        colors={['#007AFF']}
                    />
                }
            >
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        showDetail={(task) => setSelectedTask(task)}
                        onUpdate={(updatedTask) => {
                            setTasks(prevTasks =>
                                prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                            );
                        }}
                    />
                ))}
            </ScrollView>

            {/* 全局 TaskDetail 弹窗 */}
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={(updatedTask) => {
                        if (updatedTask) {
                            // 更新已有任务
                            setTasks(prevTasks =>
                                prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                            );
                        } else {
                            // 删除任务时，从数组中过滤掉该任务 ID
                            setTasks(prevTasks =>
                                prevTasks.filter(t => t.id !== selectedTask.id)
                            );
                            setSelectedTask(null);
                        }
                    }}
                />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff',
    },

});

export default TaskScreen;
