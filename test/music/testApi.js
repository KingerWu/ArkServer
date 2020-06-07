const musicApi = require("../../lib/musicApi");

musicApi.searchSong("虎").then(results => {
    results.forEach(element => {
        console.log(element);
        if (!element.copyright) {
            musicApi.searchLyricsAndPlayLink(element.belong, element.belong_id).then(result => {
                console.log(result);
            });
        }
    });

});