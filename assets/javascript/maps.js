// On page load, call functions
$(document).ready(function () {
    // get MapBox.com
    initializeApp();
    // gives value to userState
    ajaxState();
    // fill News, Testing  & Data Cards (needs userState)
    // setTimeouts to give ajax calls time to respond
    setTimeout(function () {
        stateStatsCall();
    }, 300)
    setTimeout(function () {
        ajaxNews();
    }, 300)
    setTimeout(function () {
        ajaxTesting();
    }, 750)
});


/* BEGIN MAPBOX */

// the base url end point 
const baseUrlEndPoint = `https://coronavirus-tracker-api.herokuapp.com/v2/locations`;

// Container for displaying the corona details 
let coronaDetailsContainer;

// Dropdown for country selection
let countrySelectDropdown;

// Container for rendering the world Corona details 
let coronaWorldDetailsContainer;

const coronaData = {
    latest: {},
    locations: []
}

// Countries with Country Codes
const countriesWithCountryCodes = {
    "TH": "Thailand",
    "JP": "Japan",
    "SG": "Singapore",
    "NP": "Nepal",
    "MY": "Malaysia",
    "CA": "Canada",
    "AU": "Australia",
    "KH": "Cambodia",
    "LK": "Sri Lanka",
    "DE": "Germany",
    "FI": "Finland",
    "AE": "United Arab Emirates",
    "PH": "Philippines",
    "IN": "India",
    "IT": "Italy",
    "SE": "Sweden",
    "ES": "Spain",
    "BE": "Belgium",
    "EG": "Egypt",
    "LB": "Lebanon",
    "IQ": "Iraq",
    "OM": "Oman",
    "AF": "Afghanistan",
    "BH": "Bahrain",
    "KW": "Kuwait",
    "DZ": "Algeria",
    "HR": "Croatia",
    "CH": "Switzerland",
    "AT": "Austria",
    "IL": "Israel",
    "PK": "Pakistan",
    "BR": "Brazil",
    "GE": "Georgia",
    "GR": "Greece",
    "MK": "North Macedonia",
    "NO": "Norway",
    "RO": "Romania",
    "EE": "Estonia",
    "SM": "San Marino",
    "BY": "Belarus",
    "IS": "Iceland",
    "LT": "Lithuania",
    "MX": "Mexico",
    "NZ": "New Zealand",
    "NG": "Nigeria",
    "IE": "Ireland",
    "LU": "Luxembourg",
    "MC": "Monaco",
    "QA": "Qatar",
    "EC": "Ecuador",
    "AZ": "Azerbaijan",
    "AM": "Armenia",
    "DO": "Dominican Republic",
    "ID": "Indonesia",
    "PT": "Portugal",
    "AD": "Andorra",
    "LV": "Latvia",
    "MA": "Morocco",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "AR": "Argentina",
    "CL": "Chile",
    "JO": "Jordan",
    "UA": "Ukraine",
    "HU": "Hungary",
    "LI": "Liechtenstein",
    "PL": "Poland",
    "TN": "Tunisia",
    "BA": "Bosnia and Herzegovina",
    "SI": "Slovenia",
    "ZA": "South Africa",
    "BT": "Bhutan",
    "CM": "Cameroon",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "PE": "Peru",
    "RS": "Serbia",
    "SK": "Slovakia",
    "TG": "Togo",
    "MT": "Malta",
    "MQ": "Martinique",
    "BG": "Bulgaria",
    "MV": "Maldives",
    "BD": "Bangladesh",
    "PY": "Paraguay",
    "AL": "Albania",
    "CY": "Cyprus",
    "BN": "Brunei",
    "US": "US",
    "BF": "Burkina Faso",
    "VA": "Holy See",
    "MN": "Mongolia",
    "PA": "Panama",
    "CN": "China",
    "IR": "Iran",
    "KR": "Korea, South",
    "FR": "France",
    "XX": "Cruise Ship",
    "DK": "Denmark",
    "CZ": "Czechia",
    "TW": "Taiwan*",
    "VN": "Vietnam",
    "RU": "Russia",
    "MD": "Moldova",
    "BO": "Bolivia",
    "HN": "Honduras",
    "GB": "United Kingdom",
    "CD": "Congo (Kinshasa)",
    "CI": "Cote d'Ivoire",
    "JM": "Jamaica",
    "TR": "Turkey",
    "CU": "Cuba",
    "GY": "Guyana",
    "KZ": "Kazakhstan",
    "ET": "Ethiopia",
    "SD": "Sudan",
    "GN": "Guinea",
    "KE": "Kenya",
    "AG": "Antigua and Barbuda",
    "UY": "Uruguay",
    "GH": "Ghana",
    "NA": "Namibia",
    "SC": "Seychelles",
    "TT": "Trinidad and Tobago",
    "VE": "Venezuela",
    "SZ": "Eswatini",
    "GA": "Gabon",
    "GT": "Guatemala",
    "MR": "Mauritania",
    "RW": "Rwanda",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "SR": "Suriname",
    "XK": "Kosovo",
    "CF": "Central African Republic",
    "CG": "Congo (Brazzaville)",
    "GQ": "Equatorial Guinea",
    "UZ": "Uzbekistan",
    "NL": "Netherlands",
    "BJ": "Benin",
    "LR": "Liberia",
    "SO": "Somalia",
    "TZ": "Tanzania",
    "BB": "Barbados",
    "ME": "Montenegro",
    "KG": "Kyrgyzstan",
    "MU": "Mauritius",
    "ZM": "Zambia",
    "DJ": "Djibouti",
    "GM": "Gambia, The",
    "BS": "Bahamas, The",
    "TD": "Chad",
    "SV": "El Salvador",
    "FJ": "Fiji",
    "NI": "Nicaragua",
    "MG": "Madagascar",
    "HT": "Haiti",
    "AO": "Angola",
    "CV": "Cape Verde",
    "NE": "Niger",
    "PG": "Papua New Guinea",
    "ZW": "Zimbabwe",
    "TL": "Timor-Leste",
    "ER": "Eritrea",
    "UG": "Uganda",
    "DM": "Dominica",
    "GD": "Grenada",
    "MZ": "Mozambique",
    "SY": "Syria"
}

