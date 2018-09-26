var express = require("express")
var cors = require("cors")
const axios = require("axios")
const multer = require("multer")

const fs = require("fs")
const path = require("path")
var map = require("rxjs/operators").map
var { of, from, interval, timer, concat } = require("rxjs")
var range = require("rxjs").range

var toArray = require("rxjs/operators").toArray
var catchError = require("rxjs/operators").catchError
var switchMap = require("rxjs/operators").switchMap
var { skip, filter, take, pipe, merge, delay } = require("rxjs/operators")
var throwError = require("rxjs").throwError

var app = express()

const multerConfig = {
  storage: multer.diskStorage({
    //Setup where the user's file will go
    destination: function(req, file, next) {
      next(null, "./storage")
    },
    //Then give the file a unique name
    filename: function(req, file, next) {
      console.log(file)
      const ext = file.mimetype.split("/")[1]
      next(null, file.fieldname + "-" + Date.now() + "." + ext)
    },
  }),
  //A means of ensuring only images are uploaded.
  fileFilter: function(req, file, next) {
    if (!file) {
      console.log("no fichero")
      next()
    }
    next(null, true)
  },
}
app.use(cors())
app.use(express.static("public"))
app.use(express.static("storage"))

app.post("/upload", multer(multerConfig).single("file"), function(req, res) {
  res.send({ file: req.file })
})

app.post("/uploadMultiple", multer(multerConfig).array("file", 12), function(
  req,
  res,
) {
  res.send({ file: req.files })
})

app.get("/loadData/:filename", function(req, res) {
  const absFilename = path.join(__dirname, "storage", req.params.filename)
  fs.createReadStream(absFilename).pipe(res)
  console.log(absFilename)
})
app.get("/ficheros", function(req, res) {
  const absFolder = path.join(__dirname, "storage")
  fs.readdir(absFolder, (err, data) => {
    res.send(data)
  })
})
app.get("/:time", async function(req, res) {
  res.append("X-CUSTOM", "AAA")
  res.append("Warning", "199 Miscellaneous warning")
  concat(
    from(axios.get("http://localhost:3002/")),
    from(axios.get("http://localhost:3002/")),
  )
    .pipe(
      delay(req.params.time),
      map(i => i.data),
    )
    .subscribe(
      i => {
        res.write(i)
      },
      err => {
        res.send(err.message)
      },
      () => {
        res.end("final")
      },
    )
})

app.get("/fichas", (req, res) => {
  fs.createReadStream(path.join(__dirname, "fichas.json")).pipe(res)
})

app.get("/", function(req, res) {
  range(1, 10)
    .pipe(
      switchMap(() =>
        range(1, 100).pipe(
          delay(5000),
          take(20),
          filter(i => i % 3 === 0),
        ),
      ),
    )
    .subscribe(
      i => {
        res.write(`${i}-`)
      },
      error => {
        console.log("esto es un control de error")
        res.write({ e: error.message })
      },
      () => {
        res.write("")
        res.end()
      },
    )
})

app.listen(process.env.PORT || 80, function() {
  console.log("puerto 80")
})
