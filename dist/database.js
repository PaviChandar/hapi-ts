"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb+srv://PavithraChandarS:Pavithra0501@cluster0.hzly1jq.mongodb.net/product?retryWrites=true&w=majority')
    .then(data => console.log("Connected to database"))
    .catch(error => console.log("Error in connection : ", error));
mongoose_1.default.connection.on("disconnected", () => {
    console.log("mongodb disconnected");
});
