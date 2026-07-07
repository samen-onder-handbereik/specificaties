# Architecture Decisions

## ADR-001 – Gebruik van PROV-JSONLD

### Status
Geaccepteerd

### Besluit
Voor provenance-informatie in CloudEvents wordt PROV-JSONLD gebruikt.

### Motivatie
PROV biedt een gestandaardiseerd model voor het beschrijven van herkomst en gebruik van informatie.

### Consequenties
De CloudEvent-payload bevat een PROV-JSONLD-graaf.


## ADR-002 – Betrokkene wordt als Entity gemodelleerd

### Status
Geaccepteerd

### Besluit
De Betrokkene wordt als afzonderlijke Entity opgenomen in de graph.

### Motivatie
De graph moet bevraagbaar zijn op basis van het burgerservicenummer, bijvoorbeeld tijdens een ZSM-overleg.

### Consequenties
De graph bevat naast provenance ook domeinankers.


## ADR-003 – Besluiten en acties worden niet als PROV Entity opgenomen

### Status
Geaccepteerd

### Besluit
Besluiten en acties blijven onderdeel van de inhoud die via de inzage-API wordt geleverd.

### Motivatie
Voorkomen van duplicatie en scheiding tussen inhoud en provenance.
