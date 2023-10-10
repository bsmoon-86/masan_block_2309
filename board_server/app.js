const express = require('express')
const app = express()

const port = 3000

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))


// user.js 파일 로드 
const user = require("./routes/user")()
app.use("/user", user)

// board.js파일 로드 
const router1 = require("./routes/board")
const board = router1()
app.use("/board", board)


app.listen(port, function(){
    console.log(port, "Server Start")
})