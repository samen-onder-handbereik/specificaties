# Toepassing van de CloudEvents-standaard

## Inleiding

Binnen *Samen Onder Handbereik* worden gebeurtenissen uitgewisseld
conform de standaard CloudEvents van de Cloud Native Computing
Foundation (CNCF).

Een CloudEvent beschrijft een gebeurtenis die binnen een
samenwerkfunctie heeft plaatsgevonden. Het CloudEvent bevat de
informatie die nodig is om de gebeurtenis te identificeren, te verwerken
en te relateren aan de betreffende samenwerkfunctie.

Het CloudEvent bevat niet de inhoudelijke gegevens waarop de gebeurtenis
betrekking heeft. De betekenis van de gebeurtenis, het betrokken object
en de inhoud van de bijbehorende gegevens worden bepaald door de
betreffende samenwerkfunctie.

Binnen *Samen Onder Handbereik* wordt het attribuut `id` van een
CloudEvent gebruikt als unieke identificatie van het CloudEvent. Voor
asynchrone interacties is deze identificatie tevens de identificatie
waarmee de interactie kan worden gevolgd.

Een CloudEvent bestaat uit:

1.  Context-attributen

    Gestandaardiseerde metadata-attributen die informatie geven over de
    gebeurtenis, zoals de bron, het type gebeurtenis en het tijdstip
    waarop de gebeurtenis heeft plaatsgevonden.

2.  `data`

    De gegevens die bij de gebeurtenis horen. De structuur en betekenis
    hiervan worden bepaald door de betreffende samenwerkfunctie.

Een CloudEvent heeft in hoofdlijnen de volgende structuur:

``` json
{
  "specversion": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "/oin/<oin>/systeem/<systeemnaam>",
  "type": "<samenwerkfunctie>.<gebeurtenis>",
  "time": "2026-03-03T10:15:30Z",
  "datacontenttype": "application/ld+json",
  "dataschema": "<schema-identificatie>",
  "subject": "<identifier>",
  "data": {}
}
```

Dit voorbeeld laat de generieke structuur van een CloudEvent zien. De
concrete invulling van de attributen `type`, `subject`, `dataschema` en
`data` wordt vastgesteld binnen de specificatie van de betreffende
samenwerkfunctie.

De afspraken in dit hoofdstuk hebben betrekking op het generieke gebruik
van CloudEvents.

# Vulling van context-attributen

## `specversion`

### Doel

Geeft aan welke versie van de CloudEvents-specificatie wordt gebruikt.

### Afspraken

-   De waarde is altijd `1.0`.
-   De waarde wordt opgenomen in ieder CloudEvent.

## `id`

### Doel

Identificeert het CloudEvent.

### Afspraken

-   Het attribuut `id` identificeert het CloudEvent waarin een
    gebeurtenis wordt beschreven.
-   Het attribuut `id` wordt gegenereerd door de producerende partij.
-   De waarde is uniek binnen de context waarin de producer CloudEvents
    uitgeeft.
-   Als standaard wordt gebruikgemaakt van een UUID, bij voorkeur
    UUIDv4.
-   Een eenmaal gebruikt `id` wordt niet opnieuw gebruikt, ook niet
    wanneer een CloudEvent opnieuw wordt aangeboden.
-   Binnen het generieke patroon voor asynchrone interacties wordt het
    attribuut `id` gebruikt als identificatie van de interactie
    (`interactieId`).

## `source`

### Doel

Identificeert de bron die het CloudEvent heeft geproduceerd.

### Afspraken

-   De waarde identificeert de producerende organisatie of applicatie.
-   De waarde wordt vastgelegd als URI.
-   De URI hoeft niet resolvable te zijn.
-   Als basis wordt bij voorkeur het Organisatie-identificatienummer
    (OIN) gebruikt.

Voorbeeldstructuur:

    /oin/<oin>/systeem/<systeemnaam>

De `source` verandert niet per gebeurtenis, maar is gekoppeld aan de
producerende bron.

## `type`

### Doel

Geeft het type gebeurtenis aan.

### Afspraken

-   Het attribuut beschrijft wat er functioneel is gebeurd.
-   Het attribuut beschrijft niet de technische verwerking van de
    gebeurtenis.
-   De toegestane waarden worden vastgesteld per samenwerkfunctie.
-   Naamgeving volgt het patroon:

```{=html}
<!-- -->
```
    <samenwerkfunctie>.<gebeurtenis>

-   Er wordt gebruikgemaakt van lower-case en puntnotatie.
-   Versienummers worden niet opgenomen in `type`.

