import { Tablero } from './views/tablero.js'

/**
 * La clase Game representa el controlador principal del juego.
 * @class
 */
export class Game {
  /**
   * Constructor de la clase Game.
   * Inicializa la propiedad 'game' en null.
   * @constructor
   */
  constructor () {
    /** @type {Tablero} */
    this.game = null
  }
 /**
   * Inicia el juego creando una nueva instancia de la clase Tablero.
   * Asigna la nueva instancia a la propiedad 'game'.
   * @method
   */
  iniciar () {
    this.game = new Tablero()
  }
}
const game = new Game()
game.iniciar()
