# Uitwisselen Uitkomst Overleg

## Protocol 

### Uitwisseling 1: Beschikbaar stellen Uitkomst Overleg

Voorzitter -> KETENINDEX

Hierbij stel ik beschikbaar uit het casusoverleg, m.b.t. hoofdbetrokkene de referentie (verwijzing) naar de uitkomst overleg.

Samenwerkpatroon: **Opdracht Leveren** “Uitkomst Overleg Beschikbaar delen” + **Gebeurtenis Melden “**Uitkomst Overleg Beschikbaar gedeeld”**,**  door Voorzitter

Technisch patroon: **Event** “Uitkomst Overleg Beschikbaar gedeeld” met inzage URI delen, via **Command** naar Kentenindex  API, door Voorzitter

### Uitwisseling 2: Opvragen gebeurtenis Uitkomst

KETENINDEX <- Deelnemer

Samenwerkpatroon: **Gebeurtenis Ontvangen** “Query Uitkomst Overleg Beschikbaar events”, door Deelnemer

Technisch patroon: **Event** “Uitkomst Overleg Beschikbaar gedeeld” opvragen, via **Query** naar Ketenindex  API, door Deelnemer

### Uitwisseling 3: Inzage/Inzien in de Gebeurtenis uitkomst

Voorzitter <- Deelnemer

Hierbij kunt u als deelnemer inzien uit het casusoverleg, m.b.t.

hoofdbetrokkene en nevenbetrokkenen, het verslag met mijn referentie:

de notulen, gemaakte (conditionele) afspraken en besluiten. De direct

betrokken zijn wel/niet geïnformeerd over deze uitkomst vanwege

onderbouwing.

_request_

Samenwerkpatroon: **Inzage Verzoek** “Uitkomst Overleg Inzien” + **Gebeurtenis Melden** “Inzage verzoek gedaan”, door Deelnemer

Technisch patroon: **Query** naar API van systeem voorzitter + **Event** “Inzage verzoek gedaan” delen, via **Command** naar Kentenindex  API, door Deelnemer  

_Response_

Samenwerkpatroon: **Inzage Leveren** “Uitkomst Overleg Leveren” + **Gebeurtenis Melden** “Inzage verzoek Uitkomst Overleg geleverd”**,** door systeem Voorzitter

Technisch patroon: **Query**, via 200 response met daarbij de inhoud Uitkomst Overleg + **Event** “Inzage verzoek geleverd” delen, via **Command** naar Kentenindex  API, door systeem Voorzitter

## API's
Hier komen de verwijzingen naar de yaml files.

