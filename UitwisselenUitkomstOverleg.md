# Uitwisselen Uitkomst Overleg

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

Een queryresultaat bevat identificerende gegevens en een `inzageUrl`
waarmee de inhoudelijke resource via de inzage-API kan worden
geraadpleegd.

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

## InzageUrl

Een resultaat van de Query-API bevat een `inzageUrl`.

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

## CloudEvents

Binnen deze samenwerkfunctie zijn onder andere de volgende
gebeurtenissen relevant.

### Uitkomst beschikbaar gesteld

Eventtype:

`uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`

Dit event geeft aan dat een Uitkomst Overleg beschikbaar is gesteld.

### Uitkomst ingezien

Eventtype:

`uitwisselen-uitkomst-overleg.uitkomst-ingezien`

Dit event geeft aan dat een Uitkomst Overleg is geraadpleegd.

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
-   `beschikbaarSinds`;
-   `inzageUrl`.

### Betrokkene

Type:

`soh:Betrokkene`

Een persoon of organisatie waarop een Uitkomst Overleg betrekking heeft.

Eigenschappen:

-   `identifier`;
-   `type`.

## Provenance-concepten

### BeschikbaarStellenUitkomst

Type:

`soh:BeschikbaarStellenUitkomst`

Activiteit waarbij een Uitkomst Overleg beschikbaar wordt gesteld.

Eigenschappen:

-   `identifier`;
-   `tijdstip`.

### InzienUitkomst

Type:

`soh:InzienUitkomst`

Activiteit waarbij een Uitkomst Overleg wordt geraadpleegd.

Eigenschappen:

-   `identifier`;
-   `tijdstip`;
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
| Uitkomst Overleg | `soh:UitkomstOverleg` | identifier, beschikbaarSinds, inzageUrl |
| Betrokkene | `soh:Betrokkene` | identifier, type |
| Organisatie | `soh:Organisatie` | identifier, naam |
| BeschikbaarStellenUitkomst | `soh:BeschikbaarStellenUitkomst` | identifier, tijdstip |
| InzienUitkomst | `soh:InzienUitkomst` | identifier, tijdstip |

## Relaties

### `soh:betrokkenBij`

Domeinrelatie tussen Betrokkene en UitkomstOverleg.

### `prov:wasAssociatedWith`

Relatie tussen activiteit en verantwoordelijke organisatie.

Voor inzage:

``` text
Organisatie
    |
    | prov:wasAssociatedWith
    |
InzienUitkomst
```

### `prov:used`

Relatie waarbij een activiteit gebruikmaakt van een Entity.

Voor inzage:

``` text
InzienUitkomst
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
  "beschikbaarSinds": "2026-01-01"
}
```

### Query-resultaat

``` json
{
  "resultaten": [
    {
      "identifier": "urn:uitkomst-overleg:12345",
      "beschikbaarSinds": "2026-01-10",
      "inzageUrl": "https://organisatie.example/inzage/uitkomst-overleg/12345"
    }
  ]
}
```

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
  "source": "urn:organisatie:voorbeeld",
  "type": "uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld",
  "time": "2026-01-10T12:00:00Z",
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
        ]
      },
      {
        "@id": "urn:activity:beschikbaarstellen:12345",
        "@type": [
          "prov:Activity",
          "soh:BeschikbaarStellenUitkomst"
        ],
        "prov:wasGeneratedBy": {
          "@id": "urn:activity:beschikbaarstellen:12345"
        },
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
  "source": "urn:organisatie:raadpleger",
  "type": "uitwisselen-uitkomst-overleg.uitkomst-ingezien",
  "time": "2026-01-11T09:30:00Z",
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
          "soh:InzienUitkomst"
        ],
        "prov:used": {
          "@id": "urn:uitkomst-overleg:12345"
        },
        "prov:wasAssociatedWith": {
          "@id": "urn:organisatie:raadpleger"
        }
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

## Beheer van verdere ontwikkeling

Openstaande ontwikkelpunten, besluitpunten en verdere uitwerking van het ontwerp worden bijgehouden buiten deze specificatie, bijvoorbeeld in `Backlog.md`.

Deze specificatie beschrijft de vastgestelde werking, het gegevensmodel, de interacties en voorbeelden van de samenwerkfunctie.
