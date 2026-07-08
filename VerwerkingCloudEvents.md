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
