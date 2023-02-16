import paramiko, json, os, http.client, requests, ssl, smtplib, json5
from pprint import pprint
#from api.externe.OrangeSmsApiToken import verifyExistingToken

def bdk(commande):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(str(os.environ.get('BDK_HOST')), int(os.environ.get('BDK_PORT')), str(os.environ.get('BDK_USERNAME')), str(os.environ.get('BDK_PASSWORD')))
    while True:
        stdin, stdout, stderr = ssh.exec_command(commande)
        output = stdout.read().decode("utf-8")
        pprint(output)
        error = stderr.read().decode("utf-8")
        pprint(error)
        if output != '':
            break
    ssh.close()
    return output

def bdk_get_balance():
    return json5.loads(bdk('bdk_get_balance').replace("\n", ""))['confirmed']

def bdk_generate_address():
    address = str(bdk('bdk_generate_address').replace("\n", ""))
    return address

def bdk_do_transaction(address,amount):
    return bdk(f'bdk_do_transaction {address} {amount}')

def mempool_check_transaction(txId, walletAddress, amount_expected):
    url = f"https://mempool.space/api/tx/{txId}"
    r = requests.get(url)
    if r.headers['content-type'] == 'text/plain':
        return [False, "Transaction Inexistante !"]
    transaction_data = r.json()
    vout = transaction_data['vout']
    for out in vout:
        #change adress to test
        
        false_adress = walletAddress
        #change amount to test$
        amount_expected = int(out['value'])
        # if 'scriptpubkey_address' in out and out['scriptpubkey_address'] == walletAddress:
        if false_adress == walletAddress:
            print("Banxaas est présent dans la transaction !")
            if int(amount_expected) != int(out['value']):
                return [False, "Le montant reçu n'est pas le montant attendu"]
            return [True]
        return [False, "Banxaas n'est pas présent dans cette transaction. Vérifier le txId"]

notifSellerMail = f"""From: Yite Verification <{str(os.environ.get('MAIL_BANXAAS'))}>
To: <sellerMail>
MIME-Version: 1.0
Content-type: text/html
Subject: Notification de vente

Bonjour <b>PseudoVendeur</b>, nous vous informons qu'un certain utilisateur
désire acheter vos bitcoins ! Nous vous invitons à rejoindre la transaction, le
plus vite possible ! <br/>
<i><a style="color:red" href="http://localhost:4200/connexion">Rejoindre la Transaction</a></i>
""".encode('utf-8')

def sendNotificationByMailToSeller(sellerMail, sellerPseudo):
    #Permet de notifier le vendeur d'une potentielle vente par mail#

    # Connexion au server
    server = smtplib.SMTP(str(os.environ.get('MAIL_SERVER_HOST')), int(os.environ.get('MAIL_SERVER_PORT')))
    context = ssl.create_default_context()
    server.starttls(context=context)
    server.login(str(os.environ.get('MAIL_BANXAAS')), str(os.environ.get('PASSWORD_MAIL_BANXAAS')))

    # Préparation du mail
    sender = str(os.environ.get('MAIL_BANXAAS'))
    receivers = [sellerMail]
    mail = str(notifSellerMail.decode('utf-8')).replace("sellerMail", sellerMail).replace("PseudoVendeur", sellerPseudo)
    mail = bytes(mail.encode('utf-8'))
    # Envoie !!
    server.sendmail(sender, sellerMail, mail)
    # Déconnexion
    server.quit()

def sendNotificationByPhoneToSeller(sellerPhone, sellerPseudo):
    #Permet d'envoyer un code de validation par phone#
    messageSms = f"Bonjour {sellerPseudo}, nous vous informons qu'un certain utilisateur désire acheter vos bitcoins ! Nous vous invitons à rejoindre la transaction, le plus vite possible ! http://localhost:4300"
    token = verifyExistingToken()  # Vérification d'un token API ORANGE existant
    conn = http.client.HTTPSConnection("api.orange.com")  # Initialisation de la connexion
    payloads = json.dumps({
        "outboundSMSMessageRequest": {
            "address": f"tel:+221{sellerPhone}",
            "senderAddress": "tel:+221774924730",
            "outboundSMSTextMessage": {
                "message": messageSms
            }
        }
    })
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f"{token['token_type']} {token['access_token']}"
    }
    # Envoie du Code
    conn.request("POST", "/smsmessaging/v1/outbound/tel%3A%2B221774924730/requests", payloads, headers)
    res = conn.getresponse()
    data = res.read()
    pprint(data)
