# Geldigheid, historie en tijdreizen binnen Samen Onder Handbereik

**Status:** Discussiedocument -- voorstel ter beoordeling\
**Datum:** 25 november 2026

## 1. Aanleiding en doel

Binnen Samen Onder Handbereik (SOH) wordt informatie uitgewisseld tussen
organisaties die samenwerken binnen het domein Jeugd, Zorg en
Veiligheid. De informatie wordt onder meer beschikbaar gesteld via API's
en verwerkt in een Knowledge Graph. CloudEvents informeren deelnemers
over gebeurtenissen die voor hen relevant kunnen zijn.

Bij de verdere uitwerking van de samenwerkfunctie *Uitwisselen Uitkomst
Overleg* is de vraag ontstaan hoe moet worden omgegaan met wijzigingen
in een Uitkomst Overleg. Een Uitkomst Overleg kan immers worden
aangevuld of gewijzigd. Daarbij is niet alleen van belang wat op dit
moment de geldende inhoud is, maar ook:

-   welke inhoud op een bepaald moment materieel van toepassing was;
-   welke inhoud op een bepaald moment formeel bekend was;
-   wanneer een wijziging in het bronsysteem beschikbaar kwam;
-   wanneer SOH die wijziging heeft verwerkt.

Dit document beschrijft een voorstel voor de wijze waarop SOH met deze
aspecten omgaat. Het doel is om overeenstemming te bereiken over de
uitgangspunten voordat deze worden verwerkt in de bestaande
architectuur- en API-specificaties.

De uitwerking richt zich op Uitkomst Overleg als concreet voorbeeld. De
bedoeling is om de uitgangspunten waar mogelijk generiek toepasbaar te
maken op andere samenwerkfuncties.

## 2. Begrippen en uitgangspunten

### 2.1 Materiële Historie

De **Materiële Historie** beschrijft vanaf welk moment bepaalde
informatie in de werkelijkheid of binnen het betreffende domein geldig
is.

Bij een Uitkomst Overleg gaat het om het moment vanaf wanneer een
bepaalde versie van de vastlegging als de geldende versie moet worden
beschouwd.

Een nieuwe versie krijgt een eigen beginmoment van geldigheid. Vanaf dat
moment vervangt deze versie de voorgaande versie.

### 2.2 Formele Historie

De **Formele Historie** beschrijft vanaf welk moment bepaalde informatie
formeel in een systeem bekend en beschikbaar is.

Voor SOH is het van belang om daarbij onderscheid te maken tussen twee
systemen:

1.  **Formele Historie in het bronsysteem:** vanaf welk moment een
    versie beschikbaar is via de Inzage-API van de organisatie die de
    Uitkomst Overleg beschikbaar stelt.
2.  **Formele Historie in de Knowledge Graph van SOH:** vanaf welk
    moment SOH de betreffende versie heeft verwerkt en in de Knowledge
    Graph heeft opgenomen.

Deze momenten hoeven niet samen te vallen. Een versie kan al via de
Inzage-API beschikbaar zijn, terwijl SOH de melding daarover nog niet
heeft verwerkt.

### 2.3 Twee tijdsdimensies

Materiële Historie en Formele Historie zijn twee verschillende
tijdsdimensies. Ze beantwoorden verschillende vragen:

| Tijdsdimensie | Centrale vraag |
|---|---|
| Materiële Historie | Wanneer was deze informatie geldig? |
| Formele Historie | Wanneer was deze informatie in het betreffende systeem bekend? |

Door beide tijdsdimensies vast te leggen, kan informatie vanuit
verschillende historische perspectieven worden geraadpleegd.

### 2.4 Versies en identiteit

Het voorstel is om onderscheid te maken tussen:

-   de **Uitkomst Overleg** als stabiel herkenbaar informatieobject;
-   de verschillende **versies** waarin de inhoud van dat
    informatieobject is vastgelegd.

Iedere versie wordt als een afzonderlijke node in de Knowledge Graph
opgenomen. Elke node krijgt een eigen, unieke `@id`. Die `@id`
identificeert de specifieke versie, niet de Uitkomst Overleg als geheel.

Daarnaast krijgt iedere versie een eigenschap
`soh:UitkomstOverleg.identifier`. Deze eigenschap identificeert de
overkoepelende Uitkomst Overleg en heeft daarom voor alle versies van
dezelfde Uitkomst Overleg dezelfde waarde.

