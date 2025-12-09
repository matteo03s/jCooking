# jCooking
progetto tirocinio laurea triennale

**Descrizione**  
jCooking è un'applicazione full-stack per la gestione di ricette, con funzionalità di creazione, modifica, gestione ingredienti, steps, tags, recensioni e suggerimenti AI.

---

## Struttura della repository

jCooking/
├── backend/                 # Codice backend Java Spring Boot
│   ├── src/main/java/it/jpanik/jCooking
│   │   ├── config           # Configurazioni (es. Cloudinary)
│   │   ├── controllers      # Controller REST
│   │   ├── dtos             # Data Transfer Objects
│   │   ├── entities         # Entità JPA
│   │   ├── exceptions       # Eccezioni personalizzate
│   │   ├── mappers          # Mapper DTO <-> Entity
│   │   ├── repositories     # Repository JPA
│   │   ├── security         # Sicurezza (JWT, Auth)
│   │   ├── services         # Logica di business
│   │   └── validator        # Validator personalizzati
│   └── src/main/resources
│       ├── application.properties
│       └── data.sql
│
├── frontend/                 # Codice frontend Angular
│   ├── src/app
│   │   ├── core             # Componenti riutilizzabili, servizi, store
│   │   ├── pages            # Pagine principali
│   │   └── assets           # Immagini, avatar, dati JSON, i18n
│   └── src/styles.scss       # Stili globali
│
└── README.md
