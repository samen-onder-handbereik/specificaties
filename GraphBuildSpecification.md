# Graph Build Specification

## Inleiding

De Graph Build Specification beschrijft hoe de Knowledge graph wordt
opgebouwd vanuit gebeurtenissen en domeingegevens.

Het hoofdstuk [Knowledge graph-model](#knowledge-graph-model) beschrijft de
betekenis en structuur van de Knowledge graph. Deze Graph Build
Specification beschrijft de regels waarmee die structuur wordt gevuld.

De Graph Build Specification vormt de verbinding tussen:

- de gebeurtenissen die via CloudEvents worden ontvangen;
- de provenance-modellering volgens PROV;
- de domeinmodellering binnen Samen Onder Handbereik;
- de technische realisatie van de Knowledge graph.

Deze specificatie beschrijft de functionele en semantische uitgangspunten
voor het opbouwen van de graph. De concrete technische inrichting binnen
Neo4j, zoals de keuze voor specifieke indexen, constraints en
implementatiepatronen, wordt door de ontwikkelaars bepaald binnen de
kaders van deze specificatie.

## Uitgangspunten

### De Knowledge graph wordt opgebouwd uit gebeurtenissen

De primaire bron voor het opbouwen van provenance-informatie zijn de
CloudEvents die binnen de samenwerkfuncties worden verwerkt.

Een CloudEvent leidt niet rechtstreeks tot een domeinnode. Eerst wordt
bepaald welke provenance-activiteit het event representeert.

```
CloudEvent
    |
    v
prov:Activity
    |
    v
prov:Entity
```

### Identiteiten worden niet hergebruikt

Bij het opbouwen van de Knowledge graph worden verschillende soorten
identificaties onderscheiden.

- `CloudEvent.id`
  - Identificeert het CloudEvent zelf.

- `Activity.identifier`
  - Identificeert de provenance-activiteit.

- `Entity.identifier`
  - Identificeert het domeinobject.

Deze identificaties hebben ieder hun eigen betekenis en worden niet
onderling vervangen.

## Algemene mappingregels

### CloudEvent naar Activity

Een ontvangen CloudEvent wordt vertaald naar een PROV Activity wanneer
het event aanleiding geeft tot het vastleggen van een betekenisvolle
gebeurtenis binnen de Knowledge graph.

De Activity bevat minimaal:

- een eigen identifier;
- het type activiteit;
- een verwijzing naar het oorspronkelijke CloudEvent.

Voorbeeld:

```
(:Activity:BeschikbaarStellenUitkomstOverleg)
{
    identifier: "urn:activity:12345",
    cloudEventId: "event-12345"
}
```

De waarde `cloudEventId` verwijst naar het oorspronkelijke CloudEvent en
is niet de identifier van de Activity.

### Activity naar Entity

Een Activity kan leiden tot het ontstaan of beschikbaar komen van een
domeinobject.

```
(:Activity:BeschikbaarStellenUitkomstOverleg)
        |
        | prov:generated
        v
(:Entity:UitkomstOverleg)
```

De Entity krijgt een eigen identifier.

## Eventtype naar graphmapping

Een CloudEvent-type bepaalt welke provenance-activiteit en welke
domeinobjecten bij de gebeurtenis horen.

De mapping tussen eventtypen en graph-elementen wordt per
samenwerkfunctie vastgelegd.

Voorbeeld Uitwisselen Uitkomst Overleg:

CloudEvent type:

```
uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld
```

leidt tot:

```
Activity:
BeschikbaarStellenUitkomstOverleg

Entity:
UitkomstOverleg
```

met relatie:

```
(Activity)-[:GENERATED]->(Entity)
```

De concrete mapping van eventtypen naar Activities, Entities en relaties
maakt onderdeel uit van de samenwerkfunctie-specifieke uitwerking.

## Mapping van domeinobjecten

Een domeinobject wordt als één node opgenomen in de Knowledge graph.

Een node kan meerdere typen hebben:

- een PROV-type;
- één of meer domeinspecifieke typen.

Voorbeeld:

```
(:Entity:UitkomstOverleg)
```

Deze node representeert zowel `prov:Entity` als
`soh:UitkomstOverleg`.

Er wordt geen afzonderlijke node gemaakt voor het PROV-type en het
domeintype.

## Idempotente verwerking

CloudEvents kunnen meer dan één keer worden aangeboden.

De opbouw van de Knowledge graph moet daarom idempotent zijn.

Dit betekent:

- hetzelfde CloudEvent mag niet leiden tot meerdere provenance-
  activiteiten;
- dezelfde activiteit mag niet leiden tot dubbele domeinobjecten;
- bestaande relaties worden herkend en niet onnodig opnieuw aangemaakt.

De wijze waarop deze herkenning technisch wordt gerealiseerd, wordt
uitgewerkt in de technische Neo4j-inrichting.

## Relaties

De Graph Build Specification bepaalt welke relaties worden aangemaakt
tussen nodes.

Daarbij wordt onderscheid gemaakt tussen:

- PROV-relaties;
- domeinspecifieke relaties.

De exacte technische naamgeving van Neo4j-relaties wordt vastgesteld in
de technische uitwerking.

## Samenwerkfunctie-specifieke mappings

Een samenwerkfunctie bepaalt:

- welke CloudEvents relevant zijn;
- welke Activities worden gemaakt;
- welke Entities ontstaan;
- welke relaties worden gelegd;
- welke eigenschappen beschikbaar zijn.

De generieke Graph Build Specification beschrijft de uitgangspunten.
De samenwerkfunctie-specifieke specificatie beschrijft de concrete
invulling.

## Verdere technische uitwerking

Deze Graph Build Specification vormt de basis voor de technische
implementatie.

De volgende onderwerpen worden verder uitgewerkt:

- concrete mappingtabellen;
- Neo4j-labels en properties;
- constraints en indexen;
- validatieregels;
- Cypher-query's;
- verwerking van wijzigingen en nieuwe versies van informatieobjecten.
