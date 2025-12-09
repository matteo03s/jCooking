package it.jpanik.jCooking.services.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements StorageService {

    @Value("${app.storage.location}")
    private String uploadDir;

    @Value("${app.storage.base-url}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
            System.out.println("Directory di upload creata/verificata: " + uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Impossibile inizializzare la directory di storage locale: " + uploadDir, e);
        }
    }

    @Override
    public String uploadFile(MultipartFile file, Long recipeId) {
        if (file.isEmpty()) {
            throw new RuntimeException("Impossibile caricare un file vuoto.");
        }

        String filename = String.format("%d-%s-%s",
                recipeId,
                UUID.randomUUID().toString().substring(0, 8),
                file.getOriginalFilename());

        try {
            Path targetLocation = Paths.get(uploadDir).resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return baseUrl + filename;
        } catch (IOException e) {
            throw new RuntimeException("Errore nel salvataggio del file locale: " + filename, e);
        }
    }

    @Override
    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        try {
            String filename = imageUrl;
            if (imageUrl.startsWith(baseUrl)) {
                filename = imageUrl.substring(baseUrl.length());
            } else {
                int lastSlashIndex = imageUrl.lastIndexOf('/');
                if (lastSlashIndex != -1) {
                    filename = imageUrl.substring(lastSlashIndex + 1);
                }
            }
            Path filePath = Paths.get(uploadDir).resolve(filename);
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                System.out.println("File eliminato fisicamente: " + filePath);
            } else {
                System.out.println("File non trovato su disco (potrebbe essere già stato cancellato): " + filePath);
            }

        } catch (IOException e) {
            System.err.println("ERRORE: Impossibile eliminare il file fisico: " + imageUrl);
            e.printStackTrace();
        }
    }
}