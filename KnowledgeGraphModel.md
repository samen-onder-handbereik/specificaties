# Knowledge graph-model

## Inleiding

De Knowledge graph ondersteunt het semantisch vastleggen, verbinden en
bevragen van informatieobjecten en de herkomst daarvan.

De Knowledge graph combineert twee perspectieven:

-   het domeinperspectief, waarin informatieobjecten en gebeurtenissen
    betekenis krijgen binnen een samenwerkfunctie;
-   het provenanceperspectief, waarin de herkomst, totstandkoming en het
    gebruik van informatie wordt vastgelegd.

De Knowledge graph wordt gerealiseerd met Neo4j. Neo4j is de technische
opslagvoorziening voor het graphmodel, maar het semantische model is
leidend voor de inrichting.

## Uitgangspunten

### Geen opslag van CloudEvents

De Knowledge graph is geen opslag van ontvangen CloudEvents.

Een CloudEvent beschrijft een gebeurtenis die heeft plaatsgevonden en
kan aanleiding geven tot het vastleggen van provenance-informatie.

De graph bevat:

-   informatieobjecten;
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
  "@id": "urn:uitkomst-overleg:98765",
  "@type": [
    "prov:Entity",
    "soh:UitkomstOverleg"
  ]
}
```

In Neo4j wordt dit bijvoorbeeld weergegeven als:

    (:Entity:UitkomstOverleg)

## Generiek graphmodel

Het generieke model gebruikt de PROV-concepten:

-   `prov:Entity`
    -   Informatieobject.
-   `prov:Activity`
    -   Activiteit waardoor informatie ontstaat, wijzigt of wordt
        gebruikt.
-   `prov:Agent`
    -   Actor die betrokken is bij activiteiten.

Deze concepten worden aangevuld met domeinspecifieke typen.

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

Voorbeelden van PROV-relaties:

    (:Activity:BeschikbaarStellenUitkomstOverleg)
            |
            | prov:generated
            v
    (:Entity:UitkomstOverleg)

Voorbeelden van domeinspecifieke relaties:

    (:UitkomstOverleg)
            |
            | heeftBetrokkene
            v
    (:Betrokkene)

Een relatie beschrijft altijd een betekenisvol verband tussen twee
objecten. Een samenwerkfunctie bepaalt welke domeinspecifieke relaties
worden vastgelegd.

## Modellering van nodes

### Domeinobjecten

Domeinobjecten worden gemodelleerd als nodes met:

-   een PROV-type indien relevant;
-   één of meer domeinspecifieke labels;
-   eigenschappen die bij het object horen.

Voorbeeld:

    (:Entity:UitkomstOverleg {
        identifier: "uitkomst-overleg-98765",
        beschikbaarGesteldOp: "2026-01-15T10:30:00Z"
    })

### Activiteiten

Activiteiten worden gemodelleerd als nodes met:

-   label `Activity`;
-   een samenwerkfunctie-specifiek activiteitstype;
-   eigenschappen die de activiteit beschrijven.

Voorbeeld:

    (:Activity:BeschikbaarStellenUitkomstOverleg {
        identifier: "urn:activity:beschikbaarstellen:12345"
    })

De identifier van een Activity identificeert de provenance-activiteit en
heeft geen betekenis binnen het domeinmodel.

## Meervoudige relaties

Een informatieobject kan betrokken zijn bij meerdere activiteiten en
relaties.

Een `UitkomstOverleg` kan bijvoorbeeld:

-   beschikbaar zijn gesteld;
-   zijn ingezien;
-   onderdeel zijn van meerdere provenance-ketens.

Daarom wordt provenance gekoppeld aan activiteiten en niet rechtstreeks
aan het informatieobject.

## Relatie met CloudEvents

Een CloudEvent beschrijft de gebeurtenis waarmee een activiteit wordt
gemeld.

Het attribuut `id` van een CloudEvent identificeert het CloudEvent zelf.

Het CloudEvent-id:

-   wordt niet gebruikt als identifier van een Activity;
-   wordt niet gebruikt als identifier van een Entity;
-   wordt niet als zelfstandig object in de Knowledge graph opgenomen.

Wanneer provenance wordt opgebouwd vanuit een CloudEvent, kan de relatie
met het oorspronkelijke CloudEvent worden vastgelegd op de Activity.

Voorbeeld:

    (:Activity:BeschikbaarStellenUitkomstOverleg {
        identifier: "urn:activity:beschikbaarstellen:12345",
        cloudEventId: "event-12345"
    })

## Identificatie

Binnen de Knowledge graph bestaan verschillende soorten identifiers:

-   **CloudEvent `id`**
    -   technische identificatie van het event.
-   **Activity identifier**
    -   identificatie van de provenance-activiteit.
-   **Entity identifier**
    -   identificatie van het domeinobject.

Deze identifiers worden niet door elkaar gebruikt.

## Vertaling naar Neo4j

### Labels

Semantische typen worden vertaald naar Neo4j-labels.

Voorbeelden:

-   `prov:Entity` wordt vertaald naar label `Entity`.
-   `prov:Activity` wordt vertaald naar label `Activity`.
-   `prov:Agent` wordt vertaald naar label `Agent`.
-   `soh:UitkomstOverleg` wordt vertaald naar label `UitkomstOverleg`.

Een node kan meerdere labels hebben.

### Properties

Eigenschappen worden opgeslagen als node-properties.

Voorbeelden:

    (:Entity:UitkomstOverleg {
        identifier: "..."
    })

en:

    (:Activity:BeschikbaarStellenUitkomstOverleg {
        identifier: "...",
        cloudEventId: "..."
    })

## Conceptueel voorbeeld

Een eenvoudige representatie van de samenhang:

    (:Agent:Organisatie)
              |
              | prov:wasAssociatedWith
              v
    (:Activity:BeschikbaarStellenUitkomstOverleg)
              |
              | prov:generated
              v
    (:Entity:UitkomstOverleg)
              |
              | heeftBetrokkene
              v
    (:Entity:Betrokkene)

## Samenwerkfunctie-specifieke uitbreiding

Een samenwerkfunctie bepaalt:

-   welke domeinobjecten voorkomen;
-   welke activiteiten relevant zijn;
-   welke relaties worden vastgelegd;
-   welke eigenschappen beschikbaar zijn.

Het generieke graphmodel beschrijft de betekenis van de elementen. De
samenwerkfunctie-specifieke specificatie beschrijft de concrete
invulling.
