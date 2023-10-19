const express = require('express')

const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// 업로드되는 파일들의 위치를 설정하기 전에 해당하는 폴더가 존재하는지 확인
const fs = require('fs')

try{
    // uploads 폴더가 존재하는지 확인
    fs.readdirSync('uploads')
}catch(err){
    console.log('폴더가 존재하지 않는다.')
    // 폴더를 생성한다. 
    fs.mkdirSync('uploads')
}

const multer = require('multer')
const path = require('path')

// 업로드 되는 파일들의 저장 경로를 지정, 저장되는 파일의 이름 설정
const upload = multer({
    storage : multer.diskStorage({  // 저장하는 공간 정보 : 하드디스크 저장
        destination(req, file, done){   // 업로드된 파일들의 저장 위치 지정
            done(null, 'uploads/')
        }, 
        filename(req, file, done){  // 업로드 된 파일들의 이름을 지정
            const ext = path.extname(file.originalname) // extname() : 파일명에서 확장자만 출력
            // Date.now() : 현재의 시간을 뜻한다.(1970-01-01을 시작으로 하여 몇 나노초만큼 지났는가?)
            done(null, path.basename(file.originalname, ext) + Date.now() + ext) // 파일의 이름은 업로드파일의 이름 + 시간 + 확장자
        }
    }), 
    limits : {
        fileSize : 5 * 1024 * 1024  // 업로드되는 파일의 용량은 5메가 제한
    }
})

// 파일 업로드 화면을 보여주는 api 생성
app.get("/", function(req, res){
    res.render('upload')
})

// localhost:3000/upload[post] api 생성
app.post('/upload', upload.single('_file') ,function(req, res){
    console.log(req.file)
    console.log(req.body)
    res.send('OK')
})





app.listen(3000, function(){
    console.log('Server Start')
})