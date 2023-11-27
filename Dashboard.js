import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [dropdownsOpen, setDropdownsOpen] = useState({
        closestDeadlineTask: false,
        lateTasks: false,
        totalTasks: false,
    });
    useEffect(() => {
        const db = getDatabase();
        const tasksRef = ref(db, '/tasks');
        onValue(tasksRef, (snapshot) => {
            const data = snapshot.val();
            const loadedTasks = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setTasks(loadedTasks);
        });
    }, []);

    useEffect(() => {
        // Initialize the dropdown state for each category
        const dropdownStates = categoryTotals.reduce((acc, catTotal) => {
            acc[catTotal.category] = false;
            return acc;
        }, {});
        setDropdownsOpen(dropdownStates);
    }, [categoryTotals]); // Rerun this effect when categoryTotals change

    // 1. Total tasks
    const totalTasks = tasks.length;

    // 2. Closest deadline
    const closestDeadlineTask = tasks
        .filter(task => new Date(task.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

    // Late tasks
    const lateTasks = tasks.filter(task => new Date(task.deadline) < new Date());

    // 4. Most common category
    const categoryCounts = tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});
    const mostCommonCategory = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b, '');

    // 5. Category totals
    const categoryTotals = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));

    // 6. Toggle Dropdown menu
    const toggleDropdown = (dropdownKey) => {
        setDropdownsOpen(prevState => ({
            ...prevState,
            [dropdownKey]: !prevState[dropdownKey]
        }));
    };

    const toggleCategoryDropdown = (category) => {
        setDropdownsOpen(prevState => ({
            ...prevState,
            [category]: !prevState[category]
        }));
    };

    return (
        <ScrollView style={styles.dashboardContainer}>
            <TouchableOpacity style={styles.dashboardCard} onPress={() => toggleDropdown('totalTasks')}>
                <Text style={styles.cardTitle}>Total Tasks</Text>
                <Text style={styles.cardContent}>{totalTasks}</Text>
            </TouchableOpacity>
                    {dropdownsOpen.totalTasks && (
                <View style={styles.dropdown}>
                    {tasks.map(task => (
                        <Text key={task.id} style={styles.dropdownItem}>
                            {task.name}
                        </Text>
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.dashboardCard} onPress={() => toggleDropdown('closestDeadlineTask')}>
                <Text style={styles.cardTitle}>Closest Deadline</Text>
                <Text style={styles.cardContent}>
                    {closestDeadlineTask ? new Date(closestDeadlineTask.deadline).toLocaleDateString() : 'None'}
                </Text>
            </TouchableOpacity>

            {dropdownsOpen.closestDeadlineTask && closestDeadlineTask && (
            <View style={styles.dropdown}>
                <Text style={styles.dropdownItem}>
                    Name: {closestDeadlineTask.name}
                </Text>
            </View>
        )}

            <TouchableOpacity style={styles.dashboardCard} onPress={() => toggleDropdown('lateTasks')}>
                <Text style={styles.cardTitle}>Late Tasks</Text>
                <Text style={styles.cardContent}>Count: {lateTasks.length}</Text>
            </TouchableOpacity>

            {dropdownsOpen.lateTasks && (
                <View style={styles.dropdown}>
                    {lateTasks.map(task => (
                        <Text key={task.id} style={styles.dropdownItem}>
                            {task.name}
                        </Text>
                    ))}
                </View>
            )}
            {categoryTotals.map((catTotal) => (
            <View style={styles.dashboardCard} key={catTotal.category}>
                <TouchableOpacity onPress={() => toggleCategoryDropdown(catTotal.category)}>
                    <Text style={styles.cardTitle}>{`Total ${catTotal.category} tasks`}</Text>
                    <Text style={styles.cardContent}>{catTotal.count}</Text>
                </TouchableOpacity>

                {dropdownsOpen[catTotal.category] && (
                    <View style={styles.dropdown}>
                        {tasks.filter(task => task.category === catTotal.category).map(task => (
                            <Text key={task.id} style={styles.dropdownItem}>
                                {task.name}
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        ))}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    dashboardContainer: {
        flex: 1,
        padding: 1,
    },

    lateTask: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    
    dropdown: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ddd',
        borderWidth: 1,
        marginTop: 5,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    dashboardCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 20,
        marginBottom: 10,
        shadowColor: '#81d4fa',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardContent: {
        fontSize: 16,
    },
});
export default Dashboard;
