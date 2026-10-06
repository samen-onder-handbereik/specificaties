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

De generieke wijze waarop asynchrone interacties, CloudEvents, status en
resultaten technisch worden uitgewisseld, is beschreven in het generieke
patroon voor asynchrone interacties. Deze specificatie beschrijft de
domeinspecifieke invulling voor Uitkomst Overleg.


## CloudEvents

Binnen deze samenwerkfunctie zijn onder andere de volgende
gebeurtenissen relevant.

### Uitkomst beschikbaar gesteld

Eventtype:

`nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`

Dit event geeft aan dat een Uitkomst Overleg beschikbaar is gesteld.

### Uitkomst ingezien

Eventtype:

`nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-ingezien`

Dit event geeft aan dat een Uitkomst Overleg is geraadpleegd.

### Uitkomst Overleg queryresultaat

Eventtype:

`nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat`

Dit event bevat het resultaat van een informatievraag. Het resultaat wordt
na succesvolle asynchrone verwerking via de Resultaat-API opgevraagd. Het
CloudEvent bevat in `data` de PROV-JSON-LD-graaf met het queryresultaat en
de beschikbare provenance.

Voor dit CloudEvent geldt:

| Attribuut | Betekenis |
|---|---|
| `type` | `nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat` |
| `subject` | Het `interactieId` van de asynchrone informatievraag waarop het resultaat betrekking heeft. |
| `data` | De PROV-JSON-LD-graaf die het queryresultaat representeert. |

Het event reconstrueert niet de oorspronkelijke gebeurtenis waarmee de
gevonden informatie beschikbaar is gesteld.

Vast uitgangspunt:

De organisatie die een Uitkomst Overleg inziet wordt altijd vastgelegd.

## CloudEvent payload en PROV-JSONLD

Het attribuut `data` van het CloudEvent bevat een PROV-JSONLD-graaf.

De payload bevat minimaal:

-   een Entity;
-   een Activity;
-   een Agent.

De inhoudelijke gegevens van de Uitkomst Overleg maken geen onderdeel
uit van de CloudEvent payload.

Het attribuut `time` van het CloudEvent geeft het tijdstip aan waarop de
gebeurtenis is geregistreerd. Het `tijdstip` van de bijbehorende
provenance- Activity geeft, indien beschikbaar, het tijdstip aan waarop
de activiteit daadwerkelijk heeft plaatsgevonden. Deze tijdstippen
kunnen van elkaar verschillen.

In de voorbeelden hieronder identificeert het CloudEvent-attribuut
`source` het systeem dat de gebeurtenis registreert en het CloudEvent
publiceert. Dit hoeft niet dezelfde partij te zijn als de organisatie die
de activiteit heeft uitgevoerd. Die partij wordt in de provenance-graaf
als `prov:Agent` opgenomen.

### Voorbeeld: Uitkomst beschikbaar gesteld

``` json
{
  "specversion": "1.0",
  "id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
  "source": "urn:nld:oin:00000001823288444000:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld",
  "time": "2026-01-10T12:00:00Z",
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
        "prov:wasGeneratedBy": {
          "@id": "urn:activity:beschikbaarstellen:12345"
        }
      },
      {
        "@id": "urn:activity:beschikbaarstellen:12345",
        "@type": [
          "prov:Activity",
          "soh:BeschikbaarStellenUitkomstOverleg"
        ],
        "tijdstip": "2026-01-10T12:00:00Z",
        "prov:wasAssociatedWith": {
          "@id": "urn:organisatie:voorbeeld"
        }
      },
      {
        "@id": "urn:nld:oin:00000001823288444000",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ]
      }
    ]
  }
}
```

### Voorbeeld: Uitkomst ingezien

``` json
{
  "specversion": "1.0",
  "id": "urn:uuid:987e6543-e21b-12d3-a456-426614174999",
  "source": "urn:nld:oin:00000001823288444000:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-ingezien",
  "time": "2026-01-11T09:30:00Z",
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
        "@type": [
          "prov:Activity",
          "soh:InzienUitkomstOverleg"
        ],
        "tijdstip": "2026-01-11T09:30:00Z",
        "prov:used": {
          "@id": "urn:uitkomst-overleg:12345"
        },
        "prov:wasAssociatedWith": {
          "@id": "urn:organisatie:raadpleger"
        }
      },
      {
        "@id": "urn:uitkomst-overleg:12345",
        "@type": [
          "prov:Entity",
          "soh:UitkomstOverleg"
        ]
      },
      {
        "@id": "urn:nld:kvknr:09220932",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ]
      }
    ]
  }
}
```

