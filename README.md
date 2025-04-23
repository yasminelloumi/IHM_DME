 📋 Application DME (Dossier Médical Électronique)
Cette application est une interface  de Dossier Médical Électronique (DME) développée avec React pour le front-end et Node.js/JSON Server pour le back-end. Elle permet la gestion et la consultation des dossiers médicaux pour différents utilisateurs du domaine de la santé.
👥 Utilisateurs et Fonctionnalités
L'application prend en charge  quatre types d'utilisateurs, chacun avec ses propres droits et fonctionnalités :
🧑‍⚕️ Médecin
Matrecule : test002
Password : med123
🧪 Laboratoire
Matrecule : 67890
Password :  labpass
🏥 Centre d’Imagerie Médicale
Matrecule : 11223
Password :  imgpass
🧑 Patient
CIN : 111741852
Password: 123

🔐 Accès sécurisé par QR Code
Tout le personnel médical doit scanner un QR code pour accéder au DME d’un patient. Cela garantit un accès sécurisé et traçable aux données de santé sensibles.


 🛠️ Technologies Utilisées
 ⚛️ React – Interface utilisateur dynamique
📡 JSON Server – Simule une API REST pour les données
🌐 Node.js – Backend et logique serveur
📱 QR Code – Pour l’accès sécurisé au DME

📦 Installation
1. Cloner le projet
git clone https://github.com/yasminelloumi/IHM_DME.git
cd IHM_DME
2. Installez les dépendances 
npm install
3. Lancez le JSON Server  
npm run json-server
4.  Lancez le Node.js
node server.js    
5. Lancez l'application React :
npm start




