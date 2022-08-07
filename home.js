// MAKE EXTRA SURE THAT THE TWITCH MODULE AND JQUERY MODULES ARE ALREADY INCLUDED
// IF NOT THIS SCRIPT WILL BREAK FAST. AND NOT THE MEAL.
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
// <script src="https://embed.twitch.tv/embed/v1.js"></script>

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

async function generateChannels() {
    // here's the channels we wanna make buttons for
    const channelsBase = [
        {"display": "NotQuiteApex",  "channel": "notquiteapex"},
        {"display": "JuiciBit",      "channel": "juicibit"},
        {"display": "Vivicaster",    "channel": "vivicaster"},
        {"display": "Percy_Creates", "channel": "percy_creates"},
        {"display": "Alchana",       "channel": "alkana"},
        {"display": "LyksaEXE",      "channel": "lyksaexe"}
    ];
    const accessToken = twitchGetToken();

    // arrays for channels that are live or those that need to play vods
    let channelsPromised = [];
    for (const c of channelsBase) {
        channelsPromised.push((async () => {
            let channel = {
                "channel": c["channel"],
                "display": c["display"],
                "vod": "",
                "live": false
            };
            let isLive = await twitchGetLive(await accessToken, channel.channel);
            if (isLive) {
                channel.live = true;
            } else {
                channel.vod = await twitchGetLatestVod(await accessToken, channel.channel);
            }
            return channel;
        })());
    }
    let channels = await Promise.all(channelsPromised);

    let liveChannels = [];
    let rerunChannels = [];
    let deadChannels = [];

    for (const c of channels) {
        console.log(c);
        if (c.live) {
            liveChannels.push(c);
        } else if (c.vod.length !== 0) {
            rerunChannels.push(c);
        } else {
            deadChannels.push(c);
        }
    }

    // shuffle channels and put the live ones on the left in random order while the reruns are ordered.
    liveChannels = shuffle(liveChannels);
    rerunChannels.sort((a, b) => parseInt(b["vod"]) - parseInt(a["vod"]));
    deadChannels = shuffle(deadChannels);
    const trueChannels = [...liveChannels, ...rerunChannels, ...deadChannels];

    // function to generate the twitch element.
    // make sure the appropriate script is included in the html.
    let generateTwitchElement = (channel, vodID) => {
        $("#twitchEmbed").empty();
        let args = {
            width: "100%",
            height: 720,

            channel: channel,
            parent: ["friendteam.biz"]
        };
        if (vodID.length !== 0) {
            args["video"] = vodID;
            delete args["channel"];
        }
        new Twitch.Embed("twitchEmbed", args);
    }

    // we should really add a check to sort what channels are live currently

    // and if a channel isnt live, pull up the latest vod to play

    // make the buttons
    for (const channel of trueChannels) {
        $(document).ready(function() {
            let btn = document.createElement("button");
            btn.innerHTML = channel["display"];
            btn.onclick = () => { generateTwitchElement(channel["channel"], channel["vod"]); };
            btn.align = "center";
            $("#channelButtons").append(btn);
        });
    }

    // put up the first stream in the array (random)
    generateTwitchElement(trueChannels[0]["channel"], trueChannels[0]["vod"]);
}

generateChannels();
