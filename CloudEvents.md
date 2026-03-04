# Gebruik van de standaard CloudEvent

Binnen *Samen Onder Handbereik* worden gebeurtenissen uitgewisseld conform de standaard **CloudEvents** van de Cloud Native Computing Foundation (CNCF).

Een CloudEvent bestaat uit:

1. **Context-attributen**  
   Gestandaardiseerde metadata-velden die informatie geven over de gebeurtenis (zoals herkomst, tijdstip en type).

2. **`data` (payload)**  
   De inhoudelijke gegevens die horen bij de gebeurtenis.

In JSON-vorm ziet een CloudEvent er schematisch als volgt uit:

```json
{
  "specversion": "1.0",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "/oin/00000004000000002000/systeem/zaaksysteem",
  "type": "uitkomst-overleg.vastgesteld",
  "time": "2026-03-03T10:15:30Z",
  "datacontenttype": "application/json",
  "subject": "uitkomst-overleg/123456789",
  "data": {
    "...": "..."
  }
}
```

De onderstaande afspraken hebben betrekking op de **standaard context-attributen**.  
Voor de attributen `type`, `subject` en `data` worden aanvullende afspraken gemaakt per samenwerkfunctie.

# Vulling van context-attributen

## `specversion`

**Doel**  
Geeft aan welke versie van de CloudEvents-specificatie wordt gebruikt.

**Afspraken**

- Waarde is altijd: `"1.0"`
- Wordt als vaste waarde opgenomen in ieder event.

**Voorbeeld**

```json
"specversion": "1.0"
```

## `id`

**Doel**  
Unieke identificatie van het event.

**Afspraken**

- Moet wereldwijd uniek zijn binnen de context van het producerende systeem.
- Wordt gegenereerd door de verzendende partij.
- UUID (bij voorkeur UUIDv4) is de standaard.
- Een `id` mag niet opnieuw gebruikt worden, ook niet bij retries.

**Voorbeeld**

```json
"id": "550e8400-e29b-41d4-a716-446655440000"
```

## `source`

**Doel**  
Identificeert de bron van het event.

**Afspraken**

- Bevat een stabiele, unieke identificatie van de producerende applicatie of organisatie.
- Wordt vastgelegd als URI (hoeft niet resolvable te zijn).
- Als basis wordt bij voorkeur het **OIN (Organisatie-identificatienummer)** gebruikt.
- Binnen *Samen Onder Handbereik* wordt het OIN van de Justitiële Informatiedienst gebruikt:

  ```
  00000004000000002000
  ```

- Structuurvoorbeeld:

  ```
  /oin/00000004000000002000/systeem/<systeemnaam>
  ```

- De `source` verandert niet per eventtype, maar per producerende applicatie of organisatorische bron.

**Voorbeeld**

```json
"source": "/oin/00000004000000002000/systeem/zaaksysteem"
```

## `type`

**Doel**  
Geeft het type gebeurtenis aan.

**Afspraken (algemeen kader)**

- Beschrijft **wat er functioneel is gebeurd**, niet hoe het technisch is verwerkt.
- Wordt vastgesteld per samenwerkfunctie.
- Naamgeving volgens vast patroon:

  ```
  <samenwerkfunctie>.<gebeurtenis>
  ```

- Gebruik lower-case en puntnotatie.
- Geen versienummers in `type` (versiebeheer vindt plaats in `dataschema` of via governance).

**Voorbeeld**

```json
"type": "uitkomst-overleg.vastgesteld"
```

## `time`

**Doel**  
Tijdstip waarop de gebeurtenis heeft plaatsgevonden.

**Afspraken**

- Wordt gevuld door de producer.
- ISO 8601 formaat.
- Altijd in UTC (met `Z` notatie).
- Betreft het moment van optreden van de gebeurtenis, niet het verzendmoment.

**Voorbeeld**

```json
"time": "2026-03-03T10:15:30Z"
```

## `datacontenttype`

**Doel**  
Geeft het formaat van de payload (`data`) aan.

**Afspraken**

- Standaardwaarde:

  ```
  application/json
  ```

**Voorbeeld**

```json
"datacontenttype": "application/json"
```

## `dataschema`

**Doel**  
Verwijzing naar het schema van de payload.

**Afspraken**

- Kan een URI bevatten naar de geldende JSON Schema-definitie.
- Indien gebruikt, bevat de verwijzing een expliciet versienummer.
- Of `dataschema` structureel wordt toegepast binnen *Samen Onder Handbereik* wordt nog nader bepaald.

**Voorbeeld**

```json
"dataschema": "https://api.samenonderhandbereik.nl/schema/uitkomst-overleg/1.0.0"
```

## `subject`

**Doel**  
Specificeert het object binnen de bron waarop het event betrekking heeft.

**Afspraken**

- Wordt gebruikt wanneer meerdere objecttypen binnen dezelfde `source` bestaan.
- Bevat de identificatie van de entiteit waarop de gebeurtenis betrekking heeft.
- Per samenwerkfunctie worden nadere afspraken gemaakt over de structuur, betekenis en naamgeving van `subject`.

**Voorbeeld**

```json
"subject": "uitkomst-overleg/123456789"
```

# Nadere uitwerking per samenwerkfunctie

Bij de beschrijving van iedere samenwerkfunctie wordt een nadere specificatie opgenomen waarin in elk geval wordt vastgelegd:

- de waarden die voor het attribuut `type` gebruikt mogen worden;
- welke entiteit als `subject` wordt aangemerkt;
- de precieze structuur en inhoudelijke vulling van het attribuut `data`.