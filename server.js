const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;
let counterMusic = 0;
let counterNoise = 0;
let counterNotes = 0;
let counterTimer = 0;

let currentTrack = {
    title: '',
    artist: '',
    album: ''
};

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.md': 'text/markdown'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/current-track' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(currentTrack));
    } else if (pathname === '/current-track' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            currentTrack = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end();
        });
    } else if (pathname === '/beats' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'music.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
                counterMusic = counterMusic + 1;
                console.log(`got music.html, ${counterMusic}`)
            }
        });
    } else if (pathname === '/noisegen' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'noisegen.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
                counterNoise = counterNoise + 1;
                console.log(`got noisegen.html, ${counterNoise}`)
            }
        });
    } else if (pathname === '/notes' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'notes.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
                counterNotes = counterNotes + 1;
                console.log(`got notes.html, ${counterNotes}`)
            }
        });
    } else if (pathname === '/timer' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'timer.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
                counterTimer = counterTimer + 1;
                console.log(`got timer.html, ${counterTimer}`)
                //console.log('got timer.html')
            }
        });
    } else if (pathname === '/sum' && req.method === 'GET') {
        console.info(`All of it, summed up:
            ${counterMusic} times music.html
            ${counterNoise} times noisegen.html
            ${counterNotes} times notes.html
            ${counterTimer} times timer.html`)
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head>
                    <title>yay</title>
                    <link rel="stylesheet" type="text/css" href="style.css">
                </head>
                <body>
                <div class="container">
                <w>w</w>
                    <p>you found a dev feature good job!!!!!1!!11!!</p>
                    <p>here is a gift for you!!1!</p>
                    <p>*the exitement of a dev feature found*</p>
                </div>
                </body>
            </html>`);

        } else if (pathname === '/focus' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'focus.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data, 'utf-8');
            }
        });
    } else {
        let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile(path.join(__dirname, 'public', '404.html'), (error, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                        console.error(`got 404 at ${filePath}`)
                        console.error(`make sure that the file exists or that the path is correct`)
                    });
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data, 'utf-8');
            }
        });
    }
});


server.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
    console.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log('going to /sum will show you how many times each page was loaded');
    //please dont spam it
});