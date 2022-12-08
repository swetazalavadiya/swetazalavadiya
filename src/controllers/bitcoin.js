const axios=require("axios")
const cryptoModel=require("../models/cryptomodel")

let getcrpto = async (req, res) => {

  try {
    let options = await axios.get("https://api.coincap.io/v2/assets", {
      params: {
      headers: {Authorization: "Bearer XXXXXXXXXX"},
      }
    })

    let result = options
    let ans = result.data
    let final = ans.data.sort((a, b) => a.changePercent24Hr.localeCompare(b.changePercent24Hr))

    await cryptoModel.deleteMany()
    let abc = await cryptoModel.create(final)
    
    res.status(200).send({ msg: abc })

  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}

module.exports.getcrpto = getcrpto