function populateLocation(country, country_code) {
    const countryOption = document.createElement('option');
    countryOption.value = country;
    countryOption.textContent = `${country_code}-${country}`;
    console.log(countryOption);
    countrySelectDropdown.appendChild(countryOption);
}


function populateLocations() {
    Object.entries(countriesWithCountryCodes)
        .forEach(([country_code, country]) => populateLocation(country, country_code));
}

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhc2V5YiIsImEiOiJja2EydmhiMXIwM2Y1M2xzNW5oMnRpYzd5In0.m1vDX_9oLA_Ywa2fa43WXg';

let geocorder;
async function geocodeReverseFromLatLngToPlace(lat, lng) {

    return new Promise((resolve, reject) => {
        geocoder.mapboxClient.geocodeReverse(
            {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng)
            },
            function (error, response) {
                if (error) {
                    reject(error);
                }
                resolve(response.features[0] && response.features[0].place_name)
            }
        );
    })
}

// MAPBOX functionality //
function renderMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
        center: [-103.59179687498357, 40.66995747013945], // starting position [lng, lat]
        zoom: 3 // starting zoom
    });

    geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    });

    map.addControl(geocoder);
    map.addControl(new mapboxgl.NavigationControl());

    map.on('load', async function () {
        map.addSource('places', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
                    },
                },
                features: await Promise.all(coronaData.locations.map(async location => {

                    const placeName = await geocodeReverseFromLatLngToPlace(
                        location.coordinates.latitude,
                        location.coordinates.longitude
                    );
                    return {
                        type: 'Feature',
                        properties: {
                            description: `
                                <table>
                                    <thead>
                                        <tr>${placeName}</tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Confirmed Cases: </td>
                                        <td>${location.latest.confirmed}</td>
                                    </tr>
                                    <tr>
                                        <td>Deaths: </td>
                                        <td>${location.latest.deaths}</td>
                                    </tr>
                                    <tr>
                                        <td>Latitude: </td>
                                        <td>${location.coordinates.latitude}</td>
                                    </tr>
                                    <tr>
                                        <td>Longitude: </td>
                                        <td>${location.coordinates.longitude}</td>
                                    </tr>
                                    </tbody>
                                </table> 
                            `,
                            icon: 'rocket'
                        },
                        geometry: {
                            type: "Point",
                            coordinates: [
                                `${location.coordinates.longitude}`,
                                `${location.coordinates.latitude}`
                            ]
                        }
                    };
                }))
            },
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'places',
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#51bbd6',
                    100,
                    '#f1f075',
                    750,
                    '#f28cb1'
                ],
                'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
            }
        });

        map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'places',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            },
        });

        map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'places',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': '#11b4da',
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff'
            },
        });

        // inspect a cluster on click
        map.on('click', 'clusters', function (event) {
            const features = map.queryRenderedFeatures(event.point, {
                layers: ['clusters'],
            });
            const clusterId = features[0].properties.cluster_id;
            map
                .getSource('places')
                .getClusterExpansionZoom(clusterId, function (error, zoom) {
                    if (error) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom,
                    });
                }
                );
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('click', 'unclustered-point', function (event) {
            const coordinates = event.features[0].geometry.coordinates.slice();
            const { description } = event.features[0].properties;

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
        });

        map.on('mouseenter', 'clusters', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
            map.getCanvas().style.cursor = '';
        });
    });
}

