## Inleiding

## Doel en scope

Deze specificatie beschrijft de samenwerkfunctie Uitwisselen Uitkomst
Overleg.

De samenwerkfunctie ondersteunt het beschikbaar stellen, vinden en
raadplegen van Uitkomsten Overleg tussen ketenpartners.

CloudEvents bevatten niet de volledige inhoud van een Uitkomst Overleg.
Zij bevatten informatie die nodig is voor notificatie, provenance, auditing
en het opbouwen van een Knowledge graph.
De volledige inhoud van een Uitkomst Overleg kan via de Inzage-API worden geraadpleegd.

### Inzage-API

De Inzage-API biedt toegang tot de volledige inhoud van een Uitkomst Overleg. De Inzage-API wordt gebruikt wanneer een deelnemer de inhoudelijke Uitkomst Overleg daadwerkelijk wil raadplegen.

De Inzage-API maakt onderdeel uit van de specificatie van de samenwerkfunctie. Een implementatie van de Inzage-API moet voldoen aan de door Samen Onder Handbereik gedefinieerde [OpenAPI-specificatie UitkomstOverleg.yaml](yaml/UitkomstOverleg.yaml).

Een `inzageUrl` die in een queryresultaat kan worden opgenomen, verwijst naar een resource die via deze Inzage-API kan worden geraadpleegd.

De generieke wijze waarop asynchrone interacties, CloudEvents, status en
resultaten technisch worden uitgewisseld, is beschreven in het generieke
patroon voor asynchrone interacties. Deze specificatie beschrijft de
domeinspecifieke invulling voor Uitkomst Overleg.


## CloudEvents

Deze samenwerkfunctie gebruikt verschillende CloudEvent-typen. Voor ieder
CloudEvent-type is hieronder dezelfde opbouw gebruikt:

- doel en betekenis;
- CloudEvent-envelope;
- opbouw van `data`;
- beschrijving van de graph-objecten en relaties;
- volledig voorbeeld;
- eventuele aandachtspunten.

De algemene betekenis en syntaxis van CloudEvents-attributen worden bepaald
door CloudEvents 1.0. De tabellen hieronder beschrijven de aanvullende
invulling voor deze samenwerkfunctie. De payloads bevatten geen volledige
inhoud van een Uitkomst Overleg; die inhoud is via de Inzage-API te
raadplegen.

### Uitkomst beschikbaar gesteld

Eventtype:

`nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`

#### Doel en betekenis

Dit event meldt dat een bestaande Uitkomst Overleg beschikbaar is gesteld.
De graph legt de beschikbaarstellingsactiviteit vast. De interne activiteit
waarmee de Uitkomst Overleg oorspronkelijk is gegenereerd, valt buiten de
scope van deze graph.

#### CloudEvent-envelope

De CloudEvent wordt als JSON-object geserialiseerd volgens CloudEvents 1.0.

| Attribuut | Invulling |
|---|---|
| `specversion` | Gebruik de vaste waarde `1.0`. |
| `id` | Gebruik een UUIDv7 als unieke identificatie van dit CloudEvent binnen de context van `source`. Dit is een aanvullende afspraak voor deze samenwerkfunctie en geen algemene CloudEvents-eis. Het id is niet de identifier van een graph-object. |
| `source` | Gebruik een URI-reference die het systeem identificeert dat het event registreert en publiceert. Gebruik de afgesproken identificatie van het bronsysteem. |
| `type` | Gebruik exact `nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`. |
| `time` | Neem het registratietijdstip op als RFC 3339-datumtijd. Dit hoeft niet gelijk te zijn aan het tijdstip van de activiteit. |
| `subject` | Laat dit attribuut weg. |
| `datacontenttype` | Gebruik `application/ld+json`. CloudEvents vereist dit attribuut niet in alle gevallen; binnen deze samenwerkfunctie is het verplicht. |
| `dataschema` | Gebruik `https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json`. Dit is een aanvullende afspraak voor deze samenwerkfunctie. |
| `data` | Neem een JSON-LD-document op met de PROV-JSON-LD-graaf zoals hieronder beschreven. |

#### Opbouw van `data`

`data` bevat één JSON-LD-document met `@context` en `@graph`. De context
bevat minimaal deze prefixdefinities:

| Prefix | URI |
|---|---|
| `prov` | `http://www.w3.org/ns/prov#` |
| `soh` | `https://samen-onder-handbereik.github.io/specificaties/schema/` |

Domeinspecifieke typen, eigenschappen en relaties worden met `soh:`
geschreven; PROV-typen en -relaties met `prov:`. Gebruik geen onverklaarde
ongeprefixte eigenschapsnamen.

