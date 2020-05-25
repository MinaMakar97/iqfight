# IQFight
### Progetto LTW 2019/2020
#### Mina Makar - Fabrizio Rossi
Una sfida avvincente fino all'ultima domanda!
### Tecnologie usate:
HTML5, CSS3, JavaScript ES6, Ajax (XMLHttpRequest), React 16, Bootstrap 4.5.0, PHP7
### Descrizione
IQFight è un'applicazione web realizzata per il corso di Linguaggi e Tecnologie per il Web.

Consiste in un gioco interattivo in cui più persone possono sfidarsi per vedere chi ne sa di più su varie categorie.

E' necessario registrarsi per poter giocare.

Il gioco si articola in stanze che possono essere create dai giocatori stessi, in maniera pubblica o privata.

Le stanza private saranno accessibili solo dalle persone che otterranno un link diretto alla stanza, mentre si può entrare nelle stanze pubbliche attraverso il browser nella sezione `Gioca`.

Una volta entrati in una stanza, solamente il creatore potrà dare il via al gioco.

Una partita consiste nel rispondere alla domanda proposta scegliendo una delle quattro risposte disponibili.

Per ogni risposta corretta verrà attribuito un punteggio in base al tempo impiegato per rispondere.

I giocatori che otterranno un punteggio alto verranno inseriti nella sezione `Classifica` **solamente** se la partita è stata giocata nella categoria di domande "**Casuale**".

E' anche possibile aggiungere nuove domande dall'apposita sezione del menù laterale, ed è possibile vedere le proprie statistiche e modificare i propri dati personali (tra cui anche l'avatar) dalla sezione profilo accessibile cliccando sulla propria immagine utente.

### Note implementative

 - L'applicazione simula il comportamento di un sistema interattivo in tempo reale utilizzando la tecnica dello **short polling**: il client manda periodicamente delle richieste Ajax al server per ottenere lo stato di gioco
 - L'applicazione è una SPA (Single Page Application) realizzata completamente grazie al componente React Router
 - Il server viene "mantenuto in vita" dai client, per cui è stato necessario gestire la concorrenza fra le richieste dei vari client per eseguire alcune operazioni tipicamente svolte dal server