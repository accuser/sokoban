class Sokoban {
  #blocks;
  #interval;
  #level;
  #levels;
  #moves;
  #target;
  #timer;

  static EMPTY = 0;
  static SOCKET = 1;
  static WALL = 2;
  static CRATE = 4;
  static PLAYER = 8;

  static TICK = 100;

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
  get #html() {
    return this.#blocks
      .map((block) => `<span data-block="${block}"></span>`)
      .join("");
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
    return this.#blocks.findIndex((block) => block & Sokoban.PLAYER);
  }

  /**
   * The player's level timer.
   *
   * @type {timer}
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
    this.#tick();
    this.#draw();

    if (this.#blocks.find((block) => block === Sokoban.CRATE) === undefined) {
      alert("Winner!");
      this.#stop();
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #move(dx, dy, from = this.position, to = from + dx + dy * this.width) {
    if (this.#blocks[to] & Sokoban.CRATE) {
      this.#push(dx, dy, to);
    }

    if (
      this.#blocks[to] === Sokoban.EMPTY ||
      this.#blocks[to] === Sokoban.SOCKET
    ) {
      this.#blocks[from] -= Sokoban.PLAYER;
      this.#blocks[to] += Sokoban.PLAYER;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #push(dx, dy, from, to = from + dx + dy * this.width) {
    if (
      this.#blocks[to] === Sokoban.EMPTY ||
      this.#blocks[to] === Sokoban.SOCKET
    ) {
      this.#blocks[from] -= Sokoban.CRATE;
      this.#blocks[to] += Sokoban.CRATE;
    }
  }

  #stop() {
    if (this.#interval) {
      clearInterval(this.#interval);
    }

    window.removeEventListener("keydown", this.#keys.bind(this));
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
    window.addEventListener("keydown", this.#keys.bind(this));
  }
}
