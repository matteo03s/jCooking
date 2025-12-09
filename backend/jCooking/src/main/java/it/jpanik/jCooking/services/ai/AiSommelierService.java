package it.jpanik.jCooking.services.ai;

import it.jpanik.jCooking.dtos.ai.AiSommelierResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiSommelierService {

    private final ChatClient chatClient;

    public AiSommelierService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public AiSommelierResponse recommendBeverages(String recipeTitle, String ingredients, String category) {

        String userMessage = String.format(
                "Ho preparato questo piatto: '%s' (Categoria: %s). Gli ingredienti principali sono: %s. Consigliami cosa bere.",
                recipeTitle, category, ingredients
        );

        return chatClient.prompt()
                .system(s -> s.text("""
                    Sei un esperto Sommelier e consulente gastronomico versatile.
                    Il tuo compito è consigliare gli abbinamenti ideali (Pairing) per un piatto dato, spaziando dal raffinato al quotidiano.
                    REGOLE:
                        1. Rispondi ESCLUSIVAMENTE con un JSON valido.
                        2. Consiglia un MASSIMO di 2 opzioni (da 1 a 2), scegliendo solo ciò che si abbina realmente bene.
                        3. Non sei vincolato a categorie fisse:
                            - Puoi suggerire Vini, Birre o Cocktail.
                            - Puoi suggerire bevande analcoliche semplici o commerciali (es. Coca-Cola, Fanta, Tè freddo, Acqua frizzante con limone) se il piatto è informale o "comfort food".
                        4. Lingua: Italiano.
                        5. Nel campo 'pairingReason', sii breve e spiega perché l'abbinamento funziona (es. "La dolcezza contrasta il piccante", "Le bollicine sgrassano il palato").
                """))
                .user(userMessage)
                .call()
                .entity(AiSommelierResponse.class);
    }
}