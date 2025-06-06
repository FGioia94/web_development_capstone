async function getSprite(pokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  const data = await response.json();
  return data.sprites.front_default;
}
async function main() {
  let defeatedList = localStorage.getItem("defeatedList");
  defeatedList = defeatedList ? JSON.parse(defeatedList) : []; 

  console.log(defeatedList);
  const pokedex = document.getElementById("pokedex");
  for (const pokemon of defeatedList) {
    console.log(pokemon);
    const sprite = await getSprite(pokemon);
    console.log(sprite);
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card")
    const nameLabel = document.createElement("h3");
    const image = document.createElement("img");
    pokemonCard.appendChild(nameLabel);
    pokemonCard.appendChild(image);
    pokedex.appendChild(pokemonCard);
    nameLabel.innerText = pokemon;
    image.src = sprite;
    console.log(localStorage);
  }
}
main();
