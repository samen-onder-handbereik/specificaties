## Protocol 

Hier moet een plantuml-diagram komen. 

### Uitwisseling 1: Stappen voor Uitwisselen Melding

## API's
De OpenAPI-specificatie van de API _Melding_ is te downloaden via deze [link](yaml/Melding.yaml).

## CloudEvents

### Doel en scope

Deze samenwerkfunctie ondersteunt het attenderen van ketenpartners op het registreren en behandelen van een melding binnen het domein van Jeugd, Zorg en Veiligheid. 

Wanneer een ketenpartner in het eigen systeem een melding registreert, wordt een CloudEvent verzonden om andere ketenpartners te informeren dat er een nieuwe melding beschikbaar is.

De gebeurtenissen binnen deze samenwerkfunctie zien op het moment waarop:
- een nieuwe melding is geregistreerd;
- een melding is ingezien door een ketenpartner;
- een melding is opgepakt door een ketenpartner.

### Subject

Binnen deze samenwerkfunctie verwijst het attribuut `subject` naar de betreffende melding.

Structuur:

```
melding/<melding-id>
```

Hierbij is `<melding-id>` de unieke identificatie van de melding binnen het producerende systeem.

Voorbeeld:

```json
"subject": "melding/987654321"
```

Elk event binnen deze samenwerkfunctie heeft betrekking op precies één specifieke melding.

### Toegestane waarden voor `type`

Binnen deze samenwerkfunctie zijn minimaal de volgende `type`-waarden toegestaan:

#### 1. Nieuwe melding geregistreerd

```json
"type": "uitwisselen-melding.melding-geregistreerd"
```

Betekenis:  
Er is een nieuwe melding geregistreerd in het systeem van een ketenpartner en deze is beschikbaar voor andere ketenpartners.

#### 2. Melding ingezien

```json
"type": "uitwisselen-melding.melding-ingezien"
```

Betekenis:  
Een ketenpartner heeft de melding geraadpleegd.

#### 3. Melding opgepakt

```json
"type": "uitwisselen-melding.melding-opgepakt"
```

Betekenis:  
Een ketenpartner heeft aangegeven de melding in behandeling te nemen.

### Vulling van `data`

De precieze structuur van het attribuut `data` verschilt per `type`.

#### Bij `melding-geregistreerd`

`data` bevat ten minste:

- het BSN van de persoon op wie de melding betrekking heeft;
- de leeftijd van de betrokkene ten tijde van registratie van de melding.

Voorbeeld (indicatief):

```json
"data": {
  "bsn": "123456782",
  "leeftijd": 15
}
```

##### Privacy en gegevensbescherming

Het opnemen van het BSN in een event betreft verwerking van een gevoelig persoonsgegeven.  
De uitwisseling van het BSN dient te voldoen aan:

- geldende wet- en regelgeving (waaronder AVG);
- sectorale wetgeving binnen het domein van Jeugd, Zorg en Veiligheid;
- afspraken omtrent doelbinding, proportionaliteit en minimale gegevensverwerking.

In de verdere uitwerking van deze samenwerkfunctie wordt nader gespecificeerd:

- op welke juridische grondslag het BSN wordt gedeeld;
- of aanvullende beveiligingsmaatregelen (zoals versleuteling op veldniveau) vereist zijn;
- of alternatieven (zoals pseudonimisering of verwijzing via een koppelregister) mogelijk of wenselijk zijn.

De vermelding van de leeftijd is opgenomen zodat ketenpartners, waaronder de Raad voor de Kinderbescherming, kunnen bepalen of de melding binnen hun wettelijke taak en doelgroep valt.

`data` kan aanvullend bevatten:

- registratiedatum van de melding;
- categorie of type melding;
- prioriteitsindicatie.

#### Bij `melding-ingezien`

`data` bevat ten minste:

- identificatie (bijvoorbeeld OIN) van de raadplegende ketenpartner;
- eventueel een technisch referentienummer.

Dit event bevat geen inhoudelijke meldingsgegevens, maar uitsluitend procesinformatie over de inzage.

#### Bij `melding-opgepakt`

`data` bevat ten minste:

- identificatie (bijvoorbeeld OIN) van de ketenpartner die de melding oppakt;
- datum en tijdstip van het oppakken (indien afwijkend van `time`);
- eventueel een intern zaak- of referentienummer.

Dit event bevat geen inhoudelijke meldingsgegevens, maar uitsluitend procesinformatie over de behandeling.

### Verdere uitwerking

Verdere verfijning of uitbreiding van `type`-waarden binnen deze samenwerkfunctie wordt in een latere versie van deze specificatie vastgelegd.