De identiteit van de Uitkomst Overleg blijft zo gedurende de hele
levensloop gelijk, terwijl iedere versie afzonderlijk herkenbaar is.
Iedere versie heeft bovendien een eigen geldigheidsperiode en formele
beschikbaarheidsperiode.

De verschillende versienodes zijn dus afzonderlijke
`prov:Entity`-objecten, die door de gedeelde
`soh:UitkomstOverleg.identifier` bij dezelfde Uitkomst Overleg horen.
Er is voor deze oplossing geen afzonderlijke bovenliggende node nodig
die alleen de identiteit van de Uitkomst Overleg representeert.

Wanneer een nieuwe versie voortbouwt op een eerdere versie, wordt
bovendien voorgesteld om de PROV-relatie `prov:wasDerivedFrom` te
gebruiken. De nieuwe versie verwijst daarmee naar de versie waaruit zij
is afgeleid. Deze relatie maakt de afstammingslijn van de versies
expliciet. Zij vervangt niet de gedeelde identifier en legt op zichzelf
ook niet vast vanaf wanneer een versie geldig of formeel beschikbaar is.

## 3. Levensloop van een Uitkomst Overleg

In dit voorstel worden drie momenten onderscheiden bij het beschikbaar
komen van een nieuwe versie.

-   **t0 -- Beschikbaar in het bronsysteem:** de nieuwe versie is
    formeel geregistreerd en daadwerkelijk opvraagbaar via de
    Inzage-API.
-   **t1 -- Aanmaken van het CloudEvent:** het bronsysteem maakt het
    CloudEvent aan en publiceert dit om te melden dat een nieuwe versie
    beschikbaar is.
-   **t2 -- Verwerking door SOH:** SOH ontvangt en verwerkt het
    CloudEvent en neemt de nieuwe versie op in de Knowledge Graph.

Deze momenten hebben verschillende betekenissen.

### 3.1 t0 -- Beschikbaar in het bronsysteem

Op t0 wordt de nieuwe versie formeel beschikbaar in het bronsysteem.
Vanaf dat moment kan een deelnemer de versie via de Inzage-API opvragen.

Dit moment vormt het begin van de Formele Historie van deze versie in
het bronsysteem.

De versie krijgt daarnaast een beginmoment van Materiële Historie. Dat
moment hoeft niet gelijk te zijn aan t0: het beschrijft wanneer de
inhoud materieel geldig is.

### 3.2 t1 -- Aanmaken en publiceren van het CloudEvent

Na het beschikbaar komen van de nieuwe versie maakt het bronsysteem een
CloudEvent aan. Dit event informeert de buitenwereld over het feit dat
een nieuwe versie beschikbaar is.

Het CloudEvent bevat niet de volledige inhoud van de Uitkomst Overleg.
Het bevat de informatie die nodig is om de gebeurtenis te herkennen en
de bijbehorende informatie via de Inzage-API op te vragen.

Het voorstel is om het CloudEvents-attribuut `time` te vullen met het
tijdstip waarop de gebeurtenis in het bronsysteem is geregistreerd: t0.

Dit sluit aan bij de richtlijn uit het NL GOV CloudEvents-profiel dat
het tijdstip waarop de gebeurtenis is geregistreerd wordt gebruikt,
omdat dit in veel gevallen het enige eenduidig vast te stellen tijdstip
is.

Het tijdstip waarop het CloudEvent daadwerkelijk wordt samengesteld of
verzonden (t1) heeft een andere betekenis. Dat kan voor technische
monitoring en diagnose relevant zijn, maar is niet het tijdstip waarop
de versie formeel beschikbaar kwam.

### 3.3 t2 -- Verwerking door SOH

SOH ontvangt het CloudEvent en verwerkt de daarin opgenomen gegevens.
Op basis daarvan wordt de Knowledge Graph bijgewerkt. De gegevens over
de beschikbaar gestelde versie en de bijbehorende provenance worden in
de Knowledge Graph vastgelegd. De volledige inhoud van het Uitkomst
Overleg wordt niet in de Knowledge Graph opgenomen; deze blijft
beschikbaar via de Inzage-API van de organisatie die het Uitkomst
Overleg heeft vastgelegd.

Op t2 begint de Formele Historie van de betreffende gegevens in de
Knowledge Graph van SOH.

Het is daarom van belang dat SOH ook het eigen verwerkingstijdstip
registreert. Het CloudEvent-attribuut `time` kan daarvoor niet worden
gebruikt: dat bevat immers het registratiemoment in het bronsysteem.

### 3.4 Overzicht van de momenten

