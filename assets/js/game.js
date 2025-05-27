class Pokémon {
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
    const random = Math.random();
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
  const randomId = Math.floor(Math.random() * 1025) + 1; // Pokémon IDs go from 1 to 1025
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  return data;
}
async function getMoves(data) {
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
  const data = response.json();
  return data;
}

let documentData = {};
let counter = 0;

async function main() {
  const gameArea = document.getElementById("game-area");
  const playAgainContainer = document.getElementById("play-again-container");
  gameArea.hidden = false;
  playAgainContainer.hidden = true;
  let data = await getRandomPokemon();
  let moves = await getMoves(data);
  const player = new Pokémon(data, moves, (isCpu = false));

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
    pokemonName.textContent = element.name;
    spritesContainer.appendChild(pokemonName);

    const health = document.createElement("p");
    element.healthText = health;
    documentData[elementLabel]["healthText"] = health;
    health.textContent = `HP ${element.hp}/${element.maxHp}`;
    spritesContainer.appendChild(health);

    const sprite = document.createElement("img");
    documentData[elementLabel]["sprite"] = sprite;
    sprite.src = element.sprite;
    spritesContainer.appendChild(sprite);
    documentData[elementLabel]["moveButtons"] = [];
    Object.keys(element.moves).forEach((move) => {
      const movesContainer =
        document.getElementsByClassName("moves-container")[index];
      const moveButton = document.createElement("button");
      documentData[elementLabel]["moveButtons"].push(moveButton);

      moveButton.textContent = move;
      moveButton.onclick = () => {
        attack(element, move, target);
      };
      movesContainer.appendChild(moveButton);
    });
  });

  processTurns();
}

function attack(attacker, move, target) {
  const message = document.getElementById("message");
  message.textContent = `${attacker.name} uses ${move}`;

  attacker.attack_enemy(move, target);
  if (!target.isDead) {
    target.healthText.textContent = `HP ${target.hp}/${target.maxHp}`;
  } else {
    console.log("hello");
    target.healthText.textContent = `HP 0/${target.maxHp}`;
    setTimeout(3000);
    message.textContent = `${attacker.name} defeated ${target.name}`;
    const gameArea = document.getElementById("game-area");
    const playAgainContainer = document.getElementById("play-again-container");
    gameArea.hidden = true;

    playAgainContainer.hidden = false;
    const winLoseText = document.getElementById("win-lose-text");

    if (target.isCpu) {
      winLoseText.textContent = "YOU WIN";
    } else {
      winLoseText.textContent = "YOU LOSE";
    }
    const playAgainButton = document.getElementById("play-again");
    playAgainButton.onclick = () => {
      main();
    };
    counter = 0;
  }
  counter++;
  unlockButtons();
  processTurns();
}

function unlockButtons() {
  ["player", "cpu"].forEach((element) => {
    documentData[element]["moveButtons"].forEach((moveButton) => {
      moveButton.disabled = false;
    });
  });
}
function processTurns() {
  if (counter % 2 === 0) {
    documentData["cpu"]["moveButtons"].forEach((moveButton) => {
      moveButton.disabled = true;
    });
  } else {
    documentData["player"]["moveButtons"].forEach((moveButton) => {
      moveButton.disabled = true;
    });
  }
}

main();
