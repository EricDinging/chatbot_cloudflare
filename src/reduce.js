import * as tf from '@tensorflow/tfjs';

async function create_model() {
    const model = tf.sequential({
        layers: [
          tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
          tf.layers.dense({units: 10, activation: 'softmax'}),
        ]
    });

    // or
    const input = tf.input({shape: [784]});
    const dense1 = tf.layers.dense({units: 32, activation: 'relu'}).apply(input);
    const dense2 = tf.layers.dense({units: 10, activation: 'softmax'}).apply(dense1);
    const model2 = tf.model({inputs: input, outputs: dense2});

    console.log(model.summary());

    // save and load model
    const saveResult = await model.save('localstorage://my-model-1');
    const model3 = await tf.loadLayersModel('localstorage://my-model-1');

    // custom layer
    class SquaredSumLayer extends tf.layers.Layer {
        constructor() {
          super({});
        }
        // In this case, the output is a scalar.
        computeOutputShape(inputShape) { return []; }
       
        // call() is where we do the computation.
        call(input, kwargs) { return input.square().sum();}
       
        // Every layer needs a unique name.
        getClassName() { return 'SquaredSum'; }
    }
    const t = tf.tensor([-2, 1, 0, 5]);
    const o = new SquaredSumLayer().apply(t);
    o.print(); // prints 30


}

async function train() {
    const model = tf.sequential({
        layers: [
          tf.layers.dense({inputShape: [784], units: 32, activation: 'relu'}),
          tf.layers.dense({units: 10, activation: 'softmax'}),
        ]
    });

    model.weights.forEach(w => {
        console.log(w.name, w.shape);
    });

    // Initialization, this step is unnecessary as tfjs automatically
    // use the best practices
    model.weights.forEach(w => {
        const newVals = tf.randomNormal(w.shape);
        // w.val is an instance of tf.Variable
        w.val.assign(newVals);
    });

    model.compile({
        optimizer: 'sgd',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    // Train

    const data = tf.randomNormal([100, 784]);
    const labels = tf.randomUniform([100,10]);

    function onBatchEnd(batch, logs) {
        console.log('Accuracy', logs.acc);
    }

    model.fit(data, labels, {
        epochs: 5,
        batchsize: 32,
        callbacks: {onBatchEnd}
    }).then(info => {
        console.log('Final accuracy', info.history.acc);
    })

    // Predict
    const prediction = model.predict(tf.randomNormal([3, 784]));
    console.log("Prediction");
    prediction.print();

    return prediction.dataSync();
}

async function run() {
    // Create a simple model.
    // const model = tf.sequential();
    // model.add(tf.layers.dense({units: 1, inputShape: [1]}));
  
    // // Prepare the model for training: Specify the loss and the optimizer.
    // model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
  
    // // Generate some synthetic data for training. (y = 2x - 1)
    // const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    // const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
  
    // // Train the model using the data.
    // await model.fit(xs, ys, {epochs: 250});
  
    // // Use the model to do inference on a data point the model hasn't seen.
    // // Should print approximately 39.
    // return model.predict(tf.tensor2d([20], [1, 1])).dataSync();
    const start = performance.now();
    const train_result = await train();
    const end = performance.now();
    const result = {
        "prediction": train_result,
        "performance": end-start
    }
    return JSON.stringify(result);
}
export default run