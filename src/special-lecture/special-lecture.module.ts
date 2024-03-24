import { Module } from '@nestjs/common'
import { SpecialLectureService } from './special-lecture.service'
import {
    SpecialLectureManager,
    SpecialLectureReader,
    SpecialLectureWriter,
} from './entities/speical-lecture.components'
import { SpecialLectureCoreRepository } from './repositories/special-lecture.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpecialLecture } from './entities/special-lecture.entity'

@Module({
    imports: [TypeOrmModule.forFeature([SpecialLecture])],
    providers: [
        SpecialLectureService,
        SpecialLectureManager,
        SpecialLectureReader,
        SpecialLectureWriter,
        {
            provide: 'SpecialLectureRepository',
            useClass: SpecialLectureCoreRepository,
        },
    ],
    exports: [SpecialLectureService],
})
export class SpecialLectureModule {}
