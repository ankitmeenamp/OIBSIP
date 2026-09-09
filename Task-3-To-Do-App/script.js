const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");

const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

const pendingBadge = document.getElementById("pending-badge");
const completedBadge = document.getElementById("completed-badge");

const currentDay = document.getElementById("current-day");
const currentDate = document.getElementById("current-date");

const clearCompletedButton =
    document.getElementById("clear-completed");

const editModal =
    document.getElementById("edit-modal");

const editForm =
    document.getElementById("edit-form");

const editInput =
    document.getElementById("edit-input");

const closeModal =
    document.getElementById("close-modal");

const cancelEdit =
    document.getElementById("cancel-edit");


// STATE

let tasks =
    JSON.parse(localStorage.getItem("oibsip-tasks")) || [];

let editingTaskId = null;


// DATE

function updateDate() {

    const today = new Date();

    currentDay.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "long"
        });

    currentDate.textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


// LOCAL STORAGE

function saveTasks() {

    localStorage.setItem(
        "oibsip-tasks",
        JSON.stringify(tasks)
    );
}


// FORMAT TIME

function formatTaskTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
    });
}


// ADD TASK

function addTask(text) {

    const cleanText = text.trim();

    if (!cleanText) {
        showInputError();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: cleanText,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();
}


// DELETE TASK

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}


// TOGGLE TASK

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            const isCompleted = !task.completed;

            return {
                ...task,
                completed: isCompleted,
                completedAt: isCompleted
                    ? new Date().toISOString()
                    : null
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}


// EDIT TASK

function openEditModal(id) {

    const task = tasks.find(
        task => task.id === id
    );

    if (!task) {
        return;
    }

    editingTaskId = id;

    editInput.value = task.title;

    editModal.classList.remove("hidden");

    editModal.setAttribute(
        "aria-hidden",
        "false"
    );

    setTimeout(() => {
        editInput.focus();
        editInput.select();
    }, 50);
}


function closeEditModal() {

    editingTaskId = null;

    editModal.classList.add("hidden");

    editModal.setAttribute(
        "aria-hidden",
        "true"
    );

    editInput.value = "";
}


function updateTask(newTitle) {

    const cleanTitle = newTitle.trim();

    if (!cleanTitle) {
        editInput.focus();
        return;
    }

    tasks = tasks.map(task => {

        if (task.id === editingTaskId) {

            return {
                ...task,
                title: cleanTitle
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();

    closeEditModal();
}


// CLEAR COMPLETED
function clearCompletedTasks() {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();
}


// =========================
// RENDER TASK
// =========================

function createTaskElement(task) {

    const article = document.createElement("article");

    article.className =
        `task-item ${task.completed ? "completed" : ""}`;

    article.dataset.id = task.id;


    // Check button
    const checkButton =
        document.createElement("button");

    checkButton.className = "task-check";

    checkButton.type = "button";

    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as pending"
            : "Mark task as complete"
    );

    checkButton.textContent =
        task.completed ? "✓" : "";


    checkButton.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    // Task information
    const taskInfo =
        document.createElement("div");

    taskInfo.className = "task-info";


    const taskTitle =
        document.createElement("span");

    taskTitle.className = "task-title";

    taskTitle.textContent = task.title;


    const taskTime =
        document.createElement("span");

    taskTime.className = "task-time";

    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Completed ${formatTaskTime(task.completedAt)}`;

    } else {

        taskTime.textContent =
            `Added ${formatTaskTime(task.createdAt)}`;
    }


    taskInfo.appendChild(taskTitle);
    taskInfo.appendChild(taskTime);


    // Actions
    const actions =
        document.createElement("div");

    actions.className = "task-actions";


    // Edit
    const editButton =
        document.createElement("button");

    editButton.type = "button";

    editButton.className =
        "action-button";

    editButton.innerHTML = "✎";

    editButton.setAttribute(
        "aria-label",
        "Edit task"
    );

    editButton.addEventListener(
        "click",
        () => openEditModal(task.id)
    );


    // Delete
    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className =
        "action-button delete-button";

    deleteButton.innerHTML = "⌫";

    deleteButton.setAttribute(
        "aria-label",
        "Delete task"
    );

    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    article.appendChild(checkButton);
    article.appendChild(taskInfo);
    article.appendChild(actions);


    return article;
}

// EMPTY STATE

function createEmptyState(type) {

    const empty = document.createElement("div");

    empty.className = "empty-state";


    const icon =
        document.createElement("div");

    icon.className = "empty-icon";

    icon.textContent =
        type === "pending" ? "✓" : "○";


    const heading =
        document.createElement("h3");

    heading.textContent =
        type === "pending"
            ? "No pending tasks"
            : "Nothing completed yet";


    const message =
        document.createElement("p");

    message.textContent =
        type === "pending"
            ? "You're all caught up. Add a new task to get started."
            : "Completed tasks will appear here.";


    empty.appendChild(icon);
    empty.appendChild(heading);
    empty.appendChild(message);


    return empty;
}


// RENDER ALL TASKS
function renderTasks() {

    pendingList.innerHTML = "";
    completedList.innerHTML = "";


    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );

    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    // Pending
    if (pendingTasks.length === 0) {

        pendingList.appendChild(
            createEmptyState("pending")
        );

    } else {

        pendingTasks.forEach(task => {

            pendingList.appendChild(
                createTaskElement(task)
            );
        });
    }


    // Completed
    if (completedTasks.length === 0) {

        completedList.appendChild(
            createEmptyState("completed")
        );

    } else {

        completedTasks.forEach(task => {

            completedList.appendChild(
                createTaskElement(task)
            );
        });
    }


    // Counts
    pendingCount.textContent =
        pendingTasks.length;

    completedCount.textContent =
        completedTasks.length;

    pendingBadge.textContent =
        pendingTasks.length;

    completedBadge.textContent =
        completedTasks.length;
}


// INPUT ERROR

function showInputError() {

    taskInput.focus();

    taskInput.style.borderColor =
        "#dc2626";

    setTimeout(() => {

        taskInput.style.borderColor =
            "";

    }, 1200);
}


// =========================
// EVENTS
// =========================

taskForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        addTask(taskInput.value);
    }
);


editForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        updateTask(editInput.value);
    }
);


closeModal.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


clearCompletedButton.addEventListener(
    "click",
    clearCompletedTasks
);


// Close modal by clicking outside
editModal.addEventListener(
    "click",
    event => {

        if (event.target === editModal) {
            closeEditModal();
        }
    }
);


// Keyboard shortcuts
document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !editModal.classList.contains("hidden")
        ) {
            closeEditModal();
        }
    }
);

// INITIALIZE

updateDate();

renderTasks();

taskInput.focus();