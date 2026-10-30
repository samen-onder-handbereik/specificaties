# Knowledge graph-model

## Inleiding

De Knowledge graph ondersteunt het semantisch vastleggen, verbinden en
bevragen van informatieobjecten en de herkomst daarvan.

De Knowledge graph combineert twee perspectieven:

-   het domeinperspectief, waarin informatieobjecten en gebeurtenissen
    betekenis krijgen binnen een samenwerkfunctie;
-   het provenanceperspectief, waarin de herkomst, totstandkoming en het
    gebruik van informatie wordt vastgelegd.

De Knowledge Graph wordt gerealiseerd met behulp van een graph-database.
Deze vormt de technische opslagvoorziening voor het graphmodel; het
semantische model is leidend voor de inrichting.

## Uitgangspunten

### Geen opslag van CloudEvents

De Knowledge graph is geen opslag van ontvangen CloudEvents.

Een CloudEvent beschrijft een gebeurtenis die heeft plaatsgevonden en
kan aanleiding geven tot het vastleggen van provenance-informatie.

De graph bevat:

-   entiteiten;
-   activiteiten;
-   actoren;
-   relaties tussen deze elementen.

Het CloudEvent zelf wordt niet als zelfstandig object in de Knowledge
graph opgenomen.

### Eén object, meerdere perspectieven

Een informatieobject kan vanuit meerdere perspectieven worden
beschreven.

Een object kan tegelijkertijd:

-   een PROV-element zijn;
-   een domeinobject zijn binnen een samenwerkfunctie.

Deze perspectieven leiden niet tot afzonderlijke nodes. Een node
representeert het object zelf en kan meerdere typen hebben.

Voorbeeld:

``` json
{
  "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e50",
  "@type": [
    "prov:Entity",
    "soh:UitkomstOverleg"
  ]
}
```

Technisch wordt dit bijvoorbeeld weergegeven als:

    (:Entity:UitkomstOverleg)

De node heeft zowel het label `Entity`, dat overeenkomt met `prov:Entity`,
als het label `UitkomstOverleg`, dat overeenkomt met `soh:UitkomstOverleg`.

## Generiek graphmodel

Het generieke model gebruikt de volgende PROV-concepten:

-   `prov:Entity`
    -   Informatieobject.
-   `prov:Activity`
    -   Activiteit waardoor informatie ontstaat, wijzigt of wordt
        gebruikt.
-   `prov:Agent`
    -   Actor die betrokken is bij activiteiten.

Deze PROV-klassen worden verbonden door **PROV-relaties**, zoals
`prov:wasGeneratedBy`, `prov:wasAssociatedWith` en
`prov:wasAttributedTo`. De relaties beschrijven de provenance-verbanden
tussen Entities, Activities en Agents.

Deze concepten worden aangevuld met domeinspecifieke typen.
Domeinspecifieke typen, eigenschappen en relaties worden vastgelegd
binnen de eigen `soh:`-namespace. In de voorbeelden wordt hiervoor de
prefix `soh:` gebruikt.

### Naamgeving van domeineigenschappen in JSON-LD

Een domeineigenschap in een JSON-LD-representatie wordt gekwalificeerd met
de naam van het concept waarop de eigenschap betrekking heeft. De vorm is
`soh:<Concept>.<eigenschap>`, bijvoorbeeld `soh:Betrokkene.identificatieType`
en `soh:Casusoverleg.identifier`. Deze conventie maakt expliciet bij welk
concept een eigenschap hoort en voorkomt dat gelijknamige eigenschappen van
verschillende concepten dezelfde term-URI krijgen.

De puntnotatie is onderdeel van de lokale termnaam binnen de `soh:`-namespace.
De JSON-LD-`@context` bevat hiervoor geen afzonderlijke termdefinities; deze
bevat alleen de prefixdefinities die voor de representatie nodig zijn.

Deze conventie betreft domeineigenschappen. Domeintypen en relaties, zoals
`soh:Betrokkene` en `soh:heeftBetrokkene`, behouden hun eigen termnaam.

Voorbeelden:

    (:Entity:UitkomstOverleg)

    (:Activity:BeschikbaarStellenUitkomstOverleg)

    (:Agent:Organisatie)

De PROV-typen beschrijven de algemene betekenis. De domeinspecifieke
typen beschrijven de betekenis binnen een samenwerkfunctie.

## Modellering van relaties

Relaties verbinden nodes en beschrijven betekenisvolle verbanden.

Er wordt onderscheid gemaakt tussen:

-   PROV-relaties;
-   domeinspecifieke relaties.

Voorbeeld van een PROV-relatie:

    (:Activity)
            |
            | prov:generated
            v
    (:Entity)

