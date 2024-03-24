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
}
