# Generiek patroon voor asynchrone interacties

## Inleiding

Binnen Samen Onder Handbereik worden veel interacties asynchroon afgehandeld.

Dit betekent dat het aanbieden van een gebeurtenis of het indienen van een
verzoek niet direct leidt tot een inhoudelijk resultaat. De verdere verwerking
vindt plaats buiten de context van de oorspronkelijke interactie.

De voortgang van de verwerking kan worden gevolgd. Afhankelijk van het type
interactie kan daarnaast een inhoudelijk resultaat beschikbaar worden gesteld.

Dit generieke interactiepatroon geldt voor verschillende typen interacties binnen het
stelsel. Specifieke API's geven invulling aan dit patroon voor verschillende
soorten interacties.

Een samenwerkfunctie bepaalt de inhoudelijke betekenis en structuur van de
gegevens die binnen een interactie worden gebruikt. De wijze waarop de
asynchrone verwerking plaatsvindt, volgt het generieke interactiepatroon zoals beschreven
in dit hoofdstuk.

## Generiek interactiepatroon

Een asynchrone interactie bestaat uit de volgende stappen:

1. Een deelnemer initieert een interactie (naar de ketenindex CloudEvent-API).
2. De interactie wordt geaccepteerd door de ketenindex CloudEvent-API en krijgt een technische identificatie (het transactie-ID).
3. De verwerking vindt asynchroon plaats.
4. De voortgang en/of het resultaat van de verwerking kan worden geraadpleegd.

```
Initiator
    |
    | verzoek of gebeurtenis aanbieden
    v
API
    |
    | acceptatie
    v
Asynchrone verwerking
    |
    +--> status beschikbaar
    |
    +--> resultaat beschikbaar
```

De volgende paragrafen beschrijven concrete toepassingen van dit patroon.

## Aanbieden van een CloudEvent

De aanbieder stelt een CloudEvent samen conform de afspraken van de betreffende samenwerkfunctie.

Het CloudEvent wordt aangeboden via de CloudEvent API.

Voorbeeld endpoint:

```http
POST https://<host>/api/handeling
```

De exacte URL wordt later vastgesteld.

## Ontvangstbevestiging en transactie-ID

Na ontvangst van het CloudEvent retourneert de API een transactie-ID.

De transactie-ID identificeert de technische verwerking van de aanbieding en is niet hetzelfde als de identifier van het CloudEvent.

| Identifier | Betekenis |
| --- | --- |
| CloudEvent `id` | Identificeert het aangeboden CloudEvent |
| Transactie-ID | Identificeert de technische verwerking van de aanbieding |

Voorbeeld antwoord:

```json
{
  "transactieId": "<transactie-id>"
}
```

## Opvragen van de verwerkingsstatus

De aanbieder kan met behulp van de Status-API de voortgang van de verwerking opvragen.

Voorbeeld endpoint:

```http
GET https://<host>/api/status/{transactieId}
```

## Verwerkingsstatussen

De Status-API retourneert informatie over de actuele toestand van een
asynchrone verwerking.

Een statusresponse bevat de volgende attributen:

| Attribuut | Betekenis |
| --- | --- |
| `transactieId` | Identificeert de technische verwerking van de interactie |
| `status` | Geeft de actuele toestand van de verwerking aan |
| `resultaat` | Bevat aanvullende informatie over de uitkomst van de verwerking |

Het attribuut `resultaat` bevat aanvullende informatie die afhankelijk is van
de status en het type interactie. Bij een succesvolle verwerking kan het
attribuut een inhoudelijk resultaat bevatten. Bij een fout bevat het informatie
over de opgetreden fout. Tijdens een lopende verwerking wordt het attribuut niet
opgenomen.

De Status-API kent drie mogelijke statussen:

| Status | Betekenis |
| --- | --- |
| `OK` | Het CloudEvent is succesvol verwerkt |
| `IN_PROGRESS` | De verwerking is nog niet afgerond |
| `ERROR` | Tijdens de verwerking is een fout opgetreden |

### Status OK

De status `OK` geeft aan dat de verwerking van het aangeboden CloudEvent
succesvol is afgerond.

Voorbeeld:

```json
{
  "transactieId": "<transactie-id>",
  "status": "OK"
}
```

### Status IN_PROGRESS

De status `IN_PROGRESS` geeft aan dat de verwerking nog niet is afgerond.

Voorbeeld:

```json
{
  "transactieId": "<transactie-id>",
  "status": "IN_PROGRESS"
}
```

### Status ERROR

De status `ERROR` geeft aan dat tijdens de verwerking een fout is opgetreden.

Een fout kan een functionele of een technische oorzaak hebben.

#### Functionele fout

Een functionele fout ontstaat wanneer het aangeboden CloudEvent inhoudelijk
niet verwerkt kan worden.

```json
{
  "id": "<transactie-id>",
  "status": "ERROR",
  "resultaat": {
    "fout": "Het CloudEvent kan niet worden verwerkt vanwege een functionele fout.",
    "info": {
      "validatiefouten": []
    }
  }
}
```

