const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    removed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Note", noteSchema)