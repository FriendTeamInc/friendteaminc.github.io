// https://www.w3schools.com/js/js_cookies.asp

function setCookie(cname, cvalue, expires_seconds) {
	const d = new Date();
	d.setTime(d.getTime() + (expires_seconds*1000));

	let expires = cname + "_expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');

	for(let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	
	return "";
}
