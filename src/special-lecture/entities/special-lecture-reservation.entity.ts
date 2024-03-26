import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SpecialLecture } from './special-lecture.entity'

@Entity()
export class SpecialLectureReservation {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @ManyToOne(
        () => SpecialLecture,
        specialLecture => specialLecture.specialLectureReservations,
        {
            onDelete: 'CASCADE',
        },
    )
    specialLecture: SpecialLecture
}
