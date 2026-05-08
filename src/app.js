const salaryBtn = document.getElementById("salaryBtn");
const salaryInput = document.getElementById("salary");

const expenseButton = document.getElementById("expBtn");
const expenseNameInput = document.getElementById("expenseName");
const expenseValueInput = document.getElementById("expenseValue");

const expList = document.getElementById("expList");
const bar = document.getElementById("topExpBar");

const bal = document.getElementById("balance");
const totExp = document.getElementById("totExp");
const sal = document.getElementById("sal");

const fromCurr = document.getElementById("fromCurrency");
const toCurr = document.getElementById("toCurrency");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let salaryObj = JSON.parse(localStorage.getItem("salary")) || null;
let salary = salaryObj ?  Number(salaryObj.amount) : 0;
sal.innerText = `${salaryObj?.currency || "INR"} ${salary.toLocaleString()}`;

//events
salaryBtn.addEventListener('click', () => {
    if (Number(salaryInput.value) === 0) return;
    if (Number(salaryInput.value) < totalExpense()) alert("Your expenses exceeds your salary.")
    updateSalary();
    salaryInput.value = "";
})

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

    expenseNameInput.value = "";
    expenseValueInput.value = "";

    updateExpenseList();
})

//UI and state
function updateSalary() {
    salaryObj = { currency: fromCurr.value, amount: Number(salaryInput.value) }
    localStorage.setItem("salary", JSON.stringify(salaryObj));
    salary = salaryObj.amount;
    sal.innerText = `${salaryObj?.currency || "INR"} ${salary.toLocaleString()}`;
    balance();
    renderChart();
}

function balance() {
    const balance = salary - totalExpense();
    if (balance < (salary / 10)) {
        bal.classList.add("text-red-500");
        bal.classList.remove("text-yellow-500");
    }
    else {
        bal.classList.add("text-yellow-500");
        bal.classList.remove("text-red-500");
    }
    bal.innerText = `${salaryObj?.currency || "INR"} ${balance.toLocaleString()}`;
    return balance;
}


function updateExpenseList() {

    if (expenses.length === 0) {
        expList.innerHTML = `  <h1 class="font-semibold text-2xl text-green-500">No expenses. You are doing good.</h1>`
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

//removing and counting logic
function removeExpense(i) {
    expenses.splice(i, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
}

function totalExpense() {
    const totalExpenses = expenses.reduce((acc, curr) => {
        return acc + curr.value;
    }, 0);
    totExp.innerText = `${salaryObj?.currency || "INR"} ${totalExpenses.toLocaleString('en-In')}`;
    return totalExpenses;
}


//chart
let chart;

function renderChart() {
    const totalExpenses = totalExpense();
    const remaining = Math.max(salary - totalExpenses, 0);

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

//pdf
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Expense Report", 90, 20);

    let y = 30;

    expenses.forEach((exp, i) => {
        doc.text(
            `${i + 1}. ${exp.name} - ${exp.value}`,
            20,
            y
        );
        y += 10;
    });

    const total = totalExpense();
    const remaining = balance();

    doc.text(`Total Expense: ${total}`, 20, y + 10);
    doc.text(`Remaining: ${remaining}`, 20, y + 20);
    doc.text(`Currency: ${salaryObj.currency}`, 20 , y + 30);
    doc.save("expenses.pdf");
}

//currencies and conversions
async function getCurrencies() {
    try {
        const data = await fetch(`https://api.frankfurter.dev/v2/currencies`);
        const currencies = await data.json();
        fromCurr.innerHTML = currencies.map((curr) => curr.iso_code === (salaryObj?.currency || "INR") ? `<option selected value="${curr.iso_code}">${curr.name}</option>` : `<option value="${curr.iso_code}">${curr.name}</option>`).join("");
        toCurr.innerHTML = currencies.map((curr) => curr.iso_code === (salaryObj?.currency || "INR") ? `<option selected value="${curr.iso_code}">${curr.name}</option>` : `<option value="${curr.iso_code}">${curr.name}</option>`).join("");
    } catch (err) {
        console.error(err)
    }
}


async function convert() {
    const base = fromCurr.value;
    const quote = toCurr.value;
    if (base === quote) {
        alert("Cannot convert to same currency");
        return
    }
    try {
        const data = await fetch(`https://api.frankfurter.dev/v2/rate/${base}/${quote}`);
        const conversion = await data.json();
        getConversion(conversion.rate, quote);
    } catch (err) {
        console.error(err)
    }
}

function getConversion(rate, currency) {
    fromCurr.value = currency;
    toCurr.value = "INR";
    salary = Number((salary * rate).toFixed(2));
    salaryObj = { currency: currency, amount: salary };
    sal.innerText = `${salaryObj?.currency || "INR"} ${salary.toLocaleString()}`;
    expenses = expenses.map((exp) => ({
        ...exp,
        value: Number((exp.value * rate).toFixed(2))
    }));
    localStorage.setItem("salary", JSON.stringify(salaryObj))
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
}

updateExpenseList();
getCurrencies();



