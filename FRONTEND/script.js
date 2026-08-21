// =====================================================
// API
// =====================================================

const API = "/api";

// =====================================================
// DOM
// =====================================================

const walletBalance =
    document.getElementById(
        "walletBalance"
    );

const addMoneyAmount =
    document.getElementById(
        "addMoneyAmount"
    );

const addMoneyBtn =
    document.getElementById(
        "addMoneyBtn"
    );

const resetWalletBtn =
    document.getElementById(
        "resetWalletBtn"
    );

const todayTotal =
    document.getElementById(
        "todayTotal"
    );

const monthlyTotal =
    document.getElementById(
        "monthlyTotal"
    );

const todayCount =
    document.getElementById(
        "todayCount"
    );

const selectedCategory =
    document.getElementById(
        "selectedCategory"
    );

const expenseAmount =
    document.getElementById(
        "expenseAmount"
    );

const expenseNote =
    document.getElementById(
        "expenseNote"
    );

const addExpenseBtn =
    document.getElementById(
        "addExpenseBtn"
    );

const todayExpenses =
    document.getElementById(
        "todayExpenses"
    );

const currentMonth =
    document.getElementById(
        "currentMonth"
    );

const analysisTotal =
    document.getElementById(
        "analysisTotal"
    );

const categoryAnalysis =
    document.getElementById(
        "categoryAnalysis"
    );

const dateWiseAnalysis =
    document.getElementById(
        "dateWiseAnalysis"
    );

const previousMonth =
    document.getElementById(
        "previousMonth"
    );

const nextMonth =
    document.getElementById(
        "nextMonth"
    );

const toast =
    document.getElementById(
        "toast"
    );


// =====================================================
// VARIABLES
// =====================================================

let selectedCategoryValue = "";

let analysisDate =
    new Date();


// =====================================================
// ICONS
// =====================================================

const categoryIcons = {

    Tea: "☕",

    Breakfast: "🍳",

    Lunch: "🍛",

    Dinner: "🍽️",

    Snacks: "🍿",

    Travel: "🚗",

    Shopping: "🛍️",

    Other: "📦"

};


// =====================================================
// MONEY
// =====================================================

function formatMoney(amount) {

    return "₹" +
        Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );

}


// =====================================================
// TOAST
// =====================================================

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// =====================================================
// API REQUEST
// =====================================================

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            API + url,
            {
                headers: {
                    "Content-Type":
                        "application/json"
                },

                ...options
            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Something went wrong"
        );

    }


    return data;

}


// =====================================================
// WALLET
// =====================================================

