import { Injectable } from '@nestjs/common'
import { Lecture } from './entities/lecture.entity'
import { LectureManager } from './components/lecture-manager.component'
import { LectureReservation } from './entities/lecture-reservation.entity'
import { LectureTimeTable } from './entities/lecture-timetable.entity'
import { CreateLectureTimeTableDto } from './dto/create-lecture-timetable.dto'

@Injectable()
export class LectureService {
    constructor(private lectureManager: LectureManager) {}

    async readLecture(id: number): Promise<Lecture> {
        return this.lectureManager.read(id)
    }

    async writeLecture(title: string): Promise<Lecture> {
        return this.lectureManager.write(title)
    }

    async readLectureTimeTables(): Promise<LectureTimeTable[]> {
        return this.lectureManager.readTimeTables()
    }

    async writeLectureTimeTable(dto: CreateLectureTimeTableDto): Promise<LectureTimeTable> {
        dto.startTime = new Date(dto.startTime)
        dto.endTime = new Date(dto.endTime)

        return this.lectureManager.writeTimeTable(dto)
    }

    async readLectureReservation(userId: number): Promise<LectureReservation> {
        return this.lectureManager.readReservation(userId)
    }

    async writeLectureReservation(userId: number, timeTableId: number): Promise<LectureReservation> {
        return this.lectureManager.writeReservation(userId, timeTableId)
    }
}
