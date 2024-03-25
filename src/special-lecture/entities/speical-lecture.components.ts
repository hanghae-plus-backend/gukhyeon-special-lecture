// special-lecture-writer.service.ts
import { Inject, Injectable } from '@nestjs/common'
import {
    LockModeType,
    SpecialLectureRepository,
    SpecialLectureReservationRepository,
} from '../repositories/special-lecture.repository'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class SpecialLectureReader {
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async read(
        lectureId: number,
        entityManager: EntityManager,
        lockMode?: LockModeType,
    ): Promise<SpecialLecture> {
        return this.repository.read(lectureId, entityManager, lockMode)
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

@Injectable()
export class SpecialLectureReservationReader {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async read(
        userId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLectureReservation> {
        return this.repository.read(userId, entityManager)
    }
}

@Injectable()
export class SpecialLectureReservationWriter {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        return this.repository.write(entityManager, userId, specialLecture)
    }
}

@Injectable()
export class SpecialLectureManager {
    constructor(
        private specialLectureReader: SpecialLectureReader,
        private specialLectureWriter: SpecialLectureWriter,
        private specialLectureReservationReader: SpecialLectureReservationReader,
        private specialLectureReservationWriter: SpecialLectureReservationWriter,
        private dataSource: DataSource,
    ) {}

    isAvailableUserId(userId: number): boolean {
        return userId > 0
    }

    async read(lectureId: number): Promise<SpecialLecture> {
        return await this.specialLectureReader.read(
            lectureId,
            this.dataSource.manager,
        )
    }

    async write(): Promise<SpecialLecture> {
        return this.specialLectureWriter.write(this.dataSource.manager)
    }

    async readReservation(userId: number): Promise<SpecialLectureReservation> {
        return this.specialLectureReservationReader.read(
            userId,
            this.dataSource.manager,
        )
    }

    async writeReservation(userId: number): Promise<SpecialLectureReservation> {
        if (!this.isAvailableUserId(userId)) {
            throw new Error('유효하지 않은 유저 아이디입니다.')
        }

        return await this.dataSource.transaction(async entityManager => {
            const specialLecture = await this.specialLectureReader.read(
                1,
                entityManager,
                'pessimistic_write',
            )

            if (
                !specialLecture ||
                specialLecture.specialLectureReservations.length >= 30
            ) {
                throw new Error('강의가 꽉 찼거나 찾을 수 없습니다.')
            }

            if (
                specialLecture.specialLectureReservations.some(
                    reservation => reservation.userId === userId,
                )
            ) {
                throw new Error('이미 신청한 유저입니다.')
            }

            const reservation =
                await this.specialLectureReservationWriter.write(
                    entityManager,
                    userId,
                    specialLecture,
                )

            return reservation
        })
    }
}
