import { Injectable } from '@nestjs/common'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'

export interface SpecialLectureRepository {
    read(userId: number): Promise<SpecialLecture>
    count(lectureId: number): Promise<number>

    write(userId: number): Promise<SpecialLecture>
}

@Injectable()
export class SpecialLectureCoreRepository implements SpecialLectureRepository {
    constructor(
        @InjectRepository(SpecialLecture)
        private specialLectureRepository: Repository<SpecialLecture>,
    ) {}

    async read(userId: number): Promise<SpecialLecture> {
        return { id: userId, title: 'title', specialLectureReservations: [] }
    }

    async write(userId: number): Promise<SpecialLecture> {
        return { id: userId, title: 'title', specialLectureReservations: [] }
    }

    async count(lectureId: number): Promise<number> {
        return lectureId
    }
}

export interface SpecialLectureReservationRepository {
    read(userId: number): Promise<SpecialLectureReservation>

    write(userId: number): Promise<SpecialLectureReservation>
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
        return {
            id: 1,
            userId: 1,
            specialLecture: {
                id: 1,
                title: 'title',
                specialLectureReservations: [],
            },
        }
    }

    async write(userId: number): Promise<SpecialLectureReservation> {
        return {
            id: 1,
            userId: 1,
            specialLecture: {
                id: 1,
                title: 'title',
                specialLectureReservations: [],
            },
        }
    }
}
