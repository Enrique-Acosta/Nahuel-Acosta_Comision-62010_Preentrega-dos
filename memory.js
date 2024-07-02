document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const resetGameButton = document.getElementById('resetGame');
    const saveGameButton = document.getElementById('saveGame');
    const loadGameButton = document.getElementById('loadGame');

    const cardsArray = [
        'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D',
        'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
    ];
    let shuffledCards = [];
    let selectedCards = [];
    let matchedPairs = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createBoard() {
        grid.innerHTML = '';
        shuffledCards = [...cardsArray];
        shuffle(shuffledCards);
        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.card = card;
            cardElement.addEventListener('click', flipCard);
            grid.appendChild(cardElement);
        });
        selectedCards = [];
        matchedPairs = 0;
    }

    function flipCard() {
        if (selectedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.card;
            selectedCards.push(this);

            if (selectedCards.length === 2) {
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    function checkForMatch() {
        const [card1, card2] = selectedCards;
        if (card1.dataset.card === card2.dataset.card) {
            matchedPairs++;
            if (matchedPairs === cardsArray.length / 2) {
                alert('¡Has ganado!');
            }
        } else {
            card1.classList.remove('flipped');
            card1.textContent = '';
            card2.classList.remove('flipped');
            card2.textContent = '';
        }
        selectedCards = [];
    }

    function saveGame() {
        const gameData = {
            shuffledCards,
            matchedPairs,
            flippedCards: Array.from(document.querySelectorAll('.flipped')).map(card => ({
                index: Array.from(grid.children).indexOf(card),
                card: card.dataset.card
            }))
        };
        localStorage.setItem('memoryGame', JSON.stringify(gameData));
        alert('Juego guardado');
    }

    function loadGame() {
        const savedGame = localStorage.getItem('memoryGame');
        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            shuffledCards = gameData.shuffledCards;
            matchedPairs = gameData.matchedPairs;

            grid.innerHTML = '';
            shuffledCards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.dataset.card = card;
                if (gameData.flippedCards.some(flippedCard => flippedCard.index === index)) {
                    cardElement.classList.add('flipped');
                    cardElement.textContent = card;
                }
                cardElement.addEventListener('click', flipCard);
                grid.appendChild(cardElement);
            });

            alert('Juego cargado');
        } else {
            alert('No hay juego guardado');
        }
    }

    resetGameButton.addEventListener('click', createBoard);
    saveGameButton.addEventListener('click', saveGame);
    loadGameButton.addEventListener('click', loadGame);

    createBoard();
});
