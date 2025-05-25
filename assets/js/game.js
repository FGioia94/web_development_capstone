class Pokémon {
  constructor(data, moves) {
    this.name = data.name;
    this.hp = data.stats[0].base_stat;
    this.attack = data.stats[1].base_stat;
    this.defense = data.stats[2].base_stat;
    this.sprite = data.sprites.front_default;
    this.moves = moves;
    this.isDead = false;
    console.log(this.moves);
  }

  attack_enemy(move, target) {
    const random = Math.random();
    const damage =
      (((2 * 1) / 5 + 2) * this.moves[move] * (this.attack / target.defense)) /
        50 +
      2;
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

async function main() {
  console.log("start")
  let data = await getRandomPokemon();
  let moves = await getMoves(data);
  const user = new Pokémon(data, moves);

  data = await getRandomPokemon();
  moves = await getMoves(data);
  const cpu = new Pokémon(data, moves);

  [user, cpu].forEach((element, index) => {
    console.log(element.moves)
    Object.keys(element.moves).forEach((move) => {
      const movesContainer = document.getElementsByClassName("moves-container")[index];
      console.log(movesContainer)
      const newButton = document.createElement("button");
      newButton.textContent = move;
      movesContainer.appendChild(newButton);
    });
  });
}

main();
