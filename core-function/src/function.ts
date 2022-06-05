const simple_auth = require("simple-oauth2");
const randomstring = require("randomstring");

import Secrets from "./secrets";

const secrets = new Secrets({
    GIT_HOSTNAME: "https://github.com",
    OAUTH_TOKEN_PATH: "/login/oauth/access_token",
    OAUTH_AUTHORIZE_PATH: "/login/oauth/authorize",
    OAUTH_CLIENT_ID: "foo",
    OAUTH_CLIENT_SECRET: "bar",
    REDIRECT_URL: "http://localhost:3000/callback",
    OAUTH_SCOPES: "repo,user"
});

function getScript(mess: string, content: unknown) {
    return `<html lang="en"><meta charset="utf-8"/><body><script type="application/javascript">
  (function() {
    function receiveMessage(e) {
      console.log("receiveMessage %o", e)
      window.opener.postMessage(
        'authorization:github:${mess}:${JSON.stringify(content)}',
        e.origin
      )
      window.removeEventListener("message",receiveMessage,false);
    }
    window.addEventListener("message", receiveMessage, false)
    console.log("Sending message: %o", "github")
    window.opener.postMessage("authorizing:github", "*")
    })()
  </script></body></html>`;
}

export async function auth() {
    await secrets.init();

    const oauth2 = new simple_auth.AuthorizationCode({
        client: {
            id: secrets.map.get("OAUTH_CLIENT_ID"),
            secret: secrets.map.get("OAUTH_CLIENT_SECRET")
        },
        auth: {
            tokenHost: secrets.map.get("GIT_HOSTNAME"),
            tokenPath: secrets.map.get("OAUTH_TOKEN_PATH"),
            authorizePath: secrets.map.get("OAUTH_AUTHORIZE_PATH")
        }
    });

    // Authorization uri definition
    const authorizationUri = oauth2.authorizeURL({
        redirect_uri: secrets.map.get("REDIRECT_URL"),
        scope: secrets.map.get("OAUTH_SCOPES"),
        state: randomstring.generate()
    });

    return {
        statusCode: 302,
        headers: {
            Location: authorizationUri
        }
    };
}

export async function callback(e: any) {
    try {
        await secrets.init();

        const oauth2 = new simple_auth.AuthorizationCode({
            client: {
                id: secrets.map.get("OAUTH_CLIENT_ID"),
                secret: secrets.map.get("OAUTH_CLIENT_SECRET")
            },
            auth: {
                tokenHost: secrets.map.get("GIT_HOSTNAME"),
                tokenPath: secrets.map.get("OAUTH_TOKEN_PATH"),
                authorizePath: secrets.map.get("OAUTH_AUTHORIZE_PATH")
            }
        });

        const options = {
            code: e.queryStringParameters.code
        };

        const result = await oauth2.getToken(options);
        const token = result.token.access_token;
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html"
            },
            body: getScript("success", {
                token,
                provider: "github"
            })
        };
    } catch (err) {
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html"
            },
            body: getScript("error", err)
        };
    }
}

export async function success() {
    return {
        statusCode: 204,
        body: ""
    };
}

export async function def() {
    return {
        statusCode: 302,
        headers: {
            Location: "/auth"
        }
    }
}

export async function healthcheck() {
    return {
        statusCode: 204,
        body: "OK"
    };
}
