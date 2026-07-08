# Asynchrone verwerking van aangeboden CloudEvents

## Inleiding

Binnen het stelsel worden gegevensuitwisselingen uitgevoerd door middel van CloudEvents.

Een samenwerkfunctie bepaalt de inhoudelijke betekenis en structuur van een CloudEvent. De technische verwerking van een aangeboden CloudEvent verloopt volgens een generiek patroon dat voor alle samenwerkfuncties geldt.

Een aanbieder levert een volledig samengesteld CloudEvent aan via de CloudEvent API. De verwerking van het aangeboden CloudEvent vindt vervolgens asynchroon plaats.

De aanbieder ontvangt na het aanbieden van het CloudEvent geen direct verwerkingsresultaat. In plaats daarvan ontvangt de aanbieder een technische transactie-ID waarmee later de status van de verwerking kan worden opgevraagd.

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

De Status-API is uitsluitend beschikbaar voor de partij die het CloudEvent heeft aangeboden.

## Verwerkingsstatussen

De Status-API kent drie mogelijke statussen:

| Status | Betekenis |
| --- | --- |
| `OK` | Het CloudEvent is succesvol verwerkt |
| `IN_PROGRESS` | De verwerking is nog niet afgerond |
| `ERROR` | Tijdens de verwerking is een fout opgetreden |

## Fout tijdens verwerking

Een fout kan een functionele of een technische oorzaak hebben.

### Functionele fout

Een functionele fout ontstaat wanneer het aangeboden CloudEvent inhoudelijk niet verwerkt kan worden.

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

### Technische fout

Een technische fout ontstaat wanneer tijdens de verwerking een technische storing optreedt.

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

## Nog vast te stellen

De volgende onderwerpen worden later verder uitgewerkt:

- definitieve API-URL's;
- exacte HTTP-contracten;
- foutcodes;
- autorisatie en authenticatie;
- bewaartermijn van transactiegegevens;
- afspraken rondom opnieuw aanbieden van een CloudEvent.

## API-specificaties

De formele technische contracten van de API's worden beschreven met behulp van
OpenAPI-specificaties.

De OpenAPI-specificaties bevatten onder andere:

- beschikbare endpoints;
- HTTP-methodes;
- request- en responsemodellen;
- foutafhandeling;
- technische validatieregels.

De actuele specificaties worden gepubliceerd via:

- OpenAPI-specificatie CloudEvent API: `<URL-placeholder>`
- OpenAPI-specificatie Status-API: `<URL-placeholder>`

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

## Standaardisatie van statusresponses

De statusresponse bevat de transactie-ID en de actuele verwerkingsstatus.
Het attribuut `resultaat` wordt alleen opgenomen wanneer de status `ERROR` is.

Voorbeeld succesvolle verwerking:

```json
{
  "transactieId": "<transactie-id>",
  "status": "OK"
}
```

Voorbeeld verwerking nog niet afgerond:

```json
{
  "transactieId": "<transactie-id>",
  "status": "IN_PROGRESS"
}
```

Voorbeeld fout:

```json
{
  "transactieId": "<transactie-id>",
  "status": "ERROR",
  "resultaat": {
    "fout": "Er heeft een fout plaatsgevonden tijdens de verwerking.",
    "info": null
  }
}
```

De exacte foutcodes en foutstructuur worden nog vastgesteld.


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

