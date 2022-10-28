import Level from "./level";
import Tile from "./tile";
import { throttle } from "./utils";

class Sokoban {
  static EMPTY = 0;
  static SOCKET = 1;
  static WALL = 2;
  static CRATE = 4;
  static PLAYER = 8;

  /** @type {HTMLCanvasElement} */
  #canvas;

  /** @type {CanvasRenderingContext2D} */
  #ctx;

  /** @type {Level} */
  #level;

  /** @type {number} */
  #moves;

  /** @type {number[]} */
  #tiles;

  /** @type {number} */
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
  get #position() {
    return this.#tiles.findIndex((tile) => tile & Sokoban.PLAYER);
  }

  /**
   * @param {KeyboardEvent} event
   */
  #handleInput({ key }) {
    switch (key) {
      case "ArrowDown":
      case "Down":
      case "s":
        this.#move(0, +1);
        break;

      case "ArrowLeft":
      case "Left":
      case "a":
        this.#move(-1, 0);
        break;

      case "ArrowRight":
      case "Right":
      case "d":
        this.#move(+1, 0);
        break;

      case "ArrowUp":
      case "Up":
      case "w":
        this.#move(0, -1);
        break;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #move(dx, dy, from = this.#position) {
    const to = this.#position + dx + dy * this.#level.width;

    if (this.#tiles[to] & 4) {
      this.#push(dx, dy, to);
    }

    if (
      this.#tiles[to] === Sokoban.EMPTY ||
      this.#tiles[to] === Sokoban.SOCKET
    ) {
      this.#tiles[from] -= Sokoban.PLAYER;
      this.#tiles[to] += Sokoban.PLAYER;
      this.#moves += 1;
    }
  }

  /**
   * @param {number} dx
   * @param {number} dy
   */
  #push(dx, dy, from) {
    const to = from + dx + dy * this.#level.width;

    if (
      this.#tiles[to] === Sokoban.EMPTY ||
      this.#tiles[to] === Sokoban.SOCKET
    ) {
      this.#tiles[from] -= Sokoban.CRATE;
      this.#tiles[to] += Sokoban.CRATE;
    }
  }

  #startLoop() {
    window.addEventListener(
      "keydown",
      throttle(this.#handleInput.bind(this), 100)
    );

    const loop = () => {
      if (this.#tiles.some((tile) => tile === Sokoban.CRATE)) {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        const scale = this.#canvas.width / this.#level.width;

        for (let i = 0; i < this.#tiles.length; i++) {
          const dx = i % this.#level.width;
          const dy = Math.floor(i / this.#level.width);
          const tile = Tile[this.#tiles[i]];

          tile.draw(this.#ctx, dx * scale, dy * scale, scale, scale);
        }

        requestAnimationFrame(loop);
      } else {
        alert("Winner");
      }
    };

    loop();
  }

  /**
   * Play the game.
   *
   * @param {number} level
   */
  play(level = 1) {
    this.#level = Level[level];
    this.#moves = 0;
    this.#tiles = [...this.#level.tiles];
    this.#timer = 0;

    this.#startLoop();
  }
}

export default Sokoban;
