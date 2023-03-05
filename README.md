# ⚔️ IQFight

A competitive challenge till the last question!
IQFight is a **web application** consisting of an interactive game in which several people can challenge each other to see **who knows the most** about various categories.

<div align="center">
<img src="https://user-images.githubusercontent.com/67014984/222987417-0a07cc75-69f3-4c69-852c-ce9f16d8edf3.png" style="width: 80%"/>
</div>

## Description

The game is divided into **rooms** that can be created by the players themselves, either **publicly** or **privately**.
Private rooms can only be accessed by people who obtain a **direct link to the room**, while public rooms can be entered through the browser in the `Play` section.

Once in a room, only the creator will be able to start the game.

A game consists of **answering the proposed question** by choosing one of the **four available answers**.
For each correct answer a score will be awarded based on the time taken to answer.
Players with a high score will be placed in the `Ranking` section **only** if the game was played in the `Casual` question category.

It is also possible to **add new questions** from the side menu, and you can view your **statistics and edit your personal data** (including your avatar) from the **profile section** accessible by clicking on your user image.

***Note**: It is necessary to register in order to play.*

## Contributors
<a href="https://github.com/MinaMakar97" target="_blank">
  <img src="https://img.shields.io/badge/Profile-Mina%20Makar-green?style=for-the-badge&logo=github&labelColor=blue&color=white">
</a>
<a href="https://www.linkedin.com/in/minamakar97/" target="_blank">
 <img src="https://img.shields.io/badge/Profile-Mina%20Makar-green?style=for-the-badge&logo=linkedin&labelColor=blue&color=white">
</a>
<br /><br />
<a href="https://github.com/SkyLionx" target="_blank">
  <img src="https://img.shields.io/badge/Profile-Fabrizio%20Rossi-green?style=for-the-badge&logo=github&labelColor=blue&color=white">
</a>
<a href="https://www.linkedin.com/in/fabrizio-rossi-a40741243/" target="_blank">
 <img src="https://img.shields.io/badge/Profile-Fabrizio%20Rossi-green?style=for-the-badge&logo=linkedin&labelColor=blue&color=white">
</a>

## Screenshots

### Leaderboard
<div align="center">
<img src="https://user-images.githubusercontent.com/67014984/222987449-340a167f-a103-4e6a-8299-f1b03e1e85b6.png" style="width: 80%"/>
</div>

### Room creation
<div align="center">
<img src="https://user-images.githubusercontent.com/67014984/222987479-e9178c38-a8e2-46c5-a99a-25995af0c6fd.png" style="width: 80%"/>
</div>

### User profile
<div align="center">
<img src="https://user-images.githubusercontent.com/67014984/222987522-dd4efb68-572f-4972-9a3a-e409299f31b7.png" style="width: 80%"/>
</div>

## Technologies used:
HTML5, CSS3, JavaScript ES6, Ajax (XMLHttpRequest), React 16, Bootstrap 4.5.0, PHP7

### Implementation notes
 - The application acts as an interactive real-time system using the **short polling** technique: the client periodically sends Ajax requests to the server to obtain the game status
 - The application is a SPA (Single Page Application) completely realised thanks to the React Router component
 - The server is "kept alive" by the clients, so it was necessary to manage the competition between the requests of the various clients in order to perform certain operations typically carried out by the server
