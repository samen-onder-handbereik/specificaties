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
[AsynchroneInteracties.yaml](yaml/AsynchroneInteracties.yaml).

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

  -----------------------------------------------------------------------
  Begrip                              Betekenis
  ----------------------------------- -----------------------------------
  Asynchrone interactie               Een interactie waarvan de
                                      verwerking na acceptatie buiten de
                                      oorspronkelijke HTTP-aanroep
                                      plaatsvindt.

  CloudEvent                          Een gebeurtenis die conform de
                                      CloudEvents-specificatie wordt
                                      beschreven en aangeboden.

  interactieId                        De unieke identificatie van een
                                      asynchrone interactie. Het
                                      interactieId wordt uitgegeven door
                                      de voorziening die verantwoordelijk
                                      is voor de verwerking van de
                                      interactie.

  Status-API                          De generieke API waarmee de actuele
                                      status van een asynchrone
                                      interactie kan worden opgevraagd.

  Query API                           De API waarmee een informatievraag
                                      aan de Knowledge graph kan worden
                                      gesteld.

  Samenwerkfunctie                    Een domeinspecifieke invulling van
                                      het generieke interactiepatroon.
  -----------------------------------------------------------------------

## Generiek interactiepatroon

Een asynchrone interactie verloopt volgens een vast patroon:

1.  Een deelnemer biedt een interactie aan via een API.
2.  De API accepteert de interactie voor verdere verwerking.
3.  De verwerking van de interactie vindt asynchroon plaats.
4.  De deelnemer kan de voortgang van de verwerking volgen.
5.  Na afronding kan een resultaat beschikbaar worden gesteld.

