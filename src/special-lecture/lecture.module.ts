import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lecture } from './entities/lecture.entity'
import { LectureReservation } from './entities/lecture-reservation.entity'
import { LectureTimeTable } from './entities/lecture-timetable.entity'
import { LectureController } from './lecture.controller'
import { LectureService } from './lecture.service'
import { LectureManager } from './components/lecture-manager.component'
import { LectureReader, LectureWriter } from './components/lecture.component'
import { LectureRepository } from './repositories/lecture.repository'
import { LectureTimeTableReader, LectureTimeTableWriter } from './components/lecture-timetable.component'
import { LectureReservationReader, LectureReservationWriter } from './components/lecture-reservation.component'
import { LectureTimeTableRepository } from './repositories/lecture-timetable.repository'
import { LectureReservationRepository } from './repositories/lecture-reservation.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Lecture, LectureReservation, LectureTimeTable])],
    controllers: [LectureController],
    providers: [
        LectureService,
        LectureManager,
        {
            provide: LectureReader,
            useClass: LectureRepository,
        },
        {
            provide: LectureWriter,
            useClass: LectureRepository,
        },
        {
            provide: LectureTimeTableReader,
            useClass: LectureTimeTableRepository,
        },
        {
            provide: LectureTimeTableWriter,
            useClass: LectureTimeTableRepository,
        },
        {
            provide: LectureReservationReader,
            useClass: LectureReservationRepository,
        },
        {
            provide: LectureReservationWriter,
            useClass: LectureReservationRepository,
        },
    ],
    exports: [LectureService],
})
export class LectureModule {}