async function initializeApp() {
    setReferences();
    doEventBindings();
    // NProgress.start();
    populateLocations();
    await performAsyncCall();
    renderUI(coronaData.latest, world = true);
    // NProgress.done();
    renderMap();
}

async function performAsyncCall() {
    const response = await fetch(`${baseUrlEndPoint}`);
    const data = await response.json();
    const { latest, locations } = data;
    coronaData.latest = latest;
    coronaData.locations.push(...locations)
}

function renderUI(world = true) {
    let html = '';
    // html = `
    // <table class="table">
    //     <thead>
    //         ${world ? '<h1>World Details</h1>' : `
    //         <tr>${details.country} ${details.country_code}</tr>
    //         `}
    //     </thead>
    //         <tbody>
    //             <tr>
    //                 <td class="cases">Reported Cases: </td> 
    //                 <td> ${world ? details.confirmed : details.latest.confirmed} </td>
    //             </tr>
    //             <tr>
    //                 <td class="deaths">Deaths: </td> 
    //                 <td>${world ? details.deaths : details.latest.deaths} </td>
    //             </tr>
    //         </tbody>
    //     </table>
    //     `;
    if (world) {
        coronaWorldDetailsContainer.innerHTML = html;
    } else {
        coronaWorldDetailsContainer.innerHTML = html;
    }
}

function renderDetailsForSelectedLocation(event) {
    const countrySelected = event.target.value;
    const locationCoronaDetails = coronaData.locations.reduce((accumulator, currentLocation) => {
        if (currentLocation.country === countrySelected) {
            accumulator['country'] = currentLocation.country;
            accumulator['country_code'] = currentLocation.country_code;
            accumulator.latest.confirmed += currentLocation.latest.confirmed;
            accumulator.latest.deaths += currentLocation.latest.deaths;
        }
        return accumulator
    }, {
        country: '',
        country_code: '',
        latest: {
            confirmed: 0,
            deaths: 0
        }
    });
    renderUI(locationCoronaDetails);
}

function setReferences() {
    coronaDetailsContainer = document.querySelector('#corona-details')
    countrySelectDropdown = document.querySelector('[name="select-country"]');
    coronaWorldDetailsContainer = document.querySelector('#corona-world-details');
}

function doEventBindings() {
    countrySelectDropdown.addEventListener('change', renderDetailsForSelectedLocation);
}


/* BEGIN NEWS, TESTING & STATS CARDS */

// Global var used in ajax calls and Select State Dropdown
let userState = "";

// NEW Listener to capture search bar input
// Should we change ids in html to make more sense? #submitState #stateInput?
$("#submitCity").click(searchRegion)
// searchCountry() grabs value of search. Needs a use!
function searchRegion() {
    // value from search input bar
    $userRegion = $("#cityInput").val();
    console.log($userRegion);
    // clear input bar after capture
    $("#cityInput").val("");
}

/* NovelCOV-19 API Calls */
// Global Stats
var settings = {
    "url": "https://disease.sh/v2/all",
    "method": "GET",
    "timeout": 0,
};

