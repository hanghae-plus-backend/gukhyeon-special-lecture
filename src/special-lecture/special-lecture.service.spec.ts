import {
    SpecialLectureManager,
    SpecialLectureReader,
    SpecialLectureReservationReader,
    SpecialLectureWriter,
    SpecialLectureReservationWriter,
} from './entities/speical-lecture.components'

describe('특강 신청', () => {
    let specialLectureReader: SpecialLectureReader
    let specialLectureReservationReader: SpecialLectureReservationReader
    let specialLectureWriter: SpecialLectureWriter
    let specialLectureReservationWriter: SpecialLectureReservationWriter
    let manager: SpecialLectureManager

    beforeEach(() => {
        // Mock the necessary repositories
        const specialLectureRepository = {
            getCount: jest.fn(),
            read: jest.fn(),
            count: jest.fn(),
            write: jest.fn(),
        }

        // Initialize readers and the manager with the mocked repositories
        specialLectureReader = new SpecialLectureReader(
            specialLectureRepository,
        )
        specialLectureReservationReader = new SpecialLectureReservationReader(
            specialLectureRepository,
        )
        manager = new SpecialLectureManager(
            specialLectureReader,
            specialLectureWriter,
            specialLectureReservationReader,
            specialLectureReservationWriter,
        )

        // Mock implementations
        specialLectureReader.getCount = jest.fn().mockResolvedValue(0) // Default to no applicants
        specialLectureReservationReader.read = jest.fn().mockResolvedValue(null) // Default to no reservation
    })

    it('should throw an error for an invalid user ID', async () => {
        await expect(manager.canApplyForSpecialLecture(-1)).rejects.toThrow(
            '유효하지 않은 유저 아이디입니다.',
        )
    })

    it('should throw an error if the lecture is full', async () => {
        specialLectureReader.getCount = jest.fn().mockResolvedValue(30) // Lecture is full
        await expect(manager.canApplyForSpecialLecture(1)).rejects.toThrow(
            '강의가 꽉 찼습니다.',
        )
    })

    it('should throw an error if the user has already applied', async () => {
        specialLectureReservationReader.read = jest.fn().mockResolvedValue({
            id: 1,
            userId: 1,
            specialLecture: {
                id: 1,
                title: 'title',
                specialLectureReservations: [],
            },
        })
        await expect(manager.canApplyForSpecialLecture(1)).rejects.toThrow(
            '이미 신청한 유저입니다.',
        )
    })

    it('should allow application if the user is valid, the lecture is not full, and the user has not applied', async () => {
        specialLectureReader.getCount = jest.fn().mockResolvedValue(0)
        specialLectureReservationReader.read = jest.fn().mockResolvedValue(null)

        await expect(manager.canApplyForSpecialLecture(1)).resolves.toBe(true)
    })
})
