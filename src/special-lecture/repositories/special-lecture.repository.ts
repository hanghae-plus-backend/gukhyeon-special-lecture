import { Injectable } from '@nestjs/common'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

export interface SpecialLectureRepository {
    read(lectureId: number): Promise<SpecialLecture>

    write(): Promise<SpecialLecture>
}

@Injectable()
export class SpecialLectureCoreRepository implements SpecialLectureRepository {
    constructor(
        @InjectRepository(SpecialLecture)
        private specialLectureRepository: Repository<SpecialLecture>,
    ) {}

    async read(lectureId: number): Promise<SpecialLecture> {
        return this.specialLectureRepository.findOne({
            where: { id: lectureId },
            relations: ['specialLectureReservations'],
        })
    }

    async write(): Promise<SpecialLecture> {
        const specialLectureData = new SpecialLecture()
        return this.specialLectureRepository.save(specialLectureData)
    }
}

export interface SpecialLectureReservationRepository {
    read(userId: number): Promise<SpecialLectureReservation>

    write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation>
}

@Injectable()
export class SpecialLectureReservationCoreRepository
    implements SpecialLectureReservationRepository
{
    constructor(
        @InjectRepository(SpecialLectureReservation)
        private specialLectureReservationRepository: Repository<SpecialLectureReservation>,
    ) {}

    async read(userId: number): Promise<SpecialLectureReservation> {
        return this.specialLectureReservationRepository.findOneBy({ userId })
    }

    async write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        const reservationData = new SpecialLectureReservation()
        reservationData.userId = userId
        reservationData.specialLecture = specialLecture

        // Use the provided entityManager to save the reservation
        return entityManager.save(reservationData)
    }
}