De graph bevat precies één node voor elk van deze objecten:

- `UitkomstOverleg`;
- `BeschikbaarStellenUitkomstOverleg`;
- `Organisatie` die de activiteit uitvoert;
- `Betrokkene` waarop de Uitkomst Overleg betrekking heeft.

Elk object heeft een eigen `@id`. Verwijzingen tussen nodes gebruiken
`{"@id": "<identifier>"}` en moeten overeenkomen met de `@id` van het
bedoelde object in de graph.

#### Graph-objecten en relaties

##### UitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de Uitkomst Overleg in de Knowledge graph identificeert. |
| `@type` | Verplicht: zowel `prov:Entity` als `soh:UitkomstOverleg`. |
| `soh:heeftBetrokkene` | Verplicht. Verwijst naar de opgenomen Betrokkene-node. |
| `soh:beschikbaarGesteldOp` | Optioneel. Het tijdstip/de datum waarop deze Uitkomst Overleg beschikbaar is gesteld, als RFC 3339-datumtijd. Als ook `soh:tijdstip` is opgenomen bij de activiteit, beschrijven beide eigenschappen hetzelfde beschikbaarstellingsmoment. |


`prov:wasGeneratedBy` wordt hier bewust niet gebruikt: die relatie zou
suggereren dat de beschikbaarstellingsactiviteit de Uitkomst Overleg heeft
gegenereerd. Het gaat om een reeds bestaande Uitkomst Overleg. Het verband
met de beschikbaarstellingsactiviteit wordt vastgelegd met de domeinrelatie
`soh:steltBeschikbaar`.

De volledige inhoud en `inzageUrl` zijn niet vereist in dit event. Een
`inzageUrl` kan deel uitmaken van een queryresultaat.

##### BeschikbaarStellenUitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. Eigen URI die de provenance-activiteit identificeert. |
| `@type` | Verplicht: zowel `prov:Activity` als `soh:BeschikbaarStellenUitkomstOverleg`. |
| `soh:tijdstip` | Optioneel wanneer het daadwerkelijke tijdstip niet bekend of beschikbaar is. Indien aanwezig: RFC 3339-datumtijd en het tijdstip waarop de beschikbaarstellingsactiviteit plaatsvond. |
| `prov:wasAssociatedWith` | Verplicht. Verwijst naar de Organisatie-node die de activiteit heeft uitgevoerd. |
| `soh:steltBeschikbaar` | Verwijst naar de UitkomstOverleg-node die beschikbaar wordt gesteld. |


##### Organisatie

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de uitvoerende organisatie identificeert, bijvoorbeeld een afgesproken OIN-gebaseerde URN. |
| `@type` | Verplicht: zowel `prov:Agent` als `soh:Organisatie`. |

De `@id` waarnaar `prov:wasAssociatedWith` verwijst, moet overeenkomen met
de `@id` van deze node. De organisatie hoeft niet dezelfde te zijn als het
systeem in het CloudEvent-attribuut `source`.

##### Betrokkene

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die het Betrokkene-object in de Knowledge graph identificeert. Gebruik niet zonder afzonderlijke afspraak het BSN of een ander persoonsidentificatienummer als `@id`. |
| `@type` | Verplicht: `soh:Betrokkene`. Dit type maakt het object niet automatisch tot `prov:Agent`. |
| `soh:identificatieType` | Optioneel. Opnemen wanneer identificatiegegevens noodzakelijk en toegestaan zijn. Stabiele code voor het type identificatienummer, bijvoorbeeld `BSN` of `V-NUMMER`. |
| `soh:identificatieWaarde` | Optioneel. Alleen opnemen samen met `soh:identificatieType`, wanneer identificatiegegevens noodzakelijk en toegestaan zijn. De waarde is een string. |
| `soh:woonplaats` | Optioneel. Indien aanwezig, een tekstuele waarde. |

De `@id` identificeert het Betrokkene-object en staat los van de combinatie
van identificatietype en identificatiewaarde. Het opnemen van de Betrokkene-node
vereist niet automatisch dat ook persoonsidentificatie wordt verstrekt. Neem
persoonsgegevens alleen op voor zover dat noodzakelijk en toegestaan is. Als één
van de identificatie-eigenschappen wordt opgenomen, moeten beide aanwezig zijn.

#### Identifiers

De volgende identifiers hebben verschillende betekenissen en mogen niet
door elkaar worden gebruikt:

- CloudEvent `id`: identificeert het event;
- Activity `@id`: identificeert de beschikbaarstellingsactiviteit;
- Entity `@id`: identificeert de Uitkomst Overleg;
- Agent `@id`: identificeert de Organisatie;
- Betrokkene `@id`: identificeert het Betrokkene-object.

