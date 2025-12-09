package it.jpanik.jCooking.services.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@Primary
public class CloudinaryStorageService implements StorageService {

    private final Cloudinary cloudinary;

    public CloudinaryStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadFile(MultipartFile file, Long recipeId) {
        try {
            // Definiamo il nome univoco del file e la cartella su Cloudinary
            String fileName = recipeId + "-" + UUID.randomUUID().toString();

            Map params = ObjectUtils.asMap(
                    "public_id", fileName,
                    "folder", "jCooking/recipes", // Cartella nel cloud
                    "overwrite", true
            );

            // Carichiamo il file
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            // Restituiamo l'URL sicuro (https)
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException("Errore durante l'upload su Cloudinary", e);
        }
    }

    @Override
    public void deleteFile(String imageUrl) {
        try {
            // Cloudinary per cancellare vuole il "public_id", non l'URL intero.
            // Dobbiamo estrarlo dall'URL.
            String publicId = extractPublicIdFromUrl(imageUrl);

            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                System.out.println("Immagine Cloudinary eliminata: " + publicId);
            }
        } catch (IOException e) {
            System.err.println("Errore durante la cancellazione su Cloudinary: " + e.getMessage());
        }
    }

    /**
     * Metodo helper per estrarre il public_id dall'URL completo.
     * Esempio URL: https://res.cloudinary.com/demo/image/upload/v123456/jCooking/recipes/1-uuid.jpg
     * Public ID atteso: jCooking/recipes/1-uuid
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Trova l'inizio del path dopo "/upload/" e l'eventuale versione "v123/"
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) return null;

            String path = imageUrl.substring(uploadIndex + 8); // Salta "/upload/"

            // Se c'è la versione (v + numeri + /), saltala
            if (path.matches("^v\\d+/.*")) {
                path = path.substring(path.indexOf("/") + 1);
            }

            // Rimuovi l'estensione (.jpg, .png)
            int dotIndex = path.lastIndexOf(".");
            if (dotIndex != -1) {
                path = path.substring(0, dotIndex);
            }

            return path;
        } catch (Exception e) {
            return null;
        }
    }
}