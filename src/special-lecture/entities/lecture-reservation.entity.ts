import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { LectureTimeTable } from './lecture-timetable.entity'

@Entity()
export class LectureReservation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @ManyToOne(() => LectureTimeTable, lectureTimeTable => lectureTimeTable.lectureReservations, {
        onDelete: 'CASCADE',
    })
    lectureTimeTable: LectureTimeTable
}
