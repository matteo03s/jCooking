package it.jpanik.jCooking.mappers;

import java.util.List;

// 1
public abstract class Mapper<DTO, ENTITY> {

    // 2
    public ENTITY convertDtoToEntity(DTO dto) {
        if (dto == null) {
            return null;
        }
        return convertDtoToEntityImpl(dto);
    }

    // 2
    public DTO convertEntityToDto(ENTITY entity) {
        if (entity == null) {
            return null;
        }
        return convertEntityToDtoImpl(entity);
    }

    // 2
    public List<ENTITY> convertListDtoToListEntity(List<DTO> dtos) {
        if (dtos == null) {
            return null;
        }
        // 4
        return dtos.stream().map(this::convertDtoToEntityImpl).toList();
    }

    // 2
    public List<DTO> convertListEntityToListDto(List<ENTITY> entities) {
        if (entities == null) {
            return null;
        }
        // 4
        return entities.stream().map(this::convertEntityToDto).toList();
    }

    // 3
    protected abstract ENTITY convertDtoToEntityImpl(DTO dto);

    // 3
    protected abstract DTO convertEntityToDtoImpl(ENTITY entity);

}