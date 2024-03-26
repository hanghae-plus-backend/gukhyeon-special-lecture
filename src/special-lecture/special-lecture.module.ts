import { Module } from '@nestjs/common'
import { SpecialLectureService } from './special-lecture.service'
import {
    SpecialLectureReader,
    SpecialLectureWriter,
} from './components/speical-lecture.component'
import { SpecialLectureCoreRepository } from './repositories/special-lecture.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpecialLecture } from './entities/special-lecture.entity'
import { SpecialLectureController } from './special-lecture.controller'
import { SpecialLectureManager } from './components/special-lecture-manager.component'
import { SpecialLectureReservation } from './entities/special-lecture-reservation.entity'
import {
    SpecialLectureReservationReader,
    SpecialLectureReservationWriter,
} from './components/special-lecture-reservation.component'
import { SpecialLectureReservationCoreRepository } from './repositories/special-lecture-reservation.repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([SpecialLecture, SpecialLectureReservation]),
    ],
    controllers: [SpecialLectureController],
    providers: [
        SpecialLectureService,
        SpecialLectureManager,
        SpecialLectureReader,
        SpecialLectureWriter,
        SpecialLectureReservationReader,
        SpecialLectureReservationWriter,
        {
            provide: 'SpecialLectureRepository',
            useClass: SpecialLectureCoreRepository,
        },
        {
            provide: 'SpecialLectureReservationRepository',
            useClass: SpecialLectureReservationCoreRepository,
        },
    ],
    exports: [SpecialLectureService],
})
export class SpecialLectureModule {}
