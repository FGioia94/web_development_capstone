async function getSprite(pokemon) {
  /*
  Retrieves the sprite URL for a given Pokémon using the PokeAPI.
  Handles potential errors gracefully and provides a fallback if the fetch fails.

  @param {string} pokemon - The name or ID of the Pokémon.
  */

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );
    if (!response.ok) throw new Error(`Failed to fetch sprite for ${pokemon}`);

    const data = await response.json();
    return data.sprites.front_default;
  } catch (error) {
    console.error("Error fetching Pokémon sprite:", error);
    return null;
  }
}
async function main() {
  /*
  Main function to dynamically display defeated Pokémon in the Pokedex.
  Retrieves a list of defeated Pokémon from local storage, fetches their sprites,
  and generates corresponding Pokémon cards in the UI.

  No parameters required.
  */
  let defeatedList = localStorage.getItem("defeatedList");
  defeatedList = defeatedList ? JSON.parse(defeatedList) : [];
  const pokedex = document.getElementById("pokedex");

  // Loop through the defeated Pokémon list and create cards
  for (const pokemon of defeatedList) {
    const sprite = await getSprite(pokemon);
    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");
    const nameLabel = document.createElement("h3");
    const image = document.createElement("img");
    pokemonCard.appendChild(nameLabel);
    pokemonCard.appendChild(image);
    pokedex.appendChild(pokemonCard);
    nameLabel.innerText = pokemon;
    image.src = sprite;
  }
}
main();
