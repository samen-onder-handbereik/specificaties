## Inleiding

## Doel en scope

Deze specificatie beschrijft de samenwerkfunctie Uitwisselen Uitkomst
Overleg.

De samenwerkfunctie ondersteunt het beschikbaar stellen, vinden en
raadplegen van Uitkomsten Overleg tussen ketenpartners.

Onder een *Uitkomst Overleg* wordt verstaan: de vastlegging van wat in een
Casusoverleg is besproken en besloten, inclusief een overzicht van de concrete
besluiten en acties. De Uitkomst Overleg hoeft geen eigen identifier te hebben.
Waar een identifier wordt uitgewisseld, gaat het om de identifier van het
Casusoverleg zelf, zoals die bekend is in het zaaksysteem van de organisatie
die de vastlegging beschikbaar stelt.

CloudEvents bevatten niet de volledige inhoud van een Uitkomst Overleg.
Zij bevatten informatie die nodig is voor notificatie, provenance, auditing
en het opbouwen van een Knowledge graph. De volledige inhoud van een Uitkomst
Overleg kan via de Inzage-API worden geraadpleegd.

Voor deze samenwerkfunctie geldt als overgangsafspraak dat het event ook de
Zaak-identificatie aanlevert die nodig is om het Casusoverleg aan de betreffende
Zaak te relateren. De structurele verantwoordelijkheid voor het aanleveren
van die relatie ligt uiteindelijk bij de samenwerkfunctie Overleggen over de
casus, omdat die samenwerkfunctie daarvoor de meest logische plek is.

### Inzage-API

De Inzage-API biedt toegang tot de volledige inhoud van een Uitkomst Overleg. De Inzage-API wordt gebruikt wanneer een deelnemer de inhoudelijke Uitkomst Overleg daadwerkelijk wil raadplegen.

