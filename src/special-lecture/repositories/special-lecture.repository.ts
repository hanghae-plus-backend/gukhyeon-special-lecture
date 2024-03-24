import { Injectable } from '@nestjs/common'
import { SpecialLecture } from '../entities/special-lecture.entity'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'

export interface SpecialLectureRepository {
    read(userId: number): Promise<SpecialLecture>
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
}
