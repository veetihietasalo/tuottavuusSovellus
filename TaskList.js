import React, { useState, useEffect } from 'react';
import { FlatList, Text } from 'react-native';
import Task from './Task';
import { fetchTasks } from './firebaseTasks';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingStates, setEditingStates] = useState({});

    useEffect(() => {
        fetchTasks(setTasks);
    }, []);

    if (!tasks.length) {
        return <Text>No tasks available</Text>;
    }

    return (
        <FlatList
            data={tasks}
            renderItem={({ item }) => (
                <Task 
                    key={item.id}
                    task={item}
                    editingStates={editingStates}
                    setEditingStates={setEditingStates} 
                />
    )}
            keyExtractor={item => item.id}
        />
    );
};

export default TaskList;
