const salaryBtn = document.getElementById("salaryBtn");
const salaryInput = document.getElementById("salary");

const expenseButton = document.getElementById("expBtn");
const expenseNameInput = document.getElementById("expenseName");
const expenseValueInput = document.getElementById("expenseValue");

const savedSalary = localStorage.getItem("salary");
salaryInput.value = JSON.parse(savedSalary) || null;

const savedExpenses = localStorage.getItem("expenses");
let expenses = JSON.parse(savedExpenses) || [];


salaryBtn.addEventListener('click', () => {
    localStorage.setItem("salary", JSON.stringify(salaryInput.value));
})


expenseButton.addEventListener('click', () => {
    const expName = expenseNameInput.value;
    const expValue = expenseValueInput.value;

    const totalExpenses = [...expenses, { name: expName, value: expValue  }]
    localStorage.setItem("expenses", JSON.stringify(totalExpenses))
})



