document.addEventListener("DOMContentLoaded", function() {
    loadTasks();
    document.getElementById("addTask").addEventListener("click", addTask);
    document.getElementById("calculateGPA").addEventListener("click", calculateGPA);
});
// To-Do List Section

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let task = taskInput.value.trim();

    if (task) {
        addTaskToTable(task);
        saveTask(task);
        taskInput.value = "";
    }
}

function addTaskToTable(task) {
    let taskList = document.getElementById("taskList");
    let row = document.createElement("tr");

    let indexCell = document.createElement("td");
    indexCell.textContent = taskList.children.length + 1;

    let taskCell = document.createElement("td");
    taskCell.textContent = task;

    let actionCell = document.createElement("td");

    // Create the 'Done' button
    let doneBtn = document.createElement("button");
    doneBtn.textContent = "✔️";
    doneBtn.classList.add("btn", "btn-success", "btn-sm");
    doneBtn.addEventListener("click", function() {
        toggleDone(taskCell, doneBtn);
    });

    // Create the 'Delete' button
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
    deleteBtn.addEventListener("click", function() {
        row.remove();
        removeTask(task);
        updateIndexes();
    });

    actionCell.appendChild(doneBtn);
    actionCell.appendChild(deleteBtn);
    row.appendChild(indexCell);
    row.appendChild(taskCell);
    row.appendChild(actionCell);
    taskList.appendChild(row);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ task: task, completed: false });  // Save task with completion status
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function(taskObj) {
        addTaskToTable(taskObj.task);
        if (taskObj.completed) {
            markTaskAsDone(taskObj.task);
        }
    });
}

function removeTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let updatedTasks = tasks.filter(t => t.task !== task);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function updateIndexes() {
    let rows = document.querySelectorAll("#taskList tr");
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Function to toggle task completion status
function toggleDone(taskCell, doneBtn) {
    let isDone = taskCell.classList.contains("done");
    if (isDone) {
        taskCell.classList.remove("done");
        doneBtn.textContent = "✔️"; // Reset to 'Done' button
    } else {
        taskCell.classList.add("done");
        doneBtn.textContent = "✅"; // Change to 'Checked' button
    }
    saveTaskStatus(taskCell.textContent, isDone);
}

// Mark task as done in the UI
function markTaskAsDone(task) {
    let taskList = document.getElementById("taskList");
    for (let row of taskList.rows) {
        if (row.cells[1].textContent === task) {
            row.cells[1].classList.add("done");
        }
    }
}

// Save task completion status in local storage
function saveTaskStatus(task, isDone) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let updatedTasks = tasks.map(t => {
        if (t.task === task) {
            t.completed = !isDone;  // Toggle completion
        }
        return t;
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}


// ..................................
// GPA Calculator Section
function calculateGPA() {
    let scores = [
        {score: document.getElementById("scoreCSI101").value, credits: 3},
        {score: document.getElementById("scoreCSI102").value, credits: 3},
        {score: document.getElementById("scoreCSI203").value, credits: 3},
        {score: document.getElementById("scoreCSI204").value, credits: 3},
        {score: document.getElementById("scoreCSI305").value, credits: 3}
    ];

    let totalCredits = 0;
    let totalPoints = 0;

    for (let course of scores) {
        let score = parseFloat(course.score);

        // Validate input (1-100 range)
        if (isNaN(score) || score < 0 || score > 100) {
            document.getElementById("gpaResult").textContent = "Please enter a valid score between 0 and 100.";
            return;
        }

        // GPA calculation based on score
        if (score >= 90) {
            totalPoints += score * 4; // A grade
        } else if (score >= 80) {
            totalPoints += score * 3; // B grade
        } else if (score >= 70) {
            totalPoints += score * 2; // C grade
        } else if (score >= 60) {
            totalPoints += score * 1; // D grade
        } else {
            totalPoints += score * 0; // F grade
        }
        totalCredits += course.credits;
    }

    let gpa = totalPoints / totalCredits;
    document.getElementById("gpaResult").textContent = gpa.toFixed(2);
}

// ..........................................

document.addEventListener("DOMContentLoaded", fetchUserData);

function fetchUserData() {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(data => displayUserData(data))
        .catch(error => console.log(error));
}

function displayUserData(users) {
    let userTable = document.getElementById("userTable");
    users.forEach(user => {
        let row = document.createElement("tr");
        
        let nameCell = document.createElement("td");
        nameCell.textContent = user.name;

        let emailCell = document.createElement("td");
        emailCell.textContent = user.email;

        let addressCell = document.createElement("td");
        addressCell.textContent = `${user.address.street}, ${user.address.city}`;
        
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(addressCell);

        userTable.appendChild(row);
    });
}

// ..................................

document.getElementById("generateLottery").addEventListener("click", function() {
    let lotteryNumber = generateLotteryNumber();
    let userGuess = document.getElementById("lotteryGuess").value;

    if (userGuess === "") {
        document.getElementById("lotteryResult").textContent = "Please enter a guess!";
        return;
    }

    if (userGuess == lotteryNumber) {
        document.getElementById("lotteryResult").textContent = `Congratulations! You guessed the correct number: ${lotteryNumber}`;
    } else {
        document.getElementById("lotteryResult").textContent = `Sorry! The correct number was: ${lotteryNumber}. Better luck next time!`;
    }
});


function generateLotteryNumber() {
    return Math.floor(Math.random() * 900000 + 100000); // Generates a random 6-digit number
}
