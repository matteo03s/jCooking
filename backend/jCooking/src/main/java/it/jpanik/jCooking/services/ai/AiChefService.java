package it.jpanik.jCooking.services.ai;

import it.jpanik.jCooking.dtos.ai.AiTranslatedRecipeRecord;
import it.jpanik.jCooking.dtos.ai.RecipeFields.AiDescriptionRecord;
import it.jpanik.jCooking.dtos.ai.AiRecipeRecord;
import it.jpanik.jCooking.dtos.ai.RecipeFields.AiStepsRecord;
import it.jpanik.jCooking.dtos.ai.RecipeFields.AiTagsRecord;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.mappers.AiRecipeMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiChefService {

    private final ChatClient chatClient;
    private final AiRecipeMapper mapper;

    public AiChefService(ChatClient.Builder builder, AiRecipeMapper mapper) {
        this.chatClient = builder.build();
        this.mapper = mapper;
    }

    public RecipeWithAuthorDto generateRecipe(String ingredients, String type) {

        String userMessage = String.format(
                "Ingredienti: %s. Tipo: %s.",
                ingredients, (type != null ? type : "A tua scelta")
        );

        AiRecipeRecord aiResponse = chatClient.prompt()
                .system(s -> s.text("""
                        Sei un generatore API rigoroso. Rispondi SOLO in JSON.
                        
                        REGOLE PER LA DESCRIZIONE:
                            -deve avere una compresa tra le 20 e le 50 parole
                            -deve rappresentare il piatto, ma non solo descriverne gli ingredienti
                            -descrivi le caratteristiche (es. "un piatto perfetto per una serata invernale")
                        REGOLE PER GLI STEPS:
                            -devi essere chiaro
                            -non serve essere troppo sintetico, puoi anche essere più esplicativo
                        REGOLE PER I TAGS:
                            -i tag devono essere parole semplici che rappresentino una caratteristica del piatto,
                                come ad esempio "italiana", "fresca", "estiva" e cose simili.
                        REGOLE PER I CAMPI ENUM (TASSATIVE):
                            1. 'difficulty' DEVE essere ESATTAMENTE uno di questi valori:
                               [VERY_EASY, EASY, MEDIUM, HARD]
                            2. REGOLE UNITÀ DI MISURA (Usa SOLO queste stringhe nel campo 'unit'):
                                - G (Grammi)
                                - KG (Chilogrammi)
                                - ML (Millilitri)
                                - L (Litri)
                                - TBSP (Cucchiaio grande)
                                - TSP (Cucchiaino)
                                - CUP (Tazza)
                                - PZ (Pezzi, es. per uova)
                                - QB (Quanto basta, es. sale/pepe)
                            3. REGOLE TASSATIVE PER LA CATEGORIA (Usa SOLO queste stringhe nel campo 'category':
                                -appetizer  (aperitivi)
                                -first  (primi piatti, come pasta o altro)
                                -second (secondi piatti, come carne o pesce)
                                -single (piatti unici, come una torta rustica o come una grande frittata)
                                -side   (contorni o salse)
                                -dessert    (dolci)
                                -snack  (piccoli sfizi)
                                -beverage   (bevande)
                                -other  (ciò che non sai classificare)

                        ISTRUZIONI AGGIUNTIVE:
                        - Se l'ingrediente è numerabile (es. 2 Uova), usa unit: "PZ".
                        - Se la quantità è indefinita (es. sale, olio), usa unit: "QB" e quantity: 0.
                        - Usa "TBSP" per cucchiaio e "TSP" per cucchiaino.
                        
                        """))
                .user(userMessage)
                .call()
                .entity(AiRecipeRecord.class);

        return mapper.toDto(aiResponse);
    }

    public AiDescriptionRecord generateDescription(String title, String ingredients) {

        String userMessage = String.format("Titolo ricetta: %s. Ingredienti principali: %s.", title, ingredients);

        return chatClient.prompt()
                .system(s -> s.text("""
            Sei un Food Blogger appassionato e persuasivo.
            Scrivi una descrizione INTRODUTTIVA per questa ricetta.
            
            REGOLE:
            1. Lunghezza: Massimo 3-4 frasi (dalle 20 alle 50 parole).
            2. Tono: Invitante, caldo, appetitoso ("Mouth-watering").
            3. Lingua: Italiano.
            4. Rispondi SOLO con il JSON contenente il campo 'description'.
            """))
                .user(userMessage)
                .call()
                .entity(AiDescriptionRecord.class);
    }

    public AiTagsRecord generateTags(String title, String ingredients) {

        String userMessage = String.format("Titolo ricetta: %s. Ingredienti principali: %s.", title, ingredients);

        return chatClient.prompt()
                .system(s -> s.text("""
            Sei un esperto SEO per un blog di cucina.
            Il tuo compito è generare una lista di TAG (parole chiave) pertinenti per questa ricetta.
            REGOLE:
                1. Genera dai 3 ai 7 tag al massimo.
                2. I tag devono riguardare: Un Ingrediente principale, Tipo di portata (es. "Primo"), Dieta (es. "Vegano", "Senza Glutine"), Stagionalità, Provenienza o Metodo di cottura.
                3. Usa parole singole o brevi frasi (es. "Pasta Fresca", "Veloce").
                4. Lingua: Italiano.
                5. Rispondi SOLO con il JSON contenente il campo 'tags' che è una lista di stringhe.
            """))
                .user(userMessage)
                .call()
                .entity(AiTagsRecord.class);
    }

    public AiStepsRecord generateSteps(String title, String ingredients) {

        String userMessage = String.format("Titolo ricetta: %s. Ingredienti principali: %s.", title, ingredients);

        return chatClient.prompt()
                .system(s -> s.text("""
                        Sei uno Chef esperto e un ottimo insegnante di cucina.
                        Il tuo compito è scrivere il procedimento (steps) passo dopo passo per realizzare la ricetta indicata, usando gli ingredienti forniti.
                        
                        REGOLE:
                        1. Genera una sequenza logica di passaggi (minimo 3, massimo 12).
                        2. Stile: Usa l'imperativo o l'infinito (es. "Tagliare le verdure" o "Taglia le verdure"), mantieni un tono chiaro e istruzionale.
                        3. Dettagli: Dove possibile, specifica tempi di cottura approssimativi e segnali visivi (es. "finché non diventa dorato", "per circa 10 minuti").
                        4. Non inventare ingredienti esotici non presenti nella lista, ma dai per scontato l'uso di base di olio, sale, pepe e acqua.
                        5. Lingua: Italiano.
                        6. Rispondi SOLO con il JSON contenente il campo 'steps' che è una lista di stringhe."""))
                .user(userMessage)
                .call()
                .entity(AiStepsRecord.class);
    }

    public AiTranslatedRecipeRecord translateRecipe(String title, String description, String ingredients, String steps, String targetLanguage) {

        String userMessage = String.format(
                """
                DATI RICETTA:
                Titolo: %s
                Descrizione: %s
                Ingredienti: %s
                Step: %s
                
                LINGUA TARGET: %s
                """,
                title, description, ingredients, steps, targetLanguage
        );

        return chatClient.prompt()
                .system(s -> s.text("""
                Sei un traduttore culinario esperto.
                Il tuo compito è tradurre la ricetta nella lingua: ""\" + targetLanguage + ""\".
                REGOLE FONDAMENTALI:
                    1. Traduci Titolo, Descrizione, Step e NOMI degli ingredienti.
                    2. PER GLI INGREDIENTI: Devi restituire un oggetto strutturato.
                        - 'name': Traduci il nome dell'ingrediente (es. "Farina" -> "Flour").
                        - 'quantity': Mantieni lo stesso numero originale.
                        - 'unit': Mantieni la stessa IDENTICA stringa originale (o il suo codice, es. 'G', 'ML'). Non convertirle (es. non passare da grammi a cups).
                    3. Rispondi SOLO con il JSON valido mappato sulla struttura richiesta.
                    4. Traduci Titolo, Descrizione, Ingredienti e Step.
                """))
                .user(userMessage)
                .call()
                .entity(AiTranslatedRecipeRecord.class);
    }
}