$.ajax(settings).done(function (response) {
    console.log(response);
    // assign values to vars
    let globalActive = response.active;
    let globalRecovered = response.recovered;
    let globalDeaths = response.deaths;
    let globalToday = response.todayCases;
    // for small text timestamp (going to convert from UNIX)
    let globalUpdate = response.updated;
    // first convert moment Obj w/ .unix() method
    globalUpdate = moment.unix(globalUpdate / 1000);
    // extract human readable format
    globalUpdate = globalUpdate.format("dddd, MMM Do");
    // append to Data Cards, with hr above p's
    $("#global-cases").append("<p class='cards-p'>Active:</p><p class='cards-p'>" + globalActive + "</p>")
    $("#global-recovered").append("<p class='cards-p'>Recovered:</p><p class='cards-p'>" + globalRecovered + "</p>")
    $("#global-deaths").append("<p class='cards-p'>Deceased:</p><p class='cards-p'>" + globalDeaths + "</p>")
    $("#global-new").append("<p class='cards-p'>New Today:</p><p class='cards-p'>" + globalToday + "</p>")
    $("#global-time").text("Current as of " + globalUpdate);
});

// NovelCOV-19 Again, this time for State Stats
function stateStatsCall() {
    // plug userState into call
    let stateStatsURL = "https://disease.sh/v2/states/" + userState;
    var settings = {
        "url": stateStatsURL,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        // assign values to vars
        let stateName = response.state;
        let stateActive = response.active;
        let stateDeaths = response.deaths;
        let stateToday = response.todayCases;
        // for small text timestamp, same conversion as above
        let localUpdate = response.updated;
        localUpdate = moment.unix(localUpdate / 1000);
        localUpdate = localUpdate.format("dddd, MMM Do");
        // clear section in case this is not the first stateStatsCall()
        $(".wipe").empty();
        // .empty clears card-title, so refill it
        $("#state-stats").text("Local Statistics")
        // append to Data Cards, with hr above p's
        $("#state-name").append("<p class='cards-p wipe'>State:</p><p class='cards-p wipe'>" + stateName + "</p>")
        $("#state-cases").append("<p class='cards-p wipe'>Active:</p><p class='cards-p wipe'>" + stateActive + "</p>")
        $("#state-deaths").append("<p class='cards-p wipe'>Deceased:</p><p class='cards-p wipe'>" + stateDeaths + "</p>")
        $("#state-new").append("<p class='cards-p wipe'>New Today:</p><p class='cards-p wipe'>" + stateToday + "</p>")
        $("#state-time").text("Current as of " + localUpdate);
    });
}

/* NEWS SECTION */

// ajaxResource() gets userState for NewsAPI and Testing API below
function ajaxState() {
    // first, ipapi.co to get state (region) from user IP address
    $.get('https://ipapi.co/8.8.8.8/region/', function (data) {
        // need a var to hold value of data, in lower case
        userState = data.toLowerCase();
        console.log(userState);
    });
}

// ajaxNews() fills News Section
function ajaxNews() {
    // NewsAPI.org
    let newsURL = "https://newsapi.org/v2/top-headlines?country=us&q=coronavirus&sortBy=popularity&apiKey=5f16e289ba95422780d31a86b588ae1d";
    $.ajax({
        url: newsURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // array to hold titles
        let newsTitles = [];
        // array to hold urls
        let newsLinks = [];
        // loop through response, grab article titles & urls
        for (i = 0; i < response.articles.length; i++) {
            newsTitles[i] = response.articles[i].title;
            newsLinks[i] = response.articles[i].url;
        }
        // Shuffling the two arrays: Fisher-Yates Algorithm
        // Thanks to a previous teacher at Sac City, Matthew Phillips,
        // for answering my email about this subject in my old notes.
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
            $("#news-list").append("<li><a href=" + newsLinks[i] + " target='_blank'>" + newsTitles[i] + "</a></li>");
        }
    });
}

/* TESTING SECTION */

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
        // clear section & state in case this is not the first ajaxTesting() call
        $("#test-list").empty();
        $("#your-state").empty();
        // display state in card-title
        $("#your-state").text(" - " + userState);
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
    stateStatsCall();
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