const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect("mongodb://mongoadmin:secret@localhost:27017/todos", {
authSource:"admin",
});
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        // console.log(error);
    }
}

module.exports = {connect};