# Architecture Decisions

## ADR-001 -- Gebruik van PROV-JSONLD

### Status

Geaccepteerd

### Besluit

Voor provenance-informatie in CloudEvents wordt PROV-JSONLD gebruikt.

### Motivatie

PROV biedt een gestandaardiseerd model voor het beschrijven van herkomst
en gebruik van informatie.

### Consequenties

De CloudEvent-payload bevat een PROV-JSONLD-graaf.

## ADR-002 -- Betrokkene wordt als Entity gemodelleerd

### Status

Geaccepteerd

### Besluit

De Betrokkene wordt als afzonderlijke Entity opgenomen in de graph.

### Motivatie

De graph moet bevraagbaar zijn op basis van het burgerservicenummer.

### Consequenties

De graph bevat naast provenance ook domeinankers.

## ADR-003 -- Besluiten en acties worden niet als PROV Entity opgenomen

### Status

Geaccepteerd

### Besluit

Besluiten en acties blijven onderdeel van de inhoud die via de
inzage-API wordt geleverd.

### Motivatie

Voorkomen van duplicatie en scheiding tussen inhoud en provenance.

## ADR-004 -- Specifieke CloudEvent-afspraken horen bij de samenwerkfunctie

### Status

Geaccepteerd

### Besluit

Afspraken die specifiek zijn voor Uitwisselen Uitkomst Overleg worden
opgenomen in hoofdstuk 6.

### Motivatie

Generieke afspraken horen bij hoofdstuk 4; domeinspecifieke afspraken
horen bij de samenwerkfunctie.
