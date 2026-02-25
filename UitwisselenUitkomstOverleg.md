## Protocol 

![Alt text](https://www.plantuml.com/plantuml/png/fP3FIWCn48VlUOeX9ptq1Of85KMAIFr_dtP_nB3PsJgP3TgdjrayM1OKzRGi-URxabbaOxMXIswx_yPDtB8O3HbAdCa_zxtkeXdKqm7HmY1bF8L42IDz3Qi_3Txy0TnhO8cPBMBaBe0awA3UkJ4rEvqAvtI5DGQjoamtI0s4_5Eqjk-oqQf04mAT8szUOhjcLWfeiEUy-nhysRqIAooXwky6w3jz6q61M9uqndVCQIax3fWQZkul7nxfx7P9hpLnV31-CllF-2-szwalq5sFjkwBMRohyRzR9fSDI2ZGnhi5f1cwz040)

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
De OpenAPI-specificatie van de API _Uitkomst Overleg_ is te downloaden via deze [link](yaml/UitkomstOverleg.yaml).

