const getRandom = (min, max) => Math.round(Math.random() * (max - min) + min);

const generateColor = () => {
  let color = "#";
  const letters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];

  for (let i = 0; i < 6; i++) {
    const index = getRandom(0, 16);
    color += letters[index];
  }

  return color;
};

const getTemplate = () => {
  return ` <div class="game">
        <div class="container">
               <div class="game__row">
                     <div class="game__preview">
                       <div class="game__start">
                         <button id='start'>Start</button>
                       </div>
                       <div class="game__description">
                        Сlick on the numbers until you reach the last.
                       </div>
                     </div>
                     <div class="game__content hide">
                       <div class="game__time">
                         Remaining: <span class="timer">20</span> seconds
                       </div>
                       <div class="game__result">
                         <div class="result__success hide">
                           You have won!
                         </div>
                         <div class="result__failure hide">
                           You have lost!
                         </div>
                       </div>
                       <div class="game__field">
                         <div class="field__container">
                               <div class="field__row">
                                   <div class="field__item"></div>
                                   <div class="field__item"></div>
                                   <div class="field__item"></div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                               </div>
                               <div class="field__row">
                                   <div  class="field__item">5</div>
                                   <div  class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                               </div>
                               <div class="field__row">
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                               </div>
                               <div class="field__row">
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                                   <div class="field__item">5</div>
                               </div>
                         </div>
                       </div>
                       <div class="game__restart">
                         <button id='restart'>Restart</button>
                       </div>
                     </div>
               </div>
        </div>
       </div>`;
};

export default class Field {
  constructor(selector) {
    this.$app = document.querySelector(selector);
    this.itemsList = null;
    this.activeValues = [];
    this.#render();
    this.#setup();
  }

  #render() {
    this.$app.innerHTML = getTemplate();
    this.#setElements();
  }

  #setup() {
    const startBtn = this.$app.querySelector("#start");
    this.startGame = this.startGame.bind(this);

    startBtn.addEventListener("click", this.startGame);
  }

  startGame() {
    const preview = this.$app.querySelector(".game__preview");
    const content = this.$app.querySelector(".game__content");
    const timeBar = this.$app.querySelector(".timer");
    let interval;
    let time = Number(timeBar.textContent);

    this.hide(preview);
    this.show(content);

    this.#gameStarted();

    interval = setInterval(() => {
      if (time > 0) {
        time -= 1;
        timeBar.textContent = String(time);
      } else if(time <= 0) {
        clearInterval(interval);
        this.#gameOver();
      }
    }, 1000);
  }

  #gameStarted() {
    const gameField = this.$app.querySelector(".game__content");
    this.handleItemClick = this.handleItemClick.bind(this);

    this.#getActiveValues();
    gameField.addEventListener("click", this.handleItemClick);
  }

  #gameOver() {
    const timeBar = this.$app.querySelector('.game__time')
    const result = this.$app.querySelector(".game__result");
    const successBar = result.querySelector(".result__success");
    const failureBar = result.querySelector(".result__failure");


    result.style.display = "block";
    timeBar.classList.add('hide')

    this.activeValues.length === 0
      ? successBar.classList.remove("hide")
      : failureBar.classList.remove("hide");
  }

  handleItemClick(event) {
    const item = event.target;

    if (
      item.classList.contains("field__item") &&
      +item.textContent === this.activeValues[0]
    ) {
      item.classList.add("clicked");
      this.activeValues.shift();
    } else if(item.getAttribute('id') === 'restart') {
      this.#render()
      this.#setup()
    }
  }

  #getActiveValues() {
    //getting values from nodes
    this.itemsList.forEach(
      (item, index) => (this.activeValues[index] = Number(item.textContent))
    );
    //sorting
    this.activeValues.sort((a, b) => a - b);
  }

  show(element) {
    element.classList.remove("hide");
  }

  hide(element) {
    element.classList.add("hide");
  }

  #setElements() {
    this.itemsList = document.querySelectorAll(".field__item");
    const randomedValues = [];

    for (let i = 0; i < this.itemsList.length; i++) {
      let number = getRandom(1, 20);
      let isIncluded = true;
      do {
        if (!randomedValues.includes(number)) {
          randomedValues[i] = number;
          isIncluded = false;
        } else number = getRandom(1, 20);
      } while (isIncluded);
    }

    this.itemsList.forEach((item, index) => {
      item.style.color = generateColor();
      item.style.fontSize = getRandom(10, 20) + "px";
      item.textContent = randomedValues[index];
    });
  }
}
