import { getDatabase, ref, set, push, remove, onValue } from 'firebase/database';
import { demoMode } from './firebaseConfig';
import localList from './localList';

// Firebase when it's configured, the local list in demo mode. The functions are the same either way.

const toTaskList = (data) => (data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);

export const addTask = (tasks) => {
    const newTask = {
        name: `Tehtävä ${tasks.length + 1}`,
        priority: 1, // Oletusprioriteetti
        deadline: new Date().toISOString(), // Oletusmääräaika
        category: 'Work',
        timeUsed: 3
    };
    if (demoMode) {
        localList.push(newTask);
        return;
    }
    const db = getDatabase();
    push(ref(db, '/tasks'), newTask);
}; 

export const editTask = (id, updatedTask) => {
    const saved = demoMode
        ? localList.set(id, updatedTask)
        : set(ref(getDatabase(), '/tasks/' + id), updatedTask);
    saved
        .then(() => {
            console.log("Task updated successfully!");
        })
        .catch((error) => {
            console.error("Error updating task: ", error);
        });
};

export const deleteTask = id => {
    if (demoMode) {
        localList.remove(id);
        return;
    }
    const db = getDatabase();
    remove(ref(db, '/tasks/' + id));
};

// Returns the unsubscribe function, so callers can return it from useEffect.
export const fetchTasks = (setTasks) => {
    if (demoMode) {
        return localList.onValue((data) => setTasks(toTaskList(data)));
    }
    const db = getDatabase();
    const tasksRef = ref(db, '/tasks');

    return onValue(tasksRef, (snapshot) => {
        setTasks(toTaskList(snapshot.val()));
    }, (error) => {
        console.error("Error fetching tasks: ", error);
    });
};
