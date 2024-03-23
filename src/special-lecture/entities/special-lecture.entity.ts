import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
} from 'typeorm'

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
