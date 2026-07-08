# Uitwisselen Uitkomst Overleg

> Status: Concept\
> Versie: 1.0-draft Sprint 2

## Inleiding

Deze specificatie beschrijft de samenwerkfunctie **Uitwisselen Uitkomst
Overleg**.

De samenwerkfunctie ondersteunt het beschikbaar stellen en raadplegen
van de uitkomst van een casusoverleg tussen ketenpartners.

De oplossing bestaat uit drie complementaire onderdelen:

1.  De inzage-API waarmee de inhoud van de Uitkomst Overleg beschikbaar
    wordt gesteld.
2.  De Query-API waarmee deelnemers kunnen zoeken naar beschikbare Uitkomsten
    Overleg.
3.  CloudEvents waarmee gebeurtenissen rondom de Uitkomst Overleg worden
    gemeld.

De CloudEvents bevatten niet de volledige inhoud van de uitkomst. Zij
bevatten informatie die nodig is voor notificatie, provenance, auditing
en het opbouwen van een knowledge graph.

## Scope

Deze specificatie beschrijft:

-   de CloudEvents binnen deze samenwerkfunctie;
-   het gebruik van PROV-JSONLD;
-   het graphmodel;
-   de mapping tussen het informatiemodel en de graph;
-   de events:
    -   `uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`;
    -   `uitwisselen-uitkomst-overleg.uitkomst-ingezien`;
-   de Query-API voor het vinden van beschikbare Uitkomsten Overleg.

Deze specificatie beschrijft niet de inhoudelijke modellering van
besluiten en acties of de interne totstandkoming daarvan.

## Architectuur

``` mermaid
flowchart LR
    C[Casusoverleg] --> U[Uitkomst Overleg]
    U --> API[Inzage-API]
    U --> Q[Query-API]
    U --> CE[CloudEvent]
    CE --> G[Knowledge graph]
```

De inzage-API is de bron voor de inhoudelijke gegevens.

De Query-API ondersteunt deelnemers bij het vinden van beschikbare Uitkomsten
Overleg. De Query-API is specifiek voor deze samenwerkfunctie en bevat
queries die aansluiten op de betekenis en het gebruik van de gegevens binnen
Uitwisselen Uitkomst Overleg.

De graph ondersteunt:

-   provenance;
-   auditing;
-   zoeken naar eerdere betrokkenheid van personen;
-   zoeken naar beschikbare Uitkomsten Overleg op basis van beschikbaarheidsdatum.

## Query-API

De Query-API ondersteunt deelnemers bij het uitvoeren van queries op beschikbare
Uitkomsten Overleg.

De queries zijn samenwerkfunctie-specifiek. Anders dan de API voor het aanbieden
van CloudEvents en de Status-API, kan de inhoud van deze queries niet generiek
worden vastgesteld. De beschikbare queries zijn afhankelijk van de betekenis van
de gegevens binnen de betreffende samenwerkfunctie.

Voorbeelden van mogelijke queries binnen Uitwisselen Uitkomst Overleg zijn:

- welke Uitkomsten Overleg zijn beschikbaar gekomen sinds een bepaald tijdstip;
- welke Uitkomsten Overleg betrekking hebben op een bepaalde Betrokkene;
- welke Uitkomsten Overleg door een bepaalde organisatie beschikbaar zijn
  gesteld.

De Query-API gebruikt de gegevens uit de graph om deze vragen te beantwoorden.

De technische specificatie van de Query-API wordt vastgelegd in een
samenwerkfunctie-specifieke OpenAPI-specificatie.

## CloudEvents

Binnen deze samenwerkfunctie worden twee eventtypen gebruikt:

| Eventtype | Betekenis |
|---|---|
| `uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld` | De Uitkomst Overleg is beschikbaar gesteld. |
| `uitwisselen-uitkomst-overleg.uitkomst-ingezien` | De Uitkomst Overleg is geraadpleegd. |


### CloudEvent-profiel

De producer vult de standaard CloudEvent-attributen volgens de afspraken
uit het generieke CloudEvent-profiel.

Voor deze samenwerkfunctie gelden de volgende aanvullende afspraken:

| Attribuut | Verplicht | Betekenis |
|---|---|---|
| `id` | MUST | Unieke identificatie van het CloudEvent |
| `source` | MUST | Organisatie die het event publiceert |
| `type` | MUST | Eén van de toegestane eventtypen |
| `subject` | MUST | Identificatie van de Uitkomst Overleg waarop het event betrekking heeft |
| `time` | MUST | Tijdstip waarop de gebeurtenis plaatsvond |
| `data` | MUST | PROV-JSONLD-graaf |


