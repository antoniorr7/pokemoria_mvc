import { Tablero } from './views/tablero.js'

export class Game {
  constructor () {
    this.game = null
  }

  iniciar () {
    this.game = new Tablero()
  }
}
const game = new Game()
game.iniciar()
