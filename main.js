class Sokoban {
  #blocks;
  #interval;
  #level;
  #levels;
  #moves;
  #target;
  #timer;

  static TICK = 100;

  static TILE = Object.freeze({
    EMPTY: 0,
    SOCKET: 1,
    WALL: 2,
    CRATE: 4,
    PLAYER: 8,
  });

  /**
   * @param {HTMLDivElement} target
   */
  constructor(target, levels) {
    this.#levels = levels;
    this.#target = target;
  }

  /**
   * Get the current HTML representation of the level.
   */
  get #levelHtml() {
    return `<div class="level">${this.#blocks
      .map((block) => `<span data-block="${block}"></span>`)
      .join("")}</div>`;
  }

  get #movesHtml() {
    return `<p class="moves">Moves: <label>${this.#moves}</label></p>`;
  }

  get #timerHtml() {
    const time = new Date(this.#timer);

    const formattedTime = [time.getMinutes(), time.getSeconds()]
      .map((part) => part.toString().padStart(2, "0"))
      .join(":");

    return `<p class="timer">Timer: <time timestamp=${time.getTime()}>${formattedTime}</time></p>`;
  }

  get #html() {
    return [this.#levelHtml, this.#movesHtml, this.#timerHtml].join("");
  }

  /**
   * The height of the game's current level.
   *
   * @type {number}
   */
  get height() {
    return this.#level.height;
  }

  /**
   * The game's current level.
   *
   * @type {number}
   */
  get level() {
    return this.#level.id;
  }

  /**
   * The player's current position.
   *
   * @type {number}
   */
  get position() {
    return this.#blocks.findIndex((block) => block & Sokoban.TILE.PLAYER);
  }

  /**
   * The player's current level timer in milliseconds.
   *
   * @type {number}
   */
  get timer() {
    return this.#timer;
  }
  /**
   * The width of the game's current level.
   *
   * @type {number}
   */
  get width() {
    return this.#level.width;
  }

  #draw() {
    this.#target.innerHTML = this.#html;
  }

  #init(level) {
    this.#level = levels.find(({ id }) => id === level);
    this.#moves = 0;
    this.#timer = 0;

    this.#blocks = this.#level.rows
      .map((row) =>
        row
          .padEnd(this.width)
          .split("")
          .map((c) => [" ", ".", "#", , "$", , , , "@"].indexOf(c))
      )
      .reduce((prev, curr) => prev.concat(curr), []);
  }

  /**
   * Callback to handle keyboard "keydown" events.
   *
   * @param {KeyboardEvent} event
   */
  #onKeyDown({ key }) {
    switch (key) {
      case "ArrowDown":
      case "Down":
        this.#movePlayer(0, +1);
        break;

      case "ArrowLeft":
      case "Left":
        this.#movePlayer(-1, 0);
        break;

      case "ArrowRight":
      case "Right":
        this.#movePlayer(+1, 0);
        break;

      case "ArrowUp":
      case "Up":
        this.#movePlayer(0, -1);
        break;
    }

    this.#draw();
  }

  #loop() {
    this.#tick();
    this.#draw();

    if (
      this.#blocks.find((block) => block === Sokoban.TILE.CRATE) === undefined
    ) {
      alert("Winner!");
      this.#stop();
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #movePlayer(dx, dy, from = this.position, to = from + dx + dy * this.width) {
    if (this.#blocks[to] & Sokoban.TILE.CRATE) {
      this.#pushCrate(dx, dy, to);
    }

    if (
      this.#blocks[to] === Sokoban.TILE.EMPTY ||
      this.#blocks[to] === Sokoban.TILE.SOCKET
    ) {
      this.#blocks[from] -= Sokoban.TILE.PLAYER;
      this.#blocks[to] += Sokoban.TILE.PLAYER;
      this.#moves += 1;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #pushCrate(dx, dy, from, to = from + dx + dy * this.width) {
    if (
      this.#blocks[to] === Sokoban.TILE.EMPTY ||
      this.#blocks[to] === Sokoban.TILE.SOCKET
    ) {
      this.#blocks[from] -= Sokoban.TILE.CRATE;
      this.#blocks[to] += Sokoban.TILE.CRATE;
    }
  }

  #stop() {
    if (this.#interval) {
      clearInterval(this.#interval);
    }

    window.removeEventListener("keydown", this.#onKeyDown.bind(this));
  }

  #tick() {
    this.#timer += Sokoban.TICK;
  }

  /**
   * Play the game.
   *
   * @param {number} level
   */
  play(level = 1) {
    this.#stop();
    this.#init(level);
    this.#draw();

    this.#interval = setInterval(this.#loop.bind(this), Sokoban.TICK);
    window.addEventListener("keydown", this.#onKeyDown.bind(this));
  }
}
