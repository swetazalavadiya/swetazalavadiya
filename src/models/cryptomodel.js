const mongoose= require("mongoose")

let crypto = new mongoose.Schema({
    "symbol": {
      type: String,
      Unique: true
    },

    "name": {
      type: String,
      Unique: true
    },
    "marketCapUsd": String,
    "priceUsd": String
  })

  module.exports=mongoose.model("createCripto", crypto)