In dit grafische voorbeeld wordt de relatie weergegeven vanuit het
perspectief dat voor de lezer het meest natuurlijk is. `prov:generated`
wordt weergegeven van Activity naar Entity. In RDF is de
corresponderende relatie `prov:wasGeneratedBy` gericht van Entity naar
Activity.

Domeinspecifieke relaties verbinden domeinobjecten en worden vastgelegd
binnen de namespace van de betreffende samenwerkfunctie. In de voorbeelden
wordt hiervoor de prefix `soh:` gebruikt. Een domeinspecifieke relatie
maakt zichtbaar dat het verband niet door PROV wordt gedefinieerd, maar
voortkomt uit het domeinmodel.

Een relatie beschrijft altijd een betekenisvol verband tussen twee
objecten. De samenwerkfunctie bepaalt welke domeinspecifieke relaties
worden vastgelegd en wat hun richting en betekenis zijn.

## Modellering van nodes

### Domeinobjecten

Domeinobjecten worden gemodelleerd als nodes met:

-   een PROV-type indien relevant;
-   één of meer domeinspecifieke labels;
-   eigenschappen die bij het object horen.

Een domeinobject kan met een ander domeinobject worden verbonden
via een domeinspecifieke relatie. De concrete typen, eigenschappen,
relatienaam en relatierichting worden bepaald door het informatiemodel
van de samenwerkfunctie.

### Activiteiten

Activiteiten worden gemodelleerd als nodes met:

-   label `Activity`;
-   een samenwerkfunctie-specifiek activiteitstype;
-   eigenschappen die de activiteit beschrijven.

Ook een Activity krijgt een eigen `@id`, net als iedere andere node in de
Knowledge graph. Deze `@id` is een UUIDv7-URI en identificeert de node.
Er wordt geen afzonderlijke `Activity.identifier` gebruikt.

## Meervoudige relaties

Een informatieobject kan betrokken zijn bij meerdere activiteiten en
relaties.

Een domeinobject kan bijvoorbeeld:

-   met andere domeinobjecten verbonden zijn;
-   door verschillende activiteiten zijn gegenereerd of gebruikt;
-   betrokken zijn bij meerdere provenance-ketens.

Daarom wordt provenance gekoppeld aan activiteiten en niet rechtstreeks
aan het informatieobject.

## Relatie met CloudEvents

Een CloudEvent beschrijft de gebeurtenis waarmee een activiteit wordt
gemeld. Het attribuut `time` van het CloudEvent geeft het tijdstip aan
waarop de gebeurtenis is geregistreerd. Dit is niet noodzakelijk het
tijdstip waarop de bijbehorende activiteit daadwerkelijk heeft
plaatsgevonden.

Als het daadwerkelijke tijdstip van de activiteit relevant is en
beschikbaar is, wordt dit als onderdeel van de provenance-informatie van
de Activity vastgelegd.

Het attribuut `id` van een CloudEvent identificeert het CloudEvent zelf.

Het CloudEvent-id:

-   is niet de `@id` van een Activity of Entity;
-   wordt niet als zelfstandig object in de Knowledge graph opgenomen.

Wanneer provenance wordt opgebouwd vanuit een CloudEvent, wordt het
oorspronkelijke CloudEvent-id verplicht op de Activity vastgelegd met de
domeineigenschap `soh:Activity.cloudEventId`. Daarmee blijft de herkomst van
de provenance-informatie herleidbaar tot het ontvangen CloudEvent.

Voorbeeld:

    (:Activity {
        "soh:Activity.cloudEventId": "0199f0a0-1234-7abc-8def-012345678901"
    })

De Activity zelf heeft daarnaast een eigen `@id` (UUIDv7-URI), die
onafhankelijk is van het CloudEvent-id.

## Validatie van provenance-gegevens

Wanneer provenance-informatie via een CloudEvent als PROV-JSONLD wordt
aangeleverd, kan de JSON-structuur worden gecontroleerd met het
[PROV-JSON-LD JSON Schema](jsonschema/prov-jsonld.schema.json).

Deze validatie ondersteunt de technische verwerking van de payload, maar
garandeert niet dat de volledige provenance-graaf semantisch correct is.
Semantische validatie, bijvoorbeeld met SHACL, kan in een toekomstige
uitbreiding worden toegevoegd.

## Identificatie van personen en organisaties

Voor de identificatie van personen en organisaties kunnen verschillende
soorten identificatienummers worden gebruikt. Een identificatie bestaat uit
een typering en een identificatiewaarde. De typering geeft aan om welk soort
identificatienummer het gaat, bijvoorbeeld een BSN, V-nummer, OIN of
KvK-nummer, en wordt benoemd als het soort persoonsidentificatie of het soort
organisatieidentificatie.

Dit uitgangspunt geldt voor de hele gegevensketen: de aanlevering van gegevens
via CloudEvents, de opslag en modellering in de Knowledge graph, de bevraging
van de Knowledge graph en de representatie van personen en organisaties in
queryresultaten.

