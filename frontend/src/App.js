import React, { useState, useEffect } from "react";

function App() {
	const [tasks, setTasks] = useState([]);
	const [text, setText] = useState("");
	const rootUrl = "http://localhost:15000";

	const loadTasks = async () => {
		const response = await fetch(`${rootUrl}/tasks`);
		if (!response.ok) {
			console.error("Failed to fetch tasks");
			return;
		}
		const data = await response.json();
		console.log("Loaded tasks:", data);
		setTasks(data);
	};

	useEffect(() => {
		loadTasks();
	}, []);

	const addTask = async () => {
		await fetch(`${rootUrl}/tasks`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text, completed: false }),
		});
		setText("");
		loadTasks();
	};

	const toggleTask = async (task) => {
		await fetch(`${rootUrl}/tasks/${task._id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...task, completed: !task.completed }),
		});
		loadTasks();
	};

	const deleteTask = async (id) => {
		await fetch(`${rootUrl}/tasks/${id}`, {
			method: "DELETE",
		});
		loadTasks();
	};

	return (
		<div
			style={{
				padding: "20px",
				maxWidth: "400px",
				margin: "40px auto",
				borderRadius: "10px",
				background: "#fdf8e9ff",
				boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
				fontFamily: "sans-serif",
			}}>
			{/* Header */}
			<h1 style={{ textAlign: "center", color: "#333" }}>✅ Todo List</h1>
			{/* Add Tasks */}
			<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
				<input
					type="text"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Enter a task..."
					style={{
						flex: 1,
						padding: "8px 12px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						outline: "none",
						fontSize: "14px",
					}}
				/>
				<button onClick={addTask}>Add Task</button>
			</div>
			{/* Tasks */}
			<ul>
				{tasks.map((task) => (
					<li
						key={task._id}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "8px 10px",
							marginBottom: "8px",
							background: "#fff",
							borderRadius: "5px",
							boxShadow: "1px 2px 4px rgba(0,0,0,0.2)",
						}}>
						<span
							style={{
								textDecoration: task.completed
									? "line-through"
									: "none",
								color: task.completed ? "green" : "red",
								flex: 1,
							}}>
							{task.text}
						</span>
						<input
							type="checkbox"
							checked={task.completed}
							onChange={() => toggleTask(task)}
							style={{ marginRight: "8px" }}
						/>
						<button
							onClick={() => deleteTask(task._id)}
							style={{
								background: "#e53935",
								color: "white",
								border: "none",
								padding: "4px 8px",
								borderRadius: "4px",
								cursor: "pointer",
							}}>
							❌
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