#### Volledig voorbeeld

De URN's en waarden zijn fictief.

```json
{
  "specversion": "1.0",
  "id": "019b7a10-6c2d-7abc-8def-1234567890ab",
  "source": "urn:nld:oin:00000001823288444000:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld",
  "time": "2026-10-15T10:30:00Z",
  "datacontenttype": "application/ld+json",
  "dataschema": "https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:activity:beschikbaarstellen:12345",
        "@type": ["prov:Activity", "soh:BeschikbaarStellenUitkomstOverleg"],
        "soh:tijdstip": "2026-10-15T10:30:00Z",
        "prov:wasAssociatedWith": {"@id": "urn:nld:oin:00000001823288444000"},
        "soh:steltBeschikbaar": {"@id": "urn:uitkomst-overleg:12345"}
      },
      {
        "@id": "urn:uitkomst-overleg:12345",
        "@type": ["prov:Entity", "soh:UitkomstOverleg"],
        "soh:heeftBetrokkene": {"@id": "urn:betrokkene:67890"}
      },
      {
        "@id": "urn:betrokkene:67890",
        "@type": "soh:Betrokkene",
        "soh:identificatieType": "BSN",
        "soh:identificatieWaarde": "123456789",
        "soh:woonplaats": "Deventer"
      },
      {
        "@id": "urn:nld:oin:00000001823288444000",
        "@type": ["prov:Agent", "soh:Organisatie"]
      }
    ]
  }
}
```

#### Nog te bevestigen ontwerpkeuzes

- **Betrokkenegegevens:** het concept schrijft identificatietype en -waarde niet standaard verplicht voor. Bevestig per gebruikssituatie welke gegevens noodzakelijk en toegestaan zijn en of woonplaats mag worden opgenomen; beoordeel gegevensminimalisatie en autorisatie.
- **Tijdstip:** bevestig of `soh:tijdstip` optioneel blijft wanneer het werkelijke tijdstip niet bekend is.
- **Beschikbaarheidsdatum:** `soh:beschikbaarGesteldOp` is als optionele eigenschap bij de Entity opgenomen. Als deze én `soh:tijdstip` bij de Activity aanwezig zijn, moeten ze hetzelfde beschikbaarstellingsmoment beschrijven. Bevestig of deze dubbele representatie wenselijk is.

### Uitkomst ingezien

Eventtype:

`nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-ingezien`

#### Doel en betekenis

Dit event meldt dat een Uitkomst Overleg daadwerkelijk is geraadpleegd via
de Inzage-API. Het uitvoeren van een informatievraag geldt niet als inzage;
raadpleging van de inhoud wordt als afzonderlijke activiteit vastgelegd.

#### CloudEvent-envelope

| Attribuut | Invulling |
|---|---|
| `specversion` | Gebruik de vaste waarde `1.0`. |
| `id` | Gebruik een UUIDv7 als unieke identificatie van dit CloudEvent binnen de context van `source`. Dit is een aanvullende afspraak voor deze samenwerkfunctie en geen algemene CloudEvents-eis. Het id is niet de identifier van een graph-object. |
| `source` | Gebruik een URI-reference die het systeem identificeert dat het event registreert en publiceert. Gebruik de afgesproken identificatie van het bronsysteem. |
| `type` | Gebruik exact `nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-ingezien`. |
| `time` | Neem het registratietijdstip op als RFC 3339-datumtijd. |
| `subject` | Laat dit attribuut weg. |
| `datacontenttype` | Gebruik `application/ld+json`. CloudEvents vereist dit attribuut niet in alle gevallen; binnen deze samenwerkfunctie is het verplicht. |
| `dataschema` | Gebruik `https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json`. Dit is een aanvullende afspraak voor deze samenwerkfunctie. |
| `data` | Neem een JSON-LD-document op met de graaf van de inzageactiviteit. |

#### Opbouw van `data`

`data` bevat `@context` met de prefixen `prov` en `soh` zoals hierboven
beschreven, en een `@graph`. De graph bevat minimaal:

- één `InzienUitkomstOverleg`-node;
- één `UitkomstOverleg`-node waarnaar de activiteit verwijst;
- één `Organisatie`-node die de inzage heeft uitgevoerd.

Elk object heeft een eigen `@id`. Verwijzingen moeten overeenkomen met de
`@id` van het bedoelde object in de graph.

#### Graph-objecten en relaties

##### InzienUitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. Eigen URI die de inzageactiviteit identificeert. |
| `@type` | Verplicht: zowel `prov:Activity` als `soh:InzienUitkomstOverleg`. |
| `soh:tijdstip` | Het daadwerkelijke tijdstip van inzage, als RFC 3339-datumtijd wanneer opgenomen. |
| `prov:used` | Verwijst naar de `UitkomstOverleg` die is ingezien. |
| `prov:wasAssociatedWith` | Verwijst naar de Organisatie die de inzage heeft uitgevoerd. |

##### UitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de geraadpleegde Uitkomst Overleg identificeert. |
| `@type` | Verplicht: zowel `prov:Entity` als `soh:UitkomstOverleg`. |

##### Organisatie

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de organisatie identificeert die de inzage heeft uitgevoerd. |
| `@type` | Verplicht: zowel `prov:Agent` als `soh:Organisatie`. |

#### Identifiers

Het CloudEvent-id, de Activity-id, de Entity-id en de Agent-id hebben elk
een eigen functie. Het CloudEvent-id wordt niet hergebruikt als identifier
van een graph-object.

#### Volledig voorbeeld

De waarden zijn fictief. De `@id` waarnaar `prov:wasAssociatedWith` verwijst,
komt overeen met de opgenomen Organisatie-node.

```json
{
  "specversion": "1.0",
  "id": "019b7a11-6c2d-7abc-8def-1234567890ab",
  "source": "urn:nld:oin:00000001823288444000:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-ingezien",
  "time": "2026-10-15T11:00:00Z",
  "datacontenttype": "application/ld+json",
  "dataschema": "https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:activity:inzien:67890",
        "@type": ["prov:Activity", "soh:InzienUitkomstOverleg"],
        "soh:tijdstip": "2026-10-15T11:00:00Z",
        "prov:used": {"@id": "urn:uitkomst-overleg:12345"},
        "prov:wasAssociatedWith": {"@id": "urn:nld:kvknr:09220932"}
      },
      {
        "@id": "urn:uitkomst-overleg:12345",
        "@type": ["prov:Entity", "soh:UitkomstOverleg"]
      },
      {
        "@id": "urn:nld:kvknr:09220932",
        "@type": ["prov:Agent", "soh:Organisatie"]
      }
    ]
  }
}
```

#### Aandachtspunten

- Het CloudEvent `time` beschrijft de registratie van het event; `soh:tijdstip` beschrijft het daadwerkelijke tijdstip van inzage. Deze waarden kunnen verschillen.
- De organisatie die de inzage uitvoert, hoeft niet dezelfde te zijn als het systeem dat het event publiceert.
- De inhoud van de Uitkomst Overleg wordt niet in dit event opgenomen.

### Uitkomst Overleg queryresultaat

Eventtype:

`nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat`

#### Doel en betekenis

Dit event bevat het resultaat van een informatievraag. Na succesvolle
asynchrone verwerking wordt het resultaat via
`GET /interacties/{interactieId}/resultaat` opgevraagd. De response-resource
retourneert het CloudEvent met de PROV-JSON-LD-resultaatgraaf. Het event
reconstrueert niet de oorspronkelijke gebeurtenis waarmee gevonden informatie
beschikbaar is gesteld.

#### CloudEvent-envelope

| Attribuut | Invulling |
|---|---|
| `specversion` | Gebruik de vaste waarde `1.0`. |
| `id` | Gebruik een UUIDv7 als unieke identificatie van dit CloudEvent binnen de context van `source`. Dit is een aanvullende afspraak voor deze samenwerkfunctie en geen algemene CloudEvents-eis. Het id is niet de identifier van een graph-object. |
| `source` | Gebruik een URI-reference die het systeem identificeert dat het event registreert en publiceert. Gebruik de afgesproken identificatie van het bronsysteem. |
| `type` | Gebruik exact `nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat`. |
| `time` | Neem het registratietijdstip op als RFC 3339-datumtijd. |
| `subject` | Neem het `interactieId` op van de asynchrone informatievraag waarop het resultaat betrekking heeft. |
| `datacontenttype` | Gebruik `application/ld+json`. CloudEvents vereist dit attribuut niet in alle gevallen; binnen deze samenwerkfunctie is het verplicht. |
| `dataschema` | Gebruik `https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json`. Dit is een aanvullende afspraak voor deze samenwerkfunctie. |
| `data` | Neem een JSON-LD-document op met de resultaatgraaf. |

#### Opbouw van `data`

`data` bevat een JSON-LD-document met `@context` en `@graph`. De context
bevat minimaal de prefixen `prov` en `soh` zoals hierboven beschreven.
De resultaatgraaf hangt af van de informatievraag en kan nul, één of meer
`UitkomstOverleg`-nodes bevatten. Als een Betrokkene wordt opgenomen, wordt
deze als afzonderlijke node beschreven en vanuit de betreffende
`UitkomstOverleg` met `soh:heeftBetrokkene` verbonden.

