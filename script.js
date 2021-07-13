class Game {
    constructor(time, cards) {
        this.time = time;
        this.cards = cards;
        this.timeRemaining = time;
        this.timer = document.querySelector('.time-remaining');
        this.ticker = document.querySelector('.flips');
    }

    startGame() {
        this.cardToMatch = null;
        this.totalClicks = 0;
        this.timeRemaining = this.time;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(() => {
            this.busy = false;
            this.shuffleCards();
            this.countDown = this.startCountDown();
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = 0;
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if(this.cardToMatch) {
                this.checkForMatch(card)
            } else {
                this.cardToMatch = card;
            }
        }

        console.log(!this.busy)
        console.log(!this.matchedCards.includes(card));
        console.log(card !== this.cardToMatch);

        console.log(this.matchedCards);
    }

    getCardValue(card) {
        return card.querySelector('.card-value').id
    }

    hideCards() {
        this.cards.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    checkForMatch(card) {
        if(this.getCardValue(card) === this.getCardValue(this.cardToMatch)) {
            this.cardMatch(card, this.cardToMatch);
        } else {
            this.cardMisMatch(card, this.cardToMatch);
        }
        this.cardToMatch = null;
    }

    cardMatch(card1, card2) {
        this.matchedCards.push(card1)
        this.matchedCards.push(card2)
        card1.classList.add('matched');
        card2.classList.add('matched');
        if(this.matchedCards.length === this.cards.length) {
            this.victory();
        }
    }

    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }

    victory() {
        clearInterval(this.countDown);
        document.querySelector('#victory-text').classList.add('visible');
    }

    gameOver() {
        clearInterval(this.countDown);
        document.querySelector('#game-over-text').classList.add('visible');
    }

    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false;
        }, 1000)
    }

    shuffleCards() {
        for(let i = this.cards.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i+1));
            this.cards[randomIndex].style.order = i
            this.cards[i].style.order = randomIndex;
        }
    }

    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToMatch;
    }
}


function ready() {
    const overlays = [...document.querySelectorAll('.overlay-text')];
    const cards = [...document.querySelectorAll('.card')];
    let game = new Game(100, cards)

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        })
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    })
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}