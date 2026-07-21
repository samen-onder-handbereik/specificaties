# Generiek patroon voor asynchrone interacties

## Inleiding

### Doel

Het generieke patroon voor asynchrone interacties beschrijft hoe interacties binnen Samen Onder Handbereik (SOH) worden aangeboden, asynchroon worden verwerkt en gevolgd.

Het patroon is bedoeld voor situaties waarin de verwerking van een interactie niet direct kan worden afgerond binnen de oorspronkelijke HTTP-aanroep. Na acceptatie vindt de verdere verwerking plaats buiten de context van de initiële interactie.

De generieke verwerking bepaalt hoe interacties technisch worden aangeboden en gevolgd. Een samenwerkfunctie bepaalt de inhoudelijke betekenis van de interactie, de gegevens die daarbij worden uitgewisseld en eventuele domeinspecifieke validaties.

De technische contracten van de generieke API's zijn vastgelegd in de OpenAPI-specificatie [AsynchroneInteracties.yaml](yaml/AsynchroneInteracties.yaml).

### Toepassingsgebied

Binnen SOH kunnen verschillende typen interacties asynchroon worden verwerkt. Dit generieke patroon ondersteunt deze interacties door een uniforme wijze te bieden voor:

- het aanbieden van een interactie;
- het identificeren van een interactie;
- het volgen van de voortgang van de verwerking;
- het beschikbaar stellen van een eventueel resultaat.

Het patroon wordt door samenwerkfuncties toegepast wanneer een directe synchrone verwerking niet passend of niet mogelijk is.

## Kernbegrippen

| Begrip | Betekenis |
| --- | --- |
| Asynchrone interactie | Een interactie waarvan de verwerking na acceptatie buiten de oorspronkelijke HTTP-aanroep plaatsvindt. |
| CloudEvent | Een gebeurtenis die wordt aangeboden conform de CloudEvents-specificatie. |
| interactieId | De unieke identificatie van een asynchrone interactie. Voor CloudEvents is het `interactieId` gelijk aan `CloudEvent.id`. |
| Status-API | De generieke API waarmee de actuele status van een asynchrone interactie kan worden opgevraagd. |
| Samenwerkfunctie | Een domeinspecifieke invulling van het generieke interactiepatroon. |

## Generiek interactiepatroon

Een asynchrone interactie verloopt volgens een vast patroon:

1. Een deelnemer biedt een CloudEvent aan via de CloudEvent API.
2. De CloudEvent API accepteert de interactie.
3. De verwerking van de interactie vindt asynchroon plaats.
4. De deelnemer kan de voortgang volgen via de Status-API.
5. Na afronding kan een resultaat beschikbaar worden gesteld.

