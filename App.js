import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { Button } from '@rneui/base';
import AppNavigator from './AppNavigator';
import firebaseConfig from './firebaseConfig';
import { addTask, fetchTasks } from './firebaseTasks';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App = () => {
    
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks(setTasks);
    }, []);    

    return (
        
        <View style={ styles.container }> 
            <Button title="Add Task" onPress={addTask} />    
            {<AppNavigator/>}
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 10,
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

export default App;
