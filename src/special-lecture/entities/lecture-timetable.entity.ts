import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Lecture } from './lecture.entity'
import { LectureReservation } from './lecture-reservation.entity'

@Entity()
export class LectureTimeTable {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Lecture, lecture => lecture.lectureTimeTables, {
        onDelete: 'CASCADE',
    })
    lecture: Lecture

    @Column()
    startTime: Date

    @Column()
    endTime: Date

    @OneToMany(() => LectureReservation, lectureReservation => lectureReservation.lectureTimeTable)
    lectureReservations: LectureReservation[]
}
