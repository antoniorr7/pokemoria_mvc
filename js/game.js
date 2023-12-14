import { Tablero } from "./views/tablero.js";

export class Game {
  constructor() {
    this.game = new Tablero();
}
}
const game = new Game();