const express = require("express")
const request = require("request")
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Disease = require('./models/Disease');
const app = express()
const Environment = require('./models/Environment')
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');
  //get message on topic /esp/data
  socket.on('/esp/data', async (msg) => {
    // const measurements = msg.split(" ")
    //msg will look like this: {temperature: 30, humidity: 50, uv: 100, uvi: 10, co: 100, gas: 100, dust: 100}

    //save the msg to database for later use 
    const environment = new Environment({
      temperature: msg.temp,
      humidity: msg.humi,
      uv: msg.uv,
      uvi: msg.uvi,
      co: msg.co,
      gas: msg.gas,
      dust: msg.dust,
    })
    try {
      await environment.save();
    } catch (error) {
      console.log(error);
    }

    //emit the data to all clients on topic /web/data
    socket.broadcast.emit('/web/data', environment);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');

  });
});


const atlasConnectionUrl = "mongodb+srv://nnatuan264826:JUt7vncgWGCwIAeL@skinuni.xmweuyz.mongodb.net/skinuni?retryWrites=true&w=majority"
mongoose.connect(atlasConnectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const names = await retrieveDiseaseNames();
    console.log('Disease names:', names);

  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });


app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))

app.get("/", async function (req, res) {
  res.render("index.ejs", { lesionList: await retrieveDiseases() })
})

app.get("/info/", async function (req, res) {
  res.render("info.ejs", { lesionList: await retrieveDiseases() })
})

app.get('/info/:lesionName', async function (req, res) {
  const convertToTitleCase = str => {
    const words = str.split("_")
    const newWords = []
    for (word of words) {
      word = word.charAt(0).toUpperCase() + word.slice(1)
      newWords.push(word)
    }
    return newWords.join(" ")
  };
  const lesionName = convertToTitleCase(req.params.lesionName);
  const names = await retrieveDiseaseNames()
  if (names.includes(lesionName)) {
    res.render("lesion_info", { lesionList: await retrieveDiseases(), lesion: await retrieveDisease(lesionName) });
  }
  else {
    res.render('404.ejs', { errorMessage: `Lesion '${lesionName}' not found.` });
  }
});

app.get('/add', function (req, res) {
  res.render('add');
});

app.post('/add', async (req, res) => {
  const { name, image, description, symptoms, treatments, cite } = req.body;
  try {
    const newDisease = new Disease({
      name,
      image,
      description,
      symptoms: symptoms.split('/').map(item => item.trim()),
      treatments: treatments.split('/').map(item => item.trim()),
      cite,
    });
    await newDisease.save();

    res.redirect('/add');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

app.get("/analysis/", async function (req, res) {
  res.render("analysis.ejs", { lesionList: await retrieveDiseases() })
})

app.get("/analysis/getData", async function (req, res) {
  try {
    const environment = await Environment.find({})
      .sort({ time: -1 })
      .limit(20);
    res.json(environment);
  } catch (err) {
    console.log(err);
    res.json("error")
  }
})

app.get("*", function (req, res) {
  res.render("404.ejs")
})


server.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
});


async function retrieveDiseaseNames() {
  try {
    const diseaseNames = await Disease.find({}, 'name');
    const names = diseaseNames.map(disease => disease.name);

    return names;
  } catch (error) {
    console.error('Error retrieving disease names:', error);
    return [];
  }
}

async function retrieveDiseases() {
  try {
    const diseases = await Disease.find({});
    return diseases;
  } catch (error) {
    console.error('Error retrieving diseases:', error);
    return [];
  }
}

async function retrieveDisease(name) {
  try {
    const disease = await Disease.findOne({ name: name });
    return disease;
  } catch (error) {
    console.error('Error retrieving disease:', error);
    return null;
  }
}