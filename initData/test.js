var youtubedl = require('youtube-dl');
const vttToJson = require("vtt-json");
var url = 'https://www.youtube.com/watch?v=_vL8s5ayuFk';
const fs = require('fs');
var options = {
    // Write automatic subtitle file (youtube only)
    auto: true,
    // Downloads all the available subtitles.
    all: false,
    // Languages of subtitles to download, separated by commas.
    lang: 'en',
    // The directory to save the downloaded files in.
    cwd: __dirname
};
youtubedl.getSubs(url, options, function (err, files) {
    if (err) throw err;

    console.log('subtitle files downloaded:', files);
    let sub = fs.readFile(files[0], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            //console.log(data.toString());
            vttToJson(data.toString())
                .then((result) => {
                    console.log(result);
                });
        }
    });

});