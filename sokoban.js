class Sokoban {
  /** @type {HTMLCanvasElement} */
  #canvas;

  /** @type {CanvasRenderingContext2D} */
  #ctx;

  #level;
  #moves;
  #tiles;
  #timer;

  /**
   * @param {Object} config
   * @param {HTMLCanvasElement} config.canvas
   */
  constructor({ canvas }) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
  }

  /**
   * The player's current position.
   *
   * @type {number}
   */
  get position() {
    return this.#level.tiles.findIndex((tile) => tile & Level.TILE.PLAYER);
  }

  get width() {
    return this.#level.width;
  }

  #bindInput() {
    window.addEventListener("keydown", throttle(handleInput.bind(this), 100));
  }

  /**
   * @param {KeyboardEvent} event
   */
  #handleInput({ key }) {
    switch (key) {
      case "ArrowDown":
      case "Down":
      case "S":
        this.#move(0, +1);
        break;

      case "ArrowLeft":
      case "Left":
      case "A":
        this.#move(-1, 0);
        break;

      case "ArrowRight":
      case "Right":
      case "D":
        this.#move(+1, 0);
        break;

      case "ArrowUp":
      case "Up":
      case "W":
        this.#move(0, -1);
        break;

      default:
        console.log(`Unexpected keypress: "${key}"`);
        break;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #movePlayer(
    dx,
    dy,
    from = this.position,
    to = this.position + dx + dy * this.width
  ) {
    if (this.#level.tiles[to] & Sokoban.TILE.CRATE) {
      this.#pushCrate(dx, dy, to);
    }

    if (
      this.#level.tiles[to] === Sokoban.TILE.EMPTY ||
      this.#level.tiles[to] === Sokoban.TILE.SOCKET
    ) {
      this.#level.tiles[from] -= Sokoban.TILE.PLAYER;
      this.#level.tiles[to] += Sokoban.TILE.PLAYER;
      this.#moves += 1;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #pushCrate(dx, dy, from, to = from + dx + dy * this.width) {
    if (
      this.#level.tiles[to] === Sokoban.TILE.EMPTY ||
      this.#level.tiles[to] === Sokoban.TILE.SOCKET
    ) {
      this.#level.tiles[from] -= Sokoban.TILE.CRATE;
      this.#level.tiles[to] += Sokoban.TILE.CRATE;
    }
  }

  #startLoop() {
    const loop = () => {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

      const tiles = [...this.#level.tiles];

      // this.#ctx.drawImage(image, dx,dy,dw,dh)

      requestAnimationFrame(loop);
    };

    loop();
  }

  play(id = 1) {
    this.#level = new Level(id);
    this.#moves = 0;
    this.#tiles = [...this.#level.tiles];
    this.#timer = 0;

    this.#startLoop();
  }
}
