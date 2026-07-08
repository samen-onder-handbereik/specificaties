# Release Notes

## Sprint 1

### Doel

Eerste herstructurering van de specificatie.

### Resultaat

- Eerste architectuur waarin CloudEvents, inzage-API en knowledge graph samenkomen.
- Gebruik van PROV-JSONLD.
- Eerste conceptueel graphmodel.
- Modellering van Betrokkene als Entity.

## Sprint 2

### Doel

Verdere uitwerking van de implementatiespecificatie.

### Toegevoegd

- CloudEvent-profiel opgenomen in `UitwisselenUitkomstOverleg.md`.
- Afspraken over CloudEvent-attributen toegevoegd.
- Betekenis van `subject` en `data` uitgewerkt.

### Gewijzigd

- CloudEvent-afspraken zijn onderdeel van de samenwerkfunctie-specificatie gemaakt.

### Nog uit te werken

- Volledige PROV-JSONLD voorbeelden.
- Graph Build Specification.
- Neo4j-specificatie.

## Sprint 2 - Markdown-correctie

### Aanleiding

Herstel van Markdown-opmaak. Geen inhoudelijke wijzigingen.

### Gewijzigd

- Tabellen teruggebracht naar GitHub Flavored Markdown.
- Geen conversie van Markdown naar andere tabelvormen meer.

## Sprint 3

### Doel

Vastleggen van de mapping tussen het informatiemodel en het PROV-model.

### Toegevoegd

- Mapping tussen domeinconcepten en PROV-elementen.
- Eerste afspraken over identifiers van Entity, Activity en Agent.
- Onderscheid gemaakt tussen domeinidentificatie en provenance-identificatie.

### Resultaat

De basis voor de concrete PROV-JSONLD-uitwerking is vastgelegd.

## Sprint 4

### Doel

Concrete uitwerking van CloudEvents en PROV-JSONLD voor de samenwerkfunctie Uitwisselen Uitkomst Overleg.

### Toegevoegd

- Eerste concrete PROV-JSONLD-uitwerking opgenomen.
- Relatie tussen CloudEvents en de provenance-graaf verder uitgewerkt.
- Event `uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld` uitgewerkt.
- Event `uitwisselen-uitkomst-overleg.uitkomst-ingezien` uitgewerkt.
- Modellering van burgerservicenummer als attribuut van Betrokkene vastgelegd.

### Ontwerpkeuzes

- Betrokkene blijft een Entity in de graph.
- Burgerservicenummer wordt gebruikt als domeinattribuut en niet als technische identifier.
- Beschikbaarstelling en inzage worden als afzonderlijke Activities gemodelleerd.


## Sprint 5

### Doel

Uitwerken van JSON-LD context, namespaces en identifierstrategie.

### Toegevoegd

- Eerste ontwerp voor JSON-LD context.
- Gebruik van prefixen voor PROV en Samen onder handbereik.
- Onderzoeksvraag voor URI- en identifierstrategie vastgelegd.

## Sprint 6

### Doel

Uitwerken van een volledig CloudEvent-contract inclusief PROV-JSONLD payload.

### Toegevoegd

- Volledig CloudEvent-voorbeeld opgenomen.
- Relatie tussen CloudEvent envelope en PROV-JSONLD payload verduidelijkt.
- JSON-LD context onderdeel gemaakt van het semantisch contract.


## Sprint 7

### Doel

Consolidatie en structurering van de specificatie.

### Toegevoegd

- Handmatige paragraafnummering verwijderd uit de specificatiebron.
- PROV-JSONLD-model en volledig CloudEvent-voorbeeld van elkaar onderscheiden.
- JSON-LD-modellering met meervoudige `@type` uitgewerkt.