| Moment | Gebeurtenis | Betekenis |
|---|---|---|
| t0 | Nieuwe versie beschikbaar via de Inzage-API | Begin Formele Historie in het bronsysteem |
| t1 | CloudEvent aangemaakt en gepubliceerd | Melding van de beschikbaarheid |
| t2 | CloudEvent door SOH verwerkt; versie opgenomen in de Knowledge Graph | Begin Formele Historie in de Knowledge Graph |

De momenten t0, t1 en t2 kunnen dicht bij elkaar liggen, maar dat hoeft
niet. Met name tussen t1 en t2 kan enige tijd verstrijken.

## 4. Voorbeeld 1 -- Een nieuwe versie zonder terugwerkende kracht

Een organisatie stelt op 10 maart een Uitkomst Overleg beschikbaar. De
inhoud is vanaf dat moment materieel geldig.

Op 15 maart wordt een correctie aangebracht. De organisatie stelt een
nieuwe versie beschikbaar. Deze nieuwe versie vervangt de eerdere versie
vanaf 15 maart.

De tijdlijn ziet er als volgt uit:

| Datum | Gebeurtenis |
|---|---|
| 10 maart | Versie 1 wordt beschikbaar gesteld en is materieel geldig vanaf 10 maart |
| 15 maart | Versie 2 wordt beschikbaar gesteld en is materieel geldig vanaf 15 maart |

De Materiële Historie is daarmee:

| Periode | Geldige versie |
|---|---|
| Vanaf 10 maart tot 15 maart | Versie 1 |
| Vanaf 15 maart | Versie 2 |

De Formele Historie in het bronsysteem begint voor iedere versie op het
moment waarop die versie via de Inzage-API beschikbaar komt.

Wanneer de nieuwe versie ook in SOH is verwerkt, kan de Knowledge Graph
beide versies historisch beschikbaar houden.

## 5. Voorbeeld 2 -- De versie is al beschikbaar, maar nog niet verwerkt door SOH

Een organisatie stelt op 15 maart om 10:00 uur een nieuwe versie van een
Uitkomst Overleg beschikbaar via de Inzage-API.

Het CloudEvent wordt om 10:02 uur aangemaakt en gepubliceerd. SOH
ontvangt en verwerkt het event pas om 10:05 uur.

De tijdlijn is dan:

| Tijdstip | Gebeurtenis |
|---|---|
| 10:00 (t0) | Nieuwe versie beschikbaar via de Inzage-API |
| 10:02 (t1) | CloudEvent aangemaakt en gepubliceerd |
| 10:05 (t2) | SOH heeft het event verwerkt en de gegevens over de nieuwe versie in de Knowledge Graph opgenomen |

Dit heeft een belangrijk gevolg.

Een deelnemer die om 10:03 uur rechtstreeks de Inzage-API van het
bronsysteem raadpleegt, kan de nieuwe versie al ontvangen.

Een informatievraag aan de Queryfunctionaliteit van SOH kan op datzelfde
moment echter nog de oude versie opleveren. De nieuwe versie is immers
nog niet in de Knowledge Graph opgenomen.

Vanaf 10:05 uur kan de nieuwe versie ook via de Knowledge Graph worden
gevonden.

Dit is een vorm van tijdelijke inconsistentie tussen het bronsysteem en
de Knowledge Graph. Het is een gevolg van de asynchrone verwerking van
gebeurtenissen.

Het voorstel is om deze situatie expliciet te onderkennen en in de
specificaties te beschrijven. De formele beschikbaarheid in het
bronsysteem en de formele beschikbaarheid in de Knowledge Graph zijn
immers verschillende zaken.

## 6. Tijdreizen en raadpleging

Wanneer zowel Materiële Historie als Formele Historie worden vastgelegd,
kan informatie vanuit verschillende historische perspectieven worden
geraadpleegd.

Daarvoor moet bij raadpleging onderscheid kunnen worden gemaakt tussen
twee peildata:

-   **Materiële peildatum:** het tijdstip waarvoor wordt gevraagd welke
    versie materieel geldig was.
-   **Formele peildatum:** het tijdstip waarvoor wordt gevraagd welke
    informatie formeel bekend was.

### 6.1 Combinatie van peildata

Door beide peildata te combineren, kan niet alleen worden vastgesteld
welke informatie op een bepaald moment materieel geldig was, maar ook
welke informatie op dat moment in een bepaald systeem formeel bekend
was.

Neem het volgende voorbeeld:

