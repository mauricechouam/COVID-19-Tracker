// CDC API 2019 Novel Coronavirus
// https://documenter.getpostman.com/view/8854915/SzS7NkAL?version=latest#9cdd846a-4698-4129-9375-80300fdf8cb1

let queryURL = "https://tools.cdc.gov/api/v2/resources/media/403372.rss"
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);

});