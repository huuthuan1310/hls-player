const express = require('express');
const app = express();
const fs = require('fs');
const hls = require('hls-server');
app.use(express.static('HLS'));
app.get('/', (req, res) => {
    return res.status(200).sendFile(`${__dirname}/player.html`);
});

const server = app.listen(3001, '', () => {
    console.log('Listening on 3001!');
});

new hls(server, {
    provider: {
        exists: (req, cb) => {
            const ext = req.url.split('.').pop();

            if (ext !== 'm3u8' && ext !== 'ts') {
                return cb(null, true);
            }

            fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
                if (err) {
                    console.log('File not exist');
                    return cb(null, false);
                }
                cb(null, true);
            });
        },
        getManifestStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        },
        getSegmentStream: (req, cb) => {
            const stream = fs.createReadStream(__dirname + req.url);
            cb(null, stream);
        }
    }
});
