# Uitwisselen Uitkomst Overleg

> Status: Concept\
> Versie: 1.0-draft Sprint 2

## 1. Inleiding

Deze specificatie beschrijft de samenwerkfunctie **Uitwisselen Uitkomst
Overleg**.

De samenwerkfunctie ondersteunt het beschikbaar stellen en raadplegen
van de uitkomst van een casusoverleg tussen ketenpartners.

De oplossing bestaat uit twee complementaire onderdelen:

1.  De inzage-API waarmee de inhoud van de Uitkomst Overleg beschikbaar
    wordt gesteld.
2.  CloudEvents waarmee gebeurtenissen rondom de Uitkomst Overleg worden
    gemeld.

De CloudEvents bevatten niet de volledige inhoud van de uitkomst. Zij
bevatten informatie die nodig is voor notificatie, provenance, auditing
en het opbouwen van een knowledge graph.

## 2. Scope

Deze specificatie beschrijft:

-   de CloudEvents binnen deze samenwerkfunctie;
-   het gebruik van PROV-JSONLD;
-   het graphmodel;
-   de mapping tussen het informatiemodel en de graph;
-   de events:
    -   `uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`;
    -   `uitwisselen-uitkomst-overleg.uitkomst-ingezien`.

Deze specificatie beschrijft niet de inhoudelijke modellering van
besluiten en acties of de interne totstandkoming daarvan.

## 3. Architectuur

``` mermaid
flowchart LR
    C[Casusoverleg] --> U[Uitkomst Overleg]
    U --> API[Inzage-API]
    U --> CE[CloudEvent]
    CE --> G[Knowledge graph]
```

De inzage-API is de bron voor de inhoudelijke gegevens.

De graph ondersteunt:

-   provenance;
-   auditing;
-   zoeken naar eerdere betrokkenheid van personen.

## 4. CloudEvents

Binnen deze samenwerkfunctie worden twee eventtypen gebruikt:

| Eventtype | Betekenis |
|---|---|
| `uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld` | De Uitkomst Overleg is beschikbaar gesteld. |
| `uitwisselen-uitkomst-overleg.uitkomst-ingezien` | De Uitkomst Overleg is geraadpleegd. |


### 4.1 CloudEvent-profiel

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


### 4.2 Subject

Het CloudEvent-attribuut `subject` verwijst naar de Uitkomst Overleg
waarop het event betrekking heeft.

De waarde wordt gebaseerd op de identificatie van de Uitkomst Overleg.

### 4.3 Data

Het attribuut `data` bevat een PROV-JSONLD-document.

De payload bevat minimaal:

-   een Entity voor de Uitkomst Overleg;
-   een Activity die de gebeurtenis representeert;
-   een Agent die verantwoordelijk is voor de activiteit.

Voor deze samenwerkfunctie worden de volgende domeinconcepten gebruikt:

-   Betrokkene;
-   BeschikbaarStellenUitkomst;
-   InzienUitkomst.

## 5. Gebruik van PROV-JSONLD

Het attribuut `data` van het CloudEvent bevat een PROV-JSONLD-graaf.

De graaf beschrijft de provenance van de beschikbaarstelling of inzage.

De graaf beschrijft niet de inhoudelijke besluitvorming van het
casusoverleg.

## 6. Conceptueel graphmodel

| Concept | PROV-type | Betekenis |
|---|---|---|
| UitkomstOverleg | Entity | De via de API beschikbare resource. |
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

## 7. Betrokkene

De Betrokkene wordt als afzonderlijke Entity opgenomen.

De reden hiervoor is dat de graph bevraagbaar moet zijn op basis van het
burgerservicenummer, bijvoorbeeld tijdens een ZSM-overleg.

De Betrokkene vormt geen onderdeel van de provenance, maar is een
domeinanker binnen de graph.

Een toekomstige uitbreiding kan ondersteuning voor het
vreemdelingennummer toevoegen.

## 8. Ontwerpkeuzes

Belangrijke uitgangspunten:

-   De inhoud van de Uitkomst Overleg blijft beschikbaar via de
    inzage-API.
-   CloudEvents bevatten geen duplicatie van besluiten en acties.
-   Provenance wordt vastgelegd met PROV-JSONLD.
-   Betrokkene wordt opgenomen om operationeel zoeken mogelijk te maken.
-   Activities krijgen geen businessidentiteit.