```text
Initiator
    |
    | aanbieden CloudEvent
    v
CloudEvent API
    |
    | acceptatie
    v
Asynchrone verwerking
    |
    +--> status beschikbaar via Status-API
    |
    +--> resultaat beschikbaar

## CloudEvent API

### Doel

De CloudEvent API biedt de mogelijkheid om een CloudEvent aan te bieden binnen het generieke interactiepatroon.

Een deelnemer gebruikt deze API om een interactie te initiëren. Na acceptatie wordt de verdere verwerking asynchroon uitgevoerd.

De CloudEvent API is verantwoordelijk voor:

- het ontvangen van het CloudEvent;
- het uitvoeren van technische controles;
- het accepteren van de interactie;
- het mogelijk maken om de interactie verder te volgen.

De inhoudelijke betekenis van het CloudEvent en de gegevens in de payload worden bepaald door de betreffende samenwerkfunctie.

### Aanbieden van een CloudEvent

Een deelnemer biedt een CloudEvent aan conform de afspraken van de betreffende samenwerkfunctie.

Het CloudEvent wordt aangeboden via een HTTP POST-aanroep.

Voorbeeld:

```http
POST https://<host>/api/handeling
```

De exacte URL wordt vastgesteld in de technische API-specificatie.

Het aangeboden CloudEvent bevat een unieke identifier in het attribuut `id`.

Binnen het generieke interactiepatroon geldt:

```text
interactieId = CloudEvent.id
```

Deze identificatie wordt gebruikt om de interactie later via de Status-API te volgen.

### Acceptatie van een interactie

Na ontvangst controleert de CloudEvent API het aangeboden CloudEvent.

Wanneer het CloudEvent technisch kan worden geaccepteerd, retourneert de API een HTTP-response met status `202 Accepted`.

De status `202 Accepted` betekent dat de interactie is geaccepteerd voor verdere asynchrone verwerking. De verwerking zelf hoeft op dat moment nog niet te zijn afgerond.

De aanbieder kan vervolgens de Status-API gebruiken om de voortgang van de verwerking te volgen.

Wanneer het CloudEvent niet kan worden geaccepteerd, retourneert de API een foutmelding volgens de geldende HTTP- en foutafhandelingsafspraken.

## Status-API

### Doel

De Status-API ondersteunt het volgen van een asynchrone interactie.

Met deze API kan een deelnemer de actuele status van een eerder aangeboden interactie opvragen.

De Status-API bepaalt niet de inhoudelijke betekenis van de verwerking. Deze betekenis wordt bepaald door de betreffende samenwerkfunctie.

### Opvragen van de status

De status van een interactie wordt opgevraagd met het `interactieId`.

Voorbeeld:

```http
GET https://<host>/api/status/{interactieId}
```

De Status-API retourneert de actuele status van de interactie.

Een statusresponse bevat de volgende gegevens:

| Attribuut | Betekenis |
| --- | --- |
| `interactieId` | Identificeert de asynchrone interactie. |
| `status` | Geeft de actuele toestand van de verwerking aan. |
| `resultaat` | Bevat aanvullende informatie over de uitkomst van de verwerking, indien beschikbaar. |

Het attribuut `resultaat` is afhankelijk van de status en de betreffende samenwerkfunctie.

Bij een succesvolle verwerking kan het resultaat inhoudelijke gegevens bevatten. Bij een fout kan het informatie bevatten over de oorzaak van de fout.

### Verwerkingsstatussen

De Status-API kent de volgende statussen:

| Status | Betekenis |
| --- | --- |
| `IN_PROGRESS` | De verwerking is gestart maar nog niet afgerond. |
| `OK` | De verwerking is succesvol afgerond. |
| `ERROR` | Tijdens de verwerking is een fout opgetreden. |

### Status IN_PROGRESS

De status `IN_PROGRESS` geeft aan dat de verwerking nog niet is afgerond.

Voorbeeld:

```json
{
  "interactieId": "<interactie-id>",
  "status": "IN_PROGRESS"
}
```

### Status OK

De status `OK` geeft aan dat de verwerking succesvol is afgerond.

Wanneer een resultaat beschikbaar is, bevat de response het attribuut `resultaat`.

Voorbeeld:

```json
{
  "interactieId": "<interactie-id>",
  "status": "OK",
  "resultaat": {}
}
```

### Status ERROR

De status `ERROR` geeft aan dat tijdens de verwerking een fout is opgetreden.

Een fout kan een functionele of technische oorzaak hebben.

### Functionele fout

Een functionele fout ontstaat wanneer het aangeboden CloudEvent inhoudelijk niet kan worden verwerkt.

Een functionele fout kan bijvoorbeeld optreden wanneer gegevens niet voldoen aan de afspraken van de betreffende samenwerkfunctie.

Voorbeeld:

```json
{
  "interactieId": "<interactie-id>",
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

Een technische fout zegt niets over de inhoudelijke juistheid van het aangeboden CloudEvent, maar over het niet beschikbaar zijn of falen van de technische verwerking.

Voorbeeld:

```json
{
  "interactieId": "<interactie-id>",
  "status": "ERROR",
  "resultaat": {
    "fout": "Er heeft een technische fout plaatsgevonden. Neem contact op met de beheerder of probeer het later opnieuw.",
    "info": null
  }
}
```

## Identificatie

### Identificatie van een interactie

Elke asynchrone interactie heeft een unieke identificatie waarmee de voortgang van de verwerking kan worden gevolgd.

Binnen het generieke interactiepatroon wordt deze identificatie aangeduid als `interactieId`.

Voor interacties die gebaseerd zijn op CloudEvents geldt:

```text
interactieId = CloudEvent.id
```

Het attribuut `id` van een CloudEvent wordt binnen het generieke interactiepatroon gebruikt als identificatie van de asynchrone interactie die door het aanbieden van dit CloudEvent ontstaat.

Dezelfde identificatie wordt gebruikt bij het opvragen van de status via de Status-API.

### Relatie met andere identifiers

Binnen een interactie kunnen verschillende soorten identifiers voorkomen. Deze hebben ieder een eigen betekenis en toepassingsgebied.

| Identifier | Niveau | Betekenis |
| --- | --- | --- |
| `interactieId` (= CloudEvent `id`) | Interactieniveau | Identificeert de asynchrone interactie. |
| JSON-LD `@id` | Semantisch niveau | Identificeert resources binnen een provenance-graaf. |
| Domeinspecifieke identifiers | Domeinniveau | Identificeren objecten binnen een samenwerkfunctie. |

Deze identifiers hebben geen onderlinge vervanging. Een `@id` identificeert bijvoorbeeld een resource binnen een gegevensmodel, terwijl het `interactieId` de uitwisseling identificeert waarmee deze resource wordt verwerkt.

## Relatie met samenwerkfuncties

### Generieke en specifieke onderdelen

Het generieke interactiepatroon beschrijft de technische wijze waarop asynchrone interacties worden afgehandeld.

Een samenwerkfunctie bepaalt de inhoudelijke invulling van een interactie.

De samenwerkfunctie bepaalt onder andere:

- welke typen CloudEvents kunnen worden aangeboden;
- welke gegevens in de `data` van een CloudEvent worden opgenomen;
- welke domeinspecifieke validaties gelden;
- welke betekenis een resultaat heeft.

Het generieke patroon bepaalt:

- hoe een CloudEvent wordt aangeboden;
- hoe een interactie wordt geïdentificeerd;
- hoe de verwerking asynchroon plaatsvindt;
- hoe de status van een interactie kan worden opgevraagd.

### Relatie tussen generiek patroon en samenwerkfunctie

Een samenwerkfunctie maakt gebruik van het generieke interactiepatroon door invulling te geven aan de inhoudelijke aspecten van een interactie.

De verwerking verloopt daarbij volgens het volgende principe:

```text
Generiek interactiepatroon
        |
        +-- aanbieden CloudEvent
        |
        +-- identificeren interactie
        |
        +-- volgen status
        |
        v
Samenwerkfunctie
        |
        +-- betekenis gegevens
        |
        +-- validaties
        |
        +-- resultaat
```

Door deze scheiding blijft het mechanisme voor asynchrone interacties uniform, terwijl verschillende samenwerkfuncties hun eigen inhoudelijke betekenis kunnen behouden.

## Herhaald opvragen van de status

### Retry-strategie

Wanneer de Status-API de status `IN_PROGRESS` retourneert, is de verwerking van de interactie nog niet afgerond.

De aanbieder kan de Status-API op een later moment opnieuw aanroepen met hetzelfde `interactieId`.

Het opnieuw opvragen van de status wordt uitgevoerd volgens een retry-strategie. De aanbieder bepaalt daarbij het interval tussen opeenvolgende verzoeken binnen de daarvoor geldende afspraken.

Een mogelijke strategie is een oplopend interval (exponential backoff). Daarbij wordt de wachttijd tussen opeenvolgende verzoeken geleidelijk verhoogd.

Voorbeeld:

| Poging | Wachttijd |
| --- | --- |
| Eerste statusopvraag na acceptatie | 1 seconde |
| Tweede statusopvraag | 2 seconden |
| Derde statusopvraag | 4 seconden |
| Vierde statusopvraag | 8 seconden |

De gekozen retry-strategie kan afhankelijk zijn van de eigenschappen van de betreffende toepassing.

Het doel van een retry-strategie is om onnodige belasting van de Status-API te voorkomen, terwijl de aanbieder de status van de interactie kan blijven volgen.

## Nog vast te stellen

De volgende onderwerpen worden verder uitgewerkt:

- definitieve API-URL's;
- exacte HTTP-contracten;
- foutcodes;
- autorisatie en authenticatie;
- bewaartermijnen van interactiegegevens;
- afspraken rondom het opnieuw aanbieden van een CloudEvent.

## OpenAPI-specificatie

De technische contracten van de generieke API's worden beschreven met behulp van een OpenAPI-specificatie.

De OpenAPI-specificatie bevat onder andere:

- beschikbare endpoints;
- HTTP-methodes;
- request- en responsemodellen;
- foutafhandeling;
- technische validatieregels.

De OpenAPI-specificatie voor het generieke asynchrone interactiepatroon is opgenomen in [AsynchroneInteracties.yaml](yaml/AsynchroneInteracties.yaml).

Deze specificatie beschrijft:

- het aanbieden van CloudEvents via de CloudEvent API;
- het opvragen van de status van een interactie via de Status-API;
- de generieke request- en responsemodellen.

De inhoudelijke betekenis van CloudEvents en de structuur van de payload worden vastgelegd in een samenwerkfunctie-specifieke OpenAPI-specificatie.