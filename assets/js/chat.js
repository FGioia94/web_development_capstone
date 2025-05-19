let dataset = null;

async function loadDataset() {
  const response = await fetch("../data/initial_dataset.json");
  dataset = await response.json();
}

async function main() {
  await loadDataset();
}

let model = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 10, inputShape: [5], activation: "relu" })
  );
  model.add(tf.layers.dense({ units: genres.length, activation: "softmax" }));

  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

};

async function trainModel(xs, ys) {
    await model.fit(xs, ys, { epochs: 100 });
    console.log("Training complete!");
}

trainModel();

main();
