import React, { useContext, useState } from "react";
import { CategoriesContext } from "../../Context/CategoriesContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck, faEdit, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

function Tasklists() {
  const { categories, setCategories, activeCategoryId } = useContext(CategoriesContext);
  const [newTaskName, setNewTaskName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [show, setShow] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false); // État pour afficher/masquer les tâches accomplies

  // Ajouter une nouvelle tâche
  const addTask = () => {
    if (!newTaskName.trim() || !activeCategoryId) {
      alert("Le nom de la tâche ne peut pas être vide.");
      return;
    }

    setCategories((prevCategories) =>
      prevCategories.map((cat) => {
        if (cat.id === activeCategoryId) {
          const newTask = {
            id: (cat.tasks ? cat.tasks.length : 0) + 1,
            name: newTaskName.trim(),
            completed: false,
          };
          return { ...cat, tasks: [...(cat.tasks || []), newTask] };
        }
        return cat;
      })
    );
    setNewTaskName("");
  };

  // Basculer l'état "completed" d'une tâche
  const toggleTaskCompletion = (taskId) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => {
        if (cat.id === activeCategoryId) {
          return {
            ...cat,
            tasks: cat.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          };
        }
        return cat;
      })
    );
  };

  // Débuter la modification d'une tâche
  const startEditing = (taskId, currentName) => {
    setEditingTaskId(taskId);
    setEditingTaskName(currentName);
  };

  // Sauvegarder les modifications d'une tâche
  const saveTask = () => {
    if (!editingTaskName.trim()) {
      alert("Le nom de la tâche ne peut pas être vide.");
      return;
    }

    setCategories((prevCategories) =>
      prevCategories.map((cat) => {
        if (cat.id === activeCategoryId) {
          return {
            ...cat,
            tasks: cat.tasks.map((task) =>
              task.id === editingTaskId ? { ...task, name: editingTaskName.trim() } : task
            ),
          };
        }
        return cat;
      })
    );
    setEditingTaskId(null);
    setEditingTaskName("");
  };

  // Supprimer une tâche
  const deleteTask = (taskId) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) => {
        if (cat.id === activeCategoryId) {
          return {
            ...cat,
            tasks: cat.tasks.filter((task) => task.id !== taskId),
          };
        }
        return cat;
      })
    );
  };

  // Récupérer la catégorie active
  const activeCategory = categories.find((cat) => cat.id === activeCategoryId);

  // Trier les tâches : non terminées en premier
  const sortedTasks = activeCategory?.tasks
    ? [...activeCategory.tasks].sort((a, b) => a.completed - b.completed)
    : [];

  // Séparer les tâches terminées et non terminées
  const incompleteTasks = sortedTasks.filter((task) => !task.completed);
  const completedTasks = sortedTasks.filter((task) => task.completed);

  return (
    <div className="tasklist-container">
      {activeCategory ? (
        <>
          <div className="title">
            <h1>{activeCategory.name}</h1>
            <button onClick={() => setShow(!show)}>
              {show ? (
                <FontAwesomeIcon icon={faMinus} size="lg" />
              ) : (
                <FontAwesomeIcon icon={faPlus} size="lg" />
              )}
            </button>
          </div>
          {show && (
            <div className="addTaskInput">
              <input
                type="text"
                placeholder="Ajouter une tâche"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <button onClick={addTask}>
                <FontAwesomeIcon icon={faSquareCheck} size="2xl" />
              </button>
            </div>
          )}
          <ul>
            {incompleteTasks.map((task) => (
              <li key={task.id}>
                {editingTaskId === task.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingTaskName}
                      onChange={(e) => setEditingTaskName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && saveTask()}
                    />
                    <button onClick={saveTask}>
                      <FontAwesomeIcon icon={faSquareCheck} size="lg" />
                    </button>
                  </div>
                ) : (
                  <div className="task-item">
                    <div className="task-info">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                      />
                      <p>{task.name}</p>
                    </div>
                    <div className="task-actions">
                      <button onClick={() => startEditing(task.id, task.name)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button onClick={() => deleteTask(task.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {completedTasks.length > 0 && ( // Affiche uniquement si des tâches terminées existent
            <button
              className="toggle-completed"
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Masquer les tâches accomplies" : "Afficher les tâches accomplies"}
            </button>
          )}
          {showCompleted && completedTasks.length > 0 && (
            <ul className="completed-tasks">
              {completedTasks.map((task) => (
                <li key={task.id}>
                  <div className="task-item">
                    <div className="task-info">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                      />
                      <p style={{ textDecoration: "line-through" }}>{task.name}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Aucune catégorie active. Veuillez en sélectionner une.</p>
      )}
    </div>
  );
}

export default Tasklists;