-   Op **12 november om 09:00 uur (t0)** wordt een nieuwe versie van een
    Uitkomst Overleg in het bronsysteem geregistreerd. De versie is
    vanaf dat moment beschikbaar via de Inzage-API en materieel geldig.
-   Op **12 november om 09:05 uur (t1)** publiceert het bronsysteem het
    CloudEvent.
-   SOH verwerkt het CloudEvent pas om **12 november om 10:00 uur
    (t2)**. Vanaf dat moment zijn de gegevens over de nieuwe versie
    opgenomen in de Knowledge Graph.

Een gebruiker raadpleegt de Queryfunctionaliteit van SOH op
**12 november om 09:30 uur**. De nieuwe versie is dan al beschikbaar
via de Inzage-API van het bronsysteem, maar is nog niet opgenomen in de
Knowledge Graph. De gebruiker kan de nieuwe versie op dat moment dus
nog niet via de Queryfunctionaliteit van SOH vinden.

Stel dat de gebruiker later wil reconstrueren wat hij op 12 november om
09:30 uur via SOH had kunnen vinden. Dan horen daar de volgende
peildata bij:

-   **Materiële peildatum:** 12 november, 09:30 uur.
-   **Formele peildatum:** 12 november, 09:30 uur.

De query geeft dan de stand van de Knowledge Graph weer zoals die op
dat moment bestond. De nieuwe versie is daarin nog niet opgenomen.

De gebruiker kan ook willen weten welke versie op datzelfde materiële
moment geldig was, uitgaande van de informatie die SOH op **20 november**
had verwerkt:

-   **Materiële peildatum:** 12 november, 09:30 uur.
-   **Formele peildatum:** 20 november.

In dat geval wordt de nieuwe versie wel gevonden. De materiële peildatum
is gelijk gebleven; alleen de formele peildatum is verschoven. Er is
geen sprake van terugwerkende kracht: de versie was immers al op
12 november om 09:00 uur beschikbaar en materieel geldig. Het verschil
ontstaat doordat SOH de gegevens over die versie pas later in de
Knowledge Graph heeft opgenomen.

Dit voorbeeld laat zien waarom de Formele Historie van het bronsysteem
en die van de Knowledge Graph afzonderlijk moeten worden beschouwd.

### 6.2 Toepassing op de Inzage-API

De Inzage-API biedt toegang tot de volledige inhoud van een Uitkomst
Overleg.

Het voorstel is om de Inzage-API te voorzien van twee optionele
peildatumparameters:

-   `materielePeildatum`
-   `formelePeildatum`

De eerste parameter bepaalt welke versie wordt geselecteerd op basis van
de Materiële Historie. De tweede parameter bepaalt welke informatie op
het opgegeven tijdstip formeel bekend was in het bronsysteem.

Als geen peildata worden opgegeven, wordt de actuele toestand
geretourneerd.

De precieze API-afspraken, waaronder de omgang met ontbrekende
parameters en de betekenis van een peildatum in de toekomst, moeten nog
worden uitgewerkt.

### 6.3 Toepassing op de Queryfunctionaliteit

De Queryfunctionaliteit bevraagt de Knowledge Graph van SOH.

Daarom moet bij tijdreizen via de Queryfunctionaliteit rekening worden
gehouden met de Formele Historie zoals die in de Knowledge Graph is
vastgelegd. Een versie die wel in het bronsysteem beschikbaar is, maar
nog niet door SOH is verwerkt, kan immers nog niet in een queryresultaat
voorkomen.

Het voorstel is om ook bij de Queryfunctionaliteit onderscheid te maken
tussen een Materiële peildatum en een Formele peildatum.

De formele peildatum heeft daar betrekking op de informatie die op dat
moment in de Knowledge Graph van SOH bekend was.

Dit betekent dat de betekenis van de formele peildatum afhankelijk is
van het systeem waarop de raadpleging betrekking heeft:

-   bij de Inzage-API: Formele Historie in het bronsysteem;
-   bij de Queryfunctionaliteit: Formele Historie in de Knowledge Graph
    van SOH.

## 7. Gevolgen voor het informatiemodel en de provenance

De voorgestelde werkwijze heeft gevolgen voor het informatiemodel van
SOH.

### 7.1 Uitkomst Overleg en versies

Iedere versie van een Uitkomst Overleg wordt als afzonderlijke
`prov:Entity`-node in de Knowledge Graph vastgelegd. De node heeft:

