const express = require("express")
const mongoose = require("mongoose")
const Note = require("./models/notes")
const path = require("path")
require('dotenv').config()

const app = express()
app.use(express.json())

const __dirname2 = path.resolve()

//for production
app.use(express.static(path.join(__dirname2, '/client/dist')))

// other than api routes all routes will serve index.html means frontend


const PORT = process.env.PORT || 5000

app.get("/api", (req, res) => {
    res.send("hello, from the server")
})

//get
app.get("/api/notes", async(req, res) => {
    try {
        const notes = await Note.find({}) 
        return res.json({
            msg: "Success",
            notes
         })
    } catch (error) {
        console.log(error)
    }
})

//create
app.post("/api/notes/create", async(req, res) => {
    const {title, desc} = req.body
    const newNote = new Note({
        title,
        desc
    })
    try {
        await newNote.save()
        return res.json({
            msg: "Success",
            note: newNote
        })
    } catch (error) {
        console.log(error)
    }
})

//update
app.put("/api/notes/update/:id", async(req, res) => {
    const {title, desc} = req.body
    const id = req.params.id
    try {
        await Note.findByIdAndUpdate(id, {
            title,
            desc
        })
        return res.json({
            msg: "Note Updated"
        })
    } catch (error) {
        console.log(error)
    }
} )
//delete
app.delete("/api/notes/delete/:id", async(req, res) => {
    const id = req.params.id
    try {
        await Note.findByIdAndDelete(id)
        return res.json({
            msg: "Note Deleted"
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname2, 'client', 'dist', 'index.html'))
}) 

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("mongodb connected")
    app.listen(PORT, () => {
        console.log("server running on port %s", PORT)
    })
})
.catch(err => console.log(err))



