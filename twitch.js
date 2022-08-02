// MAKE EXTRA SURE THAT THE TWITCH MODULE AND JQUERY MODULES ARE ALREADY INCLUDED
// IF NOT THIS SCRIPT WILL BREAK FAST. AND NOT THE MEAL.
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
// <script src="https://embed.twitch.tv/embed/v1.js"></script>

// here's the channels we wanna make buttons for
let channels = [
    {"display": "NotQuiteApex",  "channel": "notquiteapex"},
    {"display": "JuiciBit",      "channel": "juicibit"},
    {"display": "Vivicaster",    "channel": "vivicaster"},
    {"display": "Percy_Creates", "channel": "percy_creates"},
    {"display": "Alchana",       "channel": "alkana"},
    {"display": "LyksaEXE",      "channel": "lyksaexe"}
]

// shuffling function, for random positioned buttons
// https://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

// shuffle channels.
channels = shuffle(channels);

// function to generate the twitch element.
// make sure the appropriate script is included in the html.
let genTwitch = (channel) => {
    $("#twitchEmbed").empty();
    new Twitch.Embed("twitchEmbed", {
        width: "100%",
        height: 720,

        channel: channel,
        parent: ["friendteam.biz"]
    });
}

// we should really add a check to sort what channels are live currently

// and if a channel isnt live, pull up the latest vod to play

// make the buttons
for (const channel of channels) {
    $(document).ready(function() {
        let btn = document.createElement("button");
        btn.innerHTML = channel["display"];
        btn.onclick = () => { genTwitch(channel["channel"]); };
        btn.align = "center";
        $("#channelButtons").append(btn);
    });
}

// put up the first stream in the array (random)
genTwitch(channels[0]);
