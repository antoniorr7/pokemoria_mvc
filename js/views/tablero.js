import { PokemonModels } from '../models/mjuego.js'

export class Tablero {
  constructor () {
    this.totalCards = 10
    this.selectedCards = []
    this.matchedPairs = 0
    this.pokemonPairs = []
    this.dragDropInProgress = false
    this.initializeGame()
    this.dragRequired = false
    this.cartasMesa = null
  }

  async initializeGame () {
    this.datosPokemons = new PokemonModels()

    try {
    // Esperar a que se resuelva la promesa antes de continuar
      this.pokemones = await this.datosPokemons.getPokemonArray()

      // Seleccionar 5 Pokémon al azar
      const pokemonSeleccionados = this.selectRandomPokemons(5)

      // Duplicar los Pokémon seleccionados para crear parejas
      this.pokemonPairs = [...pokemonSeleccionados, ...pokemonSeleccionados]

      // Mezclar las cartas
      this.pokemonPairs = this.shuffleArray(this.pokemonPairs)

      // Imprime los resultados
      this.generarCartas()
      this.ImagenesBarra()
    } catch (error) {
      console.error('Error inicializando el juego:', error)
    }
  }

  selectRandomPokemons (numPokemons) {
    const selectedPokemons = []

    for (let i = 0; i < numPokemons; i++) {
      const randomIndex = Math.floor(Math.random() * this.pokemones.length)
      const randomPokemon = this.pokemones[randomIndex]

      // Evitar duplicados
      if (!selectedPokemons.includes(randomPokemon)) {
        selectedPokemons.push(randomPokemon)
      } else {
        i-- // Repetir la iteración para seleccionar otro Pokémon
      }
    }

    return selectedPokemons
  }

  generarCartas () {
    const gameContainer = document.getElementById('game-container')
    let cartasGeneradas = 0

    this.pokemonPairs.forEach((pokemon, index) => {
      if (cartasGeneradas < 10) {
        const div = document.createElement('div')
        div.className = 'card'
        div.dataset.index = index

        div.addEventListener('click', () => this.flipCard(index))

        const imgFront = document.createElement('img')
        imgFront.className = 'front'
        div.appendChild(imgFront)

        const imgBack = document.createElement('img')
        imgBack.src = pokemon.image
        imgBack.className = 'back'
        imgBack.draggable = true
        imgBack.addEventListener('dragstart', (e) => this.dragStart(e))

        div.appendChild(imgBack)
        gameContainer.appendChild(div)

        cartasGeneradas++
      }
    })
  }

  ImagenesBarra () {
    const pairsBar = document.getElementById('pairs-bar')

    // Mostrar imágenes en la barra de pares
    const uniquePokemons = [...new Set(this.pokemonPairs.map(pair => pair.name))]

    // Desordenar el array de nombres de Pokémon
    const shuffledPokemons = uniquePokemons.sort(() => Math.random() - 0.5)

    shuffledPokemons.forEach(pokemonName => {
      const pairElement = document.createElement('div')
      pairElement.className = 'pair'

      const pairImage = document.createElement('img')
      const pokemon = this.pokemonPairs.find(pair => pair.name === pokemonName)
      pairImage.src = pokemon.image

      pairElement.appendChild(pairImage)
      pairsBar.appendChild(pairElement)
    })
  }

  flipCard (index) {
    // Check if a drag operation is required
    if (this.dragRequired) {
      return
    }

    // Verificar si se permite voltear cartas y no hay más de dos cartas ya volteadas
    if (!this.isFlipping) {
      const card = document.querySelector(`.card[data-index="${index}"]:not(.correct)`)

      // Verificar si la carta no es correcta, no está ya volteada y no se están volteando más de dos cartas
      if (card && !card.classList.contains('flipped') && this.selectedCards.length < 2) {
        card.classList.add('flipped')
        this.selectedCards.push({ index, pokemon: this.pokemonPairs[index] })

        if (this.selectedCards.length === 2) {
          this.isFlipping = true // Bloquear el volteo mientras se realiza la animación
          setTimeout(() => {
            this.checkMatch()
            this.isFlipping = false // Liberar el bloqueo después de la comprobación
          }, 1000)
        }
      }
    }
  }

  checkMatch () {
    const [card1, card2] = this.selectedCards

    if (card1.pokemon.name === card2.pokemon.name) {
      const matchedCards = document.querySelectorAll('.card.flipped')
      matchedCards.forEach(card => {
        card.classList.add('correct')
        card.draggable = true
        card.addEventListener('dragstart', (e) => this.dragStart(e))
        card.addEventListener('dragend', () => this.dragEnd())
        card.addEventListener('dragover', (e) => this.dragOver(e))
        card.addEventListener('drop', (e) => this.drop(e))

        // Set dragRequired to true when a pair is matched
        this.dragRequired = true
      })

      this.matchedPairs++

      if (this.matchedPairs === this.totalCards / 2) {
        // Implementa la lógica para cuando se hayan encontrado todas las parejas
      }
    } else {
      const flippedCards = document.querySelectorAll('.card.flipped:not(.correct)')
      flippedCards.forEach(card => card.classList.remove('flipped'))
    }

    this.selectedCards = []
    this.comprobarVictoria()
  }

  comprobarVictoria () {
    this.cartasMesa = document.getElementById('game-container')

    if (this.cartasMesa.childElementCount < 6) {
      alert('Terminaste, Miguel. No busques más bugs, ¡esta joya está terminada!')
    }
  }

  dragStart (e) {
    e.dataTransfer.setData('text/plain', e.target.parentElement.dataset.index)
    this.dragDropInProgress = true
  }

  dragEnd () {
    this.dragDropInProgress = false
  }

  dragOver (e) {
    if (this.dragDropInProgress) {
      e.preventDefault()
    }
  }

  drop (e) {
    e.preventDefault()
    if (this.dragDropInProgress) {
      const draggedIndex = e.dataTransfer.getData('text/plain')
      const draggedCard = document.querySelector(`.card[data-index="${draggedIndex}"]`)
      const dropTarget = e.target.closest('.card')

      if (draggedCard && dropTarget && draggedCard !== dropTarget) {
        const draggedImage = draggedCard.querySelector('.back').src
        const dropTargetImage = dropTarget.querySelector('.back').src

        if (draggedImage === dropTargetImage) {
          const gameContainer = document.getElementById('game-container')
          gameContainer.removeChild(draggedCard)

          // Reset dragRequired after a successful drag operation
          this.dragRequired = false
        }
      }
    }
    this.comprobarVictoria()
  }

  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }
}
