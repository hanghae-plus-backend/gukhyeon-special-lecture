import { Injectable } from '@nestjs/common'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'

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
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        const reservationData = {
            userId,
            specialLecture: specialLecture,
        }

        const newReservation =
            this.specialLectureReservationRepository.create(reservationData)
        return this.specialLectureReservationRepository.save(newReservation)
    }
}
