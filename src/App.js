/* global gapi */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const apiKey = 'AIzaSyACD-SEnWUgfuKxV65NQEv4SCUMVnYHUVE';
const clientSecret = '1NoRHIXBiANN-2r_YyqE0P2a';
const clientId = '728112029907-q9ovbc6cdkcg0un8tl0il0dd8vamo0dg.apps.googleusercontent.com';
const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const scopes = 'https://www.googleapis.com/auth/drive.metadata.readonly';

/*
POST /oauth2/v4/token HTTP/1.1
Host: www.googleapis.com
Content-length: 233
content-type: application/x-www-form-urlencoded
user-agent: google-oauth-playground
code=4%2FPktj9HIuvcI1xQ5Jgmb4mvkU6c6Wv9x9hH5mtnjPldY&
redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&
client_id=407408718192.apps.googleusercontent.com&
client_secret=************&
scope=&
grant_type=authorization_code
*/

class App extends Component {
	handleAuthClick = () => {
		gapi.auth2.getAuthInstance().signIn();
	};

	handleSignoutClick = () => {
		gapi.auth2.getAuthInstance().signOut();
	};

	updateSigninStatus = isSignedIn => {
		if (isSignedIn) {
			this.listFiles();
		}
	};

	listFiles = () => {
		gapi.client.drive.files
			.list({
				pageSize: 10,
				fields: 'nextPageToken, files(id, name, mimeType, kind)',
			})
			.then(response => {
				response.result.files.forEach(file => {
					console.log('file', file.mimeType, file.kind, file.id, file.name);
				});
			});
	};

	initClient = () => {
		gapi.client
			.init({
				apiKey,
				clientId,
				discoveryDocs,
				scope: scopes,
			})
			.then(() => {
				// Listen for sign-in state changes.
				gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

				// Handle the initial sign-in state.
				this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			});
	};

	/*
	code=4%2FGJO4xBGlRtvgm0_oxgK94xhRMpRJZYuJhxyotfvRVqE&
	redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&
	client_id=407408718192.apps.googleusercontent.com&
	client_secret=************&
	scope=&
	grant_type=authorization_code
	*/

	oauthGetToken = () => {
		const oauth2Endpoint = 'https://accounts.google.com/oauth2/v2/auth/';
		// const oauth2Endpoint = 'https://accounts.google.com/oauth2/v4/token/';
		const ajax = new XMLHttpRequest();

		const params = `code=4%2FGJO4xBGlRtvgm0_oxgK94xhRMpRJZYuJhxyotfvRVqE&
		client_id=407408718192.apps.googleusercontent.com&
		client_secret=${clientSecret}&
		scope=&
		grant_type=authorization_code`;

		ajax.open('POST', oauth2Endpoint + params, true);
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		ajax.send();
		ajax.onreadystatechange = () => {
			// Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
			if (ajax.readyState === 4 && ajax.status === 200) {
				const data = ajax.responseText;
				console.log('onreadystatechange', data);
			}
		};
		// const form = document.createElement('form');
		// form.setAttribute('method', 'POST'); // Send as a GET request.
		// form.setAttribute('action', oauth2Endpoint);
	};

	oauthSignIn = () => {
		// Google's OAuth 2.0 endpoint for requesting an access token
		const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

		// Create <form> element to submit parameters to OAuth 2.0 endpoint.
		const form = document.createElement('form');
		form.setAttribute('method', 'GET'); // Send as a GET request.
		form.setAttribute('action', oauth2Endpoint);

		// Parameters to pass to OAuth 2.0 endpoint.
		const params = {
			client_id: clientId,
			redirect_uri: 'YOUR_REDIRECT_URI',
			response_type: 'token',
			scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
			include_granted_scopes: 'true',
			state: 'pass-through value',
		};

		// Add form parameters as hidden input values.
		for (const p in params) {
			const input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', p);
			input.setAttribute('value', params[p]);
			form.appendChild(input);
		}

		// Add form to page and submit it to open the OAuth 2.0 endpoint.
		document.body.appendChild(form);
		form.submit();
	};

	// https://accounts.google.com/o/oauth2/v2/auth
	componentDidMount() {
		this.oauthGetToken();
		/*const script = document.createElement('script');
		script.onload = () => {
			gapi.load('client:auth2', this.initClient);
		};
		script.src = 'https://apis.google.com/js/api.js';
		document.body.appendChild(script);
		*/
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<button onClick={this.handleAuthClick}>Authorize</button>
				<button onClick={this.handleSignoutClick}>Sign Out</button>
			</div>
		);
	}
}

export default App;
