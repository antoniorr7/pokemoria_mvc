export class PokemonAPI {
  constructor(baseUrl, limit) {
      this.baseUrl = baseUrl;
      this.limit = limit;
  }

  async fetchPokemonData() {
    try {
        const url = `${this.baseUrl}?limit=${this.limit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error al obtener datos de la API. Código de estado: ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error al obtener datos de la API de Pokémon:', error);
        throw error;
    }
}

 
}
