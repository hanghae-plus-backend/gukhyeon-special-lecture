import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { LectureService } from './lecture.service'
import { Lecture } from './entities/lecture.entity'
import { LectureReservation } from './entities/lecture-reservation.entity'
import { LectureTimeTable } from './entities/lecture-timetable.entity'
import { CreateLectureTimeTableDto } from './dto/create-lecture-timetable.dto'

@Controller('lecture')
export class LectureController {
    constructor(private readonly lectureService: LectureService) {}

    @Get('timeTable')
    async readLectureTimeTables(): Promise<LectureTimeTable[]> {
        return this.lectureService.readLectureTimeTables()
    }

    @Get(':id')
    async readLecture(@Param('id') id: number): Promise<Lecture> {
        return this.lectureService.readLecture(id)
    }

    @Get('reservation/:userId')
    async readLectureReservation(@Param('userId') userId: number): Promise<LectureReservation> {
        return this.lectureService.readLectureReservation(userId)
    }

    @Post()
    async writeLecture(@Body('title') title: string): Promise<Lecture> {
        return this.lectureService.writeLecture(title)
    }

    @Post('timeTable')
    async writeLectureTimeTable(
        @Body()
        dto: CreateLectureTimeTableDto,
    ): Promise<LectureTimeTable> {
        return this.lectureService.writeLectureTimeTable(dto)
    }

    @Post('reservation/:userId/:timeTableId')
    async writeLectureReservation(@Param('userId') uid, @Param('timeTableId') tid): Promise<LectureReservation> {
        const userId = Number.parseInt(uid)
        const timeTableId = Number.parseInt(tid)

        return this.lectureService.writeLectureReservation(userId, timeTableId)
    }
}
