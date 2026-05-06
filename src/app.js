const salaryBtn = document.getElementById("salaryBtn");
const salaryInput = document.getElementById("salary");

const expenseButton = document.getElementById("expBtn");
const expenseNameInput = document.getElementById("expenseName");
const expenseValueInput = document.getElementById("expenseValue");

const expList = document.getElementById("expList");
const bar = document.getElementById("topExpBar")

const bal = document.getElementById("balance");
const totExp = document.getElementById("totExp");
const sal = document.getElementById("sal");

let salary = JSON.parse(localStorage.getItem("salary")) || null;
salaryInput.value = Number(salary);
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


salaryBtn.addEventListener('click', () => {
    if(Number(salaryInput.value) === 0) return;
    if(Number(salaryInput.value) < totalExpense()) alert("Your expenses exceeds your salary.")
    updateSalary();
})


function updateSalary() {
    salary = Number(salaryInput.value);
    localStorage.setItem("salary", JSON.stringify(salary));
    sal.innerText = salary.toLocaleString('en-IN');
    updateExpenseList();
}

function balance() {
    const balance = salary - totalExpense();
    bal.innerText = balance.toLocaleString('en-in');
    return balance;
}


expenseButton.addEventListener('click', () => {
    const expName = expenseNameInput.value;
    const expValue = expenseValueInput.value;

    if (!expValue || !expName) {
        return alert("Enter Expense")
    }

    if (expValue > balance()) {
        const isConfirmed = confirm("You dont have enough budget. Sure you want to continue?");
        if (!isConfirmed) return;
    }

    expenses = [...expenses, { name: expName, value: Number(expValue) }]
    localStorage.setItem("expenses", JSON.stringify(expenses));

    updateExpenseList();
})

function updateExpenseList() {

    if (expenses.length === 0) {
        expList.innerHTML = `  <h1 class="font-semibold text-2xl text-yellow-500">No expenses. You are doing good.</h1>`
        bar.style.display = `none`
        totalExpense();
        balance();
        renderChart();
        return
    }

    bar.style.display = `flex`

    expList.innerHTML = expenses
        .map((exp, i) => ` <li class="w-full flex ">
                        <div class="border-b border-r border-l w-1/4 h-7 text-center">
                            ${i + 1}.
                        </div>
                        <div class="border-b border-r w-1/3 h-7 text-center">
                            ${exp.name}
                        </div>
                        <div class="border-b border-r  w-1/3 h-7 text-center">
                            ${exp.value}
                        </div>
                        <button class="border-b  border-r w-1/10 h-7 text-center text-red-500 font-semibold border-black cursor-pointer hover:scale-105 transition duration-100" onClick="removeExpense(${i})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </li>`)
        .join("");

    totalExpense();
    balance();
    renderChart();
}

function removeExpense(i) {
    expenses.splice(i, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
}

function totalExpense() {
    const totalExpenses = expenses.reduce((acc, curr) => {
        return acc + curr.value;
    }, 0);
    totExp.innerText = totalExpenses.toLocaleString('en-In');
    return totalExpenses;
}


let chart;

function renderChart() {
    const totalExpenses = totalExpense();
    const remaining = Math.max(balance(), 0);

    const canvas = document.getElementById("expenseChart");
    const ctx = canvas.getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Spent", "Remaining"],
            datasets: [{
                data: [totalExpenses, remaining],
                backgroundColor: ["#ef4444", "#22c55e"]
            }]
        },

    });
}

updateSalary();
updateExpenseList();
renderChart();



