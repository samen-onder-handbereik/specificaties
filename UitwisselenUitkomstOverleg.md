## Inleiding

Deze specificatie beschrijft de samenwerkfunctie **Uitwisselen Uitkomst
Overleg**.

De samenwerkfunctie ondersteunt het beschikbaar stellen, vinden en
raadplegen van Uitkomsten Overleg tussen ketenpartners.

De oplossing bestaat uit drie samenhangende onderdelen:

-   de inzage-API waarmee de inhoudelijke gegevens van een Uitkomst
    Overleg beschikbaar worden gesteld;
-   de Query-API waarmee deelnemers beschikbare Uitkomsten Overleg
    kunnen vinden;
-   CloudEvents waarmee gebeurtenissen rondom Uitkomsten Overleg worden
    gemeld.

CloudEvents bevatten niet de volledige inhoud van een Uitkomst Overleg.
Zij bevatten informatie die nodig is voor notificatie, provenance,
auditing en het opbouwen van een Knowledge graph.

## Architectuur en samenhang

De verschillende onderdelen hebben ieder een eigen verantwoordelijkheid.

### Inzage-API

De inzage-API is de bron voor de inhoudelijke gegevens van een Uitkomst
Overleg.

### Query-API

De Query-API ondersteunt informatievragen over beschikbare Uitkomsten
Overleg.

Een queryresultaat wordt teruggegeven als een CloudEvent. De `data` van
dit CloudEvent bevat een PROV-JSON-LD-graaf die het resultaat van de
informatievraag representeert.

De resultaatgraaf kan identificerende gegevens en, waar relevant, een
`inzageUrl` bevatten waarmee de inhoudelijke resource via de inzage-API
kan worden geraadpleegd. De precieze omvang en structuur van de
resultaatgraaf worden bepaald door de informatievraag.

### CloudEvents

CloudEvents beschrijven gebeurtenissen rondom een Uitkomst Overleg,
zoals:

-   het beschikbaar stellen van een Uitkomst Overleg;
-   het inzien van een Uitkomst Overleg.

Het aanbieden van CloudEvents en het volgen van verwerking zijn
generieke functies. Deze worden beschreven in het generieke asynchrone
interactiepatroon.

## API's

### Inzage-API

De inzage-API biedt de resource Uitkomst Overleg beschikbaar.

De OpenAPI-specificatie is opgenomen in:

`UitwisselenUitkomstOverleg.yaml`

### Query-API

De Query-API ondersteunt onder andere:

-   zoeken naar beschikbare Uitkomsten Overleg;
-   zoeken op Betrokkene;
-   zoeken op beschikbaarheidsdatum.

### HTTP-mediatype van het queryresultaat

Het resultaat van de Query-API wordt als een CloudEvent teruggegeven. De
volledige HTTP-response-body is daarmee het CloudEvent. Het HTTP-mediatype
is `application/cloudevents+json`.

Het CloudEvent-attribuut `datacontenttype` beschrijft vervolgens het
mediatype van de inhoud van `data`. Voor de PROV-JSON-LD-graaf is dit
`application/ld+json`.

Het onderscheid is daarmee:

- HTTP `Content-Type: application/cloudevents+json` — de volledige
  HTTP-response-body is het CloudEvent;
- CloudEvent `datacontenttype: application/ld+json` — het attribuut `data`
  bevat de PROV/JSON-LD-graaf.

## InzageUrl

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

## Aansluiting op het generieke model

Deze samenwerkfunctie-specifieke specificatie werkt de generieke
specificaties uit voor het domein Uitkomst Overleg.

Het generieke asynchrone interactiepatroon beschrijft hoe CloudEvents,
interacties, statussen en queryresultaten technisch worden uitgewisseld.
Het Knowledge graph-model beschrijft de semantische structuur van de
Knowledge graph. De Graph Build Specification beschrijft de generieke
regels voor het opbouwen van de graph. Deze specificatie bepaalt de
concrete domeinspecifieke typen, activiteiten, relaties en mappings voor
Uitkomst Overleg.

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

Dit event is het antwoordformaat van de Query-API. Het CloudEvent bevat in
`data` de PROV/JSON-LD-graaf met het queryresultaat en de beschikbare
provenance. Het event reconstrueert niet de oorspronkelijke gebeurtenis
waarmee de gevonden informatie beschikbaar is gesteld.

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

## Validatie van de CloudEvent payload

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

## Conceptueel graphmodel

De Knowledge graph bevat zowel domeinobjecten als provenance-objecten.

Er wordt onderscheid gemaakt tussen:

-   domeinconcepten die de betekenis van informatie beschrijven;
-   provenance-concepten die beschrijven hoe informatie is ontstaan,
    beschikbaar gesteld en gebruikt.

## Domeinconcepten

### UitkomstOverleg

Type:

`soh:UitkomstOverleg`

De inhoudelijke resource die via de inzage-API beschikbaar wordt
gesteld.

