import { Controller, Get, Post, Param } from '@nestjs/common'
import { SpecialLectureService } from './special-lecture.service'
import { SpecialLecture } from './entities/special-lecture.entity'
import { SpecialLectureReservation } from './entities/special-lecture-reservation.entity'

@Controller('special-lectures')
export class SpecialLectureController {
    constructor(
        private readonly specialLectureService: SpecialLectureService,
    ) {}

    @Get(':id')
    async readSpecialLecture(@Param('id') id: number): Promise<SpecialLecture> {
        return this.specialLectureService.readSpecialLecture(id)
    }

    @Post()
    async writeSpecialLecture(): Promise<SpecialLecture> {
        return this.specialLectureService.writeSpecialLecture()
    }

    @Get('reservation/:userId')
    async readSpecialLectureReservation(
        @Param('userId') userId: number,
    ): Promise<SpecialLectureReservation> {
        return this.specialLectureService.readSpecialLectureReservation(userId)
    }

    @Post('reservation/:userId')
    async writeSpecialLectureReservation(
        @Param('userId') userId: number,
    ): Promise<SpecialLectureReservation> {
        return this.specialLectureService.writeSpecialLectureReservation(userId)
    }
}
