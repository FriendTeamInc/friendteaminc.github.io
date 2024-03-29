// MAKE EXTRA SURE THAT THE TWITCH MODULE AND JQUERY MODULES ARE ALREADY INCLUDED
// IF NOT THIS SCRIPT WILL BREAK FAST. AND NOT THE MEAL.
// <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
// <script src="https://embed.twitch.tv/embed/v1.js"></script>

// shuffling function, for random positioned buttons
// https://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length, randomIndex;
	
	while (currentIndex != 0) { // While there remain elements to shuffle.
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

async function generateChannels() {
	const accessToken = twitchGetToken();
	// here's the channels we wanna make buttons for
	const channelsBase = [
		{"display": "NotQuiteApex",  "channel": "notquiteapex"},
		{"display": "JuiciBit",      "channel": "juicibit"},
		{"display": "Percy_Creates", "channel": "percy_creates"},
		{"display": "Prismatica",    "channel": "iris_prismatica"}
		
		// cult
		//{"display": "Landon", "channel": "landonzzz6"},
		//{"display": "Magic", "channel": "magical_fool"},
		//{"display": "Moura", "channel": "46moura"},
		
		// other
		//{"display": "evets", "channel": "zevvets"},
		//{"display": "aptmoo", "channel": "aptmoo"},
		//{"display": "Skysometric", "channel": "skysometric"},
		//{"display": "Qixils", "channel": "lexikiq"},
	];

	// arrays for channels that are live or those that need to play vods
	let liveChannels = [];
	let rerunChannels = [];
	let deadChannels = [];
	let channelsPromised = [];
	for (const c of channelsBase) {
		channelsPromised.push((async () => {
			console.trace(`getting live ${c.channel}`);
			let isLive = await twitchGetLive(await accessToken, c.channel);
			let channel = {
				"channel": c.channel,
				"display": c.display,
				"vod": "",
				"live": false
			};
			console.trace(`no live err ${c.channel}`);

			if (isLive) {
				channel.live = true;
				liveChannels.push(channel);
			} else {
				console.trace(`getting vod ${c.channel}`);
				channel.vod = await twitchGetLatestVod(await accessToken, channel.channel);
				if (channel.vod.length !== 0) {
					rerunChannels.push(channel)
				} else {
					deadChannels.push(channel)
				}
				console.trace(`no vod err ${c.channel}`);
			}
		})());
	}
	await Promise.all(channelsPromised);

	// shuffle channels and put the live ones on the left in random order while the reruns are ordered.
	liveChannels = shuffle(liveChannels);
	rerunChannels.sort((a, b) => parseInt(b.vod) - parseInt(a.vod));
	deadChannels = shuffle(deadChannels);
	const trueChannels = [...liveChannels, ...rerunChannels, ...deadChannels];

	let currentChannel = "";

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
			args.video = vodID;
			delete args.channel;
		}
		new Twitch.Embed("twitchEmbed", args);

		currentChannel = channel;
	}

	// make the buttons
	for (const channel of trueChannels) {
		$(document).ready(function() {
			let btn = document.createElement("button");

			btn.innerHTML = channel.display;
			btn.align = "center";
			btn.onclick = () => {
				if (currentChannel !== channel.channel) {
					generateTwitchElement(channel.channel, channel.vod);
				}
			};
			
			$("#channelButtons").append(btn);
		});
	}

	// put up the first stream in the array (random)
	generateTwitchElement(trueChannels[0].channel, trueChannels[0].vod);
}

generateChannels();
