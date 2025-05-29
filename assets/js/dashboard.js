async function fetchPokedex() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
  const data = await response.json();
  return data.results;
}
async function getSprites(pokemonList) {
  
  const requests = pokemonList.map((pokemon) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`).then((res) =>
      res.json()
    )
  );
  // merging all the promises to avoid exceding the api request limit (100 requests per IP)
  try {
    const pokemonData = await Promise.all(requests);
    return pokemonData.map((pokemon) => pokemon.sprites.front_default);
  } catch (error) {
    console.error("Error fetching Pokémon sprites:", error);
  }
}

// Example usage
const pokemonNames = ["pikachu", "charizard", "bulbasaur"];
getSprites(pokemonNames).then((sprites) => console.log(sprites));

fetchPokedex().then((pokemonList) => {
  const pokedex = document.getElementById("pokedex");
  const sprites = getSprites(pokemonList);
  pokemonList.forEach((pokemon, index) => {
    const pokemonCard = document.createElement("div");
    const nameLabel = document.createElement("h3");
    const imageLabel = document.createElement("img");
    pokemonCard.appendChild(nameLabel);
    pokemonCard.appendChild(imageLabel);
    pokedex.appendChild(pokemonCard);
    nameLabel.innerText =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    console.log(pokemon);
    imageLabel.src = sprites[index].detail.sprites.front_default;
  });
  console.log(data);
});
