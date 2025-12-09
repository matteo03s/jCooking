package it.jpanik.jCooking.services.ai;

import it.jpanik.jCooking.dtos.ai.AiNutritionRecord;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiNutritionService {

    private final ChatClient chatClient;

    public AiNutritionService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public AiNutritionRecord analyzeNutrition(String recipeTitle, String ingredients, int servings) {

        String userMessage = String.format(
                "Analizza questa ricetta: '%s'. Ingredienti totali: %s. Numero di porzioni: %d.",
                recipeTitle, ingredients, servings
        );

        return chatClient.prompt()
                .system(s -> s.text("""
                Sei un Nutrizionista esperto.
                Il tuo compito è calcolare i valori nutrizionali stimati PER SINGOLA PORZIONE.
                
                LOGICA DI CALCOLO:
                1. Stima le calorie e i macronutrienti totali degli ingredienti.
                2. DIVIDI i totali per il numero di porzioni indicato.
                
                REGOLE:
                1. Rispondi ESCLUSIVAMENTE con un JSON valido.
                2. I valori (calories, carbohydrates, proteins, fats) devono essere numeri interi (arrotonda).
                3. I macronutrienti sono in grammi (g).
                4. Nel campo 'briefComment', dai un giudizio flash (max 5 parole) sul profilo nutrizionale (es. "Alto contenuto proteico", "Bilanciato", "Ricco di carboidrati").
                """))
                .user(userMessage)
                .call()
                .entity(AiNutritionRecord.class);
    }
}
