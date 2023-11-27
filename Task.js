import React, { useState } from 'react';
import { View, Text, TextInput, Platform, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@rneui/base';
import { addTask, editTask, deleteTask } from './firebaseTasks';

const Task = ({ task, setEditingStates, editingStates }) => {
    if (!task) return null; 
    
    const [showDatePicker, setShowDatePicker] = useState(false);
    const isEditing = editingStates[task.id];
    const [editedName, setEditedName] = useState(task.name);
    const [editedPriority, setEditedPriority] = useState(task.priority.toString());
    const [editedDeadline, setEditedDeadline] = useState(new Date(task.deadline));
    const [selectedCategory, setSelectedCategory] = useState(task.category || 'Work');
    const [timeUsed, setTimeUsed] = useState(task.timeUsed.toString());
    const categories = ['Work', 'Study', 'Exercise', 'Leisure'];

    const handleEdit = () => {
        setEditingStates(prevStates => ({
            ...prevStates,
            [task.id]: true
        }));
    };

    const handleSave = () => {
        const updatedTask = {
            name: editedName,
            priority: parseInt(editedPriority, 10),
            deadline: editedDeadline.toISOString(),
            category: selectedCategory,
            timeUsed: parseInt(timeUsed, 10),
        };
        editTask(task.id, updatedTask);
        setEditingStates(prevStates => ({
            ...prevStates,
            [task.id]: false
        }));
    };

    const onChangeDeadline = (event, selectedDate) => {
        const currentDate = selectedDate || editedDeadline;
        setShowDatePicker(Platform.OS === 'ios', Platform.OS === 'android');
        setEditedDeadline(currentDate);
    };

    return (
        
        <View style={styles.task}>
            {isEditing ? (
                // Render editing form
                <View>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}>
                        {categories.map(category => (
                            <Picker.Item key={category} label={category} value={category} />
                        ))}
                    </Picker>
                    <TextInput 
                        style={styles.input} 
                        onChangeText={setEditedName} 
                        value={editedName}
                        placeholder="Nimi" // Placeholder for name
                    />
                    <TextInput 
                        style={styles.input}
                        onChangeText={text => setEditedPriority(text.replace(/[^0-9]/g, ''))} // Ensuring only numbers
                        value={editedPriority}
                        keyboardType="numeric"
                        placeholder="Prioriteetti" // Placeholder for priority
                    />
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setTimeUsed(text.replace(/[^0-9]/g, ''))} // Ensuring only numbers
                        value={timeUsed}
                        keyboardType="numeric"
                        placeholder="Aikaa käytetty"
                    />
                    <Button title="Aseta Deadline" onPress={() => setShowDatePicker(true)} />
                    {showDatePicker && (
                        <DateTimePicker
                            value={editedDeadline}
                            mode="date"
                            display="default"
                            onChange={onChangeDeadline}
                        />
                    )}
                    <Button title="Tallenna" onPress={() => handleSave(task.id)} />
                </View>
            ) : (
                // Render task display
                <View>
                    <Text style={styles.taskText}>Nimi: {task.name}</Text>
                    <Text style={styles.taskText}>Prioriteetti: {task.priority}</Text>
                    <Text style={styles.taskText}>Deadline: {new Date(task.deadline).toLocaleDateString()}</Text>
                    <Text style={styles.taskText}>Category: {task.category}</Text>
                    <Text style={styles.taskText}>Time Used: {task.timeUsed}</Text>
                    <Button title="Muokkaa" onPress={() => handleEdit(task.id)} />
                </View>
            )}
            <Button title="Poista" onPress={() => deleteTask(task.id)} />
        </View>
        
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 20,
        backgroundColor: '#eee',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,  // Reduced padding
        marginBottom: 10,
        borderRadius: 5,
        fontSize: 14,  // Adjust font size as needed
        height: 40,  // Set a fixed height
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    task: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    taskText: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Task;