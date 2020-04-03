# peer.school

Die Ziele von Peer School sind:

- **Absolute Datensicherheit** durch Ende-zu-Ende Verschlüsselung
- **Ohne Anmeldung** kann sofort anonym gestartet werden
- **Keine Installation** von Software ist notwendig, es genügt ein aktueller Webbrowser
- **Kinderleichte Bedienung** für Lehrer und Schüler ab der 1. Klasse

Wir möchten schon hier darauf hinweisen, dass es Alternativen zu diesem Ansatz gibt, die evtl. für Ihre Bedürfnisse besser passen. Zu nennen ist hier z.B.  [Big Blue Button](https://bigbluebutton.org/). 

## Lehrer Modus

Der Lehrer erschafft einen neuen Raum auf der Startseite von [peer.school](https://peer.school). Falls dieser Raum später weiter verwendet werden soll, empfiehlt es sich ein Lesezeichen anzulegen.

Unter `Schülerlink` wird die Webadresse angezeigt, die an die Schüler verteilt werden muss, damit diese teilnehmen können. Das kann z.B. per E-Mail oder anderen etablierten Wegen erfolgen.

In dem Raum wird das eigene Videobild des Lehrers angezeigt, das so bei allen Schülern angezeigt wird. Es folgt eine Liste der aktuell angemeldeten Schüler. Zeigt ein Schüler auf, wird dieser hervorgehoben und kann durch Klick auf den Namen für alle Teilnehmer sichtbar und hörbar geschaltet werden.

Auf dem Whiteboard kann nur der Lehrer zeichnen. Es stehen einige einfache Werkzeuge zur Verfügung.

## Schüler Modus 

Der Schüler folgt dem Link den der Lehrer verteilt hat. Zunächst sieht er sein eigenes Videobild zur Kontrolle und das Video und den Ton des Lehrers, wenn diese online ist. 

Der Lehrer präsentiert per Video und Whiteboard die Lerninhalte. Der Schüler kann aufzeigen und so um Freischaltung zur Gruppe zu bitten. Wird ein Schüler freigeschaltet, so erscheint dessen Video und Ton zusätzlich zu denen des Lehrers und des Schülers. Wird der Schüler selbst freigeschaltet, so wird sein Video blau umrahmt.

## Technologien

### WebRTC

Zum Einsatz kommt die [WebRTC Technologie](https://de.wikipedia.org/wiki/WebRTC), die eine direkte verschlüsselte Verbindung zwischen zwei Webbrowsern ermöglicht, ohne das diese über einen Server laufen müssen. Diese Technologie nennt sich [*Peer-to-Peer*](https://de.wikipedia.org/wiki/Peer-to-Peer).  Grundsätzlich ist die Verbindung also sicher, allerdings müssen alle Teilnehmer jeweils mit allen anderen verbunden sein, wodurch sich ab einer großen Teilnehmerzahl eine bedeutsame Komplexität ergibt.

Damit die Teilnehmer sich finden können, kommen doch einige Server zum Einsatz, die aber die Datensicherheit nicht beeinträchtigen:

1. Der Webserver peer.school, der das Rahmenprogramm zur Verfügung stellt
2. Ein sogenannter *Signaling Server* der die WebRTC Teilnehmer miteinander bekannt macht
3. Ein *STUN Server* der die Durchlässigkeit der eigene Firewall prüft und eine optimale Route vorschlägt
4. Evtl. ein *TURN Server* der die verschlüsselten Daten durchreicht, falls kein direkter Durchgang durch die Firewall möglich ist

### Echtzeit Synchronisation

Die Daten der Teilnehmerprofile, des Whiteboards und so weiter werden in Echtzeit mit den allen Teilnehmern in Einklang gebracht. Dabei handelt es sich um ein mathematisch anspruchsvolles Problem, dass durch [Yjs](https://yjs.dev/) gelöst wird. Dadurch wird sicher gestellt, dass alle das selbe sehen und auch Daten von Teilnehmern die eine Weile offline waren, wieder automatisch einfließen können.

### Media Server

Wie unter WebRTC beschrieben, kann es ab einer hohen Teilnehmerzahl zu Problemen mit der Bandbreite und der CPU Auslastung kommen. Um dieses Problem zu lösen kann ein Medienserver eingesetzt werden. Dabei sendet jeder sein eigens Video zu einem zentralen Server, von wo aus es an die anderen verteilt wird. Also lädt der Lehrer z.B. nicht mehr 30 Videostreams gleichzeitig an jeden Schüler hoch, sondern nur noch eins. Es existiert eine Implementierung für peer.school die [Jitsi](https://jitsi.org/) verwendet, allerdings ist diese nicht aktiviert. **Eine Verschlüsselung findet dann nicht mehr statt!** Allerdings lassen sich Medienserver auch selbst betreiben, womit die volle Kontrolle wieder gegeben ist. Bestehende Lösungen wie [Big Blue Button](https://bigbluebutton.org/) sollten bei Bedarf in Betracht gezogen werden.