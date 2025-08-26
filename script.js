const MOBILENUMBER      = 12345678910;
const PINNUMBER         = 1234;
const loginBtn          = document.getElementById('login-btn');
const addMoneyBtn       = document.getElementById('add-money-btn');
const cashOutBtn        = document.getElementById('cash-out-btn');
const transferMoneyBtn  = document.getElementById('transfer-money-btn');
const getBonusBtn       = document.getElementById('get-bonus-btn');
const payBillBtn        = document.getElementById('pay-bill-btn');
const logOutBtn         = document.getElementById('logout-btn');

const addMoneyBox       = document.getElementById('add-money-box');
const cashOutBox        = document.getElementById('cashout-box');
const transferMoneyBox  = document.getElementById('transfer-money-box');
const getBonusBox       = document.getElementById('get-bonus-box');
const payBillBox        = document.getElementById('pay-bill-box');
const transactionBox    = document.getElementById('transaction-box');
const transactions      = [];

// Hide all forms & display current one
function displyCurrentForm(id) {
    const forms = document.querySelectorAll('.form-wrapper');
    for(const form of forms) {
        form.style.display = 'none';
        document.getElementById(id).style.display = 'block';
    }
}

// Add active style to box
function addActiveStyle(id) {
    const boxes = document.querySelectorAll('.box');
    for(const box of boxes) {
        box.classList.remove('border-[#0874f2]', 'bg-[#0874f20d]');
        document.getElementById(id).classList.add('border-[#0874f2]', 'bg-[#0874f20d]');
        document.getElementById(id).classList.remove('border-[#0808081a]');
        box.classList.add('border-[#0808081a]');
    }
}

// Function to show alert
function showAlert(message = 'Error!', type = 'error', delay = 3000) {
    const div = document.createElement('div');
    const showError = document.getElementById('show-error');
    div.innerHTML = `
        <div role="alert" class="alert alert-${type} text-white mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>${message}</span>
        </div>
    `;
    showError.appendChild(div);
    setTimeout(function() {
        showError.innerHTML = '';
    }, delay);
}

// Add Money or Pay Bill
function addOrPayMoney(bank, number, amount, pin, method) {
    let selectBank          = document.getElementById(bank).value;
    let mobileNumber        = + document.getElementById(number).value;
    let getAmount           = + document.getElementById(amount).value;
    let pinNumber           = + document.getElementById(pin).value;
    let availableBalance    = + document.getElementById('available-balance').innerText;

    if(selectBank === 'Select bank' || mobileNumber <= 0 || getAmount <= 0 || pinNumber <= 0) {
        showAlert(`All fields are required to ${method === 'add-money' ? 'add' : 'pay'} money`, 'error', 4000);
    } else {
        if(mobileNumber === MOBILENUMBER && pinNumber === PINNUMBER) {
            if(method === 'add-money') {
                availableBalance = availableBalance + getAmount;
            } else {
                availableBalance = availableBalance - getAmount;
            }
            
            showAlert(`Success! Amount ${method === 'add-money' ? 'added' : 'paid'} successfully.`, 'success', 4000);

            transactions.unshift({
                name: method.split('-').map(item => item[0].toUpperCase() + item.slice(1)).join(' '),
                bank: selectBank,
                number: mobileNumber,
                amount: getAmount,
                time: new Date().toLocaleDateString()
            });

            document.getElementById('available-balance').innerText  = availableBalance;
            document.getElementById(bank).value        = 'Select bank';
            document.getElementById(number).value      = '';
            document.getElementById(amount).value      = '';
            document.getElementById(pin).value         = '';
        } else {
            showAlert('Error! Credentials are incorrect', 'error', 4000);
        }
    }
}

// Cashout or Transfer
function reduceAmount(number, amount, pin, method = 'cashout') {
    let formNumber        = document.getElementById(number).value;
    let formAmount        = + document.getElementById(amount).value;
    let formPinNUmber     = + document.getElementById(pin).value;
    let availableBalance  = + document.getElementById('available-balance').innerText;

    if(formNumber === '' || formAmount <= 0 || formPinNUmber <= 0) {
        showAlert(`All fields are required to ${method === 'cashout' ? 'withdraw' : 'transfer'} money`, 'error', 4000);
    } else {
        if(formNumber.length === 11 && formPinNUmber === PINNUMBER) {
            if(availableBalance < formAmount) {
                showAlert('Sorry, you don\'t have sufficient balance', 'error', 4000);
                return;
            }
            availableBalance = availableBalance - formAmount;

            showAlert(`Success! Amount ${method === 'cashout' ? 'withdraw' : 'transfered'} successfully.`, 'success', 4000);

            let name = method[0].toUpperCase() + method.slice(1);
            transactions.unshift({
                name: name,
                number: formNumber,
                amount: formAmount,
                time: new Date().toLocaleDateString()
            });

            document.getElementById('available-balance').innerText  = availableBalance;
            document.getElementById(number).value   = '';
            document.getElementById(amount).value         = '';
            document.getElementById(pin).value     = '';
        } else {
            showAlert('Error! Credentials are incorrect', 'error', 4000);
        }
    }
}

