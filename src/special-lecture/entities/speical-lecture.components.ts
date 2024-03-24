// special-lecture-writer.service.ts
import { Injectable } from '@nestjs/common'
import { SpecialLectureRepository } from '../repositories/special-lecture.repository'
import { SpecialLecture } from '../entities/special-lecture.entity'

@Injectable()
export class SpecialLectureReader {
    constructor(private repository: SpecialLectureRepository) {}

    async read(userId: number): Promise<SpecialLecture> {
        return this.repository.read(userId)
    }

    async getCount(lectureId: number): Promise<number> {
        return this.repository.count(lectureId)
    }
}

@Injectable()
export class SpecialLectureWriter {
    constructor(private repository: SpecialLectureRepository) {}

    async write(userId: number): Promise<SpecialLecture> {
        return this.repository.write(userId)
    }
}

@Injectable()
export class SpecialLectureManager {
    constructor(
        private specialLectureReader: SpecialLectureReader,
        private specialLectureWriter: SpecialLectureWriter,
    ) {}

    async read(userId: number): Promise<SpecialLecture> {
        return this.specialLectureReader.read(userId)
    }

    async write(userId: number): Promise<SpecialLecture> {
        return this.specialLectureWriter.write(userId)
    }

    isAvailableUserId(userId: number): boolean {
        return userId > 0
    }

    canApplyForSpecialLecture = async (userId: number): Promise<boolean> => {
        const currentApplicantCount =
            await this.specialLectureReader.getCount(1) //현재 강의는 무조건 1번
        return currentApplicantCount < 30
    }
}
