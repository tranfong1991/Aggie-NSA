var TMDb_API_KEY = "e5b0a1804996442dd73bd1accee761a0";
var TMDb_URL = "http://api.themoviedb.org/3/search/person";
var TMDb_IMAGE_URL = "http://image.tmdb.org/t/p/w500";

function capture(){
    var video = document.getElementById("my_player");
    var canvas = document.getElementById('my_canvas');
    var context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    var dataURL = canvas.toDataURL("image/png");
    $.ajax({
      type: "POST",
      url: "aggiensa.php",
      data: {
          imageBase64 : dataURL
      }
    }).done(function(response) {
      console.log(response);
      if(response.status == "OK")
          populateResult(response);
    });
}

function search(){
    var id = document.getElementById('srch-term').value;
    var video = document.getElementById('my_player');
    var mp4url = "https://www.youtubeinmp4.com/redirect.php?video=";

    $.ajax({
      type: "POST",
      url: "getvideo.php",
      data: {
          video_id : id,
          video_url : mp4url + id
      }
    }).done(function(response) {
      console.log(response);
      video.src = "videos/" + id + ".mp4";
    });
}

function populateResult(json){
    var imageFacesArray = json['imageFaces'];
    var nameArray = new Array();
    
    for(var i = 0; i<imageFacesArray.length; i++){
        var obj = imageFacesArray[i];
        
        if(obj.hasOwnProperty('identity'))
            nameArray.push(obj.identity.name);
    }
    
    for(var i = 0; i<nameArray.length; i++){
        $.ajax({
            type: "GET",
            url: TMDb_URL,
            data: {
                api_key : TMDb_API_KEY,
                query : encodeURIComponent(nameArray[i])
            }
        }).done(function(response){
            if(response.total_results > 0){
                populateTemplate(response);
            }
        });
    }
}

function populateTemplate(json){
    var itemTemplate = document.querySelector("#item");
    var resultTemplate = document.querySelector("#result");
    var results = json.results;
    
    for(var i = 0; i<results.length; i++){
        var itemObj = results[i];
        
        if(itemObj.profile_path == null)
            continue;
        
        itemTemplate.content.querySelector("#picture").src = TMDb_IMAGE_URL + itemObj.profile_path;
        itemTemplate.content.querySelector("#name").innerHTML = itemObj.name;
        
        var itemClone = document.importNode(itemTemplate.content, true);
        
        //remove all child node before appending a new one
        removeAllChildNodes(resultTemplate.content.querySelector("#person"));
        resultTemplate.content.querySelector("#person").appendChild(itemClone);
        
        var worksArray = itemObj.known_for;        
        removeAllChildNodes(resultTemplate.content.querySelector("#work"));
        
        for(var j = 0 ; j<worksArray.length; j++){
            var workObj = worksArray[j];
            
            itemTemplate.content.querySelector("#picture").src = TMDb_IMAGE_URL + workObj.poster_path;
            if(workObj.hasOwnProperty('name'))
                itemTemplate.content.querySelector("#name").innerHTML = workObj.name;
            else if(workObj.hasOwnProperty('title'))
                itemTemplate.content.querySelector("#name").innerHTML = workObj.title;
            
            var workClone = document.importNode(itemTemplate.content, true);
            resultTemplate.content.querySelector("#work").appendChild(workClone);
        }
        
        var resultClone = document.importNode(resultTemplate.content, true);
        document.body.appendChild(resultClone);
    }
}

function removeAllChildNodes(element){
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}