De `@id` waarmee een persoon of organisatie als object in de Knowledge graph wordt
geïdentificeerd, staat los van de domeinidentificatie. Een identificatienummer
wordt dus niet automatisch gebruikt als `@id` van een `prov:Agent`,
`prov:Entity` of ander domeinobject.

Identificatiegegevens worden, waar ze onderdeel zijn van de aangeleverde of
teruggegeven domeingegevens, bij de persoon of organisatie gerepresenteerd als één combinatie
van typering en waarde. Daarvoor wordt geen afzonderlijk benoemd domeinobject
of PROV-element voor de identificatie geïntroduceerd. De
samenwerkfunctie-specificatie bepaalt hoe deze combinatie wordt aangeleverd,
opgeslagen, teruggegeven en gebruikt bij bevraging.

## Identificatie van nodes

Iedere node in de Knowledge graph krijgt een eigen `@id`. Deze
identificatie wordt gevormd door een UUIDv7, weergegeven als URI met het
schema `urn:uuid:`. Dit geldt voor zowel PROV-nodes (`Entity`, `Activity`
en `Agent`) als domeinspecifieke nodes.

De `@id` identificeert de node in de Knowledge graph. Een node behoudt
dezelfde `@id` wanneer deze in verschillende CloudEvents, queryresultaten
of andere representaties voorkomt. Er wordt dus geen nieuwe `@id`
gegenereerd telkens wanneer dezelfde node opnieuw wordt opgenomen in een
bericht of resultaat.

Een identifier uit een bronsysteem, zoals
`soh:Casusoverleg.identifier`, blijft een afzonderlijke domeineigenschap.
Deze kan worden gebruikt om een node te vinden of aan een bestaande node
te koppelen, maar vervangt de `@id` niet.

Het CloudEvent-attribuut `id` identificeert het CloudEvent zelf en staat
eveneens los van de `@id` van de nodes die op basis van dat event worden
vastgelegd. Het oorspronkelijke CloudEvent-id wordt verplicht als
`soh:Activity.cloudEventId` op de betreffende Activity bewaard.


## Technische representatie

De technische representatie vertaalt het semantische graphmodel naar
nodes, labels, properties en relaties. Deze representatie is
productonafhankelijk beschreven.

### Labels

Semantische typen worden vertaald naar labels.

Voorbeelden:

-   `prov:Entity` wordt vertaald naar label `Entity`.
-   `prov:Activity` wordt vertaald naar label `Activity`.
-   `prov:Agent` wordt vertaald naar label `Agent`.
Domeinspecifieke typen worden op overeenkomstige wijze vertaald naar
labels die bij de betreffende samenwerkfunctie horen.

Een node kan meerdere labels hebben.

### Properties

Eigenschappen worden opgeslagen als node-properties.

De `@id` van een node wordt in de JSON-LD-representatie opgenomen als
`@id`. In de graph-database wordt deze identificatie als technische
node-identificatie opgeslagen. De precieze opslagmapping is
implementatieafhankelijk; `@id` is de semantische identificatie in de
uitgewisselde representatie.

Voorbeelden van JSON-LD-nodes:

```json
{
  "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e50",
  "@type": ["prov:Entity", "soh:UitkomstOverleg"],
  "soh:UitkomstOverleg.beschikbaarGesteldOp": "2026-01-15T10:30:00Z"
}
```

```json
{
  "@id": "urn:uuid:019a8b7c-4d21-7e32-9a51-8c6f2b3d4e51",
  "@type": ["prov:Activity", "soh:BeschikbaarStellenUitkomstOverleg"],
  "soh:Activity.cloudEventId": "0199f0a0-1234-7abc-8def-012345678901"
}
```

## Conceptueel voorbeeld

Een generieke PROV-samenhang kan er als volgt uitzien:

    (:Agent)
          |
          | prov:wasAssociatedWith
          v
    (:Activity)
          |
          | prov:generated
          v
    (:Entity)

De domeinspecifieke objecten en relaties die daarnaast in de Knowledge
graph voorkomen, worden beschreven in de specificatie van de betreffende
samenwerkfunctie.

De voorbeelden en het informatiemodel van de samenwerkfuncties zijn
interactief te bekijken in de [kennis-graph](kennis-graph.html).

## Samenwerkfunctie-specifieke uitbreiding

Een samenwerkfunctie bepaalt:

-   welke domeinobjecten voorkomen;
-   welke activiteiten relevant zijn;
-   welke relaties worden vastgelegd;
-   welke eigenschappen beschikbaar zijn.

Het generieke graphmodel beschrijft de betekenis van de elementen. De
samenwerkfunctie-specifieke specificatie beschrijft de concrete
invulling.
