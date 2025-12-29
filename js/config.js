let respecConfig = {
//  useLogo: true,
//  useLabel: true,
//  license: "eupl",
  shortName: "Respec-template",
  pubDomain: "hl",

  // Zie de globale property 'localizationStrings/nl' voor de lijst met toegestane specificatie-types
  specType: "IM",
  
  // Zie de globale property 'localizationStrings/nl' voor de lijst met toegestane specificatie-statussen
  specStatus: "IO",
  publishDate: "2025-12-24",
  publishVersion: "0.0.2",

  // Zie de globale property 'localizationStrings/nl' voor de lijst met toegestane maturities
  //previousMaturity: "IO",
  //previousPublishDate: "2025-12-23",
  //previousPublishVersion: "0.0.1",
  
  title: "Specificaties van samenwerkpatronen, API's en events",
  subtitle: "Van het Samen onder Handbereik Jeugd-, Zorg- en Veiligheid Afsprakenstelsel",
//  content: {"mermaid": "", "ch01": "informative", "ch02": ""},
//  authors:
//    [
//      {
//        name: "Team Samen onder Handbereik",
//        company: "DGSenB",
//        companyURL: "https://www.rijksoverheid.nl/ministeries/ministerie-van-justitie-en-veiligheid",
//      }
//    ],
  editors:
    [
      {
        name: "Team Samen onder Handbereik",
        company: "DGSenB",
        companyURL: "https://www.rijksoverheid.nl/ministeries/ministerie-van-justitie-en-veiligheid",
      }
    ],
  github: "https://github.com/leongrinwis/respectvngorg",

  maxTocLevel: 5,

  // Creëer PDF en link deze aan de file in de header van het html document (optioneel). Het is (nog) niet mogelijk hier een globale property van te maken:
  alternateFormats: [
      {
          label: "pdf",
          uri: "Respec-template.pdf",
  //        uri: "Respec-bij-VNG-R.pdf",
      },
    ],
  localBiblio: {
        "MIM": {
           "href": "https://docs.geostandaarden.nl/mim/mim/",
           "publisher": "Geonovum",
           "title": "MIM - Metamodel Informatie Modellering",
           "date": "Oktober 2023",
           "rawDate": "2023"
        },
        "SemVer": {
           "href": "https://semver.org/lang/nl/",
           "title": "Semantisch Versioneren 2.0.0",
           "date": "December 19, 2023",
           "rawDate": "2023"
        },
    },
}
