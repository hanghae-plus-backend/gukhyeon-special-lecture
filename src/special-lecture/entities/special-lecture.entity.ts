import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { SpecialLectureReservation } from './special-lecture-reservation.entity'

@Entity()
export class SpecialLecture {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(
        () => SpecialLectureReservation,
        SpecialLectureReservation => SpecialLectureReservation.specialLecture,
    )
    specialLectureReservations: SpecialLectureReservation[]
}
