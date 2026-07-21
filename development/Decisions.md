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



## ADR-016 -- Asynchrone interactie als standaardpatroon

### Status

Geaccepteerd

### Besluit

Binnen Samen Onder Handbereik worden interacties asynchroon afgehandeld.
Specifieke API's geven invulling aan dit generieke interactiepatroon.

### Motivatie

Asynchrone verwerking maakt het mogelijk om interacties los te koppelen van
de verwerkingstijd en ondersteunt een uniforme wijze van status- en
resultaatverwerking.

### Consequenties

De CloudEvent API en Query-API worden beschreven als toepassingen van het
generieke patroon. De Status-API wordt beschouwd als een ondersteunende functie
voor het volgen van asynchroon uitgevoerde interacties.


## ADR-017 -- Identifier van inzage-resource is gelijk aan Entity identifier

### Status

Geaccepteerd

### Besluit

De identifier waarmee een Uitkomst Overleg via de inzage-API wordt geraadpleegd
is gelijk aan de identifier van de betreffende Entity in de Knowledge graph.

### Motivatie

Hiermee wordt voorkomen dat voor hetzelfde informatieobject meerdere
identifiers ontstaan. De identiteit van het informatieobject blijft onafhankelijk
van de technische inrichting van de inzage-API.

### Consequenties

De technische ontsluiting wordt bepaald door endpoint en pad van de inzage-API.
Deze kunnen wijzigen zonder dat de identiteit van het informatieobject verandert.




## ADR-018 -- Scheiding generieke en samenwerkfunctie-specifieke OpenAPI-specificaties

### Status

Geaccepteerd

### Besluit

Binnen Samen Onder Handbereik wordt onderscheid gemaakt tussen:

- een generieke OpenAPI-specificatie voor het asynchrone interactiepatroon;
- samenwerkfunctie-specifieke OpenAPI-specificaties.

De generieke OpenAPI-specificatie beschrijft het aanbieden van CloudEvents,
de ontvangstbevestiging en de Status-API.

De samenwerkfunctie-specifieke OpenAPI-specificatie beschrijft de
CloudEvent-profielen, payloadstructuren en Query-API's die bij een specifieke
samenwerkfunctie horen.

### Motivatie

Het generieke mechanisme voor asynchrone verwerking moet losstaan van de
inhoudelijke betekenis van gebeurtenissen en informatievragen.

Door deze scheiding kan het asynchrone interactiepatroon worden hergebruikt
zonder samenwerkfunctie-specifieke semantiek in generieke API-contracten op te
nemen.

### Consequenties

Nieuwe samenwerkfuncties kunnen een eigen OpenAPI-specificatie opstellen voor
hun CloudEvent-profielen en Query-API's, terwijl zij gebruikmaken van hetzelfde
generieke asynchrone interactiepatroon.




## ADR-019 -- Scheiding provenance- en domeinmodellering in specificaties

### Status

Geaccepteerd

### Besluit

Binnen samenwerkfunctie-specificaties wordt onderscheid gemaakt tussen:

- provenance-modellering: beschrijving van herkomst, activiteiten en verantwoordelijke actoren volgens PROV;
- domeinmodellering: beschrijving van informatieobjecten, domeinconcepten en domeinkenmerken.

### Motivatie

Provenance-informatie en domeininformatie hebben verschillende betekenissen.
Door deze gescheiden te beschrijven blijft duidelijk welke informatie de
totstandkoming en het gebruik van gegevens beschrijft en welke informatie
onderdeel is van het domeinmodel.

### Consequenties

Domeinconcepten zoals Betrokkene en Uitkomst Overleg worden beschreven binnen
de domeinmodellering. PROV-elementen zoals Entity, Activity en Agent worden
beschreven binnen de provenance-modellering.




## ADR-020 -- Query-resultaat bevat verwijzing naar inzage-resource

### Status

Geaccepteerd

### Besluit

Een resultaat van een Query-API bevat naast de identificatie en relevante kenmerken
van een informatieobject ook een verwijzing (`inzageUrl`) waarmee de inhoudelijke
resource via de inzage-API kan worden geraadpleegd.

### Motivatie

De Query-API ontsluit informatie uit de Knowledge graph. De gebruiker van een query
heeft naast de gevonden objectidentificatie ook behoefte aan een eenduidige manier
om de inhoudelijke informatie op te vragen.

### Consequenties

De Knowledge graph bevat de informatie die nodig is om de inzageUrl op te bouwen.
De technische ontsluiting blijft gescheiden van de identiteit van het
informatieobject.





## ADR-021 -- Graph-nodes combineren PROV- en domeintypen

### Status

Geaccepteerd

### Besluit

Binnen de Knowledge graph kan één node zowel een PROV-type als een
domeinspecifiek type representeren.

### Motivatie

Een informatieobject kan vanuit meerdere perspectieven worden beschreven.
Het PROV-model beschrijft de rol binnen provenance, terwijl het
domeintype de betekenis binnen het domeinmodel beschrijft.

### Consequenties

PROV-typen en domeintypen worden niet als afzonderlijke graph-objecten
gemodelleerd. Een node kan meerdere semantische typen hebben.