De graph bevat alleen de gegevens die nodig zijn om het resultaat van de
informatieaanvraag te representeren en de beschikbare provenance te
beschrijven. De volledige inhoud van de Uitkomst Overleg wordt niet in het
event opgenomen.

#### Graph-objecten en relaties

##### UitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht voor elke opgenomen Uitkomst Overleg; URI die het object in de Knowledge graph identificeert. |
| `@type` | Verplicht: zowel `prov:Entity` als `soh:UitkomstOverleg`. |
| `soh:heeftBetrokkene` | Opnemen wanneer de graaf de Betrokkene waarop de Uitkomst Overleg betrekking heeft bevat. Verwijst naar de Betrokkene-node. |
| `soh:beschikbaarGesteldOp` | Optioneel. RFC 3339-datumtijd van het beschikbaarstellingsmoment. Als ook `soh:tijdstip` van de beschikbaarstellingsactiviteit is opgenomen, beschrijven beide eigenschappen hetzelfde moment. |
| `soh:inzageUrl` | Optioneel. Verwijst naar de resource die via de Inzage-API kan worden geraadpleegd. |

##### Betrokkene

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht voor elke opgenomen Betrokkene; identificeert het object in de Knowledge graph en is niet automatisch het persoonsidentificatienummer. |
| `@type` | Verplicht: `soh:Betrokkene`. |
| `soh:identificatieType` | Opnemen wanneer de persoonsidentificatie in het resultaat wordt verstrekt. |
| `soh:identificatieWaarde` | Opnemen samen met `soh:identificatieType` wanneer de persoonsidentificatie in het resultaat wordt verstrekt. |
| `soh:woonplaats` | Optioneel wanneer relevant voor de informatievraag en toegestaan om terug te geven. |

##### Provenance-objecten

De resultaatgraaf kan naast de domeinobjecten Activity- en Agent-nodes en
relevante relaties bevatten wanneer deze provenance-informatie deel uitmaakt
van het resultaat. Welke provenance-objecten worden opgenomen, hangt af van
de informatievraag en de beschikbare gegevens. Dit event construeert niet
opnieuw de oorspronkelijke beschikbaarstellingsgebeurtenis.

#### Identifiers en relaties

- Het CloudEvent `id` identificeert het event; `subject` identificeert de asynchrone informatievraag waarop het resultaat betrekking heeft.
- De `@id` van iedere graph-node identificeert het betreffende domeinobject of provenance-object.
- Verwijzingen tussen nodes moeten overeenkomen met de `@id` van de bedoelde node in dezelfde graaf, tenzij een verwijzing naar een extern geïdentificeerd object expliciet is toegestaan.
- Een resultaat kan nul, één of meer `UitkomstOverleg`-nodes bevatten.

#### Volledig voorbeeld

Dit voorbeeld bevat één gevonden Uitkomst Overleg. De voorbeeldwaarden zijn
fictief. De `soh:`-prefix wordt ook gebruikt voor de eigenschappen
`beschikbaarGesteldOp` en `inzageUrl` zodat deze als termen in de JSON-LD-context
zijn vastgelegd.

```json
{
  "specversion": "1.0",
  "id": "019b7a12-6c2d-7abc-8def-1234567890ab",
  "source": "urn:organisatie:voorbeeld:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat",
  "time": "2026-10-15T11:05:00Z",
  "subject": "<interactie-id>",
  "datacontenttype": "application/ld+json",
  "dataschema": "https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:uitkomst-overleg:12345",
        "@type": ["prov:Entity", "soh:UitkomstOverleg"],
        "soh:heeftBetrokkene": {"@id": "urn:betrokkene:67890"},
        "soh:beschikbaarGesteldOp": "2026-01-10",
        "soh:inzageUrl": "https://organisatie.example/inzage/uitkomst-overleg/12345"
      },
      {
        "@id": "urn:betrokkene:67890",
        "@type": "soh:Betrokkene",
        "soh:identificatieType": "BSN",
        "soh:identificatieWaarde": "123456789",
        "soh:woonplaats": "Deventer"
      }
    ]
  }
}
```

#### Aandachtspunten

- De concrete inhoud van de resultaatgraaf wordt bepaald door de informatievraag.
- Een resultaat kan geen `UitkomstOverleg`-nodes bevatten wanneer geen objecten aan de informatievraag voldoen.
- Het uitvoeren van een informatievraag geldt niet als inzage. Een daadwerkelijke raadpleging via de Inzage-API wordt als afzonderlijke activiteit vastgelegd.
- De eigenschappen `soh:beschikbaarGesteldOp` en `soh:inzageUrl` moeten worden afgestemd op de definitieve naamgeving in het informatiemodel. In dit concept zijn beide expliciet als `soh:`-termen geschreven zodat hun JSON-LD-betekenis vastligt.

