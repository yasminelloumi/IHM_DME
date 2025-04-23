# 📋 Application DME (Dossier Médical Électronique)

Cette application est une interface de Dossier Médical Électronique (DME) développée avec **React** pour le front-end et **Node.js/JSON Server** pour le back-end. Elle permet la gestion et la consultation des dossiers médicaux pour différents utilisateurs du domaine de la santé.

---

## 👥 Utilisateurs et Fonctionnalités

L'application prend en charge **quatre types d'utilisateurs**, chacun avec ses propres droits et fonctionnalités :

### 🧑‍⚕️ Médecin
- **Matricule** : `test002`  
- **Mot de passe** : `med123`

### 🧪 Laboratoire
- **Matricule** : `67890`  
- **Mot de passe** : `labpass`

### 🏥 Centre d’Imagerie Médicale
- **Matricule** : `11223`  
- **Mot de passe** : `imgpass`

### 🧑 Patient
- **CIN** : `111741852`  
- **Mot de passe** : `123`

---

## 🔐 Accès sécurisé par QR Code

Tout le personnel médical doit **scanner un QR code** pour accéder au DME d’un patient. Cela garantit un accès **sécurisé et traçable** aux données de santé sensibles.

---

## 🛠️ Technologies Utilisées

- ⚛️ **React** – Interface utilisateur dynamique  
- 📡 **JSON Server** – Simule une API REST pour les données  
- 🌐 **Node.js** – Backend et logique serveur  
- 📱 **QR Code** – Pour l’accès sécurisé au DME

---

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/yasminelloumi/IHM_DME.git
   cd IHM_DME
   
2. **Installez les dépendances**
   
   npm install


4. **Lancez le JSON Server **
 
npm run json-server
5. ** Lancez le Node.js **

node server.js    
6.** Lancez l'application React**
 
npm start