## 9. Mapping informatiemodel naar PROV-model

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

## 10. Identifierstrategie

Binnen PROV is het noodzakelijk dat Entity-, Activity- en Agent-instanties
eenduidig identificeerbaar zijn.

Voor Entities en Agents wordt gebruik gemaakt van identifiers die aansluiten
bij de domeinidentificatie.

Voor Activities geldt dat iedere uitvoering van een activiteit een eigen
identifier krijgt. Deze identifier heeft geen betekenis in het domeinmodel,
maar maakt het mogelijk om provenance-relaties eenduidig vast te leggen.

Een Activity-identifier is daarmee een technische identifier en geen
businessidentifier.

## 11. Eerste PROV-JSONLD-uitwerking

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


## 12. Concrete PROV-JSONLD-uitwerking

In dit hoofdstuk wordt de eerste concrete uitwerking beschreven van de
PROV-JSONLD-graaf die wordt opgenomen in het CloudEvent
`uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld`.

De graaf bevat de volgende elementen:

| Concept | PROV-type | Toelichting |
|---|---|---|
| UitkomstOverleg | Entity | De informatiebron die via de inzage-API beschikbaar wordt gesteld. |
| Betrokkene | Entity | Domeinanker waarop onder andere gezocht kan worden via burgerservicenummer. |
| BeschikbaarStellenUitkomst | Activity | De activiteit waarmee de Uitkomst Overleg beschikbaar wordt gesteld. |
| Organisatie | Agent | De organisatie die de activiteit uitvoert. |

Een vereenvoudigd voorbeeld:

```json
{
  "@context": [
    "https://www.w3.org/ns/prov.jsonld"
  ],
  "@graph": [
    {
      "@id": "urn:justid:uitkomst-overleg:12345",
      "@type": "prov:Entity",
      "type": "UitkomstOverleg",
      "prov:wasGeneratedBy": "urn:justid:activity:beschikbaarstellen:67890"
    },
    {
      "@id": "urn:justid:betrokkene:45678",
      "@type": "prov:Entity",
      "type": "Betrokkene",
      "burgerservicenummer": "123456789"
    },
    {
      "@id": "urn:justid:activity:beschikbaarstellen:67890",
      "@type": "prov:Activity",
      "type": "BeschikbaarStellenUitkomst",
      "prov:wasAssociatedWith": "urn:justid:organisatie:om"
    },
    {
      "@id": "urn:justid:organisatie:om",
      "@type": "prov:Agent",
      "type": "Organisatie"
    }
  ]
}
```

Dit voorbeeld is bedoeld als richtinggevende specificatie. De exacte URI-strategie
en JSON-LD-context worden in een volgende iteratie vastgesteld.

## 13. Modellering burgerservicenummer

Het burgerservicenummer wordt opgenomen als attribuut van de Entity
`Betrokkene`.

Het burgerservicenummer:

- is een domeinattribuut van de Betrokkene;
- wordt gebruikt om de graph bevraagbaar te maken;
- wordt niet gebruikt als technische identifier van de PROV Entity;
- wordt niet als afzonderlijke Entity gemodelleerd.

De technische identifier van de Entity Betrokkene staat los van het
burgerservicenummer.

## 14. Event uitkomst ingezien

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


## 15. JSON-LD context en namespaces

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

## 16. Gebruik van domeinprefixen

Domeinbegrippen worden gekwalificeerd met de prefix `soh`.

Voorbeeld:

```json
{
  "@type": "soh:UitkomstOverleg"
}
```

Hiermee wordt voorkomen dat begrippen alleen als lokale namen worden geïnterpreteerd.

## 17. URI- en identifierstrategie

De strategie voor URI's en identifiers wordt verder onderzocht.

Daarbij wordt onderscheid gemaakt tussen:

- identifiers van begrippen;
- identifiers van domeinobjecten;
- technische identifiers voor provenance-elementen.

Een namespace voor begrippen en schema's is niet hetzelfde als de definitieve strategie voor identifiers van instanties.

Bij het bepalen van de strategie worden relevante overheidsbrede afspraken en standaarden betrokken.

## 18. Open punt

Open vraag:

Welke standaarden en afspraken zijn van toepassing op URI's en identifiers voor begrippen, informatieobjecten en instanties binnen de Samen onder handbereik-omgeving?