## Relatie met generieke CloudEvents-afspraken

CloudEvents 1.0 bepaalt de generieke envelope. Deze specificatie legt daarbovenop aanvullende afspraken vast, zoals UUIDv7 voor `id` en het verplicht opnemen van `datacontenttype` en `dataschema`. Deze aanvullende verplichtingen gelden binnen deze samenwerkfunctie; ze mogen niet worden gelezen als algemene eisen die CloudEvents aan ieder event stelt. Het attribuut `time` is binnen deze samenwerkfunctie verplicht en bevat het registratietijdstip als RFC 3339-datumtijd.

## Informatiemodel

De Knowledge graph bevat domeinobjecten en provenance-informatie in één
samenhangend informatiemodel. PROV vormt daarbij geen afzonderlijk model
naast het domeinmodel, maar biedt een provenance-perspectief op de
objecten en activiteiten in de Knowledge graph.

Domeinconcepten worden waar relevant tevens getypeerd met een PROV-type.
Zo is een `UitkomstOverleg` zowel een `soh:UitkomstOverleg` als een
`prov:Entity`, is een `Organisatie` zowel een `soh:Organisatie` als een
`prov:Agent` en zijn `BeschikbaarStellenUitkomstOverleg` en
`InzienUitkomstOverleg` zowel domeinspecifieke concepten als
`prov:Activity`.

De PROV-typering beschrijft daarmee niet een tweede object naast het
domeinobject, maar een aanvullende semantische karakterisering van het
object binnen de provenance-graaf.

### Concepten

#### UitkomstOverleg

Type:

- `soh:UitkomstOverleg`;
- `prov:Entity`.

Het domeinobject dat via de Inzage-API beschikbaar wordt gesteld.

Eigenschappen:

- `identifier`;
- `beschikbaarGesteldOp`;
- `inzageUrl`.

#### Betrokkene

Type:

`soh:Betrokkene`

Een persoon of organisatie waarop een UitkomstOverleg betrekking heeft.

Een `Betrokkene` krijgt niet op grond van zijn rol als betrokkene
automatisch een PROV-typering. Wanneer een betrokkene zelf als actor
optreedt in een provenance-activiteit, kan hetzelfde domeinobject
daarnaast worden getypeerd als `prov:Agent`. De PROV-typering is in dat
geval dus afhankelijk van de rol die het object in de betreffende
provenance-graaf vervult.

Eigenschappen:

- `identifier`;
- `identificatieType`;
- `identificatieWaarde`;
- `woonplaats`.

De `identifier` identificeert het domeinobject `Betrokkene` in de Knowledge graph. Deze identifier staat los van de persoonsidentificatie, die bestaat uit een typering en een identificatiewaarde. De typering is een stabiele code, bijvoorbeeld `BSN` of `V-NUMMER`.

#### Organisatie

Type:

- `soh:Organisatie`;
- `prov:Agent`.

Organisatie die verantwoordelijk is voor een activiteit.

Eigenschappen:

- `identifier`;
- `naam`.

#### BeschikbaarStellenUitkomstOverleg

Type:

- `soh:BeschikbaarStellenUitkomstOverleg`;
- `prov:Activity`.

Activiteit waarbij een Uitkomst Overleg beschikbaar wordt gesteld.

Eigenschappen:

- `identifier`;
- `tijdstip` --- het tijdstip waarop de activiteit daadwerkelijk heeft
  plaatsgevonden.

#### InzienUitkomstOverleg

Type:

- `soh:InzienUitkomstOverleg`;
- `prov:Activity`.

Activiteit waarbij een Uitkomst Overleg wordt geraadpleegd.

Eigenschappen:

- `identifier`;
- `tijdstip` --- het tijdstip waarop de activiteit daadwerkelijk heeft
  plaatsgevonden;
- verantwoordelijke organisatie.

### Relaties


#### `soh:heeftBetrokkene`

Domeinrelatie waarmee een UitkomstOverleg aan een Betrokkene wordt
gerelateerd.

Deze relatie is nodig om informatievragen op Betrokkene te kunnen
beantwoorden. Binnen deze samenwerkfunctie kan de queryfunctionaliteit worden gebruikt
om Uitkomsten Overleg te zoeken waarbij een bepaalde Betrokkene betrokken is.
De relatie tussen `UitkomstOverleg` en `Betrokkene` moet daarom in de
Knowledge graph beschikbaar zijn.

#### `prov:wasAssociatedWith`

PROV-relatie tussen een activiteit en de verantwoordelijke organisatie.

