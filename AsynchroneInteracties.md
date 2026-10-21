# Generiek patroon voor asynchrone interacties

## Inleiding

### Doel

Het generieke patroon voor asynchrone interacties beschrijft hoe
interacties binnen Samen Onder Handbereik (SOH) worden aangeboden,
asynchroon worden verwerkt en gevolgd.

Het patroon is bedoeld voor situaties waarin de verwerking van een
interactie niet direct kan worden afgerond binnen de oorspronkelijke
HTTP-aanroep. Na acceptatie vindt de verdere verwerking plaats buiten de
context van de initiële interactie.

De generieke verwerking bepaalt hoe interacties technisch worden
aangeboden en gevolgd. Een samenwerkfunctie bepaalt de inhoudelijke
betekenis van de interactie, de gegevens die daarbij worden uitgewisseld
en eventuele domeinspecifieke validaties.

De technische contracten van de generieke API's zijn vastgelegd in de
OpenAPI-specificatie
[AsynchroneInteracties.yaml](yaml/AsynchroneInteracties.yaml) ([interactief bekijken](api.html?spec=AsynchroneInteracties) · [openen in Swagger Editor](https://editor.swagger.io/?url=https://samen-onder-handbereik.github.io/specificaties/yaml/AsynchroneInteracties.yaml)).

### Toepassingsgebied

Binnen SOH kunnen verschillende typen interacties asynchroon worden
verwerkt. Dit generieke patroon ondersteunt deze interacties door een
uniforme wijze te bieden voor:

-   het aanbieden van een interactie;
-   het identificeren van een interactie;
-   het volgen van de voortgang van de verwerking;
-   het beschikbaar stellen van een eventueel resultaat.

Het patroon wordt door samenwerkfuncties toegepast wanneer een directe
synchrone verwerking niet passend of niet mogelijk is.

## Kernbegrippen

| Begrip | Betekenis |
|---|---|
| Asynchrone interactie | Een interactie waarvan de verwerking na acceptatie buiten de oorspronkelijke HTTP-aanroep plaatsvindt. |
| CloudEvent | Een gebeurtenis die conform de CloudEvents-specificatie wordt beschreven en aangeboden. |
| interactieId | De unieke identificatie van een asynchrone interactie. Het interactieId wordt uitgegeven door de voorziening die verantwoordelijk is voor de verwerking van de interactie. |
| Interactieresource | De resource die via `GET /interacties/{interactieId}` wordt opgevraagd en onder meer de actuele verwerkingsstatus bevat. |
| Resultaatresource | De gerelateerde resource die via `GET /interacties/{interactieId}/resultaat` het inhoudelijke resultaat van een asynchrone interactie beschikbaar stelt, indien de interactie een resultaat oplevert. |

De bovenstaande tabel bevat de begrippen die relevant zijn voor het generieke patroon voor asynchrone interacties. Binnen een samenwerkfunctie kan daarnaast een Inzage-API beschikbaar zijn, waarmee de inhoud van een informatieobject daadwerkelijk wordt geraadpleegd.

## Generiek interactiepatroon

### Rollen van de verschillende API’s

Binnen SOH worden verschillende API-functies onderscheiden, elk met een eigen rol bij het uitwisselen van gegevens en het afhandelen van interacties. Voor het initiëren van interacties zijn er twee mogelijkheden:

- de CloudEvent-API, waarmee een deelnemer een CloudEvent aanbiedt;
- queryfunctionaliteit, waarmee een deelnemer een informatievraag stelt.

De concrete endpoints en het technische contract voor het stellen van informatievragen worden vastgelegd in de specificatie van de betreffende samenwerkfunctie of, waar van toepassing, in een generieke specificatie voor functie-overstijgende bevragingen.

Zowel het aanbieden van een CloudEvent als het stellen van een query kan gebruikmaken van het generieke patroon voor asynchrone interacties. Na acceptatie kan de afnemer de interactie opvragen via `GET /interacties/{interactieId}`; deze resource bevat onder meer de actuele status. Wanneer de interactie een inhoudelijk resultaat oplevert, kan de afnemer dit na succesvolle verwerking ophalen via de gerelateerde resource `GET /interacties/{interactieId}/resultaat`. De status- en resultaatfuncties zijn daarmee endpoints binnen de generieke Asynchrone Interactie API en geen afzonderlijke resourcecollecties.

De queryfunctionaliteit wordt in het hier beschreven patroon asynchroon uitgevoerd. De afnemer kan na acceptatie de voortgang volgen via de interactieresource en het inhoudelijke resultaat na succesvolle verwerking ophalen via de resultaatresource. De generieke OpenAPI-specificatie voor asynchrone interacties definieert daarvoor de generieke afhandeling, maar hoeft geen query-endpoint te bevatten.

Voor de duidelijkheid: de Inzage-API valt buiten het bereik van dit generieke interactiepatroon. Deze API wordt in beginsel synchroon uitgevoerd: de afnemer ontvangt het gevraagde resultaat in het antwoord op de raadpleging. Alleen wanneer de eisen van een specifieke raadpleging daartoe aanleiding geven, kan hiervan worden afgeweken.


### Verloop van een asynchrone interactie

Een asynchrone interactie verloopt volgens een vast patroon.
1.  Een deelnemer biedt een interactie aan via een API.
2.  De API accepteert de interactie voor verdere verwerking.
3.  De verwerking van de interactie vindt asynchroon plaats.
4.  De deelnemer kan de voortgang van de verwerking volgen via de interactieresource.
5.  Na succesvolle afronding kan een inhoudelijk resultaat beschikbaar zijn.
6.  Wanneer een inhoudelijk resultaat beschikbaar is, kan dit via de resultaatresource worden opgevraagd.

``` text
Initiator
    |
    | aanbieden interactie
    v
API
    |
    | 202 Accepted + interactieId
    v
Asynchrone verwerking
    |
    +--> interactieresource
    |       |
    |       +--> IN_PROGRESS
    |       |
    |       +--> OK
    |       |
    |       +--> ERROR
    |
    +--> resultaatresource
            |
            v
        inhoudelijk resultaat
```

Niet iedere asynchrone interactie hoeft een inhoudelijk resultaat op te leveren. De betreffende samenwerkfunctie bepaalt of een resultaat beschikbaar wordt gesteld en wat de inhoud en representatie van dat resultaat zijn. Wanneer een resultaat beschikbaar is, kan dit via de resultaatresource worden opgevraagd.

## HTTP-foutafhandeling

De HTTP-foutafhandeling sluit aan bij de [NLGov REST API Design Rules](https://gitdocumentatie.logius.nl/publicatie/api/adr/), in het bijzonder de regels voor Problem Details, ongeldige invoer en het gezamenlijk retourneren van validatiefouten.

HTTP-responses met statuscode `4xx` of `5xx` gebruiken het mediatype `application/problem+json` en volgen RFC 9457 (Problem Details). De response bevat ten minste de attributen `status`, `title` en `detail`. De concrete API-specificatie beschrijft welke HTTP-foutstatussen van toepassing zijn op de betreffende endpoints.

Ongeldige invoer leidt tot HTTP `400 Bad Request`. De response bevat dan ook een `errors`-lijst. Elk element bevat ten minste:

- `in`: de plaats waar de fout is aangetroffen (`body` of `query`);
- `detail`: een leesbare beschrijving van de fout.

Een element kan daarnaast `location`, `index` en `code` bevatten, volgens de ADR. Waar mogelijk worden alle vastgestelde validatiefouten in één response teruggegeven.

Een fout die tijdens de **asynchrone verwerking** ontstaat, is iets anders dan een HTTP-fout bij het uitvoeren van een API-aanroep. Wanneer het opvragen van de status slaagt, retourneert de interactieresource HTTP `200 OK` met `status: ERROR` en de bijbehorende foutinformatie. Deze foutinformatie is geen Problem Details-response; de Problem Details-afspraken gelden voor de HTTP-responses met statuscode `4xx` of `5xx`.

## CloudEvent-API

### Doel

De CloudEvent-API biedt de mogelijkheid om een CloudEvent aan te bieden
binnen het generieke interactiepatroon.

Een deelnemer gebruikt deze API om een interactie te initiëren. Na
acceptatie wordt de verdere verwerking asynchroon uitgevoerd.

De CloudEvent-API is verantwoordelijk voor:

-   het ontvangen van het CloudEvent;
-   het uitvoeren van technische controles;
-   het accepteren van de interactie;
-   het mogelijk maken om de interactie verder te volgen.

De inhoudelijke betekenis van het CloudEvent en de gegevens in de
payload worden bepaald door de betreffende samenwerkfunctie.

### Aanbieden van een CloudEvent

Een deelnemer biedt een CloudEvent aan conform de afspraken van de
betreffende samenwerkfunctie.

Het CloudEvent wordt aangeboden via een HTTP POST-aanroep.

Bij uitwisseling via HTTP wordt het CloudEvent als geheel als JSON
verzonden. Het HTTP-mediatype is daarom `application/cloudevents+json`.
Dit mediatype beschrijft de representatie van het volledige HTTP-bericht:
de HTTP-body is zelf het CloudEvent.

Het CloudEvent-attribuut `datacontenttype` heeft een andere betekenis. Dit
attribuut beschrijft het mediatype van de inhoud van het attribuut `data`.
Wanneer `data` een PROV-JSON-LD-graaf bevat, is de waarde bijvoorbeeld
`application/ld+json`.

Het onderscheid is daarmee:

- HTTP `Content-Type: application/cloudevents+json` — de volledige HTTP-body
  is een CloudEvent;
- CloudEvent `datacontenttype: application/ld+json` — het attribuut `data`
  bevat JSON-LD.

Voorbeeld:

``` http
POST https://<host>/api/<endpoint>
```

De exacte URL wordt vastgesteld in de technische API-specificatie.

Het aangeboden CloudEvent bevat een unieke identifier in het attribuut
`id`. Deze identifier identificeert het CloudEvent zelf en is niet de
identificatie van de asynchrone interactie.

Bij acceptatie van de interactie wordt door de voorziening die
verantwoordelijk is voor de verwerking een `interactieId` uitgegeven.
Deze identificatie wordt gebruikt om de interactie later via de
interactieresource te volgen.

### Acceptatie van een interactie

Na ontvangst controleert de CloudEvent-API het aangeboden CloudEvent.

Wanneer het CloudEvent technisch kan worden geaccepteerd, retourneert de
API een HTTP-response met status `202 Accepted`. De response bevat het
`interactieId` dat de geaccepteerde interactie identificeert.

De status `202 Accepted` betekent dat de interactie is geaccepteerd voor
verdere asynchrone verwerking. De verwerking zelf hoeft op dat moment
nog niet te zijn afgerond.

De aanbieder kan vervolgens het `interactieId` gebruiken om via de
interactieresource de voortgang van de verwerking te volgen.

Wanneer het CloudEvent niet kan worden geaccepteerd, retourneert de API
een HTTP-foutresponse. HTTP-foutresponses met statuscode `4xx` of `5xx`
worden geretourneerd als `application/problem+json` en volgen RFC 9457
(Problem Details). De response bevat ten minste de attributen `status`,
`title` en `detail`. Bij `400 Bad Request` bevat de response daarnaast een
`errors`-lijst met de vastgestelde validatiefouten. Als een client een
ongeldig request aanbiedt, wordt `400 Bad Request` gebruikt.

## Interactieresource en status

### Doel

De status wordt opgevraagd via de interactieresource. Met deze functie kan een deelnemer de actuele status van een eerder aangeboden interactie opvragen. Het endpoint is onderdeel van de generieke Asynchrone Interactie API; er is geen afzonderlijk statuspad.

### Opvragen van de status

De interactie wordt opgevraagd met het `interactieId`. De response bevat onder meer de actuele status van de verwerking.

Voorbeeld:

``` http
GET https://<host>/api/interacties/{interactieId}
```

Het interactie-endpoint retourneert de actuele status van de interactie. Als de
`interactieId` syntactisch ongeldig is, retourneert de API `400 Bad Request`.
Als geen interactie met de opgegeven identifier bestaat, retourneert de API
`404 Not Found`. Deze HTTP-foutresponses gebruiken `application/problem+json`
en volgen RFC 9457 (Problem Details). Bij `400 Bad Request` bevat de response
ook de volgens de ADR vereiste `errors`-lijst.

Een statusresponse bevat de volgende gegevens:

| Attribuut | Betekenis |
|---|---|
| `interactieId` | Identificeert de asynchrone interactie. |
| `status` | Geeft de actuele toestand van de verwerking aan. |

De response van het interactie-endpoint bevat geen inhoudelijk resultaat van de verwerking.
Een inhoudelijk resultaat wordt, wanneer daarvoor een API beschikbaar
is, via die API opgevraagd.

### Verwerkingsstatussen

De interactieresource kent de volgende verwerkingsstatussen:

| Status | Betekenis |
|---|---|
| `IN_PROGRESS` | De verwerking is gestart maar nog niet afgerond. |
| `OK` | De verwerking is succesvol afgerond. |
| `ERROR` | Tijdens de verwerking is een fout opgetreden. |

### Status `IN_PROGRESS`

De status `IN_PROGRESS` geeft aan dat de verwerking nog niet is
afgerond.

Voorbeeld:

``` json
{
  "interactieId": "<interactie-id>",
  "status": "IN_PROGRESS"
}
```

### Status `OK`

De status `OK` geeft aan dat de verwerking succesvol is afgerond.

Voorbeeld:

``` json
{
  "interactieId": "<interactie-id>",
  "status": "OK"
}
```

### Status `ERROR`

De status `ERROR` geeft aan dat tijdens de verwerking een fout is
opgetreden.

Een fout kan een functionele of technische oorzaak hebben. De interactieresource
geeft in dat geval de foutclassificatie en, waar passend, aanvullende
foutinformatie terug. Het inhoudelijke resultaat van de verwerking wordt
niet via de interactieresource teruggegeven.

### Functionele fout

Een functionele fout ontstaat wanneer het aangeboden CloudEvent
inhoudelijk niet kan worden verwerkt.

Een functionele fout kan bijvoorbeeld optreden wanneer gegevens niet
voldoen aan de afspraken van de betreffende samenwerkfunctie.

Een mogelijke representatie van een functionele verwerkingsfout is:

``` json
{
  "interactieId": "<interactie-id>",
  "status": "ERROR",
  "resultaat": {
    "fout": "Het CloudEvent kan niet worden verwerkt vanwege een functionele fout.",
    "typeFout": "FUNCTIONEEL",
    "info": {
      "validatiefouten": []
    }
  }
}
```

De structuur van `resultaat` is onderdeel van het technische API-contract.
De optionele `info` bevat aanvullende informatie die bij het fouttype past.
Dit is een fout tijdens de asynchrone verwerking, geen HTTP-foutresponse:
het opvragen van de status is geslaagd en de interactieresource retourneert daarom
HTTP `200 OK`. De Problem Details-afspraken gelden voor HTTP-responses met
statuscode `4xx` of `5xx`.

### Technische fout

Een technische fout ontstaat wanneer tijdens de verwerking een
technische storing optreedt.

Een technische fout zegt niets over de inhoudelijke juistheid van het
aangeboden CloudEvent, maar over het niet beschikbaar zijn of falen van
de technische verwerking.

Een mogelijke representatie van een technische verwerkingsfout is:

``` json
{
  "interactieId": "<interactie-id>",
  "status": "ERROR",
  "resultaat": {
    "fout": "Er heeft een technische fout plaatsgevonden. Neem contact op met de beheerder of probeer het later opnieuw.",
    "typeFout": "TECHNISCH"
  }
}
```

De structuur van `resultaat` is onderdeel van het technische API-contract.
Ook deze fout wordt als verwerkingsstatus teruggegeven met HTTP `200 OK`;
het is geen HTTP-foutresponse.

## Resultaatresource

### Doel

Het resultaat van een asynchrone interactie wordt als gerelateerde resource aangeboden via het interactie-endpoint `/interacties/{interactieId}/resultaat`.

De resultaatresource wordt alleen gebruikt wanneer de betreffende asynchrone interactie een inhoudelijk resultaat oplevert. De samenwerkfunctie bepaalt of een resultaat beschikbaar wordt gesteld en welke representatie dit resultaat heeft.

### Opvragen van het resultaat

Het resultaat wordt opgevraagd met het `interactieId` van de asynchrone interactie.

Voorbeeld:

``` http
GET https://<host>/api/interacties/{interactieId}/resultaat
```

De generieke werking en het technische contract van de resultaatresource worden vastgelegd in de generieke API-specificatie. De samenwerkfunctie-specifieke afspraken bepalen of een resultaat beschikbaar wordt gesteld en beschrijven de inhoud en representatie van dat resultaat.

Het resultaat kan pas worden opgevraagd nadat de interactieresource aangeeft dat de verwerking succesvol is afgerond met de status `OK`. Als de `interactieId` syntactisch ongeldig is, retourneert de API `400 Bad Request`. Als de interactie niet bestaat, retourneert de API `404 Not Found`. Als de verwerking nog niet succesvol is afgerond of geen resultaat beschikbaar stelt, moet de concrete API-specificatie de toepasselijke foutstatus vastleggen. HTTP-foutresponses gebruiken `application/problem+json` en volgen RFC 9457 (Problem Details); bij `400 Bad Request` bevat de response ook de volgens de ADR vereiste `errors`-lijst.

De resultaatresource retourneert uitsluitend het inhoudelijke resultaat van de interactie. De actuele verwerkingsstatus wordt opgevraagd via `GET /interacties/{interactieId}`.

De vorm van het resultaat is afhankelijk van de betreffende samenwerkfunctie. Een resultaat kan bijvoorbeeld een CloudEvent zijn waarin de inhoudelijke gegevens in het attribuut `data` zijn opgenomen.

## Queryfunctionaliteit

### Doel en afbakening

Een concrete samenwerkfunctie kan eigen query-endpoints en afspraken
definiëren voor de informatievragen die zij ondersteunt. Ook kunnen
generieke, functie-overstijgende informatievragen worden gedefinieerd
wanneer die gegevens of relaties uit meerdere samenwerkfuncties combineren.
De betreffende API-specificatie legt vast welke informatievragen worden
ondersteund, hoe een vraag technisch wordt aangeleverd en welke
parameters en resultaten daarbij horen.

### Opvragen van informatie

Een informatievraag wordt aangeboden via een HTTP POST-aanroep. De
concrete endpoint-URL en de structuur van de informatievraag worden
vastgelegd in de bijbehorende API-specificatie.

POST wordt gebruikt omdat een informatievraag complexe criteria kan
bevatten, waaronder persoonsgegevens zoals een BSN. Door deze gegevens
in de requestbody op te nemen, worden ze niet als URL-parameters
doorgegeven. Dit voorkomt dat ze op die manier in URL's en URL-logs
terechtkomen; het blijft uiteraard nodig om ook de requestbody zorgvuldig
te beveiligen en niet onnodig te loggen.

De informatievraag wordt volgens het hier beschreven patroon asynchroon
verwerkt. Na acceptatie wordt een `interactieId` uitgegeven waarmee de
initiator de verwerking via de interactieresource kan volgen.

Een informatievraag kan bijvoorbeeld betrekking hebben op een persoon,
een informatieobject, een activiteit of een combinatie daarvan.

Een voorbeeld van een informatievraag is:

> Geef mij alles wat ook maar enigszins verband houdt met de persoon met
> BSN 123456789.

De wijze waarop een dergelijke informatievraag technisch wordt
uitgedrukt, maakt onderdeel uit van de samenwerkfunctie-specifieke
specificatie.

### Resultaat van een informatievraag

Het resultaat van een informatievraag wordt na succesvolle verwerking via de resultaatresource opgevraagd en teruggegeven als een CloudEvent.

#### Representatie van het resultaat

Het CloudEvent vormt de generieke envelop voor het resultaat. De inhoudelijke representatie van het resultaat bevindt zich in het attribuut `data`.

De `data` bevat altijd een PROV-JSON-LD-graaf die het resultaat van de informatievraag representeert. Deze graaf is gemodelleerd volgens het Knowledge graph-model en gebruikt PROV-concepten en, waar relevant, domeinspecifieke typen, eigenschappen en relaties.

De keuze voor een PROV-JSON-LD-graaf als generieke resultaatrepresentatie sluit aan bij het Knowledge graph-model van SOH, waarin zowel domeinobjecten als hun onderlinge relaties en de herkomst en totstandkoming van informatie kunnen worden weergegeven. Hierdoor kan één generieke resultaatrepresentatie worden gebruikt voor informatievragen die verschillende typen objecten, activiteiten, actoren en relaties opleveren. De concrete betekenis van de gevonden informatie wordt daarbij mede bepaald door de domeinspecifieke typen, eigenschappen en relaties.

Een resultaat in de vorm van een PROV-JSON-LD-graaf kan complexer ogen dan een gebruikelijke JSON-representatie met een vaste verzameling gegevensvelden. Die structuur vloeit voort uit de keuze om binnen SOH niet alleen gegevens over domeinobjecten weer te geven, maar ook de relevante samenhang daartussen en de provenance van informatie. De resultaatgraaf kan daardoor meer informatie bevatten dan voor een specifieke toepassing nodig is. Een API-gebruiker hoeft die informatie niet noodzakelijk allemaal te verwerken, maar kan zich richten op de objecten, eigenschappen en relaties die voor zijn toepassing relevant zijn.

#### Opbouw van de resultaatgraaf

Het resultaat is geen vaste JSON-resource of een lijst van resources. Het kan een relevante subgraaf van de Knowledge graph zijn. De resultaatgraaf is een representatie van het queryresultaat en hoeft niet alle eigenschappen of relaties van de corresponderende objecten in de Knowledge graph te bevatten.

Een informatievraag kan geen, één of meerdere domeinobjecten opleveren. Wanneer meerdere objecten aan de informatievraag voldoen, kunnen deze als afzonderlijke nodes in dezelfde resultaatgraaf worden opgenomen. De graaf kan daarnaast andere relevante objecten, activiteiten, actoren en relaties bevatten die nodig zijn om de resultaten en hun onderlinge samenhang te beschrijven.

Welke nodes, eigenschappen en relaties in deze subgraaf worden opgenomen, is afhankelijk van de informatievraag en de afspraken die daarvoor gelden.

Een resultaat kan bijvoorbeeld bestaan uit:

``` text
(:Agent:Persoon)
        |
        | prov:wasAssociatedWith
        v
(:Activity:...)
        |
        | prov:generated
        v
(:Entity:UitkomstOverleg)
        |
        | ...
        v
(:Entity:...)
```

De niet nader gespecificeerde relaties (`...`) kunnen zowel PROV-relaties als domeinspecifieke relaties zijn. Welke relaties in een queryresultaat worden opgenomen, is afhankelijk van de informatievraag en de relevante samenhang binnen de Knowledge graph.

De precieze omvang en structuur van de resultaatgraaf worden bepaald door de informatievraag en de afspraken van de betreffende samenwerkfunctie.

#### PROV als semantisch model

Het gebruik van PROV voor queryresultaten betekent dat het resultaat niet alleen wordt beschouwd als een technische gegevensrepresentatie.

De graaf beschrijft de betekenis en samenhang van de gevonden informatie. Daarbij kunnen `prov:Entity`, `prov:Activity` en `prov:Agent` voorkomen, aangevuld met domeinspecifieke typen.

De relaties tussen de elementen kunnen zowel PROV-relaties als domeinspecifieke relaties zijn.

Het resultaat kan daardoor zowel informatie over domeinobjecten als informatie over de herkomst, totstandkoming of het gebruik daarvan bevatten.

##### Gebruik van PROV-JSON-LD

De combinatie van PROV en JSON-LD sluit aan bij bestaande ontwikkelingen op het gebied van gegevensuitwisseling en Linked Data. PROV is onderdeel van een door het W3C ontwikkelde familie van specificaties voor het beschrijven van de herkomst en totstandkoming van gegevens. Daarnaast is er een afzonderlijke specificatie voor de representatie van PROV in JSON-LD, gepubliceerd als W3C Member Submission. Deze beschrijft hoe PROV-informatie in JSON kan worden uitgewisseld en tegelijkertijd als Linked Data kan worden geïnterpreteerd.

Ook is tooling beschikbaar voor het verwerken van JSON-LD en voor het inlezen en schrijven van PROV-JSON-LD. De keuze voor deze representatie bouwt daarmee voort op bestaande standaarden, specificaties en software-ondersteuning.

#### CloudEvent als resultaatenvelop

Een queryresultaat wordt via de resultaatresource teruggegeven als een CloudEvent. De HTTP-response heeft daarbij het mediatype `application/cloudevents+json`: de volledige HTTP-body is het CloudEvent.

Binnen dat CloudEvent geeft `datacontenttype` het mediatype van de `data` aan. Voor een resultaatgraaf in JSON-LD is dat bijvoorbeeld `application/ld+json`. `application/cloudevents+json` en `application/ld+json` beschrijven dus verschillende niveaus van de uitwisseling.

Een queryresultaat heeft dezelfde generieke CloudEvent-structuur als andere informatie die binnen SOH wordt uitgewisseld.

Het CloudEvent identificeert het resultaat als event. De graaf in `data` bevat de inhoudelijke representatie van het resultaat.

Het `CloudEvent.id` identificeert het CloudEvent zelf. Het is niet de identifier van een node in de resultaatgraaf en heeft geen andere betekenis binnen het domeinmodel. De identifiers van de resources in de resultaatgraaf worden binnen de PROV-JSON-LD-graaf zelf vastgelegd.

Voor queryresultaten gelden, naast de algemene afspraken voor CloudEvents, de volgende specifieke afspraken:

- Het attribuut `type` identificeert het CloudEvent als een queryresultaat. De concrete waarde wordt vastgesteld in de samenwerkfunctie-specifieke specificatie.
- Het attribuut `subject` bevat het `interactieId` van de asynchrone informatievraag waarop het queryresultaat betrekking heeft.
- Het attribuut `data` bevat de PROV-JSON-LD-graaf die het resultaat van de informatievraag representeert.
- Het attribuut `datacontenttype` heeft voor deze resultaatgraaf de waarde `application/ld+json`.

De concrete waarde van `source` wordt eveneens vastgesteld in de samenwerkfunctie-specifieke specificatie.

Een queryresultaat kan er bijvoorbeeld op hoofdlijnen als volgt uitzien:

``` text
HTTP/1.1 200 OK
Content-Type: application/cloudevents+json

{
  "specversion": "1.0",
  "id": "123e4567-e89b-42d3-a456-426614174001",
  "source": "<producer-van-het-queryresultaat>",
  "type": "<query-resultaat-eventtype>",
  "time": "2026-01-15T10:35:00Z",
  "subject": "<interactie-id>",
  "datacontenttype": "application/ld+json",
  "data": {
    "@context": {},
    "@graph": []
  }
}
```

Dit voorbeeld beschrijft uitsluitend de generieke structuur. De concrete waarden voor `source` en `type` en de inhoud van `data` worden vastgesteld in de samenwerkfunctie-specifieke specificatie.

## Identificatie

### Identificatie van een interactie

Elke asynchrone interactie heeft een unieke identificatie waarmee de
voortgang van de verwerking kan worden gevolgd.

Binnen het generieke interactiepatroon wordt deze identificatie
aangeduid als `interactieId`.

Het `interactieId` is de unieke identificatie van de asynchrone
interactie. Het wordt uitgegeven door de voorziening die
verantwoordelijk is voor de verwerking van de interactie.

Bij een interactie die ontstaat door het aanbieden van een CloudEvent
staat het `interactieId` los van het `id` van het CloudEvent. Het
CloudEvent `id` identificeert het CloudEvent zelf.

Hetzelfde `interactieId` wordt gebruikt bij het opvragen van de status
via de interactieresource en wordt opgenomen in het `subject`-attribuut van het
CloudEvent dat het resultaat van een informatievraag bevat.

### Overzicht van identifiers

Binnen een interactie kunnen verschillende soorten identifiers
voorkomen. Deze hebben ieder een eigen betekenis en toepassingsgebied.

| Identifier | Niveau | Betekenis |
|---|---|---|
| `interactieId` | Interactieniveau | Identificeert de asynchrone interactie. |
| `CloudEvent.id` | Eventniveau | Identificeert het CloudEvent. |
| JSON-LD `@id` | Semantisch niveau | Identificeert resources binnen een provenance-graaf. |
| Domeinspecifieke identifiers | Domeinniveau | Identificeren objecten binnen een samenwerkfunctie. |

Deze identifiers worden niet onderling vervangen.

## Relatie met samenwerkfuncties

### Generieke en specifieke onderdelen

Het generieke interactiepatroon beschrijft de technische wijze waarop
asynchrone interacties worden afgehandeld.

Een samenwerkfunctie bepaalt de inhoudelijke invulling van een
interactie en de informatievragen die specifiek zijn voor die
samenwerkfunctie.

De samenwerkfunctie bepaalt onder andere:

-   welke typen CloudEvents kunnen worden aangeboden;
-   welke gegevens in de `data` van een CloudEvent worden opgenomen;
-   welke domeinspecifieke validaties gelden;
-   welke samenwerkfunctie-specifieke informatievragen beschikbaar zijn;
-   of een asynchrone interactie een inhoudelijk resultaat oplevert;
-   welke inhoud en representatie het resultaat heeft;
-   welke betekenis een queryresultaat heeft.

Informatievragen die gegevens of relaties uit meerdere samenwerkfuncties
combineren, vragen om generieke afspraken over de betekenis en samenhang
van die gegevens. Deze afspraken worden op het niveau van SOH vastgelegd.

Het generieke patroon bepaalt:

-   hoe een CloudEvent wordt aangeboden;
-   hoe een interactie wordt geïdentificeerd;
-   hoe de verwerking asynchroon plaatsvindt;
-   hoe de status van een interactie kan worden opgevraagd;
-   hoe een inhoudelijk resultaat via de resultaatresource kan worden opgevraagd.

## Herhaald opvragen van de status

### Retry-strategie

Wanneer de interactieresource de status `IN_PROGRESS` retourneert, is de
verwerking van de interactie nog niet afgerond.

De aanbieder kan de interactieresource op een later moment opnieuw aanroepen met
hetzelfde `interactieId`.

Het opnieuw opvragen van de status wordt uitgevoerd volgens een
retry-strategie. De aanbieder bepaalt daarbij het interval tussen
opeenvolgende verzoeken binnen de daarvoor geldende afspraken.

Een mogelijke strategie is een oplopend interval (exponential backoff).

Bijvoorbeeld:

| Poging | Wachttijd |
|---|---|
| Eerste statusopvraag na acceptatie | 1 seconde |
| Tweede statusopvraag | 2 seconden |
| Derde statusopvraag | 4 seconden |
| Vierde statusopvraag | 8 seconden |

De gekozen retry-strategie kan afhankelijk zijn van de eigenschappen van
de betreffende toepassing.

Het doel van een retry-strategie is om onnodige belasting van de
interactieresource te voorkomen, terwijl de aanbieder de status van de
interactie kan blijven volgen.

## Validatie van payloads

De generieke API's controleren de technische structuur van een
aangeboden CloudEvent. De inhoud van het attribuut `data` wordt bepaald
door de betreffende samenwerkfunctie.

Wanneer `data` een PROV-JSON-LD-graaf bevat, kan de structuur daarvan
worden gevalideerd met het [PROV-JSON-LD JSON
Schema](jsonschema/prov-jsonld.schema.json).

Het JSON Schema richt zich op structurele validatie. Het valideert niet
de volledige semantische samenhang van de provenance-graaf.

Aanvullende semantische validatie, bijvoorbeeld met SHACL, kan in een
toekomstige uitbreiding worden toegevoegd.

## OpenAPI-specificatie

De technische contracten van de generieke API's worden beschreven met
behulp van een OpenAPI-specificatie.

De OpenAPI-specificatie bevat onder andere:

-   beschikbare endpoints;
-   HTTP-methodes;
-   request- en responsemodellen;
-   foutafhandeling;
-   technische validatieregels.

De OpenAPI-specificatie voor het generieke asynchrone interactiepatroon
is opgenomen in
[AsynchroneInteracties.yaml](yaml/AsynchroneInteracties.yaml) ([interactief bekijken](api.html?spec=AsynchroneInteracties) · [openen in Swagger Editor](https://editor.swagger.io/?url=https://samen-onder-handbereik.github.io/specificaties/yaml/AsynchroneInteracties.yaml)).

<details class="soh-api" data-spec="AsynchroneInteracties"><summary>API Asynchrone Interacties interactief bekijken</summary></details>
