// Expense Tracker - frontend logic

const API_URL = "http://localhost:3000/api/expenses";

let allExpenses = [];

let editingId = null;

let deletingId = null;

let sortColumn = null;

let sortDirection = "asc";

let expenseChart = null;

const dateInput = document.getElementById("date");

const today = new Date().toISOString().split("T")[0];

dateInput.value = today;


// API - Get Expenses

async function getExpenses() {
    try {
        document.getElementById("loadingSpinner").classList.remove("d-none");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }

       const expenses = await response.json();

       

       return expenses;

    } catch (error) {
        console.error(error);

         showAlert("Unable to connect to the server.");
    }
    
    finally {
        document.getElementById("loadingSpinner").classList.add("d-none");
    }
}


// Rendering

function getCategoryClass(category) {
    if (category === "Food") {
        return "text-bg-success";
    }

    if (category === "Transport") {
        return "text-bg-info";
    }

    if (category === "Bills") {
        return "text-bg-warning";
    }

    if (category === "Entertainment") {
        return "text-bg-primary";
    }

    return "text-bg-secondary";
}


function renderTable(expenses) {
    const tableBody = document.getElementById("expenseTableBody");

    tableBody.innerHTML = "";

    expenses.forEach(expense => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.title}</td>
            <td>${expense.amount}</td>
            <td>
                <span class="badge ${getCategoryClass(expense.category)}">
                    ${expense.category}
                </span>
            </td>
            <td>${expense.date}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="openEditModal(${expense.id})">
                 Edit
                </button>

                <button class="btn btn-sm btn-danger" onclick="handleDelete(${expense.id})">
                 Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}



function renderSummary(expenses) {
    let total = 0;
    let highest = 0;

    expenses.forEach(expense => {
        total += Number(expense.amount);

        if (Number(expense.amount) > highest) {
            highest = Number(expense.amount);
        }
    });

    document.getElementById("totalAmount").textContent = total.toFixed(2);
    document.getElementById("expenseCount").textContent = expenses.length;
    document.getElementById("highestExpense").textContent = highest.toFixed(2);
}

function getExpensesByCategory(expenses) {
    const categoryTotals = {
        Food: 0,
        Transport: 0,
        Bills: 0,
        Entertainment: 0,
        Other: 0
    };

    expenses.forEach(expense => {
        categoryTotals[expense.category] += Number(expense.amount);
    });

    return categoryTotals;
}


function renderChart(expenses) {
    const categoryTotals = getExpensesByCategory(expenses);

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    const ctx = document.getElementById("expenseChart");

    if (expenseChart) {
        expenseChart.destroy();
    }





    const darkMode = document.body.classList.contains("dark-mode");

    const chartBackground = {
        id: "chartBackground",
        beforeDraw(chart) {
            const ctx = chart.ctx;

            ctx.save();

            ctx.fillStyle = darkMode ? "#1e293b" : "#ffffff";

            ctx.fillRect(
                0,
                0,
                chart.width,
                chart.height
            );

            ctx.restore();
        }
    };




    expenseChart = new Chart(ctx, {

         plugins: [ chartBackground],

        type: "pie",
        data: {
            labels: labels,
           datasets: [{
                        data: data,
                        backgroundColor: [
                            "#198754", // Food - success
                            "#0dcaf0", // Transport - info
                            "#ffc107", // Bills - warning
                            "#0d6efd", // Entertainment - primary
                            "#6c757d"  // Other - secondary
                        ]
                    }]
        },
   options: {
                responsive: true,

                plugins: {
                    legend: {
                        position: "right",
                        align: "center",
                        labels: {
                            color: darkMode ? "#ffffff" : "#212529"
                        }
                    }
                }
            }
    });
}




function sortExpenses(expenses) {
    if (!sortColumn) {
        return expenses;
    }

    return [...expenses].sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        if (sortColumn === "amount") {
            valueA = Number(valueA);
            valueB = Number(valueB);
        } else {
            valueA = String(valueA).toLowerCase();
            valueB = String(valueB).toLowerCase();
        }

        if (valueA < valueB) {
            return sortDirection === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
            return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
    });
}


document.querySelectorAll("th[data-sort]").forEach(header => {
    header.addEventListener("click", function () {
        const column = header.dataset.sort;

        if (sortColumn === column) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = column;
            sortDirection = "asc";
        }

        renderTable(sortExpenses(allExpenses));
    });
});



function showAlert(message) {
    const alertContainer = document.getElementById("alertContainer");

    alertContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
}



// Add Expense


const expenseForm = document.getElementById("expenseForm");

expenseForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
 

    document.getElementById("titleError").textContent = "";
    document.getElementById("amountError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    
    document.getElementById("title").classList.remove("is-invalid");
    document.getElementById("amount").classList.remove("is-invalid");
    document.getElementById("category").classList.remove("is-invalid");

let isValid = true;

if (!title.trim()) {
    document.getElementById("titleError").textContent = "Please enter a title.";
    document.getElementById("title").classList.add("is-invalid");
    isValid = false;
}

if (!amount) {
    document.getElementById("amountError").textContent = "Please enter an amount.";
    document.getElementById("amount").classList.add("is-invalid");
    isValid = false;
} else if (Number(amount) <= 0) {
    document.getElementById("amountError").textContent = "Amount must be greater than 0.";
    document.getElementById("amount").classList.add("is-invalid");
    isValid = false;
}

if (!category) {
    document.getElementById("categoryError").textContent = "Please select a category.";
    document.getElementById("category").classList.add("is-invalid");
    isValid = false;
}


if (!isValid) {
    return;
}


    const data = {
            title: title,
            amount: amount,
            category: category,
            date: date
        };

    const newExpense = await addExpense(data);

    if (newExpense) {
        await refresh();
        expenseForm.reset();
    }
});


