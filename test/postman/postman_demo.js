eval(pm.globals.get("JsGlobal"));

const url = "http://localhost:3000/v2/users/sessions/kinger121314";

const body = {
    "refresh_token": pm.environment.get("RefreshToken")
};


getRequestParams(url, body);