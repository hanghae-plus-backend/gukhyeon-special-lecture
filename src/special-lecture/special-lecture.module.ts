import { Module } from '@nestjs/common'
import { SpecialLectureService } from './special-lecture.service'
import {
    SpecialLectureManager,
    SpecialLectureReader,
    SpecialLectureWriter,
    SpecialLectureReservationReader,
    SpecialLectureReservationWriter,
} from './entities/speical-lecture.components'
import {
    SpecialLectureCoreRepository,
    SpecialLectureReservationCoreRepository,
} from './repositories/special-lecture.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from './entities/special-lecture.entity'
import { SpecialLectureController } from './special-lecture.controller'

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