Voor inzage:

``` text
Organisatie
    |
    | prov:wasAssociatedWith
    |
InzienUitkomstOverleg
```

#### `prov:used`

PROV-relatie waarbij een activiteit gebruikmaakt van een Entity.

Voor inzage:

``` text
InzienUitkomstOverleg
    |
    | prov:used
    |
UitkomstOverleg
```

### Overzicht informatiemodel

| Concept | Type | PROV-typering | Belangrijkste eigenschappen |
|---|---|---|---|
| UitkomstOverleg | `soh:UitkomstOverleg` | `prov:Entity` | identifier, beschikbaarGesteldOp, inzageUrl |
| Betrokkene | `soh:Betrokkene` | `prov:Agent`¹ | identifier, identificatieType, identificatieWaarde, woonplaats |
| Organisatie | `soh:Organisatie` | `prov:Agent` | identifier, naam |
| BeschikbaarStellenUitkomstOverleg | `soh:BeschikbaarStellenUitkomstOverleg` | `prov:Activity` | identifier, tijdstip |
| InzienUitkomstOverleg | `soh:InzienUitkomstOverleg` | `prov:Activity` | identifier, tijdstip |

¹ Een `Betrokkene` is niet intrinsiek een `prov:Agent`. Wanneer de
betrokkene zelf als actor optreedt in een provenance-activiteit, krijgt
het betreffende domeinobject ook de typering `prov:Agent`.

## Informatievragen

### Vooraf gedefinieerde informatievragen

Binnen deze samenwerkfunctie worden informatievragen vooraf gedefinieerd.
De queryfunctionaliteit ondersteunt in ieder geval de volgende informatievragen:

- zoeken naar beschikbare Uitkomsten Overleg;
- zoeken op Betrokkene;
- zoeken op beschikbaarheidsdatum.

De concrete structuur van de informatievraag wordt vastgelegd in de
technische API-specificatie van de samenwerkfunctie.

#### Foutafhandeling

HTTP-foutresponses volgen de NLGov REST API Design Rules en gebruiken
`application/problem+json` met de verplichte velden `status`, `title` en
`detail`. Een ongeldige informatievraag resulteert in `400 Bad Request`.
Deze response bevat daarnaast een `errors`-lijst met de toepasselijke
validatiefouten, conform de ADR.

Een fout tijdens de asynchrone verwerking nadat de informatievraag is
geaccepteerd, is geen HTTP-fout van de oorspronkelijke aanvraag. De initiator
raadpleegt daarvoor de interactieresource; de representatie van deze verwerkingsfout
is beschreven in de generieke specificatie voor asynchrone interacties.

### Zoeken op beschikbaarheidsdatum

Een deelnemer kan bijvoorbeeld vragen:

> Geef de Uitkomsten Overleg die vanaf 1 januari 2026 beschikbaar zijn
> gesteld.

Voorbeeld request:

``` json
{
  "beschikbaarVanaf": "2026-01-01T00:00:00Z"
}
```

### Zoeken op Betrokkene

Een deelnemer kan bijvoorbeeld vragen:

> Geef de Uitkomsten Overleg waarbij Betrokkene X betrokken is.

Voorbeeld request:

``` json
{
  "betrokkeneIdentificatie": {
    "identificatieType": "BSN",
    "identificatie": "123456789"
  }
}
```

Een deelnemer kan ook zoeken naar Uitkomsten Overleg waarbij een betrokkene
woont in een bepaalde woonplaats. De woonplaats wordt als tekstuele eigenschap
`soh:woonplaats` bij de `Betrokkene` vastgelegd.

Voorbeeld request:

``` json
{
  "betrokkeneWoonplaats": "Deventer"
}
```

Bij het vergelijken van de zoekwaarde met de opgeslagen woonplaats wordt geen
onderscheid gemaakt tussen hoofdletters en kleine letters. Zo leveren
`Deventer`, `deventer` en `DEVENTER` dezelfde zoekresultaten op. Andere
verschillen, zoals spaties of afwijkende schrijfwijzen, worden hiermee niet
genegeerd.

### Resultaat van een informatievraag

Een informatievraag wordt asynchroon verwerkt. Na acceptatie ontvangt de
initiator een `interactieId`. Met dit `interactieId` kan de initiator via de
interactieresource de verwerking volgen.

Wanneer de status `OK` is, wordt het queryresultaat via `GET /interacties/{interactieId}/resultaat`
opgevraagd. De resultaatresource retourneert het queryresultaat als een
CloudEvent.

Bijvoorbeeld:

``` http
GET https://<host>/api/interacties/<interactie-id>/resultaat
```

