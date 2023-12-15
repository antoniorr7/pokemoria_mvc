import { PokemonAPI } from '../services/rest.js'

/**
 * Clase que encapsula la lógica para obtener datos de Pokémon y transformarlos.
 * @class
 */
export class PokemonModels {
  /**
   * Constructor de la clase PokemonModels.
   * Crea una instancia de PokemonAPI con una URL base y un límite predefinidos.
   * @constructor
   */
  constructor () {
     /**
     * Instancia de PokemonAPI utilizada para obtener datos de Pokémon.
     * @type {PokemonAPI}
     */
    this.nombres = new PokemonAPI('https://pokeapi.co/api/v2/pokemon/', 20)
  }
 /**
   * Método asíncrono para obtener un array de objetos con nombres e imágenes de Pokémon.
   * @method
   * @returns {Promise<Array>} Una promesa que se resuelve con un array de objetos de Pokémon.
   * Cada objeto contiene propiedades 'name' (nombre) e 'image' (URL de la imagen).
   * @throws {Error} Si hay un error al obtener datos de Pokémon.
   */
  async getPokemonArray () {
    try {
      const pokemonData = await this.nombres.fetchPokemonData()

      // Mapear los datos de la API para obtener un array de objetos con nombre e imagen
      const pokemonArray = pokemonData.map((pokemon, index) => ({
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
      }))

      return pokemonArray
    } catch (error) {
      console.error('Error obteniendo datos de Pokémon:', error)
      throw error
    }
  }
}