Eigenschappen:

-   `identifier`;
-   `beschikbaarGesteldOp`;
-   `inzageUrl`.

### Betrokkene

Type:

`soh:Betrokkene`

Een persoon of organisatie waarop een Uitkomst Overleg betrekking heeft.

Eigenschappen:

-   `identifier`;
-   `type`.

## Provenance-concepten

### BeschikbaarStellenUitkomstOverleg

Type:

`soh:BeschikbaarStellenUitkomstOverleg`

Activiteit waarbij een Uitkomst Overleg beschikbaar wordt gesteld.

Eigenschappen:

-   `identifier`;
-   `tijdstip` --- het tijdstip waarop de activiteit daadwerkelijk heeft
    plaatsgevonden.

### InzienUitkomstOverleg

Type:

`soh:InzienUitkomstOverleg`

Activiteit waarbij een Uitkomst Overleg wordt geraadpleegd.

Eigenschappen:

-   `identifier`;
-   `tijdstip` --- het tijdstip waarop de activiteit daadwerkelijk heeft
    plaatsgevonden;
-   verantwoordelijke organisatie.

### Organisatie

Type:

`soh:Organisatie`

Organisatie die verantwoordelijk is voor een activiteit.

Eigenschappen:

-   `identifier`;
-   `naam`.

## Overzicht graphmodel

| Node | Type | Belangrijkste eigenschappen |
|---|---|---|
| Uitkomst Overleg | `soh:UitkomstOverleg` | identifier, beschikbaarGesteldOp, inzageUrl |
| Betrokkene | `soh:Betrokkene` | identifier, type |
| Organisatie | `soh:Organisatie` | identifier, naam |
| BeschikbaarStellenUitkomstOverleg | `soh:BeschikbaarStellenUitkomstOverleg` | identifier, tijdstip |
| InzienUitkomstOverleg | `soh:InzienUitkomstOverleg` | identifier, tijdstip |

## Relaties

### `soh:heeftBetrokkene`

Domeinrelatie waarmee een UitkomstOverleg aan een Betrokkene wordt
gerelateerd.

### `prov:wasAssociatedWith`

Relatie tussen activiteit en verantwoordelijke organisatie.

Voor inzage:

``` text
Organisatie
    |
    | prov:wasAssociatedWith
    |
InzienUitkomstOverleg
```

### `prov:used`

Relatie waarbij een activiteit gebruikmaakt van een Entity.

Voor inzage:

``` text
InzienUitkomstOverleg
    |
    | prov:used
    |
UitkomstOverleg
```

### `prov:wasGeneratedBy`

Relatie tussen Entity en activiteit waardoor deze is ontstaan.

De exacte toepassing op beschikbaarstelling wordt nog vastgesteld.

## Voorbeelden

De voorbeelden maken zichtbaar hoe de verschillende onderdelen van de
samenwerkfunctie samenwerken:

-   Query-API voor het vinden van beschikbare Uitkomsten Overleg;
-   inzage-API voor het raadplegen van de inhoudelijke resource;
-   CloudEvents voor het melden van gebeurtenissen;
-   PROV-JSONLD voor provenance-informatie.

### Query-vraag

Een deelnemer kan bijvoorbeeld vragen:

> Geef de Uitkomsten Overleg die vanaf 1 januari 2026 beschikbaar zijn
> gesteld.

Voorbeeld request:

``` json
{
  "beschikbaarVanaf": "2026-01-01T00:00:00Z"
}
```

### Query-resultaat

Het resultaat van een informatievraag wordt teruggegeven als een
CloudEvent. De `data` bevat de PROV-JSON-LD-graaf van het resultaat.

Bijvoorbeeld:

``` json
{
  "specversion": "1.0",
  "id": "urn:uuid:query-resultaat-12345",
  "source": "urn:organisatie:voorbeeld:systeem:uitkomstoverleg",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat",
  "time": "2026-01-10T12:05:00Z",
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

Dit voorbeeld laat alleen de generieke structuur zien. De precieze
resultaatgraaf wordt bepaald door de informatievraag en kan naast
domeinobjecten ook activiteiten, actoren en relevante relaties bevatten.

### Query op Betrokkene

Voorbeeld informatievraag:

> Geef de Uitkomsten Overleg waarbij Betrokkene X betrokken is.

Voorbeeld request:

``` json
{
  "betrokkeneIdentifier": "urn:betrokkene:67890"
}
```

### CloudEvent: Uitkomst beschikbaar gesteld

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
        "@id": "urn:organisatie:voorbeeld",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ]
      }
    ]
  }
}
```

### CloudEvent: Uitkomst ingezien

``` json
{
  "specversion": "1.0",
  "id": "urn:uuid:987e6543-e21b-12d3-a456-426614174999",
  "source": "urn:nld:kvknr:09220932:systeem:uitkomstoverleg",
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
        "@id": "urn:organisatie:raadpleger",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ]
      }
    ]
  }
}
```
