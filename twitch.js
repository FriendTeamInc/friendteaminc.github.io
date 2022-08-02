// Don't do this. apexLUL
let clientID = "l74qhyxziqvrdz9q87g0dvxtptvix8";
let clientSecret = "9sbfbnd3wry7z5w71oh410ifklosda";

let accessToken = "";

function twitchGetToken() {
	// Check cookie and if not expired return it
	const expirationCookie = getCookie("accessToken_expires")
	const expirationDate = new Date(expirationCookie);
	const today = new Date();
	if (today < expirationDate) {
		accessToken = getCookie("accessToken");
		return accessToken;
	}

	// if no cookie, make a new one
	// POST https://id.twitch.tv/oauth2/token?client_id={}&client_secret={}&grant_type=client_credentials
	let url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;
	$.ajax({
		url: url,
		type: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		async: false,
		dataType: "json",
		success: (data) => {
			accessToken = data["access_token"];
			setCookie("accessToken", accessToken, data["expires_in"]);
		}
	});

	return accessToken;
}

function twitchGetLive(userLogin) {
	// GET https://api.twitch.tv/helix/streams?user_login={}
	// check if resp['data'][0] exists. if it does theyre live and return true
	// else return false
	let isLive = false;
	let url = `https://api.twitch.tv/helix/streams?user_login=${userLogin}`;
	$.ajax({
		url: url,
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + accessToken
		},
		async: false,
		dataType: "json",
		success: (data) => {
			if (data["data"].length !== 0) {
				isLive = true;
			}
		}
	});

	return isLive;
}

function twitchGetLatestVod(userLogin) {
	// GET https://api.twitch.tv/helix/users?login={} -> user_id
	// GET https://api.twitch.tv/helix/videos?first=1&user_id={}
	// use return dict of video
	
	let url = `https://api.twitch.tv/helix/users?login=${userLogin}`;
	let userID = "";
	$.ajax({
		url: url,
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + accessToken
		},
		async: false,
		dataType: "json",
		success: (data) => {
			if (data["data"].length === 0) {
				console.error(`Could not find user with name ${userLogin}.`);
				console.error(data);
			}

			userID = data["data"][0]["id"];
		}
	});

	let vodID = "";
	url = `https://api.twitch.tv/helix/videos?first=1&user_id=${userID}`;
	$.ajax({
		url: url,
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + accessToken
		},
		async: false,
		dataType: "json",
		success: (data) => {
			if (data["data"].length === 0) {
				console.error(`Could not find VODs for user with name ${userLogin}.`);
				console.error(data);
			}

			vodID = data["data"][0]["id"];
		}
	});

	return vodID;
}

twitchGetToken();
