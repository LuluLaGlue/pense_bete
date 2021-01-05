const express = require("express");
const router = express.Router();
const fs = require('fs');
const parse = require('csv-parse');
const csvWriter = require('csv-write-stream');

const header_csv = ["id", "creation", "finished", "title", "description", "category"]
const csv_file = __dirname + '/data/data.csv';

router.get('/:id', (req, res) => {
    const id = req.params.id;
    var data = [];
    var all = [];

    console.log('listing data for id: ', req.params.id);

    fs.createReadStream(csv_file)
        .pipe(parse({ delimiter: ';' }))
        .on('data', (row) => {
            if (row[0] === id) {
                data.push({
                    id: row[0],
                    creation: row[1],
                    finished: row[2],
                    title: row[3],
                    description: row[4],
                    category: row[5]
                })
            }

            all.push({
                id: row[0],
                creation: row[1],
                finished: row[2],
                title: row[3],
                description: row[4],
                category: row[5]
            })
        })
        .on('end', () => {
            if (id === "all") {
                all.splice(0, 1)
                return res.json(all)
            } else {
                if (data.length === 0) {
                    return res.status(404).json({ message: "Data not found" })
                }
                return res.json(data[0])
            }
        })
})

router.post('/', (req, res) => {
    const id = Math.random().toString(36).substr(2, 9);
    var writer = csvWriter({ separator: ';', headers: header_csv, sendHeaders: false });
    console.log(req.body)
    console.log("creating entry")

    try {
        writer.pipe(fs.createWriteStream(csv_file, { flags: 'a' }))
        writer.write([id, req.body.creation, req.body.finished || "", req.body.title, req.body.description || "", req.body.category || ""])
        writer.end();
        return res.status(200).json({ message: "Data created", id: id })
    } catch (e) {
        console.log(e)
        return res.status(400).json(e)
    }
})

router.put('/:id', (req, res) => {
    var data = [];
    var exists = false;
    const id = req.params.id

    console.log("Updating id: ", req.params.id)

    fs.createReadStream(csv_file)
        .pipe(parse({ delimiter: ';' }))
        .on('data', (row) => {
            if (row[0] === id) {
                exists = true
            }
            data.push({
                id: row[0],
                creation: row[1],
                finished: row[2],
                title: row[3],
                description: row[4],
                category: row[5]
            })
        })
        .on('end', () => {
            if (!exists) {
                return res.status(404).json({ message: "Data not found" })
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    data[i].creation = req.body.creation || data[i].creation;
                    data[i].finished = req.body.finished !== undefined ? req.body.finished : data[i].finished;
                    data[i].title = req.body.title || data[i].title;
                    data[i].description = req.body.description || data[i].description;
                    data[i].category = req.body.category || data[i].category;
                    break;
                }
            }
            data.splice(0, 1);

            var writer = csvWriter({ separator: ';', headers: header_csv })

            try {
                writer.pipe(fs.createWriteStream(csv_file));
                data.map((value, index) => {
                    writer.write(value)
                    return value;
                })
                writer.end();
                return res.status(200).json({ message: "Data updated" })
            } catch (e) {
                console.log(e)
                return res.status(400).json(e)
            }
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    var data = [];
    var exists = false;

    console.log("Deleting Data");

    fs.createReadStream(csv_file)
        .pipe(parse({ delimiter: ';' }))
        .on('data', (row) => {
            if (row[0] === id) {
                exists = true
            }
            data.push({
                id: row[0],
                creation: row[1],
                finished: row[2],
                title: row[3],
                description: row[4],
                category: row[5]
            })
        })
        .on('end', () => {
            if (!exists) {
                return res.status(404).json({ message: "Data not found" })
            }
            var index = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    index = i;
                    break;
                }
            }
            data.splice(index, 1);
            data.splice(0, 1);

            var writer = csvWriter({ separator: ';', headers: header_csv })

            try {
                writer.pipe(fs.createWriteStream(csv_file));
                data.map((value, index) => {
                    writer.write(value);
                    return value;
                })
                writer.end();
                return res.status(200).json({ message: "Data deleted" })
            } catch (e) {
                console.log(e)
                return res.status(400).json(e)
            }
        })
})

router.get("/list/cat", (req, res) => {
    var all = [];

    console.log('Listing categories');

    fs.createReadStream(csv_file)
        .pipe(parse({ delimiter: ';' }))
        .on('data', (row) => {
            all.push(row[5])
        })
        .on('end', () => {
            all.splice(0, 1)
            const cat = [... new Set(all)]
            return res.status(200).json(cat)
        })
})

module.exports = router