async function loadWallet() {

    try {

        const wallet =
            await apiRequest(
                "/wallet"
            );


        walletBalance.textContent =
            formatMoney(
                wallet.balance
            );

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// ADD MONEY
// =====================================================

async function addMoney() {

    const amount =
        Number(
            addMoneyAmount.value
        );


    if (
        !amount ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount"
        );

        return;

    }


    try {

        const data =
            await apiRequest(
                "/wallet/add-money",
                {

                    method: "POST",

                    body:
                        JSON.stringify({
                            amount
                        })

                }
            );


        walletBalance.textContent =
            formatMoney(
                data.wallet.balance
            );


        addMoneyAmount.value =
            "";


        showToast(
            "Money added successfully"
        );


    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// RESET WALLET
// =====================================================

async function resetWallet() {

    if (
        !confirm(
            "Are you sure you want to reset the wallet?"
        )
    ) {

        return;

    }


    try {

        const data =
            await apiRequest(
                "/wallet/reset",
                {
                    method:
                        "POST"
                }
            );


        walletBalance.textContent =
            formatMoney(
                data.wallet.balance
            );


        showToast(
            "Wallet reset successfully"
        );

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// CATEGORY
// =====================================================

function selectCategory(
    category
) {

    selectedCategoryValue =
        category;


    selectedCategory.value =
        category;


    document
        .querySelectorAll(
            ".category-btn"
        )
        .forEach(
            button =>
                button.classList.remove(
                    "active"
                )
        );


    const button =
        document.querySelector(
            `.category-btn[data-category="${category}"]`
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }

}


// =====================================================
// ADD EXPENSE
// =====================================================

async function addExpense() {

    const category =
        selectedCategoryValue;


    const amount =
        Number(
            expenseAmount.value
        );


    const note =
        expenseNote.value.trim();


    if (!category) {

        showToast(
            "Please select a category"
        );

        return;

    }


    if (
        !amount ||
        amount <= 0
    ) {

        showToast(
            "Enter a valid amount"
        );

        return;

    }


    try {

        const data =
            await apiRequest(
                "/expenses",
                {

                    method:
                        "POST",

                    body:
                        JSON.stringify({

                            category,

                            amount,

                            note,

                            expenseDate:
                                new Date().toISOString()

                        })

                }
            );


        walletBalance.textContent =
            formatMoney(
                data.wallet.balance
            );


        expenseAmount.value =
            "";

        expenseNote.value =
            "";

        selectedCategory.value =
            "";

        selectedCategoryValue =
            "";


        document
            .querySelectorAll(
                ".category-btn"
            )
            .forEach(
                button =>
                    button.classList.remove(
                        "active"
                    )
            );


        showToast(
            "Expense added successfully"
        );


        await refreshDashboard();

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// TODAY
// =====================================================

async function loadTodayExpenses() {

    try {

        const data =
            await apiRequest(
                "/expenses/today"
            );


        todayTotal.textContent =
            formatMoney(
                data.total
            );


        todayCount.textContent =
            data.expenses.length;


        renderTodayExpenses(
            data.expenses
        );

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// RENDER TODAY
// =====================================================

function renderTodayExpenses(
    expenses
) {

    if (
        !expenses ||
        expenses.length === 0
    ) {

        todayExpenses.innerHTML = `

            <div class="empty-state">
                No expenses today.
            </div>

        `;

        return;

    }


    todayExpenses.innerHTML =
        expenses.map(
            expense => {

                const icon =
                    categoryIcons[
                    expense.category
                    ] || "📦";


                return `

                    <div class="expense-item">

                        <div class="expense-left">

                            <div class="expense-icon">
                                ${icon}
                            </div>

                            <div>

                                <div class="expense-name">
                                    ${escapeHTML(
                    expense.category
                )}
                                </div>

                                <div class="expense-note">
                                    ${escapeHTML(
                    expense.note || ""
                )}
                                </div>

                            </div>

                        </div>


                        <div class="expense-right">

                            <span class="expense-amount">
                                -${formatMoney(
                    expense.amount
                )}
                            </span>

                            <button
                                class="delete-btn"
                                onclick="deleteExpense('${expense._id}')"
                            >
                                🗑️
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// =====================================================
// DELETE
// =====================================================

async function deleteExpense(
    id
) {

    if (
        !confirm(
            "Delete this expense?"
        )
    ) {

        return;

    }


    try {

        const data =
            await apiRequest(
                `/expenses/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        walletBalance.textContent =
            formatMoney(
                data.wallet.balance
            );


        showToast(
            "Expense deleted and wallet refunded"
        );


        await refreshDashboard();

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// MONTHLY ANALYSIS
// =====================================================

async function loadMonthlyAnalysis() {

    try {

        const year =
            analysisDate.getFullYear();


        const month =
            analysisDate.getMonth() + 1;


        const data =
            await apiRequest(
                `/expenses/monthly-analysis?year=${year}&month=${month}`
            );


        updateMonthTitle();


        analysisTotal.textContent =
            formatMoney(
                data.total
            );


        monthlyTotal.textContent =
            formatMoney(
                data.total
            );


        renderCategoryAnalysis(
            data.categoryTotals,
            data.total
        );

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// MONTH TITLE
// =====================================================

function updateMonthTitle() {

    currentMonth.textContent =
        analysisDate.toLocaleDateString(
            "en-IN",
            {
                month:
                    "long",

                year:
                    "numeric"
            }
        );

}


// =====================================================
// CATEGORY ANALYSIS
// =====================================================

function renderCategoryAnalysis(
    totals,
    total
) {

    const categories = [

        "Tea",

        "Breakfast",

        "Lunch",

        "Dinner",

        "Snacks",

        "Travel",

        "Shopping",

        "Other"

    ];


    categoryAnalysis.innerHTML =
        categories.map(
            category => {

                const amount =
                    Number(
                        totals[
                        category
                        ] || 0
                    );


                const percentage =
                    total > 0
                        ? (
                            amount /
                            total
                        ) * 100
                        : 0;


                return `

                    <div class="analysis-row">

                        <div class="analysis-name">

                            ${categoryIcons[category]}

                            ${category}

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width:${percentage}%"
                            >
                            </div>

                        </div>


                        <div class="analysis-amount">

                            ${formatMoney(
                    amount
                )}

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// =====================================================
// DATE-WISE ANALYSIS
// =====================================================

async function loadDateWiseAnalysis() {

    try {

        const year =
            analysisDate.getFullYear();


        const month =
            analysisDate.getMonth() + 1;


        const data =
            await apiRequest(
                `/expenses/date-wise?year=${year}&month=${month}`
            );


        renderDateWiseAnalysis(
            data.dateWise
        );

    } catch (error) {

        showToast(
            error.message
        );

    }

}


// =====================================================
// RENDER DATE-WISE
// =====================================================

function renderDateWiseAnalysis(
    dateWise
) {

    if (
        !dateWise ||
        dateWise.length === 0
    ) {

        dateWiseAnalysis.innerHTML = `

            <div class="empty-state">
                No expenses found for this month.
            </div>

        `;

        return;

    }


    dateWiseAnalysis.innerHTML =
        dateWise.map(
            item => {

                const date =
                    new Date(
                        item.date +
                        "T00:00:00"
                    );


                const formattedDate =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            day:
                                "2-digit",

                            month:
                                "short",

                            year:
                                "numeric"
                        }
                    );


                const day =
                    date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday:
                                "long"
                        }
                    );


                return `

                    <div class="date-wise-row">

                        <div class="date-wise-date">

                            <strong>
                                ${formattedDate}
                            </strong>

                            <span>
                                ${day}
                            </span>

                        </div>


                        <div class="date-wise-amount">

                            ${formatMoney(
                    item.total
                )}

                        </div>

                    </div>

                `;

            }
        ).join("");

}


// =====================================================
// REFRESH
// =====================================================

async function refreshDashboard() {

    await loadWallet();

    await loadTodayExpenses();

    await loadMonthlyAnalysis();

    await loadDateWiseAnalysis();

}


// =====================================================
// MONTH NAVIGATION
// =====================================================

previousMonth.addEventListener(
    "click",
    async () => {

        analysisDate.setMonth(
            analysisDate.getMonth() - 1
        );

        await loadMonthlyAnalysis();

        await loadDateWiseAnalysis();

    }
);


nextMonth.addEventListener(
    "click",
    async () => {

        analysisDate.setMonth(
            analysisDate.getMonth() + 1
        );

        await loadMonthlyAnalysis();

        await loadDateWiseAnalysis();

    }
);


// =====================================================
// CATEGORY BUTTONS
// =====================================================

document
    .querySelectorAll(
        ".category-btn"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectCategory(
                        button.dataset.category
                    );

                }
            );

        }
    );


// =====================================================
// BUTTON EVENTS
// =====================================================

addMoneyBtn.addEventListener(
    "click",
    addMoney
);


resetWalletBtn.addEventListener(
    "click",
    resetWallet
);


addExpenseBtn.addEventListener(
    "click",
    addExpense
);


// =====================================================
// ENTER KEY
// =====================================================

addMoneyAmount.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addMoney();

        }

    }
);


expenseAmount.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addExpense();

        }

    }
);


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// INITIALIZE
// =====================================================

async function initializeApp() {

    updateMonthTitle();

    await refreshDashboard();

}


initializeApp();
