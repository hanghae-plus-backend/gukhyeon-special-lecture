// special-lecture-writer.service.ts
import { Injectable } from '@nestjs/common'
import {
    SpecialLectureRepository,
    SpecialLectureReservationRepository,
} from '../repositories/special-lecture.repository'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'

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
export class SpecialLectureReservationReader {
    constructor(private repository: SpecialLectureReservationRepository) {}

    async read(userId: number): Promise<SpecialLectureReservation> {
        return this.repository.read(userId)
    }
}

@Injectable()
export class SpecialLectureReservationWriter {
    constructor(private repository: SpecialLectureReservationRepository) {}

    async write(userId: number): Promise<SpecialLectureReservation> {
        return this.repository.write(userId)
    }
}

@Injectable()
export class SpecialLectureManager {
    constructor(
        private specialLectureReader: SpecialLectureReader,
        private specialLectureWriter: SpecialLectureWriter,
        private specialLectureReservationReader: SpecialLectureReservationReader,
        private specialLectureReservationWriter: SpecialLectureReservationWriter,
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

    async canApplyForSpecialLecture(userId: number): Promise<boolean> {
        if (!this.isAvailableUserId(userId)) {
            throw new Error('유효하지 않은 유저 아이디입니다.')
        }

        const currentApplicantCount =
            await this.specialLectureReader.getCount(1) //현재 강의는 무조건 1번

        if (currentApplicantCount >= 30) {
            throw new Error('강의가 꽉 찼습니다.')
        }

        const specialLectureReservation =
            await this.specialLectureReservationReader.read(userId)

        if (specialLectureReservation) {
            throw new Error('이미 신청한 유저입니다.')
        }

        return true
    }
}
