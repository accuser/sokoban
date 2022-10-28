class Tile {
  /** @type {HTMLImageElement} */
  #image;

  /**
   * @param {string} src
   */
  constructor(src) {
    this.#image = new Image();
    this.#image.src = src;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} dx
   * @param {number} dy
   * @param {number} dw
   * @param {number} dh
   */
  draw(ctx, dx, dy, dw, dh) {
    ctx.drawImage(this.#image, dx, dy, dw, dh);
  }

  static [0] = new Tile("assets/empty.png");
  static [1] = new Tile("assets/socket.png");
  static [2] = new Tile("assets/wall.png");
  static [4] = new Tile("assets/crate.png");
  static [5] = new Tile("assets/socket-crate.png");
  static [8] = new Tile("assets/player.png");
  static [9] = new Tile("assets/player.png");
}

export default Tile;
