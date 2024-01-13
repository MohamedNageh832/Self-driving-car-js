class NeuralNetwork {
  constructor(neuronsCount) {
    this.levels = [];

    for (let i = 0; i < neuronsCount.length - 1; i++) {
      const level = new Level(neuronsCount[i], neuronsCount[i + 1]);
      this.levels.push(level);
    }
  }

  static feedForward(givenInputs, network) {
    const level = network.levels[0];
    let outputs = Level.feedForward(givenInputs, level);

    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }
}

class Level {
  constructor(inputsCount, outputsCount) {
    this.inputs = new Array(inputsCount);
    this.outputs = new Array(outputsCount);
    this.biases = new Array(outputsCount);

    this.weights = [];

    for (let i = 0; i < inputsCount; i++) {
      this.weights[i] = new Array(outputsCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1;

        // Randomizing the biases
        if (i > 0) continue;
        level.biases[j] = Math.random() * 2 - 1;
      }
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];

      for (let j = 0; j < level.outputs.length; j++) {
        let sum = 0;

        for (let k = 0; k < level.inputs.length; k++) {
          sum += level.inputs[k] * level.weights[k][j];
        }

        if (sum > level.biases[j]) level.outputs[j] = 1;
        else level.outputs[j] = 0;
      }
    }

    return level.outputs;
  }
}
