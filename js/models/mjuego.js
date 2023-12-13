import { PokemonAPI } from "../services/rest.js";

export class PokemonModels {
  constructor() {
    this.nombres = new PokemonAPI('https://pokeapi.co/api/v2/pokemon/', 20);
  }

  async getPokemonArray() {
    try {
      const pokemonData = await this.nombres.fetchPokemonData();

      // Mapear los datos de la API para obtener un array de objetos con nombre e imagen
      const pokemonArray = pokemonData.map((pokemon, index) => ({
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      }));

      return pokemonArray;
    } catch (error) {
      console.error("Error obteniendo datos de Pokémon:", error);
      throw error;
    }
  }
}
