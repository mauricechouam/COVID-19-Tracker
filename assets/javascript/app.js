// Mapbox API Call 
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhc2V5YiIsImEiOiJja2EydmhiMXIwM2Y1M2xzNW5oMnRpYzd5In0.m1vDX_9oLA_Ywa2fa43WXg';
var map = new mapboxgl.Map({
    container: "map", // container id
    style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
    center: [10, 0], // starting position [lng, lat]
    zoom: 1.2 // starting zoom 
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Add geolocate control to the map
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);

// NovelCOV-19 API Call //
var settings = {
    "url": "https://corona.lmao.ninja/v2/all",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    console.log(response);
});

// Global var used in ajax calls and Select State
let userState = "";

$(document).ready(function () {
    // gives value to userState
    ajaxState();
    // fill News & Testing sections (needs userState)
    // setTimeouts to give ajax calls time to respond
    setTimeout(function () {
        ajaxNews();
    }, 300)
    setTimeout(function () {
        ajaxTesting();
    }, 750)
});

// ajaxResource() gets userState for NewsAPI and Testing API below
function ajaxState() {
    // first, IP-API.com to get
    let state = "http://ip-api.com/json/?fields=regionName";
    $.getJSON(state).done(function (location) {
        // vars to get just the city from ip-api JSON
        state = location.regionName;
        // need a var to hold value of state, in lower case
        userState = state.toLowerCase();
        console.log(userState);
    });
}

// ajaxNews() fills News Section
function ajaxNews() {
    // NewsAPI.org
    let newsURL = "http://newsapi.org/v2/top-headlines?country=us&q=coronavirus&sortBy=popularity&apiKey=5f16e289ba95422780d31a86b588ae1d";
    $.ajax({
        url: newsURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // array to hold titles
        let newsTitles = [];
        // array to hold urls
        let newsLinks = [];
        // loop through response, grab top 5 article titles & their urls
        for (i = 0; i < response.articles.length; i++) {
            newsTitles[i] = response.articles[i].title;
            newsLinks[i] = response.articles[i].url;
        }
        // Shuffling the two arrays: Fisher-Yates Algorithm
        // Thanks to a previous teacher at Sac City, Mathew Phillips,
        // for answering my email about this subject in old notes!
        // loop from end of array to index 1, not 0
        for (i = newsTitles.length - 1; i > 0; i--) {
            // generate random number from 0 to last index, first pass is 0 to 4,
            // with each pass of loop, decrement highest possible value for j
            // we're going to swap the value in index i for the value at the randomly
            // generated number j, using a pass through var called tempTitles
            let j = Math.floor(Math.random() * i);
            // first the newsTitles[]
            // tempTitles holds value of i
            let tempTitles = newsTitles[i];
            // newsTitles[i] now takes value at random index j
            newsTitles[i] = newsTitles[j];
            // index j now takes tempTitles value, which is original value of i
            newsTitles[j] = tempTitles;
            // repeat these steps for newsLinks[] using same random number
            let tempLinks = newsLinks[i];
            newsLinks[i] = newsLinks[j];
            newsLinks[j] = tempLinks;
        }
        // arrays are now shuffled in the same manner,
        // display in html, set link attributes
        for (i = 0; i < newsTitles.length; i++) {
            $("#news-list").append("<li><a href=" + newsLinks[i] + ">" + newsTitles[i] + "</a></li>");
        }
    });
}

// // some states have no information, so display alternate message
// if (response[i].name === "No Locations Yet") {
//     $("#test-list").append("<li style='font-weight: 500'>No current" +
//         " information is available.</li>");
//     $("test-list").append("<li style='font-weight: 500'>Please visit" +
//         " the CDC website.<a href='https://www.cdc.gov/coronavirus/2019-nCoV/index.html'>" +
//         "www.cdc.gov</a></li>");
// }
// // some entries have no phone number, so skip those
// else if (testingNumbers[i] !== "None") {
//     // append li's from arrays with some styling
//     $("#test-list").append("<li><span style='font-weight: 500'>" + testingSites[i] +
//         ": </span>" + testingNumbers[i] + "</li>");
// }
// else {
//     console.log("No Phone Available");
// }

// ajaxTesting() fills Testing Section
function ajaxTesting() {
    // Crowdsourced API for local testing resources. Responses are statewide.
    let localTesting = "https://covid-19-testing.github.io/locations/" + userState + "/complete.json";
    $.ajax({
        url: localTesting,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // array to hold listing names
        let testingSites = [];
        // array for their phone numbers
        let testingNumbers = [];
        // clear section in case this is not the first ajaxTesting() call
        $("#test-list").empty();
        // loop to fill listings from response, display if valid
        for (i = 0; i < response.length; i++) {
            // fill sites & numbers arrays
            testingSites[i] = response[i].name;
            testingNumbers[i] = response[i].phones[0].number;
            // some entries have no phone number, so skip those
            // some states have no information, so display alternate message
            if (response[i].name === "No Locations Yet") {
                $("#test-list").append("<li style='font-weight: 500'>No current" +
                    " information is available. <p>Please visit the CDC website. " +
                    "<a href='https://www.cdc.gov/coronavirus/2019-nCoV/index.html'" +
                    " target='_blank'>www.cdc.gov</a></p></li>");
            }
            // some entries have no phone number, so skip those
            else if (testingNumbers[i] !== "None") {
                // append li's from arrays with some styling
                $("#test-list").append("<li><span style='font-weight: 500'>" + testingSites[i] +
                    ": </span>" + testingNumbers[i] + "</li>");
            }
            else {
                console.log("No Phone Available");
            }
        }
    });
}


// Select State button captures state name
$(".dropdown-item").click(function () {
    // capture value in Global userState
    userState = $(this).attr("value");
    console.log(userState);
    ajaxTesting();
});

// News Section Show More button listener toggles .hide, 
// creating animation effect (jQuery UI)
$("#more-news").click(function () {
    // add/remove .hide, sliding info in/out of view
    $("#news-list").toggleClass("hide", 800);
    if ($("#news-list").hasClass("hide")) {
        // conditional to change button text based on .hide
        $(this).text("Show Less");
    }
    else {
        $(this).text("Show More");
    }
});

// Show More button listener toggles .hide,
$("#more-tests").click(function () {
    $("#test-list").toggleClass("hide", 800);
    if ($("#test-list").hasClass("hide")) {
        $(this).text("Show Less");
    }
    else {
        $(this).text("Show More");
    }
});