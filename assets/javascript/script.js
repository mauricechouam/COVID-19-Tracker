// IP Geolocation: https://ip-api.com/
// This will set a var for us to plug into other APIs
let state = "http://ip-api.com/json/?fields=regionName";
$.getJSON(state).done(function (location) {
    // vars to get just the city from ip-api JSON
    state = location.regionName;
    // need a var to hold value of state, in lower case
    let userState = state.toLowerCase();
    console.log(userState);

    // NewsAPI.org to update the News Section
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

    // Tinkering with a second call to pull local news articles with the state info from https://www.ip-api.com
    // this works but the response is general, not covid. need to pair it with coronavirus keyword
    // emailed News API for details on concatenating a url with multiple search terms. we'll see...
    let cityURL = "http://newsapi.org/v2/top-headlines?country=us&q=" + userState + "&sortBy=popularity&apiKey=5f16e289ba95422780d31a86b588ae1d";
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });

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
        // loop to fill listings from response, display if valid
        for (i = 0; i < response.length; i++) {
            // fill sites & numbers arrays
            testingSites[i] = response[i].name;
            testingNumbers[i] = response[i].phones[0].number;
            // some entries have no phone number, so skip those
            if (testingNumbers[i] !== "None") {
                // append li's from arrays with some styling
                $("#test-list").append("<li><span style='font-weight: 500'>" + testingSites[i] +
                    ": </span>" + testingNumbers[i] + "</li>");
            }
            else {
                console.log("No Phone Available");
            }
        }
    });
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
// same steps as above
$("#more-tests").click(function () {
    $("#test-list").toggleClass("hide", 800);
    if ($("#test-list").hasClass("hide")) {
        $(this).text("Show Less");
    }
    else {
        $(this).text("Show More");
    }
});