# Graph Build Specification

## Inleiding

De Graph Build Specification beschrijft hoe de Knowledge graph wordt
opgebouwd vanuit gebeurtenissen en domeingegevens.

Het hoofdstuk [Knowledge graph-model](#knowledge-graph-model) beschrijft
de betekenis en structuur van de Knowledge graph. Deze Graph Build
Specification beschrijft de regels waarmee die structuur wordt gevuld.

De Graph Build Specification vormt de verbinding tussen:

-   de gebeurtenissen die via CloudEvents worden ontvangen;
-   de provenance-modellering volgens PROV;
-   de domeinmodellering binnen Samen Onder Handbereik;
-   de technische realisatie van de Knowledge graph.

Deze specificatie beschrijft de functionele en semantische
uitgangspunten voor het opbouwen van de graph. De concrete technische
inrichting, zoals de keuze voor specifieke indexen, constraints en
implementatiepatronen, wordt door de ontwikkelaars bepaald binnen de
kaders van deze specificatie.

## Uitgangspunten

### De Knowledge graph wordt opgebouwd uit gebeurtenissen

De primaire bron voor het opbouwen van provenance-informatie zijn de
CloudEvents die binnen de samenwerkfuncties worden verwerkt.

Een CloudEvent leidt niet rechtstreeks tot een domeinnode. Eerst wordt
bepaald welke provenance-activiteit het event representeert.

    CloudEvent
        |
        v
    prov:Activity
        |
        v
    prov:Entity

### Verschillende identificaties worden onderscheiden

Bij het opbouwen van de Knowledge graph worden verschillende soorten
identificaties onderscheiden:

-   `CloudEvent.id` identificeert het CloudEvent zelf;
-   de JSON-LD-eigenschap `@id` identificeert een node in de Knowledge graph;
-   domeineigenschappen, zoals `soh:Casusoverleg.identifier`, kunnen een
    object identificeren binnen een bronsysteem.

Deze identificaties hebben ieder hun eigen betekenis en worden niet
onderling vervangen.

Iedere node in de Knowledge graph krijgt een eigen `@id`. Hiervoor wordt
een UUIDv7 gebruikt, opgenomen als URI met het schema `urn:uuid:`. Dit
geldt voor zowel PROV-nodes (`Entity`, `Activity` en `Agent`) als
domeinspecifieke nodes. Er wordt naast `@id` geen afzonderlijke
`Activity.identifier` of `Entity.identifier` gebruikt als technische
identificatie van de graph-node.

Dezelfde node behoudt dezelfde `@id` wanneer deze in meerdere gebeurtenissen
of queryresultaten voorkomt. Bij verwerking wordt een bestaande node dus
herkend en hergebruikt; er wordt niet bij iedere gebeurtenis een nieuwe UUID
voor hetzelfde object gegenereerd. De UUIDv7 wordt niet afgeleid van het
CloudEvent-id of van een identifier uit een bronsysteem, zoals
`soh:Casusoverleg.identifier`.

## Algemene mappingregels

### CloudEvent naar Activity

Een ontvangen CloudEvent wordt vertaald naar maximaal één PROV Activity
wanneer het event aanleiding geeft tot het vastleggen van een
betekenisvolle gebeurtenis binnen de Knowledge graph.

Per verwerkt CloudEvent wordt dus maximaal één `prov:Activity`
gecreëerd. De Activity representeert de gebeurtenis die door het
CloudEvent wordt beschreven. Deze mappingregel heeft betrekking op
CloudEvents die als bron dienen voor het opbouwen van de Knowledge
graph; een CloudEvent dat een queryresultaat als resultaatenvelop
teruggeeft, valt niet onder deze mappingregel.

De Activity bevat minimaal:

-   een eigen UUIDv7 als technische node-identificatie (`@id`);
-   het type activiteit;
-   een verwijzing naar het oorspronkelijke CloudEvent.

Voorbeeld:

    CloudEvent
        |
        | representeert
        v
    (:Activity:BeschikbaarStellenUitkomstOverleg)
    {
        @id: "urn:uuid:<uuidv7>",
        cloudEventId: "<cloud-event-id>"
    }

De `@id` identificeert de Activity als node in de Knowledge graph. De
eigenschap `cloudEventId` verwijst naar het oorspronkelijke CloudEvent en
legt de herkomst van de provenance-informatie vast. Deze waarde is gelijk
aan het `id`-attribuut van het ontvangen CloudEvent. De `@id` van de Activity,
het CloudEvent-veld `id` en eventuele domeinidentificaties hebben elk een
eigen functie en mogen niet zonder expliciete afspraak als uitwisselbaar
worden beschouwd.

### Identificatie van personen en organisaties

Voor de identificatie van personen en organisaties wordt, waar deze
identificatie onderdeel is van de aangeleverde of teruggegeven domeingegevens,
één combinatie van een typering en een identificatiewaarde gebruikt. De
typering is een stabiele code uit een beheerde waardelijst.

Voor een persoon kan dit bijvoorbeeld `BSN` of `V-NUMMER` zijn. Voor een
organisatie kan dit bijvoorbeeld `OIN` of `KVK` zijn.

De domeinidentificatie staat los van de technische `@id` van de node in de
Knowledge graph. De identificatie wordt dus niet gebruikt als `@id` en leidt
niet op zichzelf tot een `prov:Activity`, `prov:Entity` of `prov:Agent`.

Wanneer de identificatie deel uitmaakt van de aangeleverde domeingegevens,
wordt de combinatie van typering en waarde als eigenschap van het betreffende
domeinobject vastgelegd. Voor een persoon betreft dit bijvoorbeeld
`soh:Betrokkene.identificatieType` en
`soh:Betrokkene.identificatieWaarde`. Voor een organisatie betreft dit
bijvoorbeeld `soh:Organisatie.identificatieType` en
`soh:Organisatie.identificatieWaarde`. Hiervoor wordt geen afzonderlijk
benoemd domeinobject of PROV-element aangemaakt.

De samenwerkfunctie-specificatie bepaalt of een domeinidentificatie wordt
opgenomen en welke identificatietypen zijn toegestaan. Als een
identificatiecombinatie wordt opgenomen, worden typering en waarde samen
vastgelegd.

### Naamgeving van domeineigenschappen

De namen van domeineigenschappen in JSON-LD volgen de conventie uit het
[Knowledge graph-model](KnowledgeGraphModel.md#naamgeving-van-domeineigenschappen-in-json-ld):
`soh:<Concept>.<eigenschap>`. De graph-build verwerkt deze termen volgens de
vastgelegde mapping naar de eigenschappen van de graph-nodes. De conceptnaam
vóór de punt geeft aan bij welk domeinconcept de eigenschap hoort.

Ook de eigenschap waarmee het oorspronkelijke CloudEvent-id op de Activity
wordt vastgelegd, volgt deze conventie: `soh:Activity.cloudEventId`.


## Eventtype naar graphmapping

Een CloudEvent-type bepaalt welke provenance-activiteit en welke
domeinobjecten bij de gebeurtenis horen.

De mapping tussen eventtypen en graph-elementen wordt per
samenwerkfunctie vastgelegd.

Voorbeeld Uitwisselen Uitkomst Overleg:

CloudEvent type:

    uitwisselen-uitkomst-overleg.uitkomst-beschikbaar-gesteld

leidt tot:

    Activity: BeschikbaarStellenUitkomstOverleg

    Entity: UitkomstOverleg

met relatie:

    (Activity: BeschikbaarStellenUitkomstOverleg)
        |
        | soh:steltBeschikbaar
        v
    (Entity: UitkomstOverleg)

Standaard PROV-relaties en domeinspecifieke relaties kunnen naast elkaar
worden gebruikt. Welke relatie of relaties bij een gebeurtenis horen, wordt
vastgelegd in de samenwerkfunctie-specifieke mapping.

De concrete mapping van eventtypen naar Activities, Entities en relaties
maakt onderdeel uit van de samenwerkfunctie-specifieke uitwerking.

## Mapping van domeinobjecten

Een domeinobject wordt als één node opgenomen in de Knowledge graph.

Een node kan meerdere typen hebben:

-   een PROV-type;
-   één of meer domeinspecifieke typen.

Voorbeeld:

    (:Entity:UitkomstOverleg)

Deze node representeert zowel `prov:Entity` als `soh:UitkomstOverleg`.

Er wordt geen afzonderlijke node gemaakt voor het PROV-type en het
domeintype.

Iedere node krijgt één technische identificatie in de vorm van een UUIDv7-URI
in `@id`. Deze identificatie blijft behouden wanneer dezelfde node in een
volgend event of queryresultaat voorkomt. Een herkenbare identificatie uit
een bronsysteem, zoals een OIN, KvK-nummer, BSN of Casusoverleg-identifier,
wordt indien relevant als afzonderlijke domeineigenschap vastgelegd.

## Validatie van de provenance-payload

Voordat een CloudEvent wordt verwerkt voor het opbouwen van de Knowledge
graph, kan de structuur van een PROV-JSONLD-payload worden gevalideerd
met het [PROV-JSON-LD JSON Schema](jsonschema/prov-jsonld.schema.json).

Het JSON Schema ondersteunt met name de controle op de JSON-structuur
van de payload en op enkele generieke profielafspraken. Het schema
vervangt geen semantische validatie van de provenance-graaf.

Een mogelijke vervolgstap is het toepassen van SHACL voor semantische
validatieregels, bijvoorbeeld regels over de toegestane PROV-relaties
tussen Entities, Activities en Agents. Dit maakt op dit moment geen
onderdeel uit van de vastgestelde werking en kan als toekomstige
uitbreiding worden onderzocht.

## Idempotente verwerking

CloudEvents kunnen meer dan één keer worden aangeboden.

De opbouw van de Knowledge graph moet daarom idempotent zijn.

Dit betekent:

-   hetzelfde CloudEvent mag niet leiden tot meerdere provenance-
    activiteiten;
-   dezelfde activiteit mag niet leiden tot dubbele domeinobjecten;
-   bestaande relaties worden herkend en niet onnodig opnieuw
    aangemaakt.

De wijze waarop deze herkenning technisch wordt gerealiseerd, wordt
uitgewerkt in de technische inrichting.

## Relaties

De Graph Build Specification bepaalt welke relaties worden aangemaakt
tussen nodes.

Daarbij wordt onderscheid gemaakt tussen:

-   PROV-relaties;
-   domeinspecifieke relaties.

De semantische naamgeving en betekenis van relaties worden bepaald door
het Knowledge graph-model en de samenwerkfunctie-specifieke
specificatie. De technische representatie van deze relaties wordt
vastgesteld in de technische uitwerking.

## Samenwerkfunctie-specifieke mappings

Een samenwerkfunctie bepaalt:

-   welke CloudEvents relevant zijn;
-   welke Activities worden gemaakt;
-   welke Entities ontstaan;
-   welke relaties worden gelegd;
-   welke eigenschappen beschikbaar zijn.

De generieke Graph Build Specification beschrijft de uitgangspunten. De
samenwerkfunctie-specifieke specificatie beschrijft de concrete
invulling.

## Verdere technische uitwerking

Deze Graph Build Specification vormt de basis voor de technische
implementatie.

De volgende onderwerpen worden verder uitgewerkt:

-   concrete mappingtabellen;
-   labels en properties;
-   constraints en indexen;
-   validatieregels;
-   query's;
-   verwerking van wijzigingen en nieuwe versies van informatieobjecten.
