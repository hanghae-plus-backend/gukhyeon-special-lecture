import { Injectable } from '@nestjs/common'
import { SpecialLecture } from './entities/special-lecture.entity'
import { SpecialLectureManager } from './components/special-lecture-manager.component'
import { SpecialLectureReservation } from './entities/special-lecture-reservation.entity'

@Injectable()
export class SpecialLectureService {
    constructor(private specialLectureManager: SpecialLectureManager) {}

    async readSpecialLecture(id: number): Promise<SpecialLecture> {
        return this.specialLectureManager.read(id)
    }

    async writeSpecialLecture(): Promise<SpecialLecture> {
        return this.specialLectureManager.write()
    }

    async readSpecialLectureReservation(
        userId: number,
    ): Promise<SpecialLectureReservation> {
        return this.specialLectureManager.readReservation(userId)
    }

    async writeSpecialLectureReservation(
        userId: number,
    ): Promise<SpecialLectureReservation> {
        return this.specialLectureManager.writeReservation(userId)
    }
}
