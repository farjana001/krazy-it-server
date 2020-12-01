const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4eamh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('newDesign'));
app.use(fileUpload());

const port = 5000




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const imageCollection = client.db("krazy-database").collection("image-data");


    // saving image to server
    app.post('/uploadImage', (req, res) => {
        const file = req.files.file;
        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        imageCollection.insertOne({ image })
            .then(result => {
                res.send(result.insertedCount > 0)


            })

    })

    // showing image from server
    app.get('/uploadImage', (req, res) => {
        imageCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Deleting an image from Server
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        imageCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res.send(result.deletedCount > 0);
            })

    })


});


app.get('/', (req, res) => {
    res.send('krazy it server!')
})

const PORT = process.env.PORT || 5000; app.listen(PORT, () => { console.log(`App listening on port ${PORT}!`); });