### Subject

Het CloudEvent-attribuut `subject` verwijst naar de Uitkomst Overleg
waarop het event betrekking heeft.

De waarde wordt gebaseerd op de identificatie van de Uitkomst Overleg.

### Data

Het attribuut `data` bevat een PROV-JSONLD-document.

De payload bevat minimaal:

-   een Entity voor de Uitkomst Overleg;
-   een Activity die de gebeurtenis representeert;
-   een Agent die verantwoordelijk is voor de activiteit.

Voor deze samenwerkfunctie worden de volgende domeinconcepten gebruikt:

-   Betrokkene;
-   BeschikbaarStellenUitkomst;
-   InzienUitkomst.

## Gebruik van PROV-JSONLD

Het attribuut `data` van het CloudEvent bevat een PROV-JSONLD-graaf.

De graaf beschrijft de provenance van de beschikbaarstelling of inzage.

De graaf beschrijft niet de inhoudelijke besluitvorming van het
casusoverleg.

## Conceptueel graphmodel

| Concept | PROV-type | Betekenis |
|---|---|---|
| UitkomstOverleg | Entity | De via de API beschikbare resource. De Entity bevat tevens de datumtijd waarop de Uitkomst Overleg beschikbaar is gesteld. |
| Betrokkene | Entity | Zoekanker voor personen. |
| BeschikbaarStellenUitkomst | Activity | Activiteit waarmee de uitkomst beschikbaar wordt gesteld. |
| InzienUitkomst | Activity | Activiteit waarmee de uitkomst wordt geraadpleegd. |
| Organisatie | Agent | Organisatie die een activiteit uitvoert. |


Relaties:

``` text
UitkomstOverleg
    BETREFT
Betrokkene

UitkomstOverleg
    WAS_GENERATED_BY
BeschikbaarStellenUitkomst

BeschikbaarStellenUitkomst
    WAS_ASSOCIATED_WITH
Organisatie

InzienUitkomst
    USED
UitkomstOverleg

InzienUitkomst
    WAS_ASSOCIATED_WITH
Organisatie
```

## Betrokkene

De Betrokkene wordt als afzonderlijke Entity opgenomen.

De reden hiervoor is dat de graph bevraagbaar moet zijn op basis van het
burgerservicenummer, bijvoorbeeld tijdens een ZSM-overleg.

De Betrokkene vormt geen onderdeel van de provenance, maar is een
domeinanker binnen de graph.

Een toekomstige uitbreiding kan ondersteuning voor het
vreemdelingennummer toevoegen.

## Ontwerpkeuzes

Belangrijke uitgangspunten:

-   De inhoud van de Uitkomst Overleg blijft beschikbaar via de
    inzage-API.
-   CloudEvents bevatten geen duplicatie van besluiten en acties.
-   Provenance wordt vastgelegd met PROV-JSONLD.
-   Betrokkene wordt opgenomen om operationeel zoeken mogelijk te maken.
-   Activities krijgen geen businessidentiteit.


## Mapping informatiemodel naar PROV-model

In dit hoofdstuk wordt de relatie beschreven tussen de concepten uit het
informatiemodel van Uitwisselen Uitkomst Overleg en de PROV-elementen die in
de CloudEvent-payload worden opgenomen.

| Informatiemodel | PROV-element | Toelichting |
|---|---|---|
| UitkomstOverleg | Entity | De informatiebron die via de inzage-API beschikbaar wordt gesteld. |
| Betrokkene | Entity | Domeinanker waarmee gezocht kan worden op bijvoorbeeld BSN. |
| BeschikbaarStellenUitkomst | Activity | De activiteit waarbij de Uitkomst Overleg beschikbaar wordt gesteld. |
| InzienUitkomst | Activity | De activiteit waarbij een organisatie de Uitkomst Overleg raadpleegt. |
| Organisatie | Agent | De organisatie die verantwoordelijk is voor een activiteit. |

## Identifierstrategie

Binnen PROV is het noodzakelijk dat Entity-, Activity- en Agent-instanties
eenduidig identificeerbaar zijn.

Voor Entities en Agents wordt gebruik gemaakt van identifiers die aansluiten
bij de domeinidentificatie.

Voor Activities geldt dat iedere uitvoering van een activiteit een eigen
identifier krijgt. Deze identifier heeft geen betekenis in het domeinmodel,
maar maakt het mogelijk om provenance-relaties eenduidig vast te leggen.

Een Activity-identifier is daarmee een technische identifier en geen
businessidentifier.

