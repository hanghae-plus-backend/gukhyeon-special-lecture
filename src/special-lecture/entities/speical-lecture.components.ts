// special-lecture-writer.service.ts
import { Inject, Injectable } from '@nestjs/common'
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
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async read(lectureId: number): Promise<SpecialLecture> {
        return this.repository.read(lectureId)
    }
}

@Injectable()
export class SpecialLectureWriter {
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async write(): Promise<SpecialLecture> {
        return this.repository.write()
    }
}

@Injectable()
export class SpecialLectureReservationReader {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async read(userId: number): Promise<SpecialLectureReservation> {
        return this.repository.read(userId)
    }
}

@Injectable()
export class SpecialLectureReservationWriter {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async write(
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        return this.repository.write(userId, specialLecture)
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

    isAvailableUserId(userId: number): boolean {
        return userId > 0
    }

    async read(lectureId: number): Promise<SpecialLecture> {
        return this.specialLectureReader.read(lectureId)
    }

    async write(): Promise<SpecialLecture> {
        return this.specialLectureWriter.write()
    }

    async readReservation(userId: number): Promise<SpecialLectureReservation> {
        return this.specialLectureReservationReader.read(userId)
    }

    async writeReservation(userId: number): Promise<SpecialLectureReservation> {
        if (!this.isAvailableUserId(userId)) {
            throw new Error('유효하지 않은 유저 아이디입니다.')
        }

        const currentSpecialLecture = await this.specialLectureReader.read(1) //현재 강의는 무조건 1번

        if (currentSpecialLecture.specialLectureReservations.length >= 30) {
            throw new Error('강의가 꽉 찼습니다.')
        }

        if (!currentSpecialLecture) {
            throw new Error('강의를 찾을 수 없습니다.')
        }

        if (
            currentSpecialLecture.specialLectureReservations.find(
                reservation => reservation.userId === userId,
            )
        ) {
            throw new Error('이미 신청한 유저입니다.')
        }

        const reservation = await this.specialLectureReservationWriter.write(
            userId,
            currentSpecialLecture,
        )

        return reservation
    }
}