``` text
Initiator
    |
    | aanbieden interactie
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

## CloudEvent API

### Doel

De CloudEvent API biedt de mogelijkheid om een CloudEvent aan te bieden
binnen het generieke interactiepatroon.

Een deelnemer gebruikt deze API om een interactie te initiëren. Na
acceptatie wordt de verdere verwerking asynchroon uitgevoerd.

De CloudEvent API is verantwoordelijk voor:

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
Status-API te volgen.

### Acceptatie van een interactie

Na ontvangst controleert de CloudEvent API het aangeboden CloudEvent.

Wanneer het CloudEvent technisch kan worden geaccepteerd, retourneert de
API een HTTP-response met status `202 Accepted`.

De status `202 Accepted` betekent dat de interactie is geaccepteerd voor
verdere asynchrone verwerking. De verwerking zelf hoeft op dat moment
nog niet te zijn afgerond.

De aanbieder kan vervolgens de Status-API gebruiken om de voortgang van
de verwerking te volgen.

Wanneer het CloudEvent niet kan worden geaccepteerd, retourneert de API
een foutmelding volgens de geldende HTTP- en foutafhandelingsafspraken.

## Status-API

### Doel

De Status-API ondersteunt het volgen van een asynchrone interactie.

Met deze API kan een deelnemer de actuele status van een eerder
aangeboden interactie opvragen.

### Opvragen van de status

De status van een interactie wordt opgevraagd met het `interactieId`.

Voorbeeld:

``` http
GET https://<host>/api/status/{interactieId}
```

De Status-API retourneert de actuele status van de interactie.

Een statusresponse bevat de volgende gegevens:

  Attribuut        Betekenis
  ---------------- --------------------------------------------------
  `interactieId`   Identificeert de asynchrone interactie.
  `status`         Geeft de actuele toestand van de verwerking aan.

De Status-API retourneert geen inhoudelijk resultaat van de verwerking.
Een inhoudelijk resultaat wordt, wanneer daarvoor een API beschikbaar
is, via die API opgevraagd.

### Verwerkingsstatussen

De Status-API kent de volgende statussen:

  Status          Betekenis
  --------------- --------------------------------------------------
  `IN_PROGRESS`   De verwerking is gestart maar nog niet afgerond.
  `OK`            De verwerking is succesvol afgerond.
  `ERROR`         Tijdens de verwerking is een fout opgetreden.

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

Een fout kan een functionele of technische oorzaak hebben. De Status-API
geeft in dat geval de foutclassificatie en, waar passend, aanvullende
foutinformatie terug. Het inhoudelijke resultaat van de verwerking wordt
niet via de Status-API teruggegeven.

### Functionele fout

Een functionele fout ontstaat wanneer het aangeboden CloudEvent
inhoudelijk niet kan worden verwerkt.

Een functionele fout kan bijvoorbeeld optreden wanneer gegevens niet
voldoen aan de afspraken van de betreffende samenwerkfunctie.

Een mogelijke representatie van een functionele fout is:

``` json
{
  "interactieId": "<interactie-id>",
  "status": "ERROR",
  "fout": {
    "type": "FUNCTIONEEL",
    "melding": "Het CloudEvent kan niet worden verwerkt vanwege een functionele fout.",
    "details": {
      "validatiefouten": []
    }
  }
}
```

De precieze structuur van `fout` en `details` wordt vastgelegd in het
technische API-contract.

### Technische fout

Een technische fout ontstaat wanneer tijdens de verwerking een
technische storing optreedt.

Een technische fout zegt niets over de inhoudelijke juistheid van het
aangeboden CloudEvent, maar over het niet beschikbaar zijn of falen van
de technische verwerking.

Een mogelijke representatie van een technische fout is:

``` json
{
  "interactieId": "<interactie-id>",
  "status": "ERROR",
  "fout": {
    "type": "TECHNISCH",
    "melding": "Er heeft een technische fout plaatsgevonden. Neem contact op met de beheerder of probeer het later opnieuw."
  }
}
```

De precieze structuur van `fout` en eventuele aanvullende details wordt
vastgelegd in het technische API-contract.

## Query API

### Doel

De Query API biedt een generiek mechanisme voor het stellen van
informatievragen aan de Knowledge graph.

Een deelnemer gebruikt de Query API om informatie op te vragen die
binnen de Knowledge graph beschikbaar is.

De concrete betekenis van een informatievraag en de wijze waarop deze
wordt gespecificeerd, worden bepaald door de betreffende
samenwerkfunctie.

De Query API is daarmee geen API voor één specifiek type
informatieobject. De API biedt een generiek mechanisme waarmee een
samenwerkfunctie de informatievragen kan definiëren die binnen haar
context relevant zijn.

### Opvragen van informatie

Een informatievraag wordt aangeboden via een HTTP POST-aanroep.

Voorbeeld:

``` http
POST https://<host>/api/query
```

De exacte URL en de structuur van de informatievraag worden vastgesteld
in de technische API-specificatie van de betreffende samenwerkfunctie.

Een informatievraag kan bijvoorbeeld betrekking hebben op een persoon,
een informatieobject, een activiteit of een combinatie daarvan.

Een voorbeeld van een informatievraag is:

> Geef mij alles wat ook maar enigszins verband houdt met de persoon met
> BSN 123456789.

De wijze waarop een dergelijke informatievraag technisch wordt
uitgedrukt, maakt onderdeel uit van de samenwerkfunctie-specifieke
specificatie.

### Resultaat van een informatievraag

Het resultaat van een informatievraag wordt teruggegeven als een
CloudEvent.

Het CloudEvent vormt de generieke envelop voor het resultaat. De
inhoudelijke representatie van het resultaat bevindt zich in het
attribuut `data`.

De `data` bevat een graph die het resultaat van de informatievraag
representeert. Deze graph is gemodelleerd volgens het Knowledge
graph-model en gebruikt PROV-concepten en, waar relevant,
domeinspecifieke typen, eigenschappen en relaties.

Het resultaat is daarmee geen vaste JSON-resource of een lijst van
resources. Het resultaat kan een relevante subgraaf van de Knowledge
graph zijn. De resultaatgraaf is een representatie van het
queryresultaat en hoeft niet alle eigenschappen of relaties van de
corresponderende objecten in de Knowledge graph te bevatten.

Welke nodes, eigenschappen en relaties in deze subgraaf worden
opgenomen, is afhankelijk van de informatievraag en de afspraken van de
betreffende samenwerkfunctie.

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

De niet nader gespecificeerde relaties (`...`) kunnen zowel
PROV-relaties als domeinspecifieke relaties zijn. Welke relaties in een
queryresultaat worden opgenomen, is afhankelijk van de informatievraag
en de relevante samenhang binnen de Knowledge graph.

De precieze omvang en structuur van de resultaatgraaf worden niet door
de generieke Query API voorgeschreven.

### PROV als semantisch model

Het gebruik van PROV voor queryresultaten betekent dat het resultaat
niet alleen wordt beschouwd als een technische gegevensrepresentatie.

De graph beschrijft de betekenis en samenhang van de gevonden
informatie. Daarbij kunnen `prov:Entity`, `prov:Activity` en
`prov:Agent` voorkomen, aangevuld met domeinspecifieke typen.

De relaties tussen de elementen kunnen zowel PROV-relaties als
domeinspecifieke relaties zijn.

Het resultaat kan daardoor zowel informatie over domeinobjecten als
informatie over de herkomst, totstandkoming of het gebruik daarvan
bevatten.

### CloudEvent als resultaatenvelop

Een Query API-resultaat heeft dezelfde generieke CloudEvent-structuur
als andere informatie die binnen SOH wordt uitgewisseld.

Het CloudEvent identificeert het resultaat als event. De graph in `data`
bevat de inhoudelijke representatie van het resultaat.

Het `CloudEvent.id` identificeert het CloudEvent zelf. Het is niet de
identifier van een node in de resultaatgraaf en heeft geen andere
betekenis binnen het domeinmodel. De identifiers van de resources in de
resultaatgraaf worden binnen de PROV-JSON-LD-graaf zelf vastgelegd.

Voor een queryresultaat gelden de volgende uitgangspunten voor de
CloudEvent-attributen:

  -----------------------------------------------------------------------
  Attribuut                           Betekenis bij een queryresultaat
  ----------------------------------- -----------------------------------
  `specversion`                       De versie van de
                                      CloudEvents-specificatie,
                                      bijvoorbeeld `1.0`.

  `id`                                Unieke identifier van het
                                      CloudEvent. Deze wordt door de
                                      producer van het CloudEvent
                                      uitgegeven.

  `source`                            Identificeert de partij of
                                      voorziening die het queryresultaat
                                      als CloudEvent produceert.

  `type`                              Identificeert dat het CloudEvent
                                      een queryresultaat bevat. De
                                      concrete waarde wordt vastgesteld
                                      door de betreffende
                                      samenwerkfunctie.

  `time`                              Tijdstip waarop het CloudEvent is
                                      geproduceerd.

  `subject`                           Alleen opnemen wanneer het
                                      queryresultaat een eenduidig
                                      onderwerp heeft. Bij een resultaat
                                      dat een bredere subgraaf bevat,
                                      hoeft `subject` niet te worden
                                      gebruikt.

  `datacontenttype`                   Geeft het mediatype van de `data`
                                      aan, bijvoorbeeld
                                      `application/ld+json`.

  `data`                              De PROV-JSON-LD-graaf die het
                                      queryresultaat representeert.
  -----------------------------------------------------------------------

De concrete waarde van `source` en de naamgeving van `type` worden
vastgesteld in de samenwerkfunctie-specifieke specificatie. Het
generieke patroon schrijft daarvoor geen specifieke URI of eventtype
voor.

Een queryresultaat kan er bijvoorbeeld op hoofdlijnen als volgt uitzien:

``` json
{
  "specversion": "1.0",
  "id": "urn:uuid:<query-resultaat-event-id>",
  "source": "<producer-van-het-queryresultaat>",
  "type": "<query-resultaat-eventtype>",
  "time": "2026-01-15T10:35:00Z",
  "datacontenttype": "application/ld+json",
  "data": {
    "@context": {},
    "@graph": []
  }
}
```

Dit voorbeeld beschrijft uitsluitend de generieke structuur. De concrete
waarden voor `source` en `type` en de inhoud van `data` worden
vastgesteld in de samenwerkfunctie-specifieke specificatie.

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
via de Status-API.

### Overzicht van identifiers

Binnen een interactie kunnen verschillende soorten identifiers
voorkomen. Deze hebben ieder een eigen betekenis en toepassingsgebied.

  -----------------------------------------------------------------------
  Identifier              Niveau                  Betekenis
  ----------------------- ----------------------- -----------------------
  `interactieId`          Interactieniveau        Identificeert de
                                                  asynchrone interactie.

  `CloudEvent.id`         Eventniveau             Identificeert het
                                                  CloudEvent.

  JSON-LD `@id`           Semantisch niveau       Identificeert resources
                                                  binnen een
                                                  provenance-graaf.

  Domeinspecifieke        Domeinniveau            Identificeren objecten
  identifiers                                     binnen een
                                                  samenwerkfunctie.
  -----------------------------------------------------------------------

Deze identifiers worden niet onderling vervangen.

## Relatie met samenwerkfuncties

### Generieke en specifieke onderdelen

Het generieke interactiepatroon beschrijft de technische wijze waarop
asynchrone interacties worden afgehandeld.

Een samenwerkfunctie bepaalt de inhoudelijke invulling van een
interactie.

De samenwerkfunctie bepaalt onder andere:

-   welke typen CloudEvents kunnen worden aangeboden;
-   welke gegevens in de `data` van een CloudEvent worden opgenomen;
-   welke domeinspecifieke validaties gelden;
-   welke informatievragen beschikbaar zijn;
-   welke betekenis een queryresultaat heeft.

Het generieke patroon bepaalt:

-   hoe een CloudEvent wordt aangeboden;
-   hoe een interactie wordt geïdentificeerd;
-   hoe de verwerking asynchroon plaatsvindt;
-   hoe de status van een interactie kan worden opgevraagd;
-   hoe een queryresultaat als CloudEvent wordt teruggegeven.

## Herhaald opvragen van de status

### Retry-strategie

Wanneer de Status-API de status `IN_PROGRESS` retourneert, is de
verwerking van de interactie nog niet afgerond.

De aanbieder kan de Status-API op een later moment opnieuw aanroepen met
hetzelfde `interactieId`.

Het opnieuw opvragen van de status wordt uitgevoerd volgens een
retry-strategie. De aanbieder bepaalt daarbij het interval tussen
opeenvolgende verzoeken binnen de daarvoor geldende afspraken.

Een mogelijke strategie is een oplopend interval (exponential backoff).

Bijvoorbeeld:

  Poging                               Wachttijd
  ------------------------------------ ------------
  Eerste statusopvraag na acceptatie   1 seconde
  Tweede statusopvraag                 2 seconden
  Derde statusopvraag                  4 seconden
  Vierde statusopvraag                 8 seconden

De gekozen retry-strategie kan afhankelijk zijn van de eigenschappen van
de betreffende toepassing.

Het doel van een retry-strategie is om onnodige belasting van de
Status-API te voorkomen, terwijl de aanbieder de status van de
interactie kan blijven volgen.

## Nog vast te stellen

De volgende onderwerpen worden verder uitgewerkt:

-   definitieve API-URL's;
-   exacte HTTP-contracten;
-   foutcodes;
-   autorisatie en authenticatie;
-   bewaartermijnen van interactiegegevens;
-   afspraken rondom het opnieuw aanbieden van een CloudEvent;
-   de concrete structuur van informatievragen per samenwerkfunctie;
-   de concrete structuur van queryresultaten.

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
[AsynchroneInteracties.yaml](yaml/AsynchroneInteracties.yaml).
