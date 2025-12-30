const boardSize = 5;
let totalMines = 5;
let board = [];
let gameOver = false;
let timer = 0;
let interval;
let balance = Number(localStorage.getItem('balance')) || 10;



function updateBalanceDisplay() {
    document.getElementById('balance').textContent = `Balans: ${balance}$`;

    // ✅ localStorage ga saqlash
    localStorage.setItem('balance', balance);

    if (balance <= 1) {
        alert('💸 Balansingiz tugadi! Qayta urinib ko‘ring.');
        gameOver = true;
        clearInterval(interval);
        revealAllMines();
    }

    // Update download buttons state when balance changes
    try { updateDownloadButtonsState(); } catch (e) { /* ignore if not yet initialized */ }
}


function startGame() {
    clearInterval(interval);
    timer = 0;
    document.getElementById('timer').textContent = 'Vaqt: 0s';
    interval = setInterval(() => {
        timer++;
        document.getElementById('timer').textContent = `Vaqt: ${timer}s`;
    }, 1000);

    totalMines = parseInt(document.getElementById('mines-input').value) || 5;
    board = [];
    gameOver = false;
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = { isMine: false, isRevealed: false, surroundingMines: 0, isFlagged: false };
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = i;
            cellElement.dataset.col = j;
            cellElement.addEventListener('click', handleClick);
            cellElement.addEventListener('contextmenu', handleRightClick);
            boardElement.appendChild(cellElement);
        }
    }

    let minesPlaced = 0;
    while (minesPlaced < totalMines) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j].isMine) {
                board[i][j].surroundingMines = countSurroundingMines(i, j);
            }
        }
    }
        
    updateBalanceDisplay();
}

function countSurroundingMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (
                newRow >= 0 && newRow < boardSize &&
                newCol >= 0 && newCol < boardSize &&
                board[newRow][newCol].isMine
            ) {
                count++;
            }
        }
    }
    return count;
}


function revealCell(row, col) {
    if (gameOver) return;
    const cell = board[row][col];
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    cellElement.classList.add('revealed');

    if (cell.isMine) {
        balance -= 2;
        updateBalanceDisplay();
        cellElement.innerHTML = '<img src="bomb.png" class="bomb-img">';
        cellElement.style.backgroundColor = '#fff';
        gameOver = true;
        clearInterval(interval);
        alert('💥 Yutqazdingiz!');
        revealAllMines();
    } else {
        if (!cellElement.classList.contains('coin-added')) {
            cellElement.innerHTML = '<img src="dollar.png" class="coin-img">';
            cellElement.classList.add('coin-added');
        }

        // ✅ Mina soniga qarab balans qo‘shish:
        switch (totalMines) {
            case 1:
                balance += 0.20;
                break;
            case 2:
                balance += 0.25;
                break;
            case 3:
                balance += 0.30;
                break;
            case 4:
                balance += 0.45;
                break;
            case 5:
                balance += 1;
                break;
            case 6:
                balance += 1.40;
                break;
            case 7:
                balance += 1.60;
                break;
            case 8:
                balance += 1.80;
                break;
            case 9:
                balance += 1.90;
                break;
            case 10:
                balance += 2;
                break;
            case 11:
                balance += 2.30;
                break;
            case 12:
                balance += 2.50;
                break;
            case 13:
                balance += 2.70;
                break;
            case 14:
                balance += 2.90;
                break;
            case 15:
                balance += 3;
                break;
            case 16:
                balance += 5;
                break;
            case 17:
                balance += 7;
                break;
            case 18:
                balance += 9;
                break;
            case 19:
                balance += 11;
                break;
            case 20:
                balance += 13;
                break;
                
            default:
                balance += 15;
        }

        updateBalanceDisplay();
    }
}


function handleClick(event) {
    if (gameOver) return;
    const row = Number(event.target.dataset.row);
    const col = Number(event.target.dataset.col);
    const cell = board[row][col];
    if (cell.isRevealed || cell.isFlagged) return;

    revealCell(row, col);
    if (!cell.isMine) checkWin();
}

function handleRightClick(event) {
    event.preventDefault();
    if (gameOver) return;
    const row = Number(event.target.dataset.row);
    const col = Number(event.target.dataset.col);
    const cell = board[row][col];
    if (cell.isRevealed) return;

   
}

function revealAllMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j].isMine) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.innerHTML = '<img src="bomb.png" class="bomb-img">';
                cell.style.backgroundColor = "#333";
            }
        }
    }
    gameOver = true;
}

function checkWin() {
    let revealedCount = 0;
    let correctFlags = 0;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = board[i][j];
            if (cell.isRevealed) revealedCount++;
            if (cell.isFlagged && cell.isMine) correctFlags++;
        }
    }

    if (revealedCount + totalMines === boardSize * boardSize || correctFlags === totalMines) {
        clearInterval(interval);
        gameOver = true;
        alert('🎉 Yutdingiz!');
        revealAllMines();
    }
}

// localStorage orqali promokodni tekshirish
let promoUsed = localStorage.getItem('promoUsed') === 'true';

function checkPromoCode() {
  const promoInput = document.getElementById('promo-input').value;

  if (promoUsed) {
    alert("❗ Bu promokod allaqachon ishlatilgan.");
    return;
  }

  if (promoInput === "025141201112345678") {
    balance += 1000;
    updateBalanceDisplay();

    alert("🎁 Tabriklaymiz! 1000 coin qo‘shildi!");

    promoUsed = true;
    localStorage.setItem('promoUsed', 'true');
  } else {
    alert("❌ Noto‘g‘ri promokod!");
  }
}


let promoUsed1 = localStorage.getItem('promoUsed') === 'true';



updateBalanceDisplay();
startGame();

// Setup download button behavior: prevent download if balance is insufficient
function setupDownloadButtons() {
    const buttons = document.querySelectorAll('.download-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const cost = Number(btn.dataset.cost) || 0;
            if (balance < cost) {
                e.preventDefault();
                alert(`❌ Balans yetarli emas. ${cost}$ kerak.`);
                return;
            }

            // Deduct the cost and update display/storage before allowing download/navigation
            balance -= cost;
            updateBalanceDisplay();
            // Default link behavior (download/navigation) will proceed
        });
    });
}


function updateDownloadButtonsState() {
    const buttons = document.querySelectorAll('.download-btn');
    buttons.forEach(btn => {
        const cost = Number(btn.dataset.cost) || 0;
        if (balance < cost) btn.classList.add('disabled');
        else btn.classList.remove('disabled');
    });
}

// initialize download buttons after DOM and script load
try { setupDownloadButtons(); updateDownloadButtonsState(); } catch (e) { /* ignore */ }