## Eerste PROV-JSONLD-uitwerking

Een CloudEvent bevat in het attribuut `data` een PROV-JSONLD-graaf.

Een eerste uitwerking van het event
`uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld` bestaat conceptueel
uit:

- een Entity voor de Uitkomst Overleg;
- een Activity voor het beschikbaar stellen;
- een Agent voor de publicerende organisatie;
- een Entity voor de Betrokkene.

De exacte JSON-LD-uitwerking wordt in een volgende iteratie verder
gespecificeerd.


## Concrete PROV-JSONLD-uitwerking

In dit hoofdstuk wordt het PROV-JSONLD-model beschreven dat in de CloudEvent-payload wordt gebruikt. De volledige JSON-LD-uitwerking is opgenomen in het volledige CloudEvent-voorbeeld verderop in dit document.

De provenance-graaf bevat de volgende elementen:

| Concept | PROV-type | Toelichting |
|---|---|---|
| UitkomstOverleg | Entity | De informatiebron die via de inzage-API beschikbaar wordt gesteld. |
| Betrokkene | Entity | Domeinanker waarop onder andere gezocht kan worden via burgerservicenummer. |
| BeschikbaarStellenUitkomst | Activity | De activiteit waarmee de Uitkomst Overleg beschikbaar wordt gesteld. |
| Organisatie | Agent | De organisatie die de activiteit uitvoert. |

De relaties in de provenance-graaf zijn:

```text
UitkomstOverleg
    prov:wasGeneratedBy
BeschikbaarStellenUitkomst

BeschikbaarStellenUitkomst
    prov:wasAssociatedWith
Organisatie
```

De concrete serialisatie van deze graaf als JSON-LD maakt onderdeel uit van het volledige CloudEvent-voorbeeld.

## Modellering burgerservicenummer

Het burgerservicenummer wordt opgenomen als attribuut van de Entity
`Betrokkene`.

Het burgerservicenummer:

- is een domeinattribuut van de Betrokkene;
- wordt gebruikt om de graph bevraagbaar te maken;
- wordt niet gebruikt als technische identifier van de PROV Entity;
- wordt niet als afzonderlijke Entity gemodelleerd.

De technische identifier van de Entity Betrokkene staat los van het
burgerservicenummer.

## Beschikbaarheidsdatum Uitkomst Overleg

Een deelnemer moet kunnen vaststellen welke Uitkomsten Overleg beschikbaar zijn
gekomen sinds een bepaald moment.

Daarvoor wordt aan de Entity `UitkomstOverleg` een domeinattribuut toegevoegd
dat de datumtijd van beschikbaarstelling bevat.

Voorbeeld:

```json
{
  "@id": "<identifier-uitkomst-overleg>",
  "@type": [
    "prov:Entity",
    "soh:UitkomstOverleg"
  ],
  "soh:beschikbaarGesteldOp": "2026-01-01T12:00:00Z"
}
```

Het attribuut `soh:beschikbaarGesteldOp` ondersteunt operationele queries op
beschikbare Uitkomsten Overleg.

Het attribuut heeft een andere betekenis dan het CloudEvent-attribuut `time`.

- `time` in het CloudEvent beschrijft het tijdstip waarop de gebeurtenis
  plaatsvond.
- `soh:beschikbaarGesteldOp` beschrijft vanaf welk moment de Uitkomst Overleg
  beschikbaar is voor raadpleging.

De provenance-informatie blijft de relatie tussen de beschikbaarstelling als
Activity en de Entity UitkomstOverleg beschrijven.


## Event uitkomst ingezien

Het event
`uitwisselen-uitkomst-overleg.uitkomst-ingezien`
legt vast dat een organisatie de Uitkomst Overleg heeft geraadpleegd.

De provenance-relaties zijn:

```text
InzienUitkomst
    USED
UitkomstOverleg

InzienUitkomst
    WAS_ASSOCIATED_WITH
Organisatie
```

Daarmee kan worden vastgesteld welke organisatie de uitkomst heeft ingezien en
op welk moment deze gebeurtenis heeft plaatsgevonden.

De vastlegging van dit event ondersteunt zowel auditing als het aantonen dat een
organisatie kennis heeft kunnen nemen van de uitkomst.


## JSON-LD context en namespaces

De PROV-JSONLD-graaf maakt gebruik van een JSON-LD context om begrippen en eigenschappen ondubbelzinnig te identificeren.

Een JSON-LD context koppelt prefixen aan namespaces. Hierdoor kunnen compacte namen worden gebruikt, terwijl de betekenis van begrippen eenduidig blijft.

