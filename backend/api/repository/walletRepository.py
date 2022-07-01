import paramiko, json

def bdk(commande):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    host='ec2-35-169-128-194.compute-1.amazonaws.com'
    username='ubuntu'
    key_filename="bdkserver.pem"
    ssh.connect(host, username=username, key_filename=key_filename)
    stdin, stdout, stderr = ssh.exec_command(commande)
    output = stdout.read().decode("utf-8")
    stdin.close()
    ssh.close()
    return output

def bdk_get_balance():
    return bdk('bdk_get_balance').replace("\n", "")

def bdk_generate_address():
    return bdk('bdk_generate_address').replace("\n", "")


print(bdk_get_balance())
print(bdk_generate_address())
