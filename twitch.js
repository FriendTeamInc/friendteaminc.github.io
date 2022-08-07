// Don't do this. apexLUL
const clientID = "l74qhyxziqvrdz9q87g0dvxtptvix8";

async function twitchGetToken() {
	let accessToken;
	const clientSecret = "9sbfbnd3wry7z5w71oh410ifklosda";

	// // Check cookie and if not expired return it
	// const expirationCookie = getCookie("accessToken_expires")
	// const expirationDate = new Date(expirationCookie);
	// const today = new Date();
	// if (today < expirationDate) {
	// 	accessToken = getCookie("accessToken");
	// 	return accessToken;
	// }

	// if no cookie, make a new one
	// POST https://id.twitch.tv/oauth2/token?client_id={}&client_secret={}&grant_type=client_credentials
	const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;
	const res = await $.ajax({
		url: url, method: "POST", dataType: "json",
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	});
	
	accessToken = res["access_token"];
	// setCookie("accessToken", accessToken, res["expires_in"]);

	return accessToken;
}

async function twitchGetLive(accessToken, userLogin) {
	// GET https://api.twitch.tv/helix/streams?user_login={}
	// check if resp['data'][0] exists. if it does theyre live and return true
	// else return false
	let isLive = false;
	const url = `https://api.twitch.tv/helix/streams?user_login=${userLogin}`;
	const res = await $.ajax({
		url: url, method: "GET", dataType: "json",
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + accessToken
		}
	});

	if (res["data"].length !== 0) {
		isLive = true;
	}

	return isLive;
}

async function twitchGetLatestVod(accessToken, userLogin) {
	// GET https://api.twitch.tv/helix/users?login={} -> user_id
	// GET https://api.twitch.tv/helix/videos?first=1&user_id={}
	// use return dict of video

	let userID = "";
	const urlUsers = `https://api.twitch.tv/helix/users?login=${userLogin}`;
	const res = await $.ajax({
		url: urlUsers, method: "GET", dataType: "json",
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + accessToken
		}
	});

	if (res["data"].length === 0) {
		console.warn(`Could not find user with name ${userLogin}.`);
		console.warn(res);
		return "";
	}

	userID = res["data"][0]["id"];

	if (userID.length === 0) {
		console.warn(`No user ${userLogin} found when searching for VODs. Returning...`);
		return "";
	}

	let vodID = "";
	const urlVideos = `https://api.twitch.tv/helix/videos?first=1&user_id=${userID}`;
	const res2 = await $.ajax({
		url: urlVideos, method: "GET", dataType: "json",
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + accessToken
		}
	});

	if (res2["data"].length === 0) {
		console.warn(`Could not find VODs for user with name ${userLogin}.`);
		console.warn(res2);
		return "";
	}

	vodID = res2["data"][0]["id"];

	if (vodID.length === 0) {
		console.warn(`No VODs found for existing user ${userLogin}. Returning...`);
		return "";
	}

	return vodID;
}
