import mongoose from "mongoose";

mongoose.connect('mongodb+srv://PavithraChandarS:Pavithra0501@cluster0.hzly1jq.mongodb.net/product?retryWrites=true&w=majority')
    .then(data => console.log("Connected to database"))
    .catch(error => console.log("Error in connection : ", error))

mongoose.connection.on("disconnected", () => {
    console.log("mongodb disconnected")
})
