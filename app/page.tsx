"use client";
import { useState, useEffect } from "react";
import { Container, Typography, List, Box } from "@mui/material";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import SearchForm from "./components/SearchForm";
import SearchItem from "./components/SearchItem";



type TaskProp = {
  id: number,
  text: string,
  completed: boolean,
  // onEdit: (input: String) => void,
  // onDelete: (input: String) => void,
  // onComplete: (input: String) => void,
}


export default function Home() {
  const [tasks, setTasks] = useState<TaskProp[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskProp[]>([]);



  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskText) => {
    const newTask = { id: Date.now(), text: taskText, completed: false };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed, id: Date.now() } : task
      )
    );
  };

  const editTask = (taskId) => {
    const newText = prompt("Edit task");
    if (newText) {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, text: newText, } : task
        )
      );
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.length != 0) {
      // get completed tasks
      let completedTasks = tasks.filter(({ completed }) => completed);
      let pendingTasks = tasks.filter(({ completed }) => !completed);
      // search for searchTerm through completedTasks
      let matchedTasks = completedTasks.filter(({ text }) => text.includes(searchTerm));
      setFilteredTasks(matchedTasks);
    } else {
      setFilteredTasks([]);
    }
  }

  const undoCompleted = (taskId: number) => {
    const confirmMessage = prompt("Type yes to undo completed task", "no");

    if (confirmMessage.trim().toLocaleLowerCase() === "yes") {
      setTasks((prevTasks) => prevTasks.map((task) => {
        if (task.id == taskId) {
          return { ...task, completed: !task.completed };
        }
        return task;
      }))
    }
  }


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "80vh",
        paddingTop: "50px",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Pending Tasks
        </Typography>
        <Box
          sx={{
            minHeight: "80vh",
            padding: "20px",
          }}
        >
          <TaskForm onAdd={addTask} />
          <List>
            {tasks.filter(({ completed }) => !completed).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onComplete={toggleComplete}
                onEdit={editTask}
              />
            ))}
          </List>
        </Box>
      </Container>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Completed
        </Typography>

        <Box
          sx={{
            backgroundColor: "#FFE9E4",
            minHeight: "80vh",
            padding: "20px",
          }}
        >
          {/* <SearchForm onSearch={addTask} /> */}
          <SearchForm onSearch={handleSearch} />
          <List>
            {(filteredTasks.length != 0 ? filteredTasks : tasks.filter(({ completed }) => completed)).map((task) => (
              <SearchItem key={task.id} task={task} onEdit={undoCompleted} />
              // <SearchItem key={task.id} task={task} onEdit={editTask} />
            ))}
          </List>
        </Box>
      </Container>
    </Box>
  );
}
