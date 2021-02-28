import { ICatFactDto } from '../../services/models';
import { ICatFact } from '../cat-fact';

export function mapCatFactFromDto(dto: ICatFactDto): ICatFact {
    return {
        id: dto._id,
        verified: dto.status.verified,
        text: dto.text,
        createdAt: new Date(dto.createdAt),
        deleted: dto.deleted,
    };
}
