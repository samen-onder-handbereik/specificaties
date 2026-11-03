# Leeswijzer

Gebruik deze Leeswijzer om te bepalen welke specificaties relevant zijn voor je informatiebehoefte of implementatietaak.

Binnen Samen Onder Handbereik wordt een knowledge graph gebruikt om informatie die via gebeurtenissen wordt uitgewisseld in onderlinge samenhang vast te leggen en bevraagbaar te maken. In de knowledge graph worden gegevens over objecten, betrokkenen, organisaties en activiteiten met elkaar verbonden. Zo kunnen informatievragen worden beantwoord op basis van de vastgelegde gegevens en hun onderlinge relaties.

Het **Knowledge graph-model** beschrijft welke objecten en relaties in de knowledge graph worden onderscheiden. De **Graph Build Specification** beschrijft hoe de graph op basis van de uitgewisselde gebeurtenissen wordt opgebouwd. De knowledge graph is daarmee geen opslagplaats voor de oorspronkelijke CloudEvents, maar een samenhangende representatie van de informatie die uit die gebeurtenissen wordt afgeleid en vastgelegd.

## Waar moet je zijn?

| Je wilt ... | Raadpleeg |
|---|---|
| Begrijpen welke technische afspraken voor SOH gelden | Het [Afsprakenstelsel](https://samen-onder-handbereik.github.io/afsprakenstelsel/) en het [Overzicht van de specificaties](#secov) |
| Weten welke voorzieningen SOH ondersteunen | [Stelselvoorzieningen](#secsv) |
| Gebeurtenissen uitwisselen | [Toepassing van de CloudEvents-standaard](#cloudevents) en de specificatie van de betreffende samenwerkfunctie |
| Een asynchrone interactie aanbieden, volgen of een resultaat ophalen | [Generiek patroon voor asynchrone interacties](#asynchroneinteracties) en de bijbehorende [OpenAPI-specificatie](https://samen-onder-handbereik.github.io/specificaties/yaml/AsynchroneInteracties.yaml) ([interactief bekijken](api.html?spec=AsynchroneInteracties)) |
| Informatievragen en queryresultaten begrijpen | [Generiek patroon voor asynchrone interacties](#asynchroneinteracties) en de specificatie van de betreffende samenwerkfunctie |
| Begrijpen hoe informatie uit gebeurtenissen in samenhang wordt vastgelegd en bevraagbaar wordt gemaakt | [Knowledge graph-model](#knowledgegraphmodel) en [Graph Build Specification](#graphbuildspecification) |
| Een samenwerkfunctie implementeren | De betreffende samenwerkfunctie-specificatie en de generieke specificaties die op de gekozen interacties van toepassing zijn |
| De technische API-contracten bekijken of downloaden | De [API-specificaties](api.html). Je kunt de OpenAPI-bestanden ook openen in Swagger Editor. |
| Het informatiemodel en voorbeelden als graph bekijken | De [kennis-graph](kennis-graph.html) |
| De inhoud van een informatieobject raadplegen | De betreffende samenwerkfunctie-specificatie en de daarin beschreven Inzage-API, voor zover die voor de functie beschikbaar is |

## Overzicht van de hoofdstukken

Hieronder staat per inhoudelijk hoofdstuk wat je er kunt vinden en wanneer het relevant is.

| Hoofdstuk | Waarom zou je dit lezen? |
|---|---|
| [Stelselvoorzieningen](#secsv) | Om te weten welke gemeenschappelijke voorzieningen SOH ondersteunen en waar je de beschrijving daarvan kunt vinden. |
| [Toepassing van de CloudEvents-standaard](#cloudevents) | Om te begrijpen hoe gebeurtenissen binnen SOH worden beschreven en uitgewisseld en welke generieke afspraken daarvoor gelden. |
| [Generiek patroon voor asynchrone interacties](#asynchroneinteracties) | Om te begrijpen hoe asynchrone interacties worden aangeboden, verwerkt en gevolgd, en hoe resultaten beschikbaar komen. |
| [Knowledge graph-model](#knowledgegraphmodel) | Om te begrijpen hoe informatie binnen SOH in een knowledge graph wordt gestructureerd en welke objecten en relaties daarin worden onderscheiden. |
| [Graph Build Specification](#graphbuildspecification) | Om te begrijpen hoe informatie uit gebeurtenissen wordt verwerkt en vastgelegd in de knowledge graph. |
| [Uitwisselen Melding](#mld) | Om de technische uitwerking van deze samenwerkfunctie te raadplegen. Let op: deze beschrijving wordt herzien en is op onderdelen verouderd. |
| [Uitwisselen Uitkomst Overleg](#uuo) | Om de gebeurtenissen, gegevens, informatievragen en inzagemogelijkheden van deze samenwerkfunctie te begrijpen. |

## Aanvullende hulpmiddelen

Naast de hoofdstukken zijn er twee interactieve hulpmiddelen:

- **[API-specificaties](api.html)**: bekijk de API-contracten interactief, download de OpenAPI-bestanden of open ze in Swagger Editor. De Swagger UI op deze site is bedoeld om de contracten te bekijken; API-aanroepen uitvoeren is daar niet mogelijk.
- **[Kennis-graph](kennis-graph.html)**: verken het informatiemodel en de voorbeelden als graph en bekijk de relaties tussen de verschillende objecten.