// Get Bonus
function getBonus() {
    const COUPON = 'PAYOO1000';
    let bonusCoupon = document.getElementById('bonus-coupon').value;
    let availableBalance  = + document.getElementById('available-balance').innerText;

    if(bonusCoupon === COUPON) {
        availableBalance = availableBalance + 1000;

        showAlert('Success! You successfully got the bonus amount.', 'success', 4000);

        transactions.unshift({
            name: 'Get Bonus',
            amount: 1000,
            time: new Date().toLocaleDateString()
        });

        document.getElementById('available-balance').innerText  = availableBalance;
        document.getElementById('bonus-coupon').value = '';
    } else {
        showAlert('Bonus code is incorrect', 'error', 4000);
    }
}

// Get Transactions
function getTransactions() {
    let transactionWrapper = document.getElementById('transaction-wrapper');

    if(transactions.length !== 0) {
        transactionWrapper.innerHTML = '';
    }
    
    let i = 1;
    for(const transaction of transactions) {
        let showBank = '';
        let showNumber = '';
        let showAmount = '';
        if(transaction.hasOwnProperty('bank')) {
            showBank = `<p class="pt-4">Bank: ${transaction.bank}</p>`;
        }
        if(transaction.hasOwnProperty('number')) {
            showNumber = `<p class="pt-4">Number: ${transaction.number}</p>`;
        }
        if(transaction.hasOwnProperty('amount')) {
            showAmount = `<p>Amount: ${transaction.amount}</p>`;
        }
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="card bg-base-100 shadow-sm flex mb-2 pr-2">
            <div class="flex items-center justify-between gap-2">
                <div class="card-body p-3 flex-row items-center gap-4">
                    <div class="bg-gray-100 p-3 rounded-full">
                        <img src="./images/wallet1.png" alt="Transaction" />
                    </div>
                    <div>
                        <h2 class="card-title">${transaction.name}</h2>
                        <p>${transaction.time}</p>
                    </div>
                </div>
                <div class="bg-gray-100 flex items-center justify-center rounded-full w-12 h-12 cursor-pointer" onclick="my_modal_${i}.showModal()"><i class="fa-solid fa-ellipsis-vertical"></i></div>
                <dialog id="my_modal_${i}" class="modal">
                    <div class="modal-box w-[350px]">
                        <form method="dialog">
                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 class="text-lg font-bold">${transaction.name}</h3>
                        <p class="pb-4">${transaction.time}</p>
                        ${showBank}
                        ${showNumber}
                        ${showAmount}
                    </div>
                </dialog>
            </div>
        </div>
        `;
        transactionWrapper.appendChild(div);
        i++;
    }
}

// Prevent direct access
if (document.referrer === '') {
    window.location.href = './index.html';
}

if(loginBtn) {
    loginBtn.addEventListener('click', function(e) {
        const loginMobileNumber = + document.getElementById('login-mobile-number').value;
        const loginPin          = + document.getElementById('login-pin-number').value;
        if(loginMobileNumber === MOBILENUMBER && loginPin === PINNUMBER) {
            window.location.href = './main.html';
        } else {
            showAlert('Error! Credentials are incorrect.', 'error', 4000);
        }
        e.preventDefault();
    })
}

if(addMoneyBox) {
    addMoneyBox.addEventListener('click', function() {
        displyCurrentForm('add-money');
        addActiveStyle('add-money-box');
    });
}

if(cashOutBox) {
    cashOutBox.addEventListener('click', function() {
        displyCurrentForm('cash-out');
        addActiveStyle('cashout-box');
    });
}

if(transferMoneyBox) {
    transferMoneyBox.addEventListener('click', function() {
        displyCurrentForm('transfer-money');
        addActiveStyle('transfer-money-box');
    });
}

if(getBonusBox) {
    getBonusBox.addEventListener('click', function() {
        displyCurrentForm('get-bonus');
        addActiveStyle('get-bonus-box');
    });
}

if(payBillBox) {
    payBillBox.addEventListener('click', function() {
        displyCurrentForm('pay-bill');
        addActiveStyle('pay-bill-box');
    });
}

if(transactionBox) {
    transactionBox.addEventListener('click', function() {
        displyCurrentForm('transaction-history');
        addActiveStyle('transaction-box');    
    });
}

if(addMoneyBtn) {
    addMoneyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addOrPayMoney('add-select-bank', 'add-mobile-number', 'add-amount', 'add-pin-number', 'add-money');
    });
}

if(cashOutBtn) {
    cashOutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        reduceAmount('cashout-agent-number', 'cashout-amount', 'cashout-pin-number', 'cashout');
    });
}

if(transferMoneyBtn) {
    transferMoneyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        reduceAmount('transfer-account-number', 'transfer-amount', 'transfer-pin-number', 'transfer');
    });
}

if(getBonusBtn) {
    getBonusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        getBonus();
    });
}

if(payBillBtn) {
    payBillBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addOrPayMoney('select-pay-bank', 'biller-account-number', 'pay-amount', 'pay-pin-number', 'pay-bill');
    });
}

if(transactionBox) {
    transactionBox.addEventListener('click', function() {
        getTransactions();
    })
}

if(logOutBtn) {
    logOutBtn.addEventListener('click', function() {
        window.location.href = './index.html';
    })
}

// console.log('add-money'.split('-').map(item => item[0].toUpperCase() + item.slice(1)).join(' '));