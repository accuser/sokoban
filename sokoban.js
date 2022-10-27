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
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
  }

  /**
   * The player's current position.
   *
   * @type {number}
   */
  get position() {
    return this.#tiles.findIndex((tile) => tile & 8);
  }

  #bindInput() {
    window.addEventListener("keydown", this.#handleInput.bind(this), 100);
  }

  /**
   * @param {KeyboardEvent} event
   */
  #handleInput({ key }) {
    switch (key) {
      case "ArrowDown":
      case "Down":
      case "s":
        this.#movePlayer(0, +1);
        break;

      case "ArrowLeft":
      case "Left":
      case "a":
        this.#movePlayer(-1, 0);
        break;

      case "ArrowRight":
      case "Right":
      case "d":
        this.#movePlayer(+1, 0);
        break;

      case "ArrowUp":
      case "Up":
      case "w":
        this.#movePlayer(0, -1);
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
    to = this.position + dx + dy * this.#level.width
  ) {
    if (this.#tiles[to] & 4) {
      this.#pushCrate(dx, dy, to);
    }

    if (this.#tiles[to] === 0 || this.#tiles[to] === 1) {
      this.#tiles[from] -= 8;
      this.#tiles[to] += 8;
      this.#moves += 1;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #pushCrate(dx, dy, from, to = from + dx + dy * this.#level.width) {
    if (this.#tiles[to] === 0 || this.#tiles[to] === 1) {
      this.#tiles[from] -= 4;
      this.#tiles[to] += 4;
    }
  }

  #startLoop() {
    const loop = () => {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

      const tiles = [...this.#level.tiles];
      const scale = this.#canvas.width / this.#level.width;

      for (let i = 0; i < this.#tiles.length; i++) {
        const dx = i % this.#level.width;
        const dy = Math.floor(i / this.#level.width);

        const image = Level.TILE[this.#tiles[i]];

        if (image) {
          this.#ctx.drawImage(image, dx * scale, dy * scale, scale, scale);
        }
      }

      requestAnimationFrame(loop);
    };

    loop();
  }

  play(id = 1) {
    this.#level = new Level(id);
    this.#moves = 0;
    this.#tiles = [...this.#level.tiles];
    this.#timer = 0;

    this.#bindInput();

    this.#startLoop();
  }
}
