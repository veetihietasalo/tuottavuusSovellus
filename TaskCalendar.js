import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { fetchTasks } from './firebaseTasks';

const TaskCalendar = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedDayTasks, setSelectedDayTasks] = useState([]);

    useEffect(() => {
        fetchTasks(setTasks); // Fetch tasks from firebase
    }, []);

    // Date formatting using moment
    const formatDate = (dateString) => {
        return moment(dateString).format('YYYY-MM-DD');
    };

    const markedDates = tasks.reduce((acc, task) => {
    const formattedDate = formatDate(task.deadline);
        acc[formattedDate] = { marked: true, dotColor: 'blue', activeOpacity: 0.5 };
            return acc;
    }, {});

    const handleDayPress = (day) => {
        const selectedDate = moment(day.dateString).format('DD/MM/YYYY');
        const tasksForSelectedDay = tasks.filter(task => 
            moment(task.deadline).format('DD/MM/YYYY') === selectedDate
        );
        setSelectedDayTasks(tasksForSelectedDay);
    };

    return (
        <View>
            <Calendar
                // Handler which gets executed on day press
                onDayPress={handleDayPress}
                markedDates={markedDates}
                
            />
            <View>
            {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map(task => (
                    <View key={task.id} style={styles.taskItem}>
                        <Text>{task.name}</Text>
                 
                    </View>
                ))
            ) : (
        <Text>No tasks for this day</Text>
    )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
    taskItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        
    },
    
});

export default TaskCalendar;