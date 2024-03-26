import { SpecialLecture } from '../entities/special-lecture.entity'
import { EntityManager } from 'typeorm'

export interface SpecialLectureRepository {
    read(
        lectureId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLecture>

    write(entityManager: EntityManager): Promise<SpecialLecture>
}

export class SpecialLectureCoreRepository implements SpecialLectureRepository {
    async read(
        lectureId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLecture> {
        const queryBuilder = entityManager
            .createQueryBuilder(SpecialLecture, 'specialLecture')
            .leftJoinAndSelect(
                'specialLecture.specialLectureReservations',
                'reservation',
            )
            .where('specialLecture.id = :id', { id: lectureId })

        const result = await queryBuilder.getOne()
        return result
    }

    async write(entityManager: EntityManager): Promise<SpecialLecture> {
        const specialLectureData = new SpecialLecture()
        specialLectureData.title = 'Special Lecture'

        return entityManager.save(specialLectureData)
    }
}
