/* A script that handles the dynamic functionalities of the game page
Author: Francesco Gioia
Last Modified: 06/06/2025*/

let documentData = {};
let counter = 0;

main();

class Pokémon {
  // Defines the pokemon class attributes and methods
  constructor(data, moves, isCpu = true) {
    this.name = data.name.toUpperCase();
    this.maxHp = data.stats[0].base_stat;
    this.hp = data.stats[0].base_stat;
    this.attack = data.stats[1].base_stat;
    this.defense = data.stats[2].base_stat;
    this.sprite = data.sprites.front_default;
    this.moves = moves;
    this.isDead = false;
    this.isCpu = isCpu;
    console.log(this.moves);
  }

  attack_enemy(move, target) {
    /*
    Method for executing an attack on an enemy Pokémon.
    Calculates damage based on move power, attack, and target defense,
    then applies it to the opponent's HP.

    @param {string} move - The name of the move being used.
    @param {Pokémon} target - The opposing Pokémon receiving the attack.
    */

    const damage = Math.floor(
      (((20 * 1) / 5 + 2) * this.moves[move] * (this.attack / target.defense)) /
        (50 + 2)
    );
    target.hp -= damage;
    if (target.hp <= 0) {
      target.isDead = true;
    }
  }
}

async function getRandomPokemon() {
  /*
  Fetches the pokeapi api to get a random pokemon name and data
  */
  try {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${randomId}`
    );
    if (!response.ok) throw new Error("Failed to fetch Pokémon data.");

    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return null; // Prevents breaking game logic
  }
}

async function getMoves(data) {
  /*
  Fetches the pokeapi api to get a random moves
  based on the ones available for a certain pokemon

  It only lists moves that actually inflict damage

  @param {object} data - The pokeapi data object of the desired pokemon
  */

  let moves = {};
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * data.moves.length);
    const move = data.moves[index];
    const power = (await getPower(move)).power;
    if (power !== null) {
      moves[data.moves[index].move.name] = power;
    } else {
      i--;
    }
  }
  return moves;
}

async function getPower(attack) {
  const response = await fetch(`${attack.move.url}`);
  const data = await response.json();
  return data;
}

async function main() {
  // Get the sprite containers, loaders and gameareas
  const spriteContainers = document.getElementsByClassName("sprites-container");
  [spriteContainers[0], spriteContainers[1]].forEach((container) => {
    container.innerHTML = "";
  });
  document.getElementById("loader").style.display = "inline";
  document.getElementById("game-area").style.visibility = "hidden";
  const gameArea = document.getElementById("game-area");
  const playAgainContainer = document.getElementById("play-again-container");

  // show the game area
  gameArea.hidden = false;
  playAgainContainer.hidden = true;

  // reset the healthbar
  const healthBarUser = document.getElementById("user-hp");
  const healthBarCpu = document.getElementById("cpu-hp");
  healthBarUser.style.width = `100%`;
  healthBarCpu.style.width = `100%`;

  // pick two random pokemon and moves
  let data = await getRandomPokemon();
  let moves = await getMoves(data);
  const player = new Pokémon(data, moves, false);

  data = await getRandomPokemon();
  moves = await getMoves(data);
  const cpu = new Pokémon(data, moves);

  [player, cpu].forEach((element, index) => {
    let target, elementLabel;
    if (element.isCpu) {
      target = player;
      elementLabel = "cpu";
    } else {
      target = cpu;
      elementLabel = "player";
    }

    documentData[elementLabel] = {};

    console.log(element.moves);
    const spritesContainer =
      document.getElementsByClassName("sprites-container")[index];
    const pokemonName = document.createElement("h2");

    // add the pokemon name
    pokemonName.textContent = element.name;
    spritesContainer.appendChild(pokemonName);

    const health = document.createElement("p");
    element.healthText = health;
    documentData[elementLabel]["healthText"] = health;
    health.textContent = `HP ${element.hp}/${element.maxHp}`;

    // add the healthbar to the container
    spritesContainer.appendChild(health);

    // add the sprite to the container
    const sprite = document.createElement("img");
    documentData[elementLabel]["sprite"] = sprite;
    sprite.src = element.sprite;
    spritesContainer.appendChild(sprite);

    // add the moves
    documentData[elementLabel]["moveButtons"] = [];
    const movesContainer =
      document.getElementsByClassName("moves-container")[index];
    movesContainer.innerHTML = "";
    Object.keys(element.moves).forEach((move) => {
      const moveButton = document.createElement("button");
      moveButton.classList.add("move-button");
      documentData[elementLabel]["moveButtons"].push(moveButton);

      moveButton.textContent = move;
      moveButton.onclick = () => {
        attack(element, move, target);
      };
      movesContainer.appendChild(moveButton);
    });
  });

  // hide the loader when the fetch is finished
  document.getElementById("loader").style.display = "none";
  document.getElementById("game-area").style.visibility = "visible";
  processTurns();
}

function attack(attacker, move, target) {
  /*
  Handles the attack logic in a Pokémon battle.
  Locks the action buttons during the attack, updates the message display, 
  applies damage to the target, and checks whether a Pokémon has fainted.
  If the target is defeated, the game state updates accordingly.

  @param {Pokémon} attacker - The Pokémon initiating the attack.
  @param {string} move - The move being used by the attacker.
  @param {Pokémon} target - The Pokémon receiving the attack.
  */

  // Lock action buttons to prevent further moves during attack
  lockButtons("player");
  lockButtons("cpu");

  // Display attack message
  const message = document.getElementById("message");
  message.textContent = `${attacker.name} uses ${move}`;

  // Execute attack logic and apply damage
  attacker.attack_enemy(move, target);

  if (!target.isDead) {
    target.healthText.textContent = `HP ${target.hp}/${target.maxHp}`;
  } else {
    target.healthText.textContent = `HP 0/${target.maxHp}`;

    message.textContent = `${attacker.name} defeated ${target.name}`;

    // Trigger post-battle sequence after a short delay
    setTimeout(() => {
      const gameArea = document.getElementById("game-area");
      const playAgainContainer = document.getElementById(
        "play-again-container"
      );

      // Hide battle area and show the play-again prompt
      gameArea.hidden = true;
      playAgainContainer.hidden = false;
      const winLoseText = document.getElementById("win-lose-text");

      if (target.isCpu) {
        winLoseText.textContent = "YOU WIN";

        let defeatedList = localStorage.getItem("defeatedList");
        defeatedList = defeatedList ? JSON.parse(defeatedList) : []; // Convert from string to array

        if (sessionStorage.getItem("isLoggedIn")) {
          if (!defeatedList.includes(target.name)) {
            console.log(defeatedList);
            defeatedList.push(target.name);

            localStorage.setItem("defeatedList", JSON.stringify(defeatedList));
          }
        }
      } else {
        winLoseText.textContent = "YOU LOSE";
      }
      const playAgainButton = document.getElementById("play-again");
      playAgainButton.onclick = () => {
        main();
      };

      // Reset battle message and counter
      message.textContent = "Ready to Fight!";
      counter = 0;
    }, 3000);
  }
  let healthBar;

  // Update health bar visuals
  if (target.isCpu) {
    healthBar = document.getElementById("cpu-hp");
  } else {
    healthBar = document.getElementById("user-hp");
  }
  let healthPercentage = Math.floor((target.hp / target.maxHp) * 100);
  healthPercentage = Math.max(0, Math.min(healthPercentage, 100));
  healthBar.style.width = `${healthPercentage}%`;
  counter++;

  // Increase turn counter and continue battle if both Pokémon are alive
  if (!attacker.isDead && !target.isDead) {
    processTurns();
  }
}

function unlockButtons(target) {
  /*
  Unlocks all move buttons for the specified target (player or CPU).
  Allows the target to perform an action in battle.

  @param {string} target - Specifies whether "player" or "cpu" buttons should be unlocked.
  */

  documentData[target]["moveButtons"].forEach((moveButton) => {
    moveButton.disabled = false;
  });
}
function lockButtons(target) {
  /*
  Locks all move buttons for the specified target (player or CPU).
  Prevents the target from making a move until the next turn.

  @param {string} target - Specifies whether "player" or "cpu" buttons should be locked.
  */

  documentData[target]["moveButtons"].forEach((moveButton) => {
    moveButton.disabled = true;
  });
}
function processTurns() {
  const pokemonCards = document.getElementsByClassName("pokemon");
  /*
  Handles the turn-based battle logic by alternating between player and CPU moves.
  Controls button states, background colors, and CPU move execution.
  */

  if (counter % 2 === 0) {
    // Player's turn: Unlock player buttons, lock CPU buttons, update visual indica
    unlockButtons("player");
    lockButtons("cpu");
    pokemonCards[0].style.backgroundColor = "lightblue";
    pokemonCards[1].style.backgroundColor = "lightgray";
  } else {
    // CPU's turn: Disable player buttons, highlight CPU's card, and execute
    documentData["player"]["moveButtons"].forEach((moveButton) => {
      moveButton.disabled = true;
    });

    pokemonCards[0].style.backgroundColor = "lightgray";
    pokemonCards[1].style.backgroundColor = "lightblue";

    // Select a random move for the CPU and execute after a short delay
    const randomIndex = Math.floor(Math.random() * 4);
    setTimeout(() => {
      unlockButtons("cpu");
      documentData["cpu"]["moveButtons"][randomIndex].click();
    }, 1000);
  }
}