-   een eigen, unieke `@id`, die de specifieke versie identificeert;
-   de eigenschap `soh:UitkomstOverleg.identifier`, met de identifier
    van de overkoepelende Uitkomst Overleg; deze waarde is gelijk voor
    alle versies van hetzelfde Uitkomst Overleg;
-   een beginmoment van Materiële Historie;
-   een beginmoment van Formele Historie in het bronsysteem;
-   een beginmoment van Formele Historie in de Knowledge Graph van SOH;
-   overige metadata over de versie en de bijbehorende provenance.

De volledige inhoud van het Uitkomst Overleg wordt niet in de
Knowledge Graph opgenomen. Deze blijft beschikbaar via de Inzage-API
van de organisatie die het Uitkomst Overleg heeft vastgelegd.

Wanneer versie 2 is afgeleid van versie 1, bevat de node van versie 2
een relatie `prov:wasDerivedFrom` naar de node van versie 1. De richting
van de relatie is dus van de nieuwe versie naar de eerdere versie
waaruit zij is afgeleid.

Een vereenvoudigd voorbeeld:

```json
{
  "@graph": [
    {
      "@id": "0195f2a0-7b3c-7abc-8def-0123456789ab",
      "@type": ["prov:Entity", "soh:UitkomstOverleg"],
      "soh:UitkomstOverleg.identifier": "UO-2026-123",
      "soh:UitkomstOverleg.beginGeldigheid": "2026-03-10T00:00:00Z",
      "soh:UitkomstOverleg.beginFormeleHistorie": "2026-03-10T09:00:00Z",
      "soh:UitkomstOverleg.beginFormeleHistorieSOH": "2026-03-10T09:02:00Z"
    },
    {
      "@id": "0195f2a0-7b3c-7abc-8def-0123456789ac",
      "@type": ["prov:Entity", "soh:UitkomstOverleg"],
      "soh:UitkomstOverleg.identifier": "UO-2026-123",
      "soh:UitkomstOverleg.beginGeldigheid": "2026-03-15T00:00:00Z",
      "soh:UitkomstOverleg.beginFormeleHistorie": "2026-03-15T10:00:00Z",
      "soh:UitkomstOverleg.beginFormeleHistorieSOH": "2026-03-15T10:05:00Z",
      "prov:wasDerivedFrom": {
        "@id": "0195f2a0-7b3c-7abc-8def-0123456789ab"
      }
    }
  ]
}
```

De identifiers en propertynamen in dit voorbeeld zijn illustratief.
De precieze naamgeving en de wijze waarop de tijdsperioden worden
vastgelegd, moeten nog worden afgestemd op het Knowledge Graph-model.

De relatie `prov:wasDerivedFrom` legt de herkomstrelatie tussen de
versies vast. De relatie zelf drukt niet uit dat de nieuwe versie de
eerdere versie volledig vervangt. Dat is een afzonderlijk uitgangspunt
voor de versiehantering binnen SOH: vanaf het beginmoment van de
Materiële Historie van de nieuwe versie vervangt deze de eerdere versie
volledig. Ook legt `prov:wasDerivedFrom` niet vast wanneer de nieuwe
versie formeel beschikbaar kwam.

Het voorstel is om alleen beginmomenten vast te leggen en geen
eindmomenten op de versienodes op te nemen. Het eindmoment van een
periode kan worden afgeleid uit het beginmoment van de opvolgende
versie. Daarmee hoeft een eerder opgenomen node niet te worden
aangepast wanneer een nieuwe versie wordt toegevoegd. Dit geldt
afzonderlijk voor de Materiële Historie, de Formele Historie in het
bronsysteem en de Formele Historie in de Knowledge Graph van SOH.

### 7.2 Provenance van beschikbaarstelling

De bestaande provenance-activiteit `BeschikbaarStellenUitkomstOverleg`
beschrijft de beschikbaarstelling van een Uitkomst Overleg.

Bij het werken met versies moet nader worden bepaald of deze activiteit
betrekking krijgt op:

-   de eerste beschikbaarstelling van het overkoepelende Uitkomst
    Overleg;
-   iedere afzonderlijke beschikbaar gestelde versie;
-   of beide, met een onderscheid in de modellering.

Daarbij moet ook duidelijk zijn dat het beschikbaar stellen van de
inhoud via de Inzage-API iets anders is dan het publiceren van een
CloudEvent dat die beschikbaarheid meldt.

### 7.3 Provenance van verwerking door SOH

Naast de beschikbaarstellingsactiviteit in het bronsysteem moet SOH
kunnen vastleggen wanneer een CloudEvent is verwerkt en wanneer de
betreffende informatie in de Knowledge Graph is opgenomen.

