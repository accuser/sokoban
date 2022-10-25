class Sokoban {
  #blocks = [
    2, 2, 2, 2, 2, 2, 1, 0, 0, 2, 2, 0, 4, 0, 2, 2, 0, 0, 8, 2, 2, 2, 2, 2, 2,
  ];
  #interval;
  #moves;
  #target;

  EMPTY = 0;
  SOCKET = 1;
  WALL = 2;
  CRATE = 4;
  PLAYER = 8;

  /**
   * @param {HTMLDivElement} target
   */
  constructor(target) {
    this.#target = target;
  }

  /**
   * The player's move count.
   *
   * @type {number}
   */
  get moves() {
    return this.#moves;
  }

  /**
   * The player's current position.
   *
   * @type {number}
   */
  get position() {
    return this.#blocks.findIndex((block) => block & this.PLAYER);
  }

  /**
   * Get the HTML representation of the playing field.
   */
  get #html() {
    return this.#blocks
      .map((block) => `<span data-block="${block}"></span>`)
      .join("");
  }

  #draw() {
    this.#target.innerHTML = this.#html;
  }

  /**
   * @param {KeyboardEvent} event
   */
  #keys({ key }) {
    switch (key) {
      case "ArrowDown":
      case "Down":
        this.#move(0, +1);
        break;

      case "ArrowLeft":
      case "Left":
        this.#move(-1, 0);
        break;

      case "ArrowRight":
      case "Right":
        this.#move(+1, 0);
        break;

      case "ArrowUp":
      case "Up":
        this.#move(0, -1);
        break;
    }

    this.#draw();
  }

  #loop() {
    this.#draw();

    if (this.#blocks.find((block) => block === this.CRATE) === undefined) {
      alert("Winner!");
      this.#stop();
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #move(dx, dy, from = this.position, to = from + dx + dy * 5) {
    if (this.#blocks[to] === this.CRATE) {
      this.#push(dx, dy, to);
    }

    if (this.#blocks[to] === this.EMPTY || this.#blocks[to] === this.SOCKET) {
      this.#blocks[from] -= this.PLAYER;
      this.#blocks[to] += this.PLAYER;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #push(dx, dy, from, to = from + dx + dy * 5) {
    if (this.#blocks[to] === this.EMPTY || this.#blocks[to] === this.SOCKET) {
      this.#blocks[from] -= this.CRATE;
      this.#blocks[to] += this.CRATE;
    }
  }

  #init() {
    this.#moves = 0;
    this.#interval = setInterval(this.#loop.bind(this), 100);

    window.addEventListener("keydown", this.#keys.bind(this));
  }

  #stop() {
    if (this.#interval) {
      clearInterval(this.#interval);
    }

    window.removeEventListener("keydown", this.#keys.bind(this));
  }

  play() {
    this.#stop();
    this.#init();
  }
}
