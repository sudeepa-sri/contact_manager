import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './ToDoListPage.css';

function ToDoListPage() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const navigate = useNavigate(); // For navigation

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('http://localhost:5000/tasks');
            const data = await response.json();
            setTasks(data);
        };
        fetchTasks();
    }, []);

    const addTask = async () => {
        if (newTask.trim()) {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task_description: newTask,
                    status: 'Pending',
                }),
            });

            if (response.ok) {
                const newTaskData = await response.json();
                setTasks([...tasks, newTaskData]);
                setNewTask('');
            } else {
                console.error('Failed to add task');
            }
        }
    };

    const toggleTaskCompletion = async (taskId, status) => {
        const updatedStatus = status === 'Pending' ? 'Completed' : 'Pending';

        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: updatedStatus }),
        });

        if (response.ok) {
            setTasks(tasks.map(task => 
                task.task_id === taskId ? { ...task, status: updatedStatus } : task
            ));
        } else {
            console.error('Failed to update task');
        }
    };

    const deleteTask = async (taskId) => {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setTasks(tasks.filter(task => task.task_id !== taskId));
        } else {
            console.error('Failed to delete task');
        }
    };

    return (
        <div className="todo-page">
            <header className="todo-header">
                <div className="header-left">Contact Manager</div>
                <div className="header-right" onClick={() => navigate('/homepage')}>Home</div>
            </header>

            <div className="todo-content">
                <h2 className="todo-subheader">To-Do List</h2>
                <div className="task-input">
                    <input
                        type="text"
                        placeholder="Enter a new task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button onClick={addTask}>Add Task</button>
                </div>

                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Task Description</th>
                            <th>Progress</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.task_id}>
                                <td>{task.task_description}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'Completed'}
                                        onChange={() => toggleTaskCompletion(task.task_id, task.status)}
                                    />
                                </td>
                                <td>
                                    <button onClick={() => deleteTask(task.task_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ToDoListPage;



