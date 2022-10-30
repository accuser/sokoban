import Level from "./level";

/**
 * Sokoban is based on the orignal Sokoban by Thinking Rabbit.
 */
class Sokoban {
  /**
   * Interval period in milliseconds.
   */
  static TICK = 100;

  /**
   * The target HTML canvas element.
   *
   * @type {HTMLCanvasElement}
   */
  #canvas;

  /** @type {NodeJS.Timer} */
  #interval;

  /**
   * The current level.
   *
   * @type {Level}
   */
  #level;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  /**
   * Render the current level, moves, and timer to the target HTML canvas
   * element.
   *
   * @type {CanvasRenderingContext2D} ctx
   */
  #draw(ctx = this.#canvas.getContext("2d")) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.#level.draw(ctx);

    const time = new Date(this.#level.timer);

    const formattedTime = [time.getMinutes(), time.getSeconds()]
      .map((part) => part.toString().padStart(2, "0"))
      .join(":");

    ctx.fillStyle = "white";
    ctx.font = "bold 24px sans-serif";
    ctx.textAlign = "center";

    ctx.fillText(
      `${this.#level.moves.toString().padStart(4)}  /  ${formattedTime}`,
      this.#canvas.width / 2,
      this.#canvas.height
    );
  }

  /**
   * @param {KeyboardEvent} event
   */
  #handleInput({ key, repeat }) {
    if (!repeat) {
      switch (key) {
        case "ArrowDown":
        case "Down":
        case "s":
          this.#level.move(0, +1);
          break;

        case "ArrowLeft":
        case "Left":
        case "a":
          this.#level.move(-1, 0);
          break;

        case "ArrowRight":
        case "Right":
        case "d":
          this.#level.move(+1, 0);
          break;

        case "ArrowUp":
        case "Up":
        case "w":
          this.#level.move(0, -1);
          break;
      }
    }
  }

  #tick() {
    if (this.#level.isComplete === false) {
      this.#level.tick(Sokoban.TICK);
    }
  }

  /**
   * @param {number} level
   */
  play(level = 0) {
    const init = () => {
      this.#level = Level[level];

      if (this.#level) {
        window.addEventListener("keydown", this.#handleInput.bind(this));
        this.#interval = setInterval(this.#tick.bind(this), Sokoban.TICK);
        requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      this.#draw();

      if (this.#level.isComplete) {
        requestAnimationFrame(next);
      } else {
        requestAnimationFrame(loop);
      }
    };

    const next = () => {
      clearInterval(this.#interval);
      window.removeEventListener("keydown", this.#handleInput.bind(this));

      alert(`Level Complete`);

      this.play(level + 1);
    };

    init();
  }
}

export default Sokoban;
