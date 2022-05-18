## 🟢 Comment lancer le projet avec Docker 🐳 ? 
---
---
### 🤔 C'est quoi Docker ? Ça se mange ? 😋
---
> Avant de découvrir Docker, vous devez comprendre ce qu’est un conteneur. Il s’agit d’un environnement d’exécution léger, et d’une alternative aux méthodes de virtualisation traditionnelles basées sur les machines virtuelles. Les conteneurs et les microservices sont de plus en plus utilisés pour le développement et le déploiement des applications. C’est ce qu’on appelle le développement ” cloud-native “. Dans ce contexte, Docker est devenue une solution massivement exploitée en entreprise.

Cliquez [ici](https://datascientest.com/docker-guide-complet) pour en savoir plus sur `Docker et les Containers`

### 🧩 Installer Docker sur Windows Facilement 💻
---
Avant d'installer *Docker*, il faut d'abord installer `WSL`.
**WSL** : Le **W**indows **S**ubsystem for **L**inux permet aux développeurs d'exécuter un environnement GNU/Linux - y compris la plupart des outils, utilitaires et applications en ligne de commande - directement sur Windows, sans modification, sans la surcharge d'une machine virtuelle traditionnelle ou d'une configuration à double amorçage.
Pour installer WSL, il suffit d'ouvrir le `Powershell` en mode **ADMINISTRATEUR**, et d'exécuter la commande suivante:
```sh
wsl --install
```
Une fois l'installation de WSL terminée, il suffit de télécharger `Docker Desktop` et de l'installer. Et terminer par le redémarrage de votre machine !

### 🏀 Lancer le projet avec Docker 🐋
Maintenant que **Docker Desktop** est installé, on peut lancer le projet banxaas et lancer tous les services (`backend`, `gateway`, `database`, `frontend`).
Veuillez ouvrir votre terminal (cmd) en mode administrateur et placer vous dans le dossier `banxaas`. Puis executer les commandes suivantes, une à une:
```sh 
docker-compose up -d
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec gateway python manage.py makemigrations
docker-compose exec gateway python manage.py migrate
```
Et c'est tout, maintenant, vous pouvez accéder au site à l'adresse:
`http://localhost:4200/`
> NB: Vous n'aurez à exécuter toutes ces commandes qu'une seule fois, pour installer toutes les dépendances des services et faire toutes les migrations. `Juste la première fois`
---
> Lorsque vous aurez besoin de lancer les différentes services pour tester le site une nouvelle fois, il vous suffira juste d'executer la commande: ``docker-compose up``
---
> Une fois que vous aurez terminé, il ne faudra pas oublier de stopper les services avec la commande `docker-compose stop`

✨`[Banxaas - 2022] HAPPY CODING !`✨


# Context

In an increasingly digitalized and globalized world, the Internet has become the basis of all modern societies, whether it is communication, finance, services, etc. In the digital age, monetary exchanges take place via centralized channels such as banks, telephone operators, money transfer companies, etc.

It is in this context that Bitcoin emerged, defined as a peer-to-peer electronic payment system. The idea was to have a completely decentralized payment system, allowing to use a valued token in order to send value to each other. Sending bitcoins to the other end of the earth costs much less than the conventional system, is faster, requires no paperwork and the transfer cannot be censored. A financial revolution that increased the value of bitcoin from pennies to tens of thousands of dollars, pushing the global demand for bitcoin to new heights. There are now several hundred online marketplaces where you can buy/sell bitcoins around the world. 

In Senegal, they can be counted on one hand. The demand is there, but the Senegalese is forced to use Chinese, European, Anglo-African solutions to satisfy his need. 
So we decided to launch «Banxaas» which is a marketplace where Senegalese can buy/sell bitcoin, with local payment methods such as Orange money, Wave, Ria.

This exchange is intended to be peer to peer and aims to be, in the long term, the first solution in Senegal to buy and sell Bitcoin.
