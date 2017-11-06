# PhytoSafe : améliorer l'efficacité des traitements anti-cancéreux

PhytoSafe est une application permettant de mettre en évidence les incompatibilités entre les traitements cancéreux prescrits par le médecin et les thérapies alternatives prises par le patient, telles que les phytothérapies et les aromathérapies. Les incompatibilités sont révélées à partir d'un formulaire rempli par le patient.

Ce répertoire Github contient le code source de la partie front-end de l'application. Ce code a été écrit en utilisant le framework [Ionic](https://ionicframework.com/).

## Sommaire

1. [Installation](#installation)
2. [Fonctionnement](#fonctionnement)
3. [Mise en production](#production)

## <a name="installation"></a>Installation

PhytoSafe est une application mobile hybride qui est codé avec des langages web : Html, CSS et JavaScript. Le code a été écrit en utilsant le framework [Ionic](https://ionicframework.com/), basé sur [Angular](https://angular.io). Il utilise deux préprocesseurs : l'un pour CSS, [SASS](https://sass-lang.com) et l'autre pour JavaScript, [TypeScript](https://www.typescriptlang.org).

### Installations des outils

Afin de procéder à l'installation de Ionic, il est nécessaire d'installer [Node.js](https://nodejs.org/en/download/). Une fois l'installation effectuée, il faut lancer la commande :
```bash
npm install -g cordova ionic
```

Avant de pouvoir utiliser PhytoSafe-api à partir de ce répertoire GitHub, il faut installer [Git](https://git-scm.com). Git est un logiciel de versions décentralisé : il permet de garder la trace des différentes versions apportées au code de PhytoSafe et de mettre en évidence chaque modification réalisée. Dans le cas de PhytoSafe, chaque modification réalisée est stockée sur ce répertoire GitHub. Avant d'enregistrer une modification dans ce répertoire GitHub, il est nécessaire de parcourir la [documentation Git](https://git-scm.com/docs).

### Initialisation

L'initialisation de l'application n'a pas vocation a être répétée, elle est décrite à titre d'information. L'application a été créée à partir du modèle "Ionic Super Starter", qui requiert la version _Ionic CLI 3_ :
```bash
ionic start phytosafe-app super
```

### Lancement de l'application

#### Cloner le répertoire GitHub
Dans un premier temps, il faut cloner ce répertoire GitHub dans un dossier local en lançant la commande, depuis l'emplacement désiré :
```bash
git clone --https://github.com/kenko-apps/phytosafe-app
```

#### Lancer l'application dans un navigateur web
Afin de lancer l'application localement, il suffit de lancer, depuis le répertoire du projet PhytoSafe, la commande suivante :
```bash
ionic serve
```
L'application s'ouvre alors automatiquement dans un navigateur web, à l'adresse : *http://localhost:8100*.

#### Lancer l'application grâce à Android Studio
Lancée localement dans un navigateur web, l'application ne peut pas fonctionner correctement : elle ne notamment pas faier de requête à l'API de PhytoSafe, le navigateur web empêchant toute requête qui n'a pas la même origine que l'application (c'est-à-dire localhost:8100). Pour contourner ce problème, il faut lancer l'application grâce à [Android Studio](https://developer.android.com/studio/index.html). La configuration d'Android Studio pour lancer une application Ionic est disponible en suivant ce [lien](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html).
Il est essentiel de s'assurer que les variables d'environnement Java et Android, ainsi que les paquets SDK, à travers l'Android SDK Manager, sont bien configurées. L'application n'étant plus lancée dans un navigateur web, il faut faire référence à l'API avec son adresse IP et non avec la variable *localhost*, même si l'API est lancée localement. Cette mofication doit être réalisée dans le fichier [api.ts](../src/providers/api.ts). Attention à ne pas révéler son adresse IP sur GitHub.
Une fois la configuration d'Android Studio finalisée, il est nécessaire d'ajouter la plateforme Android à notre application Ionic :
```bash
ionic cordova platform add android
ionic cordova build android
``` 
Il y a deux manières de lancer l'application grâce à Android Studio :

* en utilisant un appareil connecté,

Il suffit de connecter son appareil Android et de lancer la commande :
```bash
ionic cordova run android
```
Il faut s'assurer que son appareil autorise le [développement d'applications](https://developer.android.com/studio/run/device.html).

* en utilisant un émulateur,

La création d'un émulateur android (AVD - Android Virtual Device), décrite sur le site de [Cordova](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html) dont le lien est donné ci-dessus, ne peut se faire avant d'avoir réalisé les étapes ci-dessous, qui permettent de faire du projet Ionic un projet Android Studio. La création d'un tel simulateur n'est pas nécessaire pour le lancement de l'application sur un appareil connecté.


Une fois créé, l'émulateur peut être utilisé pour lancer l'application :
```bash
ionic cordova emulate android
```

## <a name="fonctionnement"></a>Fonctionnement

L'application a été créée à partir du modèle _"Ionic Super Starter"_. Cette application comprend plusieurs modules, dont certains ont été ajoutés :

* __@ngx-translate__

Ce [module](https://github.com/ngx-translate/core) permet d'écrire une application en différente langues de manière très simple.
Pour ajouter un langage, il suffit d'ajouter un fichier dans le dossier [src/assets/i18n](../resources/database), en suivant la même convention que pour les autres langues, à savoir un fichier CODELANG.json où CODELANG est le code de la langue ajoutée (ex : en/gb/de/es/fr...).
Pour changer la langue de l'application, il faut modifier dans le fichier [app.component.ts](../src/app/app.component.ts) la ligne :
```typescript
translate.use('en')
```
et remplacer le code de la langue par le code souhaité.

* __@ng-idle__

Ce module permet de détecter lorsqu'un utilisateur n'est plus actif sur l'application. Lors de l'initialisation de l'application, pour l'installer, il faut lancer les commandes suivantes :
```bash
cd <nom_du_dossier>
npm install --save @ng-idle/core
```
La mise en place de la détection de l'activité de l'utilisateur est gérée dans le fichier [inactif.ts](../src/providers/inactif.ts). Plus d'informations sur ce module peuvent être trouvées en suivant ce [lien](https://www.npmjs.com/package/ng2-idle).

* __@ionic/storage__

Ce module permet de stocker localement des paires Clé/Valeur ou des objets JSON. La manipulation des paires/objets stockés est permise par le fichier [localstockage.ts](../src/providers/localstockage.ts). Ce module est compris par défaut dans toute application Ionic. Plus d'informations sur ce module peuvent être trouvées en suivant ce [lien](https://ionicframework.com/docs/storage/).

* __@angular/http__

Ce module permet de communiquer avec un serveur HTTP. La partie front-end de l'application PhytoSafe peut ainsi communiquer avec l'API de l'application. Les requêtes qui permettent cette communication sont décrites dans le fichier [api.ts](../src/providers/api.ts), ainsi que dans les fichiers [formulaire.ts](../src/providers/formulaire.ts), [traitement.ts](../src/providers/traitement.ts) et [incompatibilite.ts](../src/providers/incompatibilite.ts). Ce module est compris par défaut dans toute application Angular. Plus d'informations peuvent être trouvées en suivant ce [lien](https://codecraft.tv/courses/angular/http/core-http-api/).

* __@angular/forms__

Ce module permet la mise en place de formulaires. Afin de valider les formulaires, des validateurs peuvent être créés sur-mesure. Ces validateurs sont répertoriés dans le fichier [validators.ts](../src/providers/validators.ts). Ce module est compris par défaut dans toute application Angular. Plus d'informations peuvent être trouvées en suivant ce [lien](https://angular.io/guide/forms).

## <a name="production"></a>Mise en production
