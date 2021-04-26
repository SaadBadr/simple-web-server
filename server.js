const http = require('http')
const path = require('path')
const fs = require('fs')

const mimeTypes = {
    'html': 'text/html',
    'css': 'text/css',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'png': 'image/png',
    'js': 'text/javascript',
}


http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const fileName = path.join(process.cwd(), url.pathname)
    console.log(`Loading ${url}`)
    var stats
   
    try {
        stats = fs.lstatSync(fileName)
    } catch (error) {
        res.statusCode = 404
        res.setHeader('Content-type', 'text/plain')
        res.write('404 Not Found\n')
        res.end()
        return
    }

    if(stats.isFile()) {
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]]
        res.statusCode = 200
        res.setHeader('Content-type', mimeType)
        const fileStream = fs.createReadStream(fileName)
        fileStream.pipe(res)
    }
    else if(stats.isDirectory()) {
        res.statusCode = 302
        res.setHeader('Location', 'index.html')
        res.end()
    }
    else{
        res.statusCode = 500
        res.setHeader('Content-type', 'text/plain')
        res.write('500 Internal Error\n')
        res.end()
    }
}).listen(1337)