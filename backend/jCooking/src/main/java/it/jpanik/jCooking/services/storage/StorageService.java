package it.jpanik.jCooking.services.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Salva il file e restituisce l'URL pubblico.
     * @param file Il file da salvare.
     * @param recipeId L'ID della ricetta, utile per organizzare i file per cartella.
     * @return L'URL (String) per accedere al file dal frontend.
     */
    String uploadFile(MultipartFile file, Long recipeId);

    void deleteFile(String imageUrl);
}