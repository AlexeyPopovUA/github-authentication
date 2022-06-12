const simple_auth = require("simple-oauth2");
const randomstring = require("randomstring");
const { SSM } = require("aws-sdk");

const ssm = new SSM();

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

const getParameters = async (parametersList: string[]): Promise<Map<string, string>> => {
    const map = new Map();

    const resp = await ssm.getParameters({
        Names: parametersList
    }).promise();

    // todo Wrong types
    resp.Parameters.forEach((param) => {
        map.set(param.Name as string, param.Value);
    });

    return map;
}

export async function auth() {
    const map = await getParameters([
        "OAUTH_CLIENT_ID",
        "OAUTH_CLIENT_SECRET",
        "GIT_HOSTNAME",
        "OAUTH_TOKEN_PATH",
        "OAUTH_AUTHORIZE_PATH",
        "REDIRECT_URL",
        "OAUTH_SCOPES",
    ]);

    const oauth2 = new simple_auth.AuthorizationCode({
        client: {
            id: map.get("OAUTH_CLIENT_ID"),
            secret: map.get("OAUTH_CLIENT_SECRET")
        },
        auth: {
            tokenHost: map.get("GIT_HOSTNAME"),
            tokenPath: map.get("OAUTH_TOKEN_PATH"),
            authorizePath: map.get("OAUTH_AUTHORIZE_PATH")
        }
    });

    // Authorization uri definition
    const authorizationUri = oauth2.authorizeURL({
        redirect_uri: map.get("REDIRECT_URL"),
        scope: map.get("OAUTH_SCOPES"),
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
        const map = await getParameters([
            "OAUTH_CLIENT_ID",
            "OAUTH_CLIENT_SECRET",
            "GIT_HOSTNAME",
            "OAUTH_TOKEN_PATH",
            "OAUTH_AUTHORIZE_PATH"
        ]);

        const oauth2 = new simple_auth.AuthorizationCode({
            client: {
                id: map.get("OAUTH_CLIENT_ID"),
                secret: map.get("OAUTH_CLIENT_SECRET")
            },
            auth: {
                tokenHost: map.get("GIT_HOSTNAME"),
                tokenPath: map.get("OAUTH_TOKEN_PATH"),
                authorizePath: map.get("OAUTH_AUTHORIZE_PATH")
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
