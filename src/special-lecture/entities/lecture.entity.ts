import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { LectureTimeTable } from './lecture-timetable.entity'

@Entity()
export class Lecture {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(() => LectureTimeTable, letectureTimeTable => letectureTimeTable.lecture)
    lectureTimeTables: LectureTimeTable[]
}