#### Technische fout

Een technische fout ontstaat wanneer tijdens de verwerking een technische
storing optreedt.

```json
{
  "id": "<transactie-id>",
  "status": "ERROR",
  "resultaat": {
    "fout": "Er heeft een technische fout plaatsgevonden. Neem contact op met de beheerder of probeer het later opnieuw.",
    "info": null
  }
}
```

## Relatie met samenwerkfuncties

Het beschreven patroon is generiek en geldt voor alle samenwerkfuncties.

Een samenwerkfunctie bepaalt:
- welke CloudEvents kunnen worden aangeboden;
- welke gegevens in `data` worden opgenomen;
- welke domeinspecifieke validaties gelden.

De generieke verwerking bepaalt:
- hoe CloudEvents worden aangeboden;
- hoe de verwerking asynchroon plaatsvindt;
- hoe de status wordt opgevraagd.

## Toepassingen en ondersteunende functies

Het generieke patroon voor asynchrone interacties kent verschillende
toepassingen en ondersteunende functies.

### Aanbieden van CloudEvents

Het aanbieden van CloudEvents is een toepassing van het generieke patroon.
Een producer biedt een gebeurtenis aan via de CloudEvent API. De verdere
verwerking van deze gebeurtenis vindt asynchroon plaats volgens het in dit
hoofdstuk beschreven patroon.

### Uitvoeren van queries

Een samenwerkfunctie kan een Query-API definiëren voor het ondersteunen van
informatievragen.

De inhoud en mogelijkheden van een Query-API kunnen niet generiek worden
vastgesteld, omdat deze afhankelijk zijn van de betekenis van de gegevens en de
informatiebehoefte binnen de betreffende samenwerkfunctie.

### Status-API als ondersteunende functie

De Status-API is geen afzonderlijke toepassing van het interactiepatroon, maar
een ondersteunende functie waarmee de voortgang van een asynchrone interactie
kan worden gevolgd.

De Status-API heeft geen eigen inhoudelijke betekenis binnen een
samenwerkfunctie, maar ondersteunt het generieke mechanisme voor het volgen van
asynchroon uitgevoerde interacties.

## Nog vast te stellen

De volgende onderwerpen worden later verder uitgewerkt:

- definitieve API-URL's;
- exacte HTTP-contracten;
- foutcodes;
- autorisatie en authenticatie;
- bewaartermijn van transactiegegevens;
- afspraken rondom opnieuw aanbieden van een CloudEvent.

## API-specificaties

De formele technische contracten van de API's worden beschreven met behulp van een
OpenAPI-specificatie.

De OpenAPI-specificatie bevat onder andere:

- beschikbare endpoints;
- HTTP-methodes;
- request- en responsemodellen;
- foutafhandeling;
- technische validatieregels.

De actuele specificatie is te downloaden via deze [link](yaml/CORV2.0.yaml).


## Identificatie en relatie tussen identifiers

Binnen de verwerking van CloudEvents worden verschillende identifiers gebruikt.

| Identifier | Niveau | Betekenis |
| --- | --- | --- |
| CloudEvent `id` | Berichtniveau | Identificeert het aangeboden CloudEvent |
| Transactie-ID | Verwerkingsniveau | Identificeert de technische verwerking van de aanbieding |
| JSON-LD `@id` | Semantisch niveau | Identificeert resources binnen de provenance-graaf |

De ontvangstbevestiging van de CloudEvent API bevat uitsluitend de transactie-ID.
De CloudEvent `id` maakt onderdeel uit van het aangeboden CloudEvent en wordt niet
opnieuw geretourneerd.

## Herhaald opvragen van de verwerkingsstatus

Wanneer de Status-API de status `IN_PROGRESS` retourneert, is de verwerking van
het aangeboden CloudEvent nog niet afgerond.

De aanbieder kan in dat geval de Status-API op een later moment opnieuw
aanroepen met dezelfde transactie-ID.

Het opnieuw opvragen van de status wordt uitgevoerd volgens een retry-strategie.
De aanbieder bepaalt daarbij zelf het interval tussen opeenvolgende verzoeken,
binnen de daarvoor geldende afspraken.

Een mogelijke strategie is een oplopend interval (exponential backoff). Daarbij
wordt de wachttijd tussen opeenvolgende verzoeken geleidelijk verhoogd.

Voorbeeld:

| Poging | Wachttijd |
| --- | --- |
| Eerste statusopvraag na ontvangst | 1 seconde |
| Tweede statusopvraag | 2 seconden |
| Derde statusopvraag | 4 seconden |
| Vierde statusopvraag | 8 seconden |

De gekozen retry-strategie kan afhankelijk zijn van de eigenschappen van de
betreffende toepassing. Het doel is om onnodige belasting van de Status-API te
voorkomen, terwijl de aanbieder de voortgang van de verwerking kan blijven
volgen.

De definitieve afspraken over retry-intervallen en eventuele maximale
herhaalduur worden later vastgesteld.