document.getElementById("title").addEventListener("input", function () {
    document.getElementById("titleError").textContent = "";
    document.getElementById("title").classList.remove("is-invalid");
});


document.getElementById("amount").addEventListener("input", function () {
    document.getElementById("amountError").textContent = "";
    document.getElementById("amount").classList.remove("is-invalid");
});


document.getElementById("category").addEventListener("change", function () {
    document.getElementById("categoryError").textContent = "";
    document.getElementById("category").classList.remove("is-invalid");
});



async function addExpense(data) {
    try {

        document.getElementById("loadingSpinner").classList.remove("d-none");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const expense = await response.json();

        

        return expense;
        }

        

        catch (error) {
        console.error(error);
        showAlert(error.message);
        return null; 
    }
     finally {
        document.getElementById("loadingSpinner").classList.add("d-none");
    }
}


// Update Expense

async function updateExpense(id, data) {
    try {

        document.getElementById("loadingSpinner").classList.remove("d-none");

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const expense = await response.json();

        return expense;
        }

    catch (error) {
    console.error(error);
    showAlert(error.message);
    }

    finally {
    document.getElementById("loadingSpinner").classList.add("d-none");
    }
}


// Delete Expense

async function deleteExpense(id) {
    try {

        document.getElementById("loadingSpinner").classList.remove("d-none");

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return true;

    } catch (error) {
        console.error(error);
        showAlert(error.message);
    }

    finally {
    document.getElementById("loadingSpinner").classList.add("d-none");
    }
}


function handleDelete(id) {
    deletingId = id;

    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
}



const confirmDeleteButton = document.getElementById("confirmDeleteButton");

confirmDeleteButton.addEventListener("click", async function () {
    const deleted = await deleteExpense(deletingId);

    if (deleted) {
        await refresh();

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("deleteModal")
        );

        modal.hide();
    }
});



// Refresh and Filter

async function refresh() {
    const expenses = await getExpenses();


    allExpenses = expenses;

    renderTable(expenses);
    renderSummary(expenses);
    renderChart(expenses);
}

function applyFilter() {
    const category = document.getElementById("categoryFilter").value;

    if (category === "All") {
        renderTable(allExpenses);
        return;
    }

    const filteredExpenses = allExpenses.filter(expense => {
        return expense.category === category;
    });

    renderTable(filteredExpenses);
}

const categoryFilter = document.getElementById("categoryFilter");

categoryFilter.addEventListener("change", function () {
    applyFilter();
}); 




function openEditModal(id) {
    editingId = id;

    const expense = allExpenses.find(expense => expense.id === id);

    document.getElementById("editTitle").value = expense.title;
    document.getElementById("editAmount").value = expense.amount;
    document.getElementById("editCategory").value = expense.category;


    document.getElementById("editDate").value = expense.date;
    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
}




const editForm = document.getElementById("editForm");

editForm.addEventListener("submit", async function (event) {
    event.preventDefault();


    const editTitle = document.getElementById("editTitle").value;

    document.getElementById("editTitleError").textContent = "";
    document.getElementById("editTitle").classList.remove("is-invalid");

    if (!editTitle.trim()) {
        document.getElementById("editTitleError").textContent = "Please enter a title.";
        document.getElementById("editTitle").classList.add("is-invalid");
        return;
    }
    

    const editAmount = document.getElementById("editAmount").value;

    document.getElementById("editAmountError").textContent = "";
    document.getElementById("editAmount").classList.remove("is-invalid");

    if (!editAmount) {
        document.getElementById("editAmountError").textContent = "Please enter an amount.";
        document.getElementById("editAmount").classList.add("is-invalid");
        return;
    }

    if (Number(editAmount) <= 0) {
    document.getElementById("editAmountError").textContent = "Amount must be greater than 0.";
    document.getElementById("editAmount").classList.add("is-invalid");
    return;
    }


    const editCategory = document.getElementById("editCategory").value;

    document.getElementById("editCategoryError").textContent = "";
    document.getElementById("editCategory").classList.remove("is-invalid");

    if (!editCategory) {
        document.getElementById("editCategoryError").textContent = "Please select a category.";
        document.getElementById("editCategory").classList.add("is-invalid");
        return;
    }




    const data = {
        title: document.getElementById("editTitle").value,
        amount: document.getElementById("editAmount").value,
        category: document.getElementById("editCategory").value,
        date: document.getElementById("editDate").value
    };

    const updatedExpense = await updateExpense(editingId, data);

    if (updatedExpense) {
        await refresh();

        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        modal.hide();
    }

});



document.getElementById("editTitle").addEventListener("input", function () {
    document.getElementById("editTitleError").textContent = "";
    document.getElementById("editTitle").classList.remove("is-invalid");
});

document.getElementById("editAmount").addEventListener("input", function () {
    document.getElementById("editAmountError").textContent = "";
    document.getElementById("editAmount").classList.remove("is-invalid");
});

document.getElementById("editCategory").addEventListener("change", function () {
    document.getElementById("editCategoryError").textContent = "";
    document.getElementById("editCategory").classList.remove("is-invalid");
});



refresh();





// Dark Mode

const darkModeButton = document.getElementById("darkModeButton");

darkModeButton.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
        darkModeButton.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("darkMode", "disabled");
        darkModeButton.textContent = "🌙 Dark Mode";
    }

    renderChart(allExpenses);
});

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeButton.textContent = "☀️ Light Mode";
}