package it.jpanik.jCooking.services.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.jpanik.jCooking.dtos.ai.AiIngredientRecord;
import it.jpanik.jCooking.dtos.ai.AiTranslatedRecipeRecord;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiTranslateService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AiTranslateService(ChatClient.Builder builder, ObjectMapper objectMapper) {
        this.chatClient = builder.build();
        this.objectMapper = objectMapper;
    }

    public AiTranslatedRecipeRecord translateRecipe(
            String title,
            String description,
            List<AiIngredientRecord> ingredients,
            List<String> steps,
            String targetLanguage
    ) {
        String ingredientsJsonTemp;
        String stepsJsonTemp;

        try {
            ingredientsJsonTemp = objectMapper.writeValueAsString(ingredients);
            stepsJsonTemp = objectMapper.writeValueAsString(steps);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Errore nella serializzazione JSON per AI", e);
        }

        final String ingredientsJson = ingredientsJsonTemp;
        final String stepsJson = stepsJsonTemp;

        return chatClient.prompt()
                .system(s -> s.text("""
                    Sei un traduttore culinario esperto (API JSON).
                    
                    INPUT: Riceverai dei dati di una ricetta (alcuni in formato JSON Array).
                    OUTPUT: Devi restituire la traduzione rispettando la stessa struttura.
                    
                    REGOLE PER GLI INGREDIENTI:
                    Riceverai un array JSON di oggetti.
                    1. Traduci SOLO il campo 'name'.
                    2. COPIA ESATTAMENTE i campi 'quantity' e 'unit' dall'input all'output.
                    3. Non cambiare l'ordine degli elementi.
                    
                    REGOLE GENERALI:
                    - Lingua di destinazione: {language}
                    - Rispondi con un JSON valido mappato sulla struttura richiesta.
                    """)
                        .param("language", targetLanguage)
                )
                .user(u -> u.text("""
                    DATI RICETTA (in formato JSON):
                    Titolo: {title}
                    Descrizione: {description}
                    Ingredienti: {ingredients}
                    Step: {steps}
                    """)
                        .param("title", title)
                        .param("description", description)
                        .param("ingredients", ingredientsJson)
                        .param("steps", stepsJson)
                )
                .call()
                .entity(AiTranslatedRecipeRecord.class);
    }
}