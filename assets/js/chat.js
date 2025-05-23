async function getGenresIDs() {
  const response = await fetch("../data/genres_ids.json");
  idData = await response.json();
  return idData;
}

const choiceFromArray = (array) => {
  const index = Math.floor(Math.random() * genres.length);
  return array[index];
};

function classifySentiment(score) {
  let genre;

  switch (score) {
    case score > 2:
      genre = choiceFromArray(["Pop", "Electronic", "Folk"]);
      break;

    case 1 < score < 2:
      genre = choiceFromArray(["Country", "Hip-Hop/Rap"]);
      break;

    case 0 < score < 1:
      genre = choiceFromArray(["Lo-fi", "Jazz"]);
      break;

    case -1 < score < 0:
      genre = choiceFromArray(["Blues", "Classical"]);
      break;

    case -2 < score < -1:
      genre = choiceFromArray(["Punk", "Metal"]);
      break;
    case score < -3:
      genre = choiceFromArray(["Ambient"]);
      break;

    default:
      genre = "Classical";
  }
}
async function analyzeSentiment(text) {
  const model = await use.load();
  const embeddings = await model.embed([text]);
  const sentimentScore = embeddings.arraySync()[0].reduce((sum, value) => sum + value, 0) / embeddings.shape[1];
  return sentimentScore;
}

// Example usage
analyzeSentiment("I love this!").then(score => console.log("Sentiment Score:", score));
// async function analyzeSentiment(text) {
//   const model = await toxicity.load(0.9);
//   const predictions = await model.classify(text);

//   let sentimentScore = 0;
//   predictions.forEach((prediction) => {
//     if (prediction.label === "insult" || prediction.label === "negative") {
//       sentimentScore -= 1;
//     } else if (prediction.label === "positive") {
//       sentimentScore += 1;
//     }
//   });

//   async function recommendSong(text) {
//     const sentiment = await analyzeSentiment(text);
//     const genre =
//       sentiment === "positive"
//         ? "Happy"
//         : sentiment === "negative"
//         ? "Sad"
//         : "Chill";
//     const songData = await fetchDeezer(genre);

//     console.log(
//       `Recommended song based on sentiment: ${songData.data[0].title} by ${songData.data[0].artist.name}`
//     );
//   }
//   return sentimentScore > 0
//     ? "positive"
//     : sentimentScore < 0
//     ? "negative"
//     : "neutral";
// }
async function fetchDeezer(keyword) {
  const response = await fetch(
    `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${keyword}`
  );
  const songs = response.json();
  return songs;
}

async function fetchRandomSongByGenre(genreId) {
  const response = await fetch(
    `https://api.deezer.com/genre/${genreId}/artists`
  );
  const data = await response.json();

  if (data.data.length > 0) {
    const randomArtist =
      data.data[Math.floor(Math.random() * data.data.length)];
    const artistSongsResponse = await fetch(
      `https://api.deezer.com/artist/${randomArtist.id}/top`
    );
    const artistSongs = await artistSongsResponse.json();

    if (artistSongs.data.length > 0) {
      return artistSongs.data[
        Math.floor(Math.random() * artistSongs.data.length)
      ];
    }
  }
  return "No songs found for this genre.";
}

async function main() {
  console.log(await analyzeSentiment("fuck you bitch"));
  return;
  const deezerData = await fetchDeezer("happy");
  const dataset = await loadDataset();
  model();
  console.log(deezerData, dataset);
}

main();
