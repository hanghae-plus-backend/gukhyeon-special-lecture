import { IsDate, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLectureTimeTableDto {
    @IsInt()
    lectureId: number

    @IsDate()
    @Type(() => Date)
    startTime: Date

    @IsDate()
    @Type(() => Date)
    endTime: Date
}
