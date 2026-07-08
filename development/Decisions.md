# Architecture Decisions

## ADR-001 -- Gebruik van PROV-JSONLD

### Status

Geaccepteerd

### Besluit

Voor provenance-informatie in CloudEvents wordt PROV-JSONLD gebruikt.


## ADR-002 -- Betrokkene wordt als Entity gemodelleerd

### Status

Geaccepteerd

### Besluit

De Betrokkene wordt als afzonderlijke Entity opgenomen in de graph.


## ADR-003 -- Besluiten en acties worden niet als PROV Entity opgenomen

### Status

Geaccepteerd

### Besluit

Besluiten en acties blijven onderdeel van de inhoud die via de inzage-API wordt geleverd.


## ADR-004 -- Specifieke CloudEvent-afspraken horen bij de samenwerkfunctie

### Status

Geaccepteerd

### Besluit

Afspraken die specifiek zijn voor Uitwisselen Uitkomst Overleg worden opgenomen in hoofdstuk 6.


## ADR-005 -- Activities krijgen een technische identifier

### Status

Geaccepteerd

### Besluit

Iedere uitvoering van een Activity krijgt een eigen identifier voor provenance-doeleinden.

### Motivatie

PROV-relaties moeten kunnen verwijzen naar een concrete uitvoering van een activiteit.

### Consequenties

De identifier van een Activity is geen businessidentifier en heeft geen betekenis in het domeinmodel.


## ADR-006 -- Domeinidentificatie en provenance-identificatie worden onderscheiden

### Status

Geaccepteerd

### Besluit

Identifiers van domeinobjecten worden onderscheiden van technische identifiers voor provenance-elementen.

### Motivatie

Een UitkomstOverleg of Betrokkene heeft een eigen identiteit, terwijl een Activity een gebeurtenis representeert.

### Consequenties

De graph bevat zowel domeinidentifiers als provenance-identifiers.


## ADR-007 -- Burgerservicenummer als attribuut van Betrokkene

### Status

Geaccepteerd

### Besluit

Het burgerservicenummer wordt opgenomen als attribuut van de Entity Betrokkene.

### Motivatie

De graph moet bevraagbaar zijn op basis van het burgerservicenummer, bijvoorbeeld tijdens een ZSM-overleg.

### Consequenties

Het burgerservicenummer is geen technische identifier van de PROV Entity en wordt niet als aparte Entity gemodelleerd.


## ADR-008 -- Beschikbaarstelling en inzage als afzonderlijke Activities

### Status

Geaccepteerd

### Besluit

Het beschikbaar stellen van een Uitkomst Overleg en het inzien daarvan worden als afzonderlijke provenance-activiteiten gemodelleerd.

### Motivatie

Beschikbaarstelling en inzage hebben verschillende betekenis binnen provenance en auditing.


## ADR-009 -- Gebruik van namespaces in JSON-LD

### Status

Geaccepteerd

### Besluit

JSON-LD contexten worden gebruikt om namespaces en prefixen expliciet te definiëren.

### Consequenties

PROV-begrippen en domeinbegrippen worden herkenbaar onderscheiden.


## ADR-010 -- URI- en identifierstrategie wordt afzonderlijk uitgewerkt

### Status

Open

### Besluit

Er wordt geen definitieve keuze gemaakt voor instantie-identifiers voordat relevante standaarden zijn onderzocht.

### Motivatie

Begrippen, domeinobjecten en provenance-elementen kunnen verschillende identificatiebehoeften hebben.

## ADR-011 -- CloudEvent bevat PROV-JSONLD in data

### Status

Geaccepteerd

### Besluit

De provenance-graaf wordt opgenomen in het `data`-attribuut van het CloudEvent.


## ADR-012 -- JSON-LD context maakt onderdeel uit van het semantisch contract

### Status

Geaccepteerd

### Besluit

De JSON-LD context is onderdeel van de afspraken over de betekenis van de payload.


## ADR-013 -- Markdown-bron gebruikt geen handmatige paragraafnummering

### Status

Geaccepteerd

### Besluit

De Markdown-bron gebruikt alleen kopniveau's. Nummering wordt door Respec gegenereerd.


## ADR-014 -- Domeinclassificatie via meervoudige JSON-LD @type

### Status

Geaccepteerd

### Besluit

Domeinbegrippen worden in JSON-LD als aanvullende `@type`-waarden naast PROV-types opgenomen.


## ADR-015 -- Query-API's zijn samenwerkfunctie-specifiek

### Status

Geaccepteerd

### Besluit

Query-API's worden niet generiek gedefinieerd, maar maken onderdeel uit van de
betreffende samenwerkfunctie.

### Motivatie

De mogelijke queries zijn afhankelijk van de betekenis van de gegevens en de
informatiebehoefte binnen een samenwerkfunctie.

### Consequenties

Iedere samenwerkfunctie bepaalt welke querymogelijkheden beschikbaar zijn en
legt deze vast in een eigen API-specificatie.
