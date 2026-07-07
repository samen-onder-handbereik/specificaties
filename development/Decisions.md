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
