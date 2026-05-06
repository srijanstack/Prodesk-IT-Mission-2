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
}


expenseButton.addEventListener('click', () => {
    const expName = expenseNameInput.value;
    const expValue = expenseValueInput.value;

    if (!expValue || !expName) {
        return alert("Enter Expense")
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

updateSalary();
updateExpenseList();



