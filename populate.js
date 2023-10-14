
const mongoose = require('mongoose');
const Disease = require('./models/Disease');
const Environment = require('./models/Environment')


const atlasConnectionUrl = "mongodb+srv://nnatuan264826:JUt7vncgWGCwIAeL@skinuni.xmweuyz.mongodb.net/skinuni?retryWrites=true&w=majority"
mongoose.connect(atlasConnectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB Atlas');

    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });


async function createEnviromentData(numOfData) {
    for (let i = 0; i < numOfData; i++) {
        let env = new Environment({
            temperature: randomIntToString(20, 30),
            humidity: randomIntToString(40, 60),
            uv: randomIntToString(0, 10),
            uvi: randomIntToString(0, 10),
            co: randomIntToString(0, 10),
            gas: randomIntToString(0, 10),
            dust: randomIntToString(0, 10),
            time: Date.now()
        })
        await env.save();
    }
    console.log('Done');
}

function randomIntToString(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// createEnviromentData(10);

async function getEnvData(numOfData) {
    let envs = await Environment.find().sort({ time: -1 }).limit(numOfData);
    console.log(envs);
}

// getEnvData(3);
