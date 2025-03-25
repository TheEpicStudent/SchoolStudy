const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;

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
});