``` http
HTTP/1.1 200 OK
Content-Type: application/cloudevents+json
```

De response-body bevat vervolgens het CloudEvent met de PROV-JSON-LD-
resultaatgraaf.

Binnen deze samenwerkfunctie kan een informatievraag geen, één of
meerdere Uitkomsten Overleg opleveren. Elke gevonden Uitkomst Overleg
wordt als afzonderlijke `soh:UitkomstOverleg`-node in dezelfde
resultaatgraaf opgenomen. Als geen Uitkomsten Overleg aan de
informatieaanvraag voldoen, bevat de resultaatgraaf geen
`soh:UitkomstOverleg`-nodes.

Een resultaatgraaf bevat bij een opgenomen `Betrokkene` de persoonsidentificatie
als combinatie van typering en identificatiewaarde en de woonplaats als
`soh:woonplaats`. Daarmee kan een afnemer de identificatie en woonplaats van
de betrokkene interpreteren, terwijl de `@id` van de Betrokkene de identifier
van het object in de Knowledge graph blijft. De resultaatgraaf kan daarnaast, waar relevant,
een `inzageUrl` bevatten waarmee de inhoudelijke resource via de Inzage-API kan
worden geraadpleegd. De precieze omvang en structuur zijn afhankelijk van de
informatievraag.

Het uitvoeren van een informatievraag geldt niet als inzage in een Uitkomst
Overleg. Een queryresultaat geeft aan welke informatie beschikbaar is en kan
een verwijzing bevatten naar de inhoudelijke resource. Wanneer een deelnemer
vervolgens de inhoudelijke Uitkomst Overleg via de Inzage-API raadpleegt,
wordt deze inzage als afzonderlijke activiteit vastgelegd.

Voorbeeld van een queryresultaat:

``` json
{
  "specversion": "1.0",
  "id": "123e4567-e89b-42d3-a456-426614174006",
  "source": "urn:organisatie:voorbeeld:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat",
  "time": "2026-01-10T12:05:00Z",
  "subject": "<interactie-id>",
  "datacontenttype": "application/ld+json",
  "dataschema": "https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:uitkomst-overleg:12345",
        "@type": [
          "prov:Entity",
          "soh:UitkomstOverleg"
        ],
        "soh:heeftBetrokkene": {
          "@id": "urn:betrokkene:67890"
        },
        "beschikbaarGesteldOp": "2026-01-10",
        "inzageUrl": "https://organisatie.example/inzage/uitkomst-overleg/12345"
      },
      {
        "@id": "urn:betrokkene:67890",
        "@type": "soh:Betrokkene",
        "soh:identificatieType": "BSN",
        "soh:identificatieWaarde": "123456789",
        "soh:woonplaats": "Deventer"
      }
    ]
  }
}
```

Dit voorbeeld laat alleen de generieke structuur van een queryresultaat
zien. De precieze resultaatgraaf wordt bepaald door de informatievraag en
kan naast domeinobjecten ook activiteiten, actoren en relevante relaties
bevatten.

## Validatie en aanvullende afspraken

### Validatie van de CloudEvent payload

Het attribuut `data` van de CloudEvents binnen deze samenwerkfunctie
bevat een PROV-JSONLD-graaf. De structurele vorm van deze payload wordt
beschreven met het [PROV-JSON-LD JSON
Schema](jsonschema/prov-jsonld.schema.json).

Het schema controleert onder andere de aanwezigheid van `@context` en
`@graph`, de structuur van de graafelementen en de aanwezigheid van de
generieke PROV-typen `prov:Entity`, `prov:Activity` en `prov:Agent`.

Het schema is bedoeld voor structurele validatie. Het controleert niet
de volledige semantische samenhang van de provenance-graaf. Semantische
validatie, bijvoorbeeld met SHACL, kan in een toekomstige uitbreiding
worden toegevoegd.

In het CloudEvent wordt het schema aangewezen met het attribuut
`dataschema`:

``` text
https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json
```

### InzageUrl

Een resultaat van een informatievraag kan een `inzageUrl` bevatten.

De `inzageUrl` verwijst naar de resource Uitkomst Overleg die via de
inzage-API kan worden geraadpleegd.

De opbouw bestaat uit:

-   het basisadres van de Inzage-API;
-   het pad naar het resource-type;
-   de identifier van de UitkomstOverleg-resource.

Voorbeeld:

``` text
https://organisatie.example/inzage/uitkomst-overleg/{identifier}
```

De identifier wordt gebruikt voor:

-   identificatie van de resource;
-   verwijzingen vanuit de Knowledge graph;
-   provenance-relaties.

De `inzageUrl` is geen zelfstandige identificatie, maar een technische
verwijzing naar de resource.

---