De Inzage-API maakt onderdeel uit van de specificatie van de samenwerkfunctie. Een implementatie van de Inzage-API moet voldoen aan de door Samen Onder Handbereik gedefinieerde [OpenAPI-specificatie UitkomstOverleg.yaml](yaml/UitkomstOverleg.yaml) ([interactief bekijken](api.html?spec=UitkomstOverleg) · [openen in Swagger Editor](https://editor.swagger.io/?url=https://samen-onder-handbereik.github.io/specificaties/yaml/UitkomstOverleg.yaml)).

<details class="soh-api" data-spec="UitkomstOverleg"><summary>API Uitkomst Overleg interactief bekijken</summary></details>

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
| `subject` | Neem de identifier op van het Casusoverleg waarop de vastgelegde Uitkomst Overleg betrekking heeft, zoals die bekend is in het zaaksysteem van de organisatie die de vastlegging beschikbaar stelt. Dit is niet de technische `@id` van de graph-node en ook geen afzonderlijke identifier van de vastlegging. |
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
- `Betrokkene` waarop de Uitkomst Overleg betrekking heeft;
- `Casusoverleg` waarop de vastlegging betrekking heeft;
- `Zaak` waarop het Casusoverleg betrekking heeft, zodat de relatie met de Zaak
  kan worden vastgelegd.

Elk object heeft een eigen `@id`, die de node in de Knowledge graph identificeert. Verwijzingen tussen nodes gebruiken
`{"@id": "<identifier>"}` en moeten overeenkomen met de `@id` van het
bedoelde object in de graph.

#### Graph-objecten en relaties

##### UitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de Uitkomst Overleg in de Knowledge graph identificeert. |
| `@type` | Verplicht: zowel `prov:Entity` als `soh:UitkomstOverleg`. |
| `soh:hoortBijCasusoverleg` | Verplicht. Verwijst naar de opgenomen `Casusoverleg`-node waarop deze vastlegging betrekking heeft. |
| `soh:heeftBetrokkene` | Verplicht. Verwijst naar de opgenomen Betrokkene-node. |
| `soh:UitkomstOverleg.beschikbaarGesteldOp` | Optioneel. Het tijdstip/de datum waarop deze Uitkomst Overleg beschikbaar is gesteld, als RFC 3339-datumtijd. Als ook `soh:BeschikbaarStellenUitkomstOverleg.tijdstip` is opgenomen bij de activiteit, beschrijven beide eigenschappen hetzelfde beschikbaarstellingsmoment. |


`prov:wasGeneratedBy` wordt hier bewust niet gebruikt: die relatie zou
suggereren dat de beschikbaarstellingsactiviteit de Uitkomst Overleg heeft
gegenereerd. Het gaat om een reeds bestaande Uitkomst Overleg. Het verband
met de beschikbaarstellingsactiviteit wordt vastgelegd met de domeinrelatie
`soh:steltBeschikbaar`.

De volledige inhoud en `inzageUrl` zijn niet vereist in dit event. Een
`inzageUrl` kan deel uitmaken van een queryresultaat. De identifier van het
Casusoverleg wordt vastgelegd op de `Casusoverleg`-node, niet op de
`UitkomstOverleg`-node.

##### Casusoverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de node van het Casusoverleg in de Knowledge graph identificeert. |
| `@type` | Verplicht: `soh:Casusoverleg`; voeg `prov:Entity` toe wanneer het object in de betreffende provenance-graaf als Entity wordt gemodelleerd. |
| `soh:Casusoverleg.identifier` | Verplicht. Identifier waaronder het Casusoverleg bekend is in het zaaksysteem van de organisatie die de vastlegging beschikbaar stelt. Dit is niet de technische `@id` van de graph-node. |
| `soh:heeftBetrekkingOpZaak` | Verplicht binnen deze overgangsafspraak. Verwijst naar de opgenomen Zaak-node. |

##### Zaak

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de Zaak-node in de Knowledge graph identificeert. |
| `@type` | Verplicht: `soh:Zaak`; voeg `prov:Entity` toe wanneer het object in de betreffende provenance-graaf als Entity wordt gemodelleerd. |
| `soh:Zaak.identifier` | Verplicht voor dit event. De identificatie van de Zaak die nodig is om de relatie met het Casusoverleg vast te leggen. |

De relatie tussen Casusoverleg en Zaak wordt uiteindelijk aangeleverd door
Overleggen over de casus. Totdat die samenwerkfunctie deze relatie levert,
levert Uitwisselen Uitkomst Overleg de Zaak-identificatie aan. De graph-build
moet bestaande nodes en relaties hergebruiken om dubbele of tegenstrijdige
relaties te voorkomen.

##### BeschikbaarStellenUitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. Eigen URI die de provenance-activiteit identificeert. |
| `@type` | Verplicht: zowel `prov:Activity` als `soh:BeschikbaarStellenUitkomstOverleg`. |
| `soh:BeschikbaarStellenUitkomstOverleg.tijdstip` | Optioneel wanneer het daadwerkelijke tijdstip niet bekend of beschikbaar is. Indien aanwezig: RFC 3339-datumtijd en het tijdstip waarop de beschikbaarstellingsactiviteit plaatsvond. |
| `prov:wasAssociatedWith` | Verplicht. Verwijst naar de Organisatie-node die de activiteit heeft uitgevoerd. |
| `soh:steltBeschikbaar` | Verwijst naar de UitkomstOverleg-node die beschikbaar wordt gesteld. |


##### Organisatie

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. UUIDv7-URI die de Organisatie-node in de Knowledge graph identificeert. |
| `@type` | Verplicht: zowel `prov:Agent` als `soh:Organisatie`. |
| `soh:Organisatie.identificatieType` | Verplicht. Stabiele code voor het type organisatie-identificatienummer, bijvoorbeeld `OIN` of `KVK`. |
| `soh:Organisatie.identificatieWaarde` | Verplicht. Waarde van het organisatie-identificatienummer, weergegeven als string. |

De `@id` waarnaar `prov:wasAssociatedWith` verwijst, moet overeenkomen met
de `@id` van deze node. De combinatie van `identificatieType` en
`identificatieWaarde` maakt duidelijk om welk organisatie-identificatienummer
het gaat. Deze combinatie staat los van de technische `@id`. De organisatie
hoeft niet dezelfde te zijn als het systeem in het CloudEvent-attribuut
`source`.

##### Betrokkene

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die het Betrokkene-object in de Knowledge graph identificeert. Gebruik niet zonder afzonderlijke afspraak het BSN of een ander persoonsidentificatienummer als `@id`. |
| `@type` | Verplicht: `soh:Betrokkene`. Dit type maakt het object niet automatisch tot `prov:Agent`. |
| `soh:Betrokkene.identificatieType` | Optioneel. Opnemen wanneer identificatiegegevens noodzakelijk en toegestaan zijn. Stabiele code voor het type identificatienummer, bijvoorbeeld `BSN` of `V-NUMMER`. |
| `soh:Betrokkene.identificatieWaarde` | Optioneel. Alleen opnemen samen met `soh:Betrokkene.identificatieType`, wanneer identificatiegegevens noodzakelijk en toegestaan zijn. De waarde is een string. |
| `soh:Betrokkene.woonplaats` | Optioneel. Indien aanwezig, een tekstuele waarde. |

De `@id` identificeert het Betrokkene-object en staat los van de combinatie
van identificatietype en identificatiewaarde. Het opnemen van de Betrokkene-node
vereist niet automatisch dat ook persoonsidentificatie wordt verstrekt. Neem
persoonsgegevens alleen op voor zover dat noodzakelijk en toegestaan is. Als één
van de identificatie-eigenschappen wordt opgenomen, moeten beide aanwezig zijn.

#### Identifiers

Bij het uitwisselen en verwerken van gegevens worden verschillende identifiers
gebruikt. Ze hebben elk een eigen betekenis.

**1. Identificatie van het CloudEvent**

- `id`: identificeert het CloudEvent. In combinatie met `source` kan deze
  identifier worden gebruikt om dubbele verwerking van hetzelfde event te
  voorkomen.

**2. Identificatie van nodes in de Knowledge Graph**

De eigenschap `@id` identificeert een node in de Knowledge Graph. Dit geldt
voor onder meer:

- de Activity die de gebeurtenis vastlegt;
- de Entity die de Uitkomst Overleg representeert;
- de Agent die de betrokken Organisatie representeert;
- de node die de Betrokkene representeert.

De `@id` van een node is een technische identificatie binnen de Knowledge Graph
en is niet automatisch gelijk aan een identifier uit een bronsysteem.

**3. Identificatie van objecten in het bronsysteem**

Voor sommige objecten wordt daarnaast een identifier uit het bronsysteem
vastgelegd:

- `soh:Casusoverleg.identifier`: de identifier van het Casusoverleg in het
  zaaksysteem;
- `soh:Zaak.identifier`: de aangeleverde identificatie van de Zaak.

De Uitkomst Overleg heeft geen afzonderlijke externe identifier nodig. De
`@id` van de bijbehorende Entity dient uitsluitend om de node in de Knowledge
Graph technisch te identificeren.

#### Volledig voorbeeld

De URN's en waarden zijn fictief.

```json
{
  "specversion": "1.0",
  "id": "0199f0a0-1234-7abc-8def-012345678901",
  "source": "urn:organisatie:voorbeeld",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld",
  "time": "2026-10-15T10:30:00Z",
  "subject": "CO-2026-12345",
  "datacontenttype": "application/ld+json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e50",
        "@type": [
          "prov:Activity",
          "soh:BeschikbaarStellenUitkomstOverleg"
        ],
        "soh:BeschikbaarStellenUitkomstOverleg.tijdstip": "2026-10-15T10:30:00Z",
        "prov:wasAssociatedWith": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e52"
        },
        "soh:steltBeschikbaar": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e54"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e54",
        "@type": [
          "prov:Entity",
          "soh:UitkomstOverleg"
        ],
        "soh:heeftBetrokkene": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e55"
        },
        "soh:hoortBijCasusoverleg": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e56"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e56",
        "@type": [
          "prov:Entity",
          "soh:Casusoverleg"
        ],
        "soh:Casusoverleg.identifier": "CO-2026-12345",
        "soh:heeftBetrekkingOpZaak": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e57"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e57",
        "@type": [
          "prov:Entity",
          "soh:Zaak"
        ],
        "soh:Zaak.identifier": "ZAAK-2026-12345"
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e55",
        "@type": [
          "prov:Entity",
          "soh:Betrokkene"
        ],
        "soh:Betrokkene.identificatieType": "BSN",
        "soh:Betrokkene.identificatieWaarde": "123456789",
        "soh:Betrokkene.woonplaats": "Deventer"
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e52",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ],
        "soh:Organisatie.identificatieType": "OIN",
        "soh:Organisatie.identificatieWaarde": "00000000000000000000"
      }
    ]
  }
}
```

[Dit voorbeeld als graph bekijken](kennis-graph.html?voorbeeld=uitkomst-overleg/uitkomst-beschikbaar-gesteld)

#### Aandachtspunten

- Dit event registreert de beschikbaarstelling van een bestaande Uitkomst Overleg, niet de activiteit waarmee deze oorspronkelijk is gegenereerd.
- Interpreteer `soh:Betrokkene.identificatieType` en `soh:Betrokkene.identificatieWaarde` in samenhang. De `@id` van de `Betrokkene` identificeert het object in de Knowledge graph en is niet de persoonsidentificatie.

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
| `subject` | Neem de identifier op van het Casusoverleg waarop de ingeziene vastlegging betrekking heeft, zoals die bekend is in het zaaksysteem van de organisatie die de vastlegging beschikbaar stelt. Dit is niet de technische `@id` van de graph-node en ook geen afzonderlijke identifier van de vastlegging. |
| `datacontenttype` | Gebruik `application/ld+json`. CloudEvents vereist dit attribuut niet in alle gevallen; binnen deze samenwerkfunctie is het verplicht. |
| `dataschema` | Gebruik `https://samen-onder-handbereik.github.io/specificaties/jsonschema/prov-jsonld.schema.json`. Dit is een aanvullende afspraak voor deze samenwerkfunctie. |
| `data` | Neem een JSON-LD-document op met de graaf van de inzageactiviteit. |

#### Opbouw van `data`

`data` bevat `@context` met de prefixen `prov` en `soh` zoals hierboven
beschreven, en een `@graph`. De graph bevat minimaal:

- één `InzienUitkomstOverleg`-node;
- één `UitkomstOverleg`-node waarnaar de activiteit verwijst;
- één `Organisatie`-node die de inzage heeft uitgevoerd.

Elk object heeft een eigen `@id`, die de node in de Knowledge graph identificeert. Verwijzingen moeten overeenkomen met de
`@id` van het bedoelde object in de graph.

#### Graph-objecten en relaties

##### InzienUitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. Eigen URI die de inzageactiviteit identificeert. |
| `@type` | Verplicht: zowel `prov:Activity` als `soh:InzienUitkomstOverleg`. |
| `soh:InzienUitkomstOverleg.tijdstip` | Het daadwerkelijke tijdstip van inzage, als RFC 3339-datumtijd wanneer opgenomen. |
| `prov:used` | Verwijst naar de `UitkomstOverleg` die is ingezien. |
| `prov:wasAssociatedWith` | Verwijst naar de Organisatie die de inzage heeft uitgevoerd. |

##### UitkomstOverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de geraadpleegde Uitkomst Overleg identificeert. |
| `@type` | Verplicht: zowel `prov:Entity` als `soh:UitkomstOverleg`. |
| `soh:hoortBijCasusoverleg` | Verwijst naar het Casusoverleg waarop de ingeziene vastlegging betrekking heeft. |

##### Casusoverleg

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. URI die de node van het Casusoverleg in de Knowledge graph identificeert. |
| `@type` | Verplicht: `soh:Casusoverleg`. |
| `soh:Casusoverleg.identifier` | De identifier waaronder het Casusoverleg bekend is in het zaaksysteem. |
| `soh:heeftBetrekkingOpZaak` | Verwijst naar de Zaak-node wanneer deze relatie in de beschikbare graphgegevens is opgenomen. |

##### Zaak

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht wanneer de Zaak in de graph wordt opgenomen. |
| `@type` | Verplicht: `soh:Zaak`. |
| `soh:Zaak.identifier` | De identificatie van de Zaak. |

##### Organisatie

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht. UUIDv7-URI die de Organisatie-node in de Knowledge graph identificeert. |
| `@type` | Verplicht: zowel `prov:Agent` als `soh:Organisatie`. |
| `soh:Organisatie.identificatieType` | Verplicht. Stabiele code voor het type organisatie-identificatienummer, bijvoorbeeld `OIN` of `KVK`. |
| `soh:Organisatie.identificatieWaarde` | Verplicht. Waarde van het organisatie-identificatienummer, weergegeven als string. |

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
  "id": "0199f0a0-5678-7abc-8def-012345678902",
  "source": "urn:organisatie:inzage",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-ingezien",
  "time": "2026-10-15T11:00:00Z",
  "subject": "CO-2026-12345",
  "datacontenttype": "application/ld+json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e51",
        "@type": [
          "prov:Activity",
          "soh:InzienUitkomstOverleg"
        ],
        "soh:InzienUitkomstOverleg.tijdstip": "2026-10-15T11:00:00Z",
        "prov:used": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e54"
        },
        "prov:wasAssociatedWith": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e53"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e54",
        "@type": [
          "prov:Entity",
          "soh:UitkomstOverleg"
        ],
        "soh:hoortBijCasusoverleg": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e56"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e56",
        "@type": [
          "prov:Entity",
          "soh:Casusoverleg"
        ],
        "soh:Casusoverleg.identifier": "CO-2026-12345",
        "soh:heeftBetrekkingOpZaak": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e57"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e57",
        "@type": [
          "prov:Entity",
          "soh:Zaak"
        ],
        "soh:Zaak.identifier": "ZAAK-2026-12345"
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e53",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ],
        "soh:Organisatie.identificatieType": "OIN",
        "soh:Organisatie.identificatieWaarde": "00000000000000000000"
      }
    ]
  }
}
```

[Dit voorbeeld als graph bekijken](kennis-graph.html?voorbeeld=uitkomst-overleg/uitkomst-ingezien)

#### Aandachtspunten

- Het CloudEvent `time` beschrijft de registratie van het event; `soh:InzienUitkomstOverleg.tijdstip` beschrijft het daadwerkelijke tijdstip van inzage. Deze waarden kunnen verschillen.
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
`UitkomstOverleg`-nodes bevatten. Bij iedere opgenomen `UitkomstOverleg`-node
wordt ook de bijbehorende `Casusoverleg`-node opgenomen, zodat de relatie
`soh:hoortBijCasusoverleg` binnen de resultaatgraaf is uitgewerkt. De
`Zaak`-node wordt opgenomen wanneer de relatie `soh:heeftBetrekkingOpZaak` deel uitmaakt
van de resultaatgraaf. Als een Betrokkene wordt opgenomen, wordt deze als
afzonderlijke node beschreven en vanuit de betreffende `UitkomstOverleg`
met `soh:heeftBetrokkene` verbonden.

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
| `soh:hoortBijCasusoverleg` | Verplicht. Verwijst naar de opgenomen `Casusoverleg`-node waarop deze vastlegging betrekking heeft. |
| `soh:heeftBetrokkene` | Opnemen wanneer de graaf de Betrokkene waarop de Uitkomst Overleg betrekking heeft bevat. Verwijst naar de Betrokkene-node. |
| `soh:UitkomstOverleg.beschikbaarGesteldOp` | Optioneel. RFC 3339-datumtijd van het beschikbaarstellingsmoment. Als ook `soh:BeschikbaarStellenUitkomstOverleg.tijdstip` van de beschikbaarstellingsactiviteit is opgenomen, beschrijven beide eigenschappen hetzelfde moment. |
| `soh:UitkomstOverleg.inzageUrl` | Optioneel. Verwijst naar de resource die via de Inzage-API kan worden geraadpleegd. |

##### Casusoverleg en Zaak

Bij iedere opgenomen Uitkomst Overleg bevat de resultaatgraaf de
bijbehorende `Casusoverleg`-node met `soh:Casusoverleg.identifier`. De
Uitkomst Overleg verwijst met `soh:hoortBijCasusoverleg` naar dit
Casusoverleg. Als de relatie met de Zaak in de resultaatgraaf wordt
opgenomen, bevat de graaf ook de `Zaak`-node met `soh:Zaak.identifier` en
de relatie `soh:heeftBetrekkingOpZaak`.

##### Betrokkene

| Onderdeel | Afspraak |
|---|---|
| `@id` | Verplicht voor elke opgenomen Betrokkene; identificeert het object in de Knowledge graph en is niet automatisch het persoonsidentificatienummer. |
| `@type` | Verplicht: `soh:Betrokkene`. |
| `soh:Betrokkene.identificatieType` | Opnemen wanneer de persoonsidentificatie in het resultaat wordt verstrekt. |
| `soh:Betrokkene.identificatieWaarde` | Opnemen samen met `soh:Betrokkene.identificatieType` wanneer de persoonsidentificatie in het resultaat wordt verstrekt. |
| `soh:Betrokkene.woonplaats` | Optioneel wanneer relevant voor de informatievraag en toegestaan om terug te geven. |

##### Provenance-objecten

De resultaatgraaf kan naast de domeinobjecten Activity- en Agent-nodes en
relevante relaties bevatten wanneer deze provenance-informatie deel uitmaakt
van het resultaat. Welke provenance-objecten worden opgenomen, hangt af van
de informatievraag en de beschikbare gegevens. Dit event construeert niet
opnieuw de oorspronkelijke beschikbaarstellingsgebeurtenis.

#### Identifiers en relaties

- Het CloudEvent `id` identificeert het event; `subject` identificeert bij een queryresultaat de asynchrone informatievraag waarop het resultaat betrekking heeft. Bij de events voor beschikbaarstelling en inzage bevat `subject` de identifier van het Casusoverleg waarop de vastlegging betrekking heeft, zoals die bekend is in het zaaksysteem van de organisatie die deze beschikbaar stelt. De identifier van de Zaak wordt als domeingegeven in `data` opgenomen wanneer die nodig is om de relatie tussen Casusoverleg en Zaak vast te leggen.
- De `@id` van iedere graph-node identificeert het betreffende domeinobject of provenance-object.
- Verwijzingen tussen nodes moeten overeenkomen met de `@id` van de bedoelde node in dezelfde graaf, tenzij een verwijzing naar een extern geïdentificeerd object expliciet is toegestaan.
- Een resultaat kan nul, één of meer `UitkomstOverleg`-nodes bevatten.

#### Voorbeeld

Een voorbeeld van een queryresultaat met meerdere Uitkomsten Overleg is
opgenomen onder [Resultaat van een informatievraag](#resultaat-van-een-informatievraag)
in de paragraaf *Informatievragen*. Dat voorbeeld laat zien hoe meerdere
`UitkomstOverleg`-objecten en bijbehorende `Betrokkene`-objecten binnen één
`@graph`-array worden opgenomen.


#### Aandachtspunten

- De concrete inhoud van de resultaatgraaf wordt bepaald door de informatievraag.
- Een resultaat kan geen `UitkomstOverleg`-nodes bevatten wanneer geen objecten aan de informatievraag voldoen.
- Het uitvoeren van een informatievraag geldt niet als inzage. Een daadwerkelijke raadpleging via de Inzage-API wordt als afzonderlijke activiteit vastgelegd.
- De eigenschappen `soh:UitkomstOverleg.beschikbaarGesteldOp` en `soh:UitkomstOverleg.inzageUrl` volgen de algemene naamgevingsconventie voor domeineigenschappen zoals vastgelegd in het Knowledge graph-model.

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

### Samenhang tussen UitkomstOverleg, Casusoverleg en Zaak

Een `UitkomstOverleg` wordt met `soh:hoortBijCasusoverleg` gekoppeld aan
het `Casusoverleg` waarop de vastlegging betrekking heeft. De identifier
waaronder het Casusoverleg bekend is in het zaaksysteem wordt vastgelegd
als `soh:Casusoverleg.identifier`. Deze domeinidentifier staat los van de
technische `@id` van de node in de Knowledge graph.

Het `Casusoverleg` wordt met `soh:heeftBetrekkingOpZaak` gekoppeld aan de
`Zaak` waarop het betrekking heeft. De Zaak-identificatie die
Uitwisselen Uitkomst Overleg aanlevert, wordt gebruikt om de Zaak-node
te vinden of te identificeren. Ook deze domeinidentificatie staat los
van de technische `@id` van de Zaak-node.

De structurele verantwoordelijkheid voor het aanleveren van de relatie
tussen Casusoverleg en Zaak ligt uiteindelijk bij de samenwerkfunctie
Overleggen over de casus. Totdat die samenwerkfunctie deze relatie
aanlevert, levert Uitwisselen Uitkomst Overleg de benodigde
Zaak-identificatie aan. De overgang moet zo worden ingericht dat dubbele
of tegenstrijdige relaties worden voorkomen.

De Uitkomst Overleg hoeft geen eigen externe identifier te hebben. De
relatie met het Casusoverleg maakt duidelijk op welk overleg de
vastlegging betrekking heeft; de technische `@id` identificeert de
UitkomstOverleg-node in de Knowledge graph.

### Concepten

#### Casusoverleg {#concept-casusoverleg}

Type: `soh:Casusoverleg`

Het casusoverleg waarop de vastlegging van een Uitkomst Overleg betrekking heeft.

Eigenschappen:

- `identifier` --- de identifier waaronder het Casusoverleg bekend is in het zaaksysteem.

#### Zaak {#concept-zaak}

Type: `soh:Zaak`

De zaak waarop het Casusoverleg betrekking heeft.

Eigenschappen:

- `identifier` --- de identificatie van de Zaak die nodig is om de relatie met het Casusoverleg vast te leggen.

#### UitkomstOverleg {#concept-uitkomstoverleg}

[UitkomstOverleg als graph bekijken](kennis-graph.html?view=model&type=soh:UitkomstOverleg)

Type:

- `soh:UitkomstOverleg`;
- `prov:Entity`.

De vastlegging van wat in een Casusoverleg is besproken en besloten, inclusief de concrete besluiten en acties. Deze vastlegging wordt via de Inzage-API beschikbaar gesteld en hoeft geen eigen externe identifier te hebben. De technische `@id` identificeert de node in de Knowledge graph.

Eigenschappen:

- `beschikbaarGesteldOp`;
- `inzageUrl`.

#### Betrokkene {#concept-betrokkene}

[Betrokkene als graph bekijken](kennis-graph.html?view=model&type=soh:Betrokkene)

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

#### Organisatie {#concept-organisatie}

[Organisatie als graph bekijken](kennis-graph.html?view=model&type=soh:Organisatie)

Type:

- `soh:Organisatie`;
- `prov:Agent`.

Organisatie die verantwoordelijk is voor een activiteit.

Eigenschappen:

- `identificatieType`;
- `identificatieWaarde`;
- `naam`.

De `@id` identificeert de Organisatie-node technisch in de Knowledge graph.
De combinatie van `identificatieType` en `identificatieWaarde` bevat de
herkenbare identificatie van de organisatie, bijvoorbeeld een OIN of
KvK-nummer. Deze identificatie staat los van de technische `@id`.

#### BeschikbaarStellenUitkomstOverleg {#concept-beschikbaarstellenuitkomstoverleg}

[BeschikbaarStellenUitkomstOverleg als graph bekijken](kennis-graph.html?view=model&type=soh:BeschikbaarStellenUitkomstOverleg)

Type:

- `soh:BeschikbaarStellenUitkomstOverleg`;
- `prov:Activity`.

Activiteit waarbij een Uitkomst Overleg beschikbaar wordt gesteld.

Eigenschappen:

- `identifier`;
- `tijdstip` --- het tijdstip waarop de activiteit daadwerkelijk heeft
  plaatsgevonden.

#### InzienUitkomstOverleg {#concept-inzienuitkomstoverleg}

[InzienUitkomstOverleg als graph bekijken](kennis-graph.html?view=model&type=soh:InzienUitkomstOverleg)

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


#### `soh:hoortBijCasusoverleg`

Domeinrelatie waarmee een Uitkomst Overleg wordt gekoppeld aan het
Casusoverleg waarop de vastlegging betrekking heeft. De identifier van het
Casusoverleg wordt niet als identifier van Uitkomst Overleg gebruikt.

#### `soh:heeftBetrekkingOpZaak`

Domeinrelatie van Casusoverleg naar Zaak. Uitwisselen Uitkomst Overleg levert
de Zaak-identificatie voorlopig aan; de structurele verantwoordelijkheid
voor het aanleveren van deze relatie ligt uiteindelijk bij Overleggen over
de casus.

#### `soh:heeftBetrokkene`

Domeinrelatie waarmee een UitkomstOverleg aan een Betrokkene wordt
gerelateerd.

De relatie legt vast op welke Betrokkene de betreffende Uitkomst Overleg
betrekking heeft. Dit is niet noodzakelijk de hoofdbetrokkene van de Zaak
en ook niet een opsomming van alle Betrokkenen die bij de Zaak horen. Een
Taak die tijdens een Casusoverleg wordt gedefinieerd, kan immers betrekking
hebben op één specifieke Betrokkene. Een ander Casusoverleg over dezelfde
Zaak kan betrekking hebben op een andere Betrokkene.

De relatie wordt daarom vanuit `UitkomstOverleg` gelegd en niet vanuit
`Zaak`. In dit model wordt de Taak zelf niet als afzonderlijk object
weergegeven; `soh:heeftBetrokkene` legt de voor de Uitkomst Overleg
relevante relatie met de Betrokkene vast.

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
| Casusoverleg | `soh:Casusoverleg` | indien relevant `prov:Entity` | identifier |
| Zaak | `soh:Zaak` | indien relevant `prov:Entity` | identifier |
| UitkomstOverleg | `soh:UitkomstOverleg` | `prov:Entity` | beschikbaarGesteldOp, inzageUrl |
| Betrokkene | `soh:Betrokkene` | `prov:Agent`¹ | identifier, identificatieType, identificatieWaarde, woonplaats |
| Organisatie | `soh:Organisatie` | `prov:Agent` | identificatieType, identificatieWaarde, naam |
| BeschikbaarStellenUitkomstOverleg | `soh:BeschikbaarStellenUitkomstOverleg` | `prov:Activity` | identifier, tijdstip |
| InzienUitkomstOverleg | `soh:InzienUitkomstOverleg` | `prov:Activity` | identifier, tijdstip |

¹ Een `Betrokkene` is niet intrinsiek een `prov:Agent`. Wanneer de
betrokkene zelf als actor optreedt in een provenance-activiteit, krijgt
het betreffende domeinobject ook de typering `prov:Agent`.

[Het informatiemodel als graph bekijken](kennis-graph.html?view=model), inclusief de verschillen tussen dit overzicht en de voorbeelden.

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
`soh:Betrokkene.woonplaats` bij de `Betrokkene` vastgelegd.

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
resultaatgraaf opgenomen. Waar relevant voor het resultaat worden ook het
bijbehorende Casusoverleg en de Zaak opgenomen, met expliciete relaties via
`@id`. Als geen Uitkomsten Overleg aan de
informatieaanvraag voldoen, bevat de resultaatgraaf geen
`soh:UitkomstOverleg`-nodes.

Een resultaatgraaf bevat bij een opgenomen `Betrokkene` de persoonsidentificatie
als combinatie van typering en identificatiewaarde en de woonplaats als
`soh:Betrokkene.woonplaats`. Daarmee kan een afnemer de identificatie en woonplaats van
de betrokkene interpreteren, terwijl de `@id` van de Betrokkene de identifier
van het object in de Knowledge graph blijft. De resultaatgraaf kan daarnaast, waar relevant,
een `inzageUrl` bevatten waarmee de inhoudelijke resource via de Inzage-API kan
worden geraadpleegd. De precieze omvang en structuur zijn afhankelijk van de
informatievraag.

De objecten in de resultaatgraaf zijn **afzonderlijke nodes in één `@graph`-array**.
Ze worden niet gegroepeerd in aparte blokken per Uitkomst Overleg. De volgorde
waarin de objecten in de array staan en de inspringing van de JSON leggen geen
relatie tussen die objecten vast. De relatie wordt expliciet gelegd met een
verwijzing via `@id`: bijvoorbeeld `soh:heeftBetrokkene` verwijst vanuit een
`UitkomstOverleg` naar de bijbehorende `Betrokkene`.

Schematisch bevat de `@graph` dus één reeks afzonderlijke objecten:

```text
@graph
  ├─ UitkomstOverleg 1 ── soh:heeftBetrokkene ──> Betrokkene 1
  ├─ Betrokkene 1
  ├─ UitkomstOverleg 2 ── soh:heeftBetrokkene ──> Betrokkene 2
  └─ Betrokkene 2
