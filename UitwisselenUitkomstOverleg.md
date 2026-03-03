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

## CloudEvents

### Doel en scope

Deze samenwerkfunctie ondersteunt het beschikbaar stellen en raadplegen van de uitkomst van een gehouden casusoverleg tussen ketenpartners.

De gebeurtenis ziet op het moment waarop:
- de uitkomst van het casusoverleg formeel beschikbaar wordt gesteld;
- een ketenpartner deze uitkomst raadpleegt.

### Subject

Binnen deze samenwerkfunctie verwijst het attribuut `subject` naar het betreffende casusoverleg.

Structuur:

```
casusoverleg/<casusoverleg-id>
```

Hierbij is `<casusoverleg-id>` de unieke identificatie van het casusoverleg binnen het producerende systeem.

Voorbeeld:

```json
"subject": "casusoverleg/123456789"
```

### Toegestane waarden voor `type`

Binnen deze samenwerkfunctie zijn minimaal de volgende `type`-waarden toegestaan:

#### 1. Uitkomst beschikbaar gesteld

```json
"type": "uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld"
```

Betekenis:  
De uitkomst van het casusoverleg is vastgesteld en beschikbaar gesteld voor ketenpartners.

#### 2. Uitkomst ingezien

```json
"type": "uitwisselen-uitkomst-overleg.uitkomst-ingezien"
```

Betekenis:  
De uitkomst van het casusoverleg is geraadpleegd door een ketenpartner.

### Vulling van `data`

De precieze structuur van het attribuut `data` verschilt per `type`.

#### Bij `uitkomst-beschikbaar-gesteld`

`data` bevat ten minste:
- de inhoudelijke uitkomst (of een verwijzing daarnaar);
- eventuele metadata zoals vaststellingsdatum;
- indien van toepassing: een versienummer.

#### Bij `uitkomst-ingezien`

`data` bevat ten minste:
- de identificatie (bijvoorbeeld OIN) van de raadplegende ketenpartner;
- het tijdstip van inzage (indien afwijkend van `time`);
- eventueel een technisch referentienummer.

### Verdere uitwerking

Indien een uitkomst wordt gewijzigd of ingetrokken, wordt dit via een afzonderlijk event binnen deze samenwerkfunctie gecommuniceerd. Eventuele aanvullende `type`-waarden worden in een latere versie van deze specificatie toegevoegd.
