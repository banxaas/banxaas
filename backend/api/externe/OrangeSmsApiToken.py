import http.client
import json
from datetime import datetime


def getNewToken():
    authorization_header = 'NEJYNDRYVFR2aWpjZ3lzYVhENHRpYklxRDE0VkVSTTA6cVN2RmY4R0EzTVlJMFRTZg'
    conn = http.client.HTTPSConnection("api.orange.com")
    payload = 'grant_type=client_credentials'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': f"Basic {authorization_header}"
    }
    conn.request("POST", "/oauth/v3/token", payload, headers)
    res = conn.getresponse()
    data = res.read()
    token = data.decode("utf-8")
    createdAt = datetime.now().strftime('%y-%m-%d %H:%M:%S.%f')
    tokenInfo = token + '|' + createdAt
    tokenFile = open('api/externe/OrangeSmsApiToken.txt', 'w')
    tokenFile.write(tokenInfo)
    tokenFile.close()


def verifyExistingToken():
    try:
        with open('api/externe/OrangeSmsApiToken.txt', 'r') as tokenFile:
            tokenInfo = tokenFile.read()
            tokenFile.close()
        token = json.loads(tokenInfo.split('|')[0])
        createdAt = datetime.strptime(tokenInfo.split('|')[1], '%y-%m-%d %H:%M:%S.%f')
        deltaTime = (datetime.now() - createdAt).total_seconds()
        if deltaTime > token['expires_in']:
            print("Generating new Token ...")
            getNewToken()
            print("Token generated with success !")
            return verifyExistingToken()
        print("Token already valid ! No need to refresh the token !")
        return token

    except FileNotFoundError:
        print("Token not found")
        getNewToken()
        print("New token generated! ")
        return verifyExistingToken()