Voor provenance wordt de PROV-namespace gebruikt. Voor begrippen binnen Samen onder handbereik wordt de prefix `soh` gereserveerd.

Voorbeeld:

```json
{
  "@context": [
    "https://openprovenance.org/prov-jsonld/context.jsonld",
    {
      "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
    }
  ]
}
```

De definitieve publicatie en inhoud van de JSON-LD context worden nog vastgesteld.

## Gebruik van domeinprefixen

Domeinbegrippen worden gekwalificeerd met de prefix `soh`.

Voorbeeld:

```json
{
  "@type": "soh:UitkomstOverleg"
}
```

Hiermee wordt voorkomen dat begrippen alleen als lokale namen worden geïnterpreteerd.

## URI- en identifierstrategie

De strategie voor URI's en identifiers wordt verder onderzocht.

Daarbij wordt onderscheid gemaakt tussen:

- identifiers van begrippen;
- identifiers van domeinobjecten;
- technische identifiers voor provenance-elementen.

Een namespace voor begrippen en schema's is niet hetzelfde als de definitieve strategie voor identifiers van instanties.

Bij het bepalen van de strategie worden relevante overheidsbrede afspraken en standaarden betrokken.

## Open punt

Open vraag:

Welke standaarden en afspraken zijn van toepassing op URI's en identifiers voor begrippen, informatieobjecten en instanties binnen de Samen onder handbereik-omgeving?

## Volledig CloudEvent-voorbeeld

In eerdere iteraties is de PROV-JSONLD-graaf uitgewerkt als inhoud van het
CloudEvent-attribuut `data`.

In deze iteratie wordt het volledige CloudEvent beschreven, inclusief de
CloudEvent envelope en de volledige PROV-JSONLD-payload.

Het voorbeeld bevat:

- de standaard CloudEvent-attributen;
- de JSON-LD context met de gebruikte namespaces;
- de Entity, Activity en Agent uit het provenance-model;
- de relaties tussen deze elementen.

```json
{
  "specversion": "1.0",
  "id": "<cloud-event-identifier>",
  "source": "<producer>",
  "type": "uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld",
  "subject": "<identifier-uitkomst-overleg>",
  "time": "2026-01-01T12:00:00Z",
  "datacontenttype": "application/ld+json",
  "data": {
    "@context": [
      "https://openprovenance.org/prov-jsonld/context.jsonld",
      {
        "prov": "http://www.w3.org/ns/prov#",
        "soh": "https://samen-onder-handbereik.github.io/specificaties/schema/"
      }
    ],
    "@graph": [
      {
        "@id": "<identifier-uitkomst-overleg>",
        "@type": [
          "prov:Entity",
          "soh:UitkomstOverleg"
        ],
        "prov:wasGeneratedBy": "<identifier-beschikbaarstelling>",
        "soh:betreft": "<identifier-betrokkene>",
        "soh:beschikbaarGesteldOp": "2026-01-01T12:00:00Z"
      },
      {
        "@id": "<identifier-betrokkene>",
        "@type": [
          "prov:Entity",
          "soh:Betrokkene"
        ],
        "soh:burgerservicenummer": "<burgerservicenummer>"
      },
      {
        "@id": "<identifier-beschikbaarstelling>",
        "@type": [
          "prov:Activity",
          "soh:BeschikbaarStellenUitkomst"
        ],
        "prov:wasAssociatedWith": "<identifier-organisatie>"
      },
      {
        "@id": "<identifier-organisatie>",
        "@type": [
          "prov:Agent",
          "soh:Organisatie"
        ]
      }
    ]
  }
}
```

De relatie tussen het CloudEvent en de provenance-graaf is als volgt:

- het CloudEvent beschrijft de gebeurtenis die wordt uitgewisseld;
- het attribuut `data` bevat de provenance-graaf;
- de identifiers leggen de verbinding tussen CloudEvent en provenance-elementen.

De gebruikte domeinrelatie `soh:betreft` is een voorbeeld van een nog vast te stellen
domeinspecifieke relatie. De exacte URI-strategie en de definitieve JSON-LD-context
worden in een volgende iteratie vastgesteld.
## Relatie CloudEvent en provenance

Het CloudEvent beschrijft de gebeurtenis die wordt uitgewisseld.

De provenance-graaf in `data` beschrijft de herkomst en relaties van de
betrokken informatieobjecten.

## JSON-LD context als onderdeel van het contract

De JSON-LD context maakt onderdeel uit van de semantische betekenis van de
payload.

De context bepaalt hoe prefixen zoals `prov` en `soh` worden geïnterpreteerd.

