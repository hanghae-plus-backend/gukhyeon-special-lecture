import { Injectable } from '@nestjs/common'
import {
    SpecialLectureManager,
    SpecialLectureReader,
} from './entities/speical-lecture.components'
import { SpecialLecture } from './entities/special-lecture.entity'

@Injectable()
export class SpecialLectureService {
    constructor(
        private specialLectureManager: SpecialLectureManager,
        private specialLectureReader: SpecialLectureReader,
    ) {}

    async readSpecialLecture(userId: number): Promise<SpecialLecture> {
        return this.specialLectureManager.read(userId)
    }

    async writeSpecialLecture(userId: number): Promise<SpecialLecture> {
        return this.specialLectureManager.write(userId)
    }

    async readSpecialLectureDirectly(userId: number): Promise<SpecialLecture> {
        return this.specialLectureReader.read(userId)
    }
}