Daarvoor is een afzonderlijke registratie of provenance-activiteit
nodig.

De precieze modellering daarvan moet nog worden uitgewerkt. Het
uitgangspunt is dat het verwerkingstijdstip in SOH niet wordt verward
met het registratietijdstip in het bronsysteem.

## 8. Benodigde aanpassingen in de bestaande specificaties

Wanneer de voorgestelde uitgangspunten worden onderschreven, zijn
aanpassingen nodig in verschillende bestaande specificaties.

| Specificatie | Beoogde aanpassing |
|---|---|
| `UitwisselenUitkomstOverleg.md` | Beschrijving van Materiële Historie, Formele Historie, versies en tijdreizen; onderscheid tussen beschikbaarheid van inhoud en notificatie daarover |
| `UitwisselenUitkomstOverleg.yaml` | Aanpassing van de resource- en eventmodellen; uitwerking van versie-identificatie en peildatumparameters |
| Inzage-API-specificatie (`UitkomstOverleg.yaml`) | Ondersteuning van Materiële en Formele peildatum |
| `AsynchroneInteracties.md` en `.yaml` | Zo nodig verduidelijking van de generieke verwerking van CloudEvents en de registratie van verwerkingstijdstippen |
| `CloudEvents.md` | Verduidelijking van de betekenis van het CloudEvent-attribuut `time` in relatie tot de registratie in het bronsysteem |
| `KnowledgeGraphModel.md` | Modellering van versies en de twee tijdsdimensies |
| `GraphBuildSpecifications.md` | Verwerking van versie-informatie en formele historie bij het opbouwen en bijwerken van de Knowledge Graph |

Daarnaast moet worden nagegaan of aanpassingen nodig zijn in het
onderliggende informatiemodel en de JSON-LD-context.

## 9. Voorgestelde uitgangspunten ter beoordeling

Onderstaande uitgangspunten vormen de kern van het voorstel. Het verzoek
is om deze te beoordelen en aan te geven of ze voldoende richting geven
aan de verdere uitwerking.

1.  SOH ondersteunt zowel Materiële Historie als Formele Historie.
2.  Deze twee tijdsdimensies worden als generieke uitgangspunten
    gehanteerd bij de samenwerkfuncties.
3.  Een Uitkomst Overleg heeft een stabiele identiteit; wijzigingen in
    de inhoud leiden tot afzonderlijke versies.
4.  Iedere versie wordt als afzonderlijke node met een eigen UUIDv7
    als `@id` in de Knowledge Graph opgenomen. De eigenschap
    `soh:UitkomstOverleg.identifier` heeft voor alle versies van
    hetzelfde Uitkomst Overleg dezelfde waarde.
5.  Een nieuwe versie die voortbouwt op een eerdere versie verwijst
    met `prov:wasDerivedFrom` naar die eerdere versie.
6.  Een nieuwe versie vervangt de eerdere versie volledig vanaf het
    beginmoment van de Materiële Historie van de nieuwe versie.
7.  Iedere versie heeft een eigen beginmoment van Materiële Historie,
    Formele Historie in het bronsysteem en Formele Historie in de
    Knowledge Graph van SOH.
8.  Het begin van de Formele Historie in het bronsysteem is het moment
    waarop de versie daadwerkelijk via de Inzage-API beschikbaar is.
9.  Het CloudEvent-attribuut `time` bevat het registratietijdstip in het
    bronsysteem (t0), niet het tijdstip waarop het CloudEvent wordt
    aangemaakt of verzonden.
10. SOH registreert afzonderlijk het moment waarop het CloudEvent is
    verwerkt en de informatie in de Knowledge Graph is opgenomen (t2).
11. De Inzage-API ondersteunt raadpleging op basis van zowel een
    Materiële als een Formele peildatum.
12. De Queryfunctionaliteit houdt rekening met de Formele Historie zoals
    die in de Knowledge Graph van SOH is vastgelegd.
13. Het beschikbaar stellen van de inhoud via de Inzage-API en het
    bekendmaken van die beschikbaarheid via een CloudEvent zijn twee
    verschillende gebeurtenissen.
14. Alleen beginmomenten worden vastgelegd; eindmomenten worden
    afgeleid uit het beginmoment van een opvolgende versie.

## 10. Vervolg

De eerste vervolgstap is om binnen het SOH-team overeenstemming te
bereiken over de uitgangspunten en de in dit document beschreven
werkwijze.
