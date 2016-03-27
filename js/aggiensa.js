var ALCHEMY_API_KEY = '0bad4d2c1ceb21f4653c104cc9bdeeb67f316f63';

function initiate(){
    var videos = document.querySelectorAll("video");
   
    for (var i = 0, l = videos.length; i < l; i++) {
        var video = videos[i];
        var src = video.src || (function () {
            var sources = video.querySelectorAll("source");
            for (var j = 0, sl = sources.length; j < sl; j++) {
                var source = sources[j];
                var type = source.type;
                var isMp4 = type.indexOf("mp4") != -1;
                if (isMp4) return source.src;
            }
            return null;
        })();
        if (src) {
            var isYoutube = src && src.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);
            if (isYoutube) {
                var id = isYoutube[1].match(/watch\?v=|[\w\W]+/gi);
                id = (id.length > 1) ? id.splice(1) : id;
                id = id.toString();
                var mp4url = "http://www.youtubeinmp4.com/redirect.php?video=";
                video.src = mp4url + id;
            }
        }
    } 
}

function capture(){
    var video = document.getElementById("my_player");
    var canvas = document.getElementById('my_canvas');
    var context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var dataURL = canvas.toDataURL("image/png");
    phpCallback(dataURL);

    //THIS WORKS
    // $.ajax({
    //     url: 'http://gateway-a.watsonplatform.net/calls/url/URLGetRankedImageFaceTags',
    //     type: 'GET',
    //     data: {
    //         apikey: ALCHEMY_API_KEY,
    //         url: 'http://ruby-on-rails-tranfong1991.c9users.io/Aggie-NSA/js/Jennifer-Garner.jpg',
    //         outputMode: 'json',
    //         knowledgeGraph: 1
    //     },
    //     success: function(response) {
    //         console.log(response);
    //     }
    // });
}

function phpCallback(dataURL){
    $.ajax({
      type: "POST",
      url: "aggiensa.php",
      data: {
          imageBase64 : dataURL
      }
    }).done(function(response) {
      console.log(response);
    });
}