## `time`

### Doel

Geeft het tijdstip aan waarop de gebeurtenis heeft plaatsgevonden.

### Afspraken

-   De producer vult het attribuut.
-   Het formaat is ISO 8601.
-   De waarde wordt vastgelegd in UTC.
-   Het tijdstip betreft het moment waarop de gebeurtenis plaatsvond en
    niet het moment van verzending.

## `datacontenttype`

### Doel

Geeft het formaat van de inhoud van `data` aan.

### Afspraken

De waarde wordt bepaald door de gebruikte representatie van de payload.

Voor JSON-LD wordt bijvoorbeeld gebruikt:

    application/ld+json

## `dataschema`

### Doel

Verwijst naar de beschrijving van de structuur en betekenis van de
payload.

### Afspraken

-   Het attribuut verwijst naar de technische beschrijving van de inhoud
    van `data`.
-   De concrete invulling wordt bepaald per samenwerkfunctie.
-   Afhankelijk van de gebruikte representatie kan dit bijvoorbeeld een
    JSON Schema en/of een semantische context bevatten.

## `subject`

### Doel

Geeft het primaire object aan waarop de gebeurtenis betrekking heeft.

### Afspraken

-   Het attribuut wordt gebruikt wanneer de gebeurtenis betrekking heeft
    op een specifiek object binnen de bron.
-   De waarde identificeert niet het CloudEvent zelf, maar het primaire
    object waarop de gebeurtenis betrekking heeft.
-   Een gebeurtenis kan betrekking hebben op meerdere objecten. De
    samenwerkfunctie bepaalt welk object als `subject` wordt aangewezen
    en hoe dit object wordt geïdentificeerd.
-   De waarde sluit aan bij de identifierstrategie van het betreffende
    domeinobject.

# Het attribuut `data`

Het attribuut `data` bevat de gegevens die nodig zijn om de gebeurtenis
te interpreteren en te verwerken.

De exacte structuur en betekenis van `data` worden vastgesteld per
samenwerkfunctie.

Binnen *Samen Onder Handbereik* kan `data` onder andere worden gebruikt
voor:

-   gegevens die de gebeurtenis nader beschrijven;
-   verwijzingen naar objecten waarop de gebeurtenis betrekking heeft;
-   provenance-informatie die nodig is voor het vastleggen van de
    herkomst of het gebruik van gegevens.

Een samenwerkfunctie bepaalt welke gegevens in `data` worden opgenomen.
Inhoudelijke gegevens van domeinobjecten worden alleen opgenomen wanneer
deze nodig zijn voor de betreffende gebeurtenis.

Een samenwerkfunctie kan `data` gebruiken voor een specifieke
representatie van de gebeurtenis, zoals een PROV-JSONLD-graaf.

# Relatie tussen generieke afspraken en samenwerkfuncties

De generieke CloudEvents-afspraken bepalen:

-   de structuur van het CloudEvent;
-   de betekenis van standaard context-attributen;
-   de wijze waarop gebeurtenissen technisch worden beschreven.

De samenwerkfunctie bepaalt:

-   welke gebeurtenistypen beschikbaar zijn;
-   welke betekenis een gebeurtenis heeft;
-   welk object als `subject` wordt gebruikt;
-   welke gegevens in `data` worden opgenomen.

# Relatie met asynchrone verwerking

Het aanbieden en verwerken van CloudEvents verloopt volgens een generiek
patroon.

Een aanbieder levert een CloudEvent aan via de CloudEvent API. De
verwerking vindt vervolgens asynchroon plaats.

Het attribuut `id` van het CloudEvent identificeert de asynchrone
interactie die door het aanbieden van het CloudEvent ontstaat.

De status van de verwerking kan met deze identificatie via de Status-API
worden gevolgd.

# Samenhang met API's

CloudEvents maken onderdeel uit van een breder patroon waarin
verschillende API's worden onderscheiden.

De generieke API's zijn:

-   CloudEvent API voor het aanbieden van CloudEvents;
-   Status-API voor het volgen van de verwerking.

Daarnaast kunnen samenwerkfuncties specifieke API's definiëren, zoals
een Inzage-API of Query-API.

## Relatie met samenwerkfunctie-specificaties

De generieke CloudEvents-afspraken beschrijven de structuur en betekenis
van de standaard CloudEvent-attributen.

De samenwerkfunctie bepaalt:

-   welke gebeurtenissen worden uitgewisseld;
-   welk object als `subject` wordt gebruikt;
-   hoe het attribuut `data` inhoudelijk wordt ingevuld.
