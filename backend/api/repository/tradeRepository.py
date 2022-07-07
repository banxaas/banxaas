import paramiko, json, os, http.client
from pprint import pprint
import smtplib
import ssl
from api.externe.OrangeSmsApiToken import verifyExistingToken

def bdk(commande):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    host='ec2-35-169-128-194.compute-1.amazonaws.com'
    username='ubuntu'
    key_filename= "/backend/api/repository/bdkserver.pem" #"bdkserver.pem"
    ssh.connect(host, username=username, key_filename=key_filename)
    stdin, stdout, stderr = ssh.exec_command(commande)
    output = stdout.read().decode("utf-8")
    stdin.close()
    ssh.close()
    return output

def bdk_get_balance():
    return bdk('bdk_get_balance').replace("\n", "").replace("Wallet balance in SAT: ", "")

def bdk_generate_address():
    return bdk('bdk_generate_address').replace("\n", "").replace("Generated Address: ", "")

notifSellerMail = f"""From: Yite Verification <{str(os.environ.get('MAIL_BANXAAS'))}>
To: <sellerMail>
MIME-Version: 1.0
Content-type: text/html
Subject: Notification de vente

Bonjour <b>PseudoVendeur</b>, nous vous informons qu'un certain utilisateur
désire acheter vos bitcoins ! Nous vous invitons à rejoindre la transaction, le
plus vite possible ! <br/>
<i><a style="color:red" href="http://localhost:4200">Rejoindre la Transaction</a></i>
""".encode('utf-8')

def sendNotificationByMailToSeller(sellerMail, sellerPseudo):
    """Permet de notifier le vendeur d'une potentielle vente par mail"""

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
    """Permet d'envoyer un code de validation par phone"""
    messageSms = f"Bonjour {sellerPseudo}, nous vous informons qu'un certain utilisateur désire acheter vos bitcoins ! Nous vous invitons à rejoindre la transaction, le plus vite possible ! http://localhost:4300"
    token = verifyExistingToken()  # Vérification d'un token API ORANGE existant
    conn = http.client.HTTPSConnection("api.orange.com")  # Initialisation de la connexion
    payload = json.dumps({
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
    conn.request("POST", "/smsmessaging/v1/outbound/tel%3A%2B221774924730/requests", payload, headers)
    res = conn.getresponse()
    data = res.read()
    pprint(data)
