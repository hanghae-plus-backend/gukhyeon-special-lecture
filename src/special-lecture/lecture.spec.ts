import { DataSource, QueryRunner, Repository } from 'typeorm'
import { LectureManager } from './components/lecture-manager.component'
import { LectureReservationReader, LectureReservationWriter } from './components/lecture-reservation.component'
import { LectureTimeTableReader, LectureTimeTableWriter } from './components/lecture-timetable.component'
import { LectureReader, LectureWriter } from './components/lecture.component'
import { LectureRepository } from './repositories/lecture.repository'
import { Lecture } from './entities/lecture.entity'
import { LectureTimeTable } from './entities/lecture-timetable.entity'
import { LectureReservation } from './entities/lecture-reservation.entity'
import { LectureTimeTableRepository } from './repositories/lecture-timetable.repository'
import { LectureReservationRepository } from './repositories/lecture-reservation.repository'
import { CreateLectureTimeTableDto } from './dto/create-lecture-timetable.dto'

describe('특강 신청', () => {
    let lectureReader: LectureReader
    let lectureWriter: LectureWriter
    let lectureTimeTableReader: LectureTimeTableReader
    let lectureTimeTableWriter: LectureTimeTableWriter
    let lectureReservationReader: LectureReservationReader
    let lectureReservationWriter: LectureReservationWriter
    let manager: LectureManager
    let dataSource: DataSource
    let queryRunner: QueryRunner

    const mockDS = {
        initialize: jest.fn(),
    }

    jest.mock('typeorm', () => {
        return {
            DataSource: jest.fn().mockImplementation(() => mockDS),
        }
    })

    beforeEach(() => {
        const lectureCoreRepository: Partial<Repository<Lecture>> = {}
        const lectureRepoository = lectureCoreRepository as LectureRepository
        lectureRepoository.read = jest.fn()
        lectureRepoository.readByTitle = jest.fn()
        lectureRepoository.write = jest.fn()

        const lectureTimeTableCoreRepository: Partial<Repository<LectureTimeTable>> = {}
        const lectureTimeTableRepository = lectureTimeTableCoreRepository as LectureTimeTableRepository
        lectureTimeTableRepository.read = jest.fn()
        lectureTimeTableRepository.readById = jest.fn()
        lectureTimeTableRepository.write = jest.fn()

        const lectureReservationCoreRepository: Partial<Repository<LectureReservation>> = {}
        const lectureReservationRepository = lectureReservationCoreRepository as LectureReservationRepository
        lectureReservationRepository.read = jest.fn()
        lectureReservationRepository.write = jest.fn()

        lectureReader = new LectureReader(lectureRepoository)
        lectureWriter = new LectureWriter(lectureRepoository)
        lectureTimeTableReader = new LectureTimeTableReader(lectureTimeTableRepository)
        lectureTimeTableWriter = new LectureTimeTableWriter(lectureTimeTableRepository)
        lectureReservationReader = new LectureReservationReader(lectureReservationRepository)
        lectureReservationWriter = new LectureReservationWriter(lectureReservationRepository)

        dataSource = new DataSource({
            type: 'mariadb',
            host: process.env.DB_HOST,
            port: 3306,
            username: process.env.DB_USER_NAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DATABASE,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: false,
        })
        queryRunner = dataSource.createQueryRunner()

        dataSource.createQueryRunner = jest.fn().mockReturnValue(queryRunner)
        queryRunner.connect = jest.fn().mockResolvedValue(undefined)
        queryRunner.startTransaction = jest.fn().mockResolvedValue(undefined)
        queryRunner.commitTransaction = jest.fn().mockResolvedValue(undefined)
        queryRunner.rollbackTransaction = jest.fn().mockResolvedValue(undefined)
        queryRunner.release = jest.fn().mockResolvedValue(undefined)

        manager = new LectureManager(
            lectureReader,
            lectureWriter,
            lectureTimeTableReader,
            lectureTimeTableWriter,
            lectureReservationReader,
            lectureReservationWriter,
            dataSource,
        )
    })

    it('should throw an error for an invalid user ID', async () => {
        await expect(manager.writeReservation(-1, 1)).rejects.toThrow('유효하지 않은 유저 아이디입니다.')
    })

    it('should throw an error if the lecture is full', async () => {
        lectureTimeTableReader.readById = jest.fn().mockResolvedValue({
            id: 1,
            startTime: new Date('2024-10-12'),
            endTime: new Date('2024-12-11'),
            lectureReservations: Array.from({ length: 30 }, (_, index) => ({
                id: index,
                userId: index + 1, // Assuming a unique userId for each reservation
                LectureTimeTable: 1,
            })),
        })

        dataSource.transaction = jest.fn().mockImplementation(async callback => {
            return callback
        })

        await expect(manager.writeReservation(1, 1)).rejects.toThrow('강의가 꽉 찼습니다.')
    })

    it('should throw an error if the user has already applied', async () => {
        lectureTimeTableReader.readById = jest.fn().mockResolvedValue({
            id: 1,
            startTime: new Date('2024-10-12'),
            endTime: new Date('2024-12-11'),
            lectureReservations: Array.from({ length: 1 }, (_, index) => ({
                id: index,
                userId: index + 1, // Assuming a unique userId for each reservation
                LectureTimeTable: 1,
            })),
        })

        await expect(manager.writeReservation(1, 1)).rejects.toThrow('이미 신청한 유저입니다.')
    })

    it('should allow application if the user is valid, the lecture is not full, and the user has not applied', async () => {
        lectureTimeTableReader.readById = jest.fn().mockResolvedValue({
            id: 1,
            startTime: new Date('2024-10-12'),
            endTime: new Date('2024-12-11'),
            lectureReservations: Array.from({ length: 1 }, (_, index) => ({
                id: index,
                userId: index + 1, // Assuming a unique userId for each reservation
                LectureTimeTable: 1,
            })),
        })

        const reservation = {
            id: 1,
            userId: 1,
            LectureTimeTable: {
                id: 1,
                startTime: new Date('2024-10-12'),
                endTime: new Date('2024-12-11'),
                Lecture: {
                    id: 1,
                    title: 'title',
                    LectureTimeTables: [],
                },
                LectureReservations: [],
            },
        }

        lectureReservationWriter.write = jest.fn().mockResolvedValue(reservation)

        await expect(manager.writeReservation(10, 1)).resolves.toBe(reservation)
    })

    it('should throw an error if the lecture title is too long', async () => {
        await expect(manager.write('a'.repeat(31))).rejects.toThrow('강의 제목은 30자 이하여야 합니다.')
    })

    it('should throw an error if the lecture title is duplicated', async () => {
        lectureReader.readByTitle = jest.fn().mockResolvedValue({
            id: 1,
            title: 'title',
            LectureTimeTables: [],
        })

        await expect(manager.write('title')).rejects.toThrow('이미 존재하는 강의입니다.')
    })

    it('should throw an error if the lecturetimetable startTime is prev', async () => {
        const dto = new CreateLectureTimeTableDto()
        dto.startTime = new Date('2022-12-12')
        dto.endTime = new Date('2023-12-11')
        dto.lectureId = 1

        await expect(manager.writeTimeTable(dto)).rejects.toThrow('과거 시간으로는 강의를 등록할 수 없습니다.')
    })

    it('should throw an error if the lecturetimetable startTime == endTime', async () => {
        const dto = new CreateLectureTimeTableDto()
        dto.startTime = new Date('2024-12-12')
        dto.endTime = new Date('2024-12-12')
        dto.lectureId = 1

        await expect(manager.writeTimeTable(dto)).rejects.toThrow('시작 시간과 종료 시간이 같을 수 없습니다.')
    })

    it('should throw an error if the lecturetimetable startTime < endTime', async () => {
        const dto = new CreateLectureTimeTableDto()
        dto.startTime = new Date('2024-12-12')
        dto.endTime = new Date('2024-10-11')
        dto.lectureId = 1

        await expect(manager.writeTimeTable(dto)).rejects.toThrow('시작 시간은 종료 시간보다 빨라야 합니다.')
    })

    it('should throw an error if the lecturetimetable is conflit', async () => {
        const dto = new CreateLectureTimeTableDto()
        dto.startTime = new Date('2024-10-13')
        dto.endTime = new Date('2024-12-10')
        dto.lectureId = 1

        lectureTimeTableReader.read = jest.fn().mockResolvedValue([
            {
                id: 1,
                startTime: new Date('2024-10-12'),
                endTime: new Date('2024-12-11'),
                specialLecture: {
                    id: 1,
                    title: 'title',
                    specialLectureTimeTables: [],
                },
            },
        ])

        await expect(manager.writeTimeTable(dto)).rejects.toThrow('시간이 겹치는 강의가 이미 존재합니다.')
    })
})
