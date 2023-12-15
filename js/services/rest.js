/**
 * Clase que representa una interfaz para interactuar con la API de Pokémon.
 * @class
 */
export class PokemonAPI {
  /**
   * Constructor de la clase PokemonAPI.
   * @constructor
   * @param {string} baseUrl - La URL base de la API de Pokémon.
   * @param {number} limit - El límite de resultados que se deben recuperar de la API.
   */
  constructor (baseUrl, limit) {
     /**
     * La URL base de la API de Pokémon.
     * @type {string}
     */
    this.baseUrl = baseUrl
    /**
     * El límite de resultados que se deben recuperar de la API.
     * @type {number}
     */
    this.limit = limit
  }
 /**
   * Método asíncrono para recuperar datos de la API de Pokémon.
   * @method
   * @returns {Promise<Array>} Una promesa que se resuelve con la lista de resultados.
   * @throws {Error} Si hay un error al obtener datos de la API.
   */
  async fetchPokemonData () {
    try {
      const url = `${this.baseUrl}?limit=${this.limit}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error al obtener datos de la API. Código de estado: ${response.status}`)
      }

      const data = await response.json()
      return data.results
    } catch (error) {
      console.error('Error al obtener datos de la API de Pokémon:', error)
      throw error
    }
  }
}