```

De lijnen in dit schema geven de relaties tussen nodes weer; de objecten zelf
blijven afzonderlijke elementen in dezelfde array.

Het uitvoeren van een informatievraag geldt niet als inzage in een Uitkomst
Overleg. Een queryresultaat geeft aan welke informatie beschikbaar is en kan
een verwijzing bevatten naar de inhoudelijke resource. Wanneer een deelnemer
vervolgens de inhoudelijke Uitkomst Overleg via de Inzage-API raadpleegt,
wordt deze inzage als afzonderlijke activiteit vastgelegd.

Voorbeeld van een queryresultaat met twee gevonden Uitkomsten Overleg:

```json
{
  "specversion": "1.0",
  "id": "0199f0a0-9abc-7abc-8def-012345678903",
  "source": "urn:organisatie:queryvoorziening",
  "type": "nl.jzv.uitwisselen-uitkomst-overleg.uitkomst-overleg-query-resultaat",
  "time": "2026-10-15T12:00:00Z",
  "subject": "987e6543-e21b-45d6-b789-426614174111",
  "datacontenttype": "application/ld+json",
  "data": {
    "@context": {
      "prov": "http://www.w3.org/ns/prov#",
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    },
    "@graph": [
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e54",
        "@type": [
          "prov:Entity",
          "soh:UitkomstOverleg"
        ],
        "soh:UitkomstOverleg.beschikbaarGesteldOp": "2026-10-15T10:30:00Z",
        "soh:UitkomstOverleg.inzageUrl": "https://inzage.voorbeeld.nl/uitkomst-overleg/CO-2026-12345",
        "soh:hoortBijCasusoverleg": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e56"
        },
        "soh:heeftBetrokkene": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e55"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e56",
        "@type": [
          "prov:Entity",
          "soh:Casusoverleg"
        ],
        "soh:Casusoverleg.identifier": "CO-2026-12345",
        "soh:heeftBetrekkingOpZaak": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e57"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e57",
        "@type": [
          "prov:Entity",
          "soh:Zaak"
        ],
        "soh:Zaak.identifier": "ZAAK-2026-12345"
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e55",
        "@type": [
          "prov:Entity",
          "soh:Betrokkene"
        ],
        "soh:Betrokkene.identificatieType": "BSN",
        "soh:Betrokkene.identificatieWaarde": "123456789",
        "soh:Betrokkene.woonplaats": "Deventer"
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e50",
        "@type": [
          "prov:Activity",
          "soh:BeschikbaarStellenUitkomstOverleg"
        ],
        "soh:BeschikbaarStellenUitkomstOverleg.tijdstip": "2026-10-15T10:30:00Z",
        "prov:wasAssociatedWith": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e52"
        },
        "soh:steltBeschikbaar": {
          "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e54"
        }
      },
      {
        "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e52",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ],
        "soh:Organisatie.identificatieType": "OIN",
        "soh:Organisatie.identificatieWaarde": "00000000000000000000"
      }
    ]
  }
}
```

[Dit voorbeeld als graph bekijken](kennis-graph.html?voorbeeld=uitkomst-overleg/queryresultaat)


De objecten staan als afzonderlijke blokken in één `@graph`-array. Verwijzingen via `@id` verbinden iedere Uitkomst Overleg met de bijbehorende Betrokkene.

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

Met de [kennis-graph](kennis-graph.html?view=paste) kan een eigen CloudEvent alvast worden gecontroleerd op `@id`-verwijzingen die niet naar een node in de `@graph` wijzen.

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
-   de identifier van het Casusoverleg waarop de vastlegging betrekking heeft.

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
