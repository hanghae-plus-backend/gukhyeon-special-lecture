import { Inject, Injectable } from '@nestjs/common'
import { SpecialLectureRepository } from '../repositories/special-lecture.repository'
import { SpecialLecture } from '../entities/special-lecture.entity'
import { EntityManager } from 'typeorm'

@Injectable()
export class SpecialLectureReader {
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async read(
        lectureId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLecture> {
        return this.repository.read(lectureId, entityManager)
    }
}

@Injectable()
export class SpecialLectureWriter {
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async write(entityManager: EntityManager): Promise<SpecialLecture> {
        return this.repository.write(entityManager)
    }
}
