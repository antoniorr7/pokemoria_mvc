import { PokemonModels } from "../models/mjuego.js";

export class Tablero {
  constructor() {
    this.totalCards = 10;
    this.selectedCards = [];
    this.matchedPairs = 0;
    this.pokemonPairs = [];

    this.initializeGame();
   
}

async initializeGame() {
    this.datosPokemons = new PokemonModels();
  
    try {
      // Esperar a que se resuelva la promesa antes de continuar
      this.pokemones = await this.datosPokemons.getPokemonArray();
      
      // Seleccionar 5 Pokémon al azar
      const pokemonSeleccionados = this.selectRandomPokemons(5);
  
      // Duplicar los Pokémon seleccionados para crear parejas
      
  
      // Mezclar las cartas
      this.pokemonPairs = this.shuffleArray(this.pokemonPairs);

  
      // Imprime los resultados
      this.pokemonPairs = [...pokemonSeleccionados, ...pokemonSeleccionados];
      
      // Generar las cartas
      this.generarCartas();
      this.mostrarImagenes();
    } catch (error) {
      console.error("Error inicializando el juego:", error);
    }
  }
  
  selectRandomPokemons(numPokemons) {
    const selectedPokemons = [];
    
    for (let i = 0; i < numPokemons; i++) {
      const randomIndex = Math.floor(Math.random() * this.pokemones.length);
      const randomPokemon = this.pokemones[randomIndex];
      
      // Evitar duplicados
      if (!selectedPokemons.includes(randomPokemon)) {
        selectedPokemons.push(randomPokemon);
      } else {
        i--; // Repetir la iteración para seleccionar otro Pokémon
      }
    }
  
    return selectedPokemons;
  }
  

  generarCartas() {
    var gameContainer = document.getElementById('game-container');
    var cartasGeneradas = 0;
  
    // Genera cartas y agrega manejador de clics
    this.pokemonPairs.forEach((pokemon, index) => {
      if (cartasGeneradas < 10) {
        var div = document.createElement('div');
        div.className = 'card';
        div.dataset.index = index;
        div.addEventListener('click', () => this.flipCard(index));
  
        var imgFront = document.createElement('img');
       
        imgFront.className = 'front';
        div.appendChild(imgFront);
  
        var imgBack = document.createElement('img');
        imgBack.src = pokemon.image;
        imgBack.className = 'back';
  
        div.appendChild(imgBack);
        gameContainer.appendChild(div);
  
        cartasGeneradas++;
      }
    });
  }
 mostrarImagenes() {
  const pairsBar = document.getElementById('pairs-bar');

  // Mostrar imágenes en la barra de pares
  for (let i = 0; i < 5; i++) {
    const pokemon = this.pokemonPairs[i];

    const pairElement = document.createElement('div');
    pairElement.className = 'pair';

    const pairImage = document.createElement('img');
    pairImage.src = pokemon.image;

    pairElement.appendChild(pairImage);
    pairsBar.appendChild(pairElement);
  }
}



  flipCard(index) {
    // Verificar si se permite voltear cartas
    if (!this.isFlipping) {
      const card = document.querySelector(`.card[data-index="${index}"]:not(.correct)`);
    
      // Verificar si la carta no es correcta y no está ya volteada
      if (card && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        this.selectedCards.push({ index, pokemon: this.pokemonPairs[index] });
  
        if (this.selectedCards.length === 2) {
          this.isFlipping = true; // Bloquear el volteo mientras se realiza la animación
          setTimeout(() => {
            this.checkMatch();
            this.isFlipping = false; // Liberar el bloqueo después de la comprobación
          }, 1000);
        }
      }
    }
  }
  
  checkMatch() {
    const [card1, card2] = this.selectedCards;
  
    if (card1.pokemon.name === card2.pokemon.name) {
      // Coincidencia, mantener las cartas volteadas y marcarlas como correctas
      const matchedCards = document.querySelectorAll('.card.flipped');
      matchedCards.forEach(card => card.classList.add('correct'));
  
      this.matchedPairs++;
  
      if (this.matchedPairs === this.totalCards / 2) {
        alert('¡Felicidades! Has encontrado todas las parejas.');
      }
    } else {
      // No hay coincidencia, voltear solo las cartas incorrectas
      const flippedCards = document.querySelectorAll('.card.flipped:not(.correct)');
      flippedCards.forEach(card => card.classList.remove('flipped'));
    }
  
    this.selectedCards = [];
  }
  
  shuffleArray(array) {
    // Implementar una función de mezcla (puedes encontrar algoritmos en línea)
    // Aquí hay un ejemplo simple de mezcla de Fisher-Yates:
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
