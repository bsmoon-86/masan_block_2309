// express server open

const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.get('/', function(req, res){
    res.render('index')
})

const http_server =  app.listen(3000, function(){
    console.log('Server Start')
})
// http통신 : 요청을 보내고 응답을 받은 뒤 서버와 유저는 연결이 종료

// socket통신 : 서버와 유저가 연결을 종료하지 않는 이상은 연결을 유지 


// web socket server open
const wsModule = require('ws')

const webSocketServer = new wsModule.Server(
    {
        server : http_server
    }
)

// socket server의 이벤트 처리
const sql_class = require('./sql_class')
const mydb = new sql_class.Mysql()
const sockets = []
let i = 1
// socket server에 유저가 연결되었을때 
webSocketServer.on('connection', function(ws, request){
    sockets.push(ws)
    ws['nickname'] = i
    i += 1
    console.log('새로운 유저가 접속하였습니다.')

    // 연결된 유저에게 메시지 보낸다. 
    if (ws.readyState == ws.OPEN){
        ws.send('웹소켓서버와 연결이 되었습니다.')
    }

    // 유저가 서버에게 메시지를 보내는 경우
    ws.on('message', async function(msg){
        console.log('유저가 보낸 데이터 : ', msg.toString('utf-8'))
        // ws.send('유저가 보낸 메시지를 잘 받았습니다.')
        sql = `
            insert into 
            message(
                nickname, 
                message
            ) values 
            (?, ?)
        `
        values = [ws.nickname, msg]
        const db_result = await mydb.execute(sql, values)
        sockets.forEach(function(user){
            user.send(`${ws.nickname} : ${msg}`)
        })
    })

    // 유저와의 연결에서 에러가 발생하는 경우
    ws.on('error', function(err){
        console.log(err)
        ws.send('웹 소켓과의 연결에서 에러가 발생했습니다.')
    })

    ws.on('close', function(){
        console.log('유저와의 연결이 끊겼습니다.')
        ws.send('웹 소켓과의 연결을 종료합니다.')
    })


})
