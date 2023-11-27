import { getDatabase, ref, set, push, remove, onValue } from 'firebase/database';

export const addTask = (tasks, setTasks) => {
    const db = getDatabase();
    const newTask = {
        name: `Tehtävä ${tasks.length + 1}`,
        priority: 1, // Oletusprioriteetti
        deadline: new Date().toISOString(), // Oletusmääräaika
        category: 'Work',
        timeUsed: 3
    };
    push(ref(db, '/tasks'), newTask);
}; 

export const editTask = (id, updatedTask) => {
    const db = getDatabase();
    const taskRef = ref(db, '/tasks/' + id);
        set(taskRef, updatedTask)
            .then(() => {
                console.log("Task updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating task: ", error);
            });
    };

export const deleteTask = id => {
    const db = getDatabase();
    remove(ref(db, '/tasks/' + id));
};

export const fetchTasks = (setTasks) => {
    const db = getDatabase();
    const tasksRef = ref(db, '/tasks');

    onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        const loadedTasks = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        setTasks(loadedTasks);
    }, (error) => {
        console.error("Error fetching tasks: ", error);
    });
};