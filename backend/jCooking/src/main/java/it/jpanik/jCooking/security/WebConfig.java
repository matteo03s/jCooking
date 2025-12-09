package it.jpanik.jCooking.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Value("${app.storage.location}")
    private String uploadDir;

    @Value("${app.storage.base-url}")
    private String baseUrl;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            // Metodo CORS esistente
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }

            // 2. NUOVO METODO: Mappatura delle Risorse per le Immagini
            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {

                // Prepara i percorsi
                String handlerPath = baseUrl.endsWith("/") ? baseUrl + "**" : baseUrl + "/**";
                String fileLocation = uploadDir.endsWith("/") ? uploadDir : uploadDir + "/";

                // Mappa le richieste HTTP (es. /static/images/foto.jpg) al percorso del file system
                registry.addResourceHandler(handlerPath)
                        .addResourceLocations("file:" + fileLocation);

                System.out.println("WebConfig: Mappatura risorse locali attiva: " + handlerPath + " -> file:" + fileLocation);
            }
        };
    }
}