In dit voorbeeld meldt het systeem `urn:nld:oin:00000001823288444000:systeem:uitkomstoverleg`
dat de UitkomstOverleg is ingezien. De organisatie die de inzage
daadwerkelijk heeft uitgevoerd, wordt in de provenance-graaf
geïdentificeerd als `urn:nld:kvknr:09220932` en is daar getypeerd als
`prov:Agent`.

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

Het domeinobject dat via de inzage-API beschikbaar wordt gesteld.

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
- `type`.

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

#### `prov:wasGeneratedBy`

PROV-relatie tussen een Entity en de activiteit waardoor deze is ontstaan.

De exacte toepassing op beschikbaarstelling wordt nog vastgesteld.

### Overzicht informatiemodel

| Concept | Type | PROV-typering | Belangrijkste eigenschappen |
|---|---|---|---|
| UitkomstOverleg | `soh:UitkomstOverleg` | `prov:Entity` | identifier, beschikbaarGesteldOp, inzageUrl |
| Betrokkene | `soh:Betrokkene` | `prov:Agent`¹ | identifier, type |
| Organisatie | `soh:Organisatie` | `prov:Agent` | identifier, naam |
| BeschikbaarStellenUitkomstOverleg | `soh:BeschikbaarStellenUitkomstOverleg` | `prov:Activity` | identifier, tijdstip |
| InzienUitkomstOverleg | `soh:InzienUitkomstOverleg` | `prov:Activity` | identifier, tijdstip |

¹ Een `Betrokkene` is niet intrinsiek een `prov:Agent`. Wanneer de
betrokkene zelf als actor optreedt in een provenance-activiteit, krijgt
het betreffende domeinobject ook de typering `prov:Agent`.

## Informatievragen

### Vooraf gedefinieerde informatievragen

Binnen deze samenwerkfunctie worden informatievragen vooraf gedefinieerd.
De Query-API ondersteunt in ieder geval de volgende informatievragen:

- zoeken naar beschikbare Uitkomsten Overleg;
- zoeken op Betrokkene;
- zoeken op beschikbaarheidsdatum.

De concrete structuur van de informatievraag wordt vastgelegd in de
technische API-specificatie van de samenwerkfunctie.

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
  "betrokkeneIdentifier": "urn:betrokkene:67890"
}
```

### Resultaat van een informatievraag

Een informatievraag wordt asynchroon verwerkt. Na acceptatie ontvangt de
initiator een `interactieId`. Met dit `interactieId` kan de initiator via de
Status-API de verwerking volgen.

Wanneer de status `OK` is, wordt het queryresultaat via de Resultaat-API
opgevraagd. De Resultaat-API retourneert het queryresultaat als een
CloudEvent.

Bijvoorbeeld:

``` http
GET https://<host>/api/resultaat/<interactie-id>
```

``` http
HTTP/1.1 200 OK
Content-Type: application/cloudevents+json
```

De response-body bevat vervolgens het CloudEvent met de PROV-JSON-LD-
resultaatgraaf.

Een resultaatgraaf kan identificerende gegevens en, waar relevant, een
`inzageUrl` bevatten waarmee de inhoudelijke resource via de inzage-API kan
worden geraadpleegd. De precieze omvang en structuur van de resultaatgraaf
worden bepaald door de informatievraag.

Voorbeeld van een queryresultaat:

``` json
{
  "specversion": "1.0",
  "id": "urn:uuid:query-resultaat-12345",
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
        "beschikbaarGesteldOp": "2026-01-10",
        "inzageUrl": "https://organisatie.example/inzage/uitkomst-overleg/12345"
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

Een resultaat van de Query-API kan een `inzageUrl` bevatten.

De `inzageUrl` verwijst naar de resource Uitkomst Overleg die via de
inzage-API kan worden geraadpleegd.

De opbouw bestaat uit:

-   het basisadres van de inzage-API;
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
