const express =require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))



app.get('/', function(req, res){
    res.render('ajax_text')
})

// 비동기 통신에서 이용할 api 생성
app.post('/data', function(req, res){
    // 유저가 보낸 데이터를 확인
    const id = req.body.input_id
    console.log(id)
    if(id == 'test'){
        // 사용 불가능한 아이디
        res.json(
            {
                'data' : '사용 불가능한 아이디'
            }
        )
    }else{
        res.json(
            {
                'data' : '사용 가능한 아이디'
            }
        )
    }
})




app.listen(3000, function(){
    console.log('server start')
})