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
            read: jest.fn(),
            write: jest.fn(),
        }

        // Initialize readers and the manager with the mocked repositories
        specialLectureReader = new SpecialLectureReader(
            specialLectureRepository,
        )
        specialLectureReservationReader = new SpecialLectureReservationReader(
            specialLectureRepository,
        )
        specialLectureWriter = new SpecialLectureWriter(
            specialLectureRepository,
        )
        specialLectureReservationWriter = new SpecialLectureReservationWriter(
            specialLectureRepository,
        )
        manager = new SpecialLectureManager(
            specialLectureReader,
            specialLectureWriter,
            specialLectureReservationReader,
            specialLectureReservationWriter,
        )

        // Mock implementations
        specialLectureReader.read = jest.fn().mockResolvedValue(null) // Default to no applicants
        specialLectureReservationReader.read = jest.fn().mockResolvedValue(null) // Default to no reservation
    })

    it('should throw an error for an invalid user ID', async () => {
        await expect(manager.writeReservation(-1)).rejects.toThrow(
            '유효하지 않은 유저 아이디입니다.',
        )
    })

    it('should throw an error if the lecture is full', async () => {
        specialLectureReader.read = jest.fn().mockResolvedValue({
            id: 1,
            title: 'title',
            specialLectureReservations: Array.from(
                { length: 30 },
                (_, index) => ({
                    id: index,
                    userId: index + 1, // Assuming a unique userId for each reservation
                    specialLectureId: 1,
                }),
            ),
        })

        await expect(manager.writeReservation(1)).rejects.toThrow(
            '강의가 꽉 찼습니다.',
        )
    })

    it('should throw an error if the user has already applied', async () => {
        specialLectureReader.read = jest.fn().mockResolvedValue({
            id: 1,
            title: 'title',
            specialLectureReservations: [
                {
                    id: 1,
                    userId: 1,
                },
            ],
        })

        await expect(manager.writeReservation(1)).rejects.toThrow(
            '이미 신청한 유저입니다.',
        )
    })

    it('should allow application if the user is valid, the lecture is not full, and the user has not applied', async () => {
        specialLectureReservationReader.read = jest.fn().mockResolvedValue(null)
        specialLectureReader.read = jest.fn().mockResolvedValue({
            id: 1,
            title: 'title',
            specialLectureReservations: [],
        })

        const reservation = {
            id: 1,
            userId: 1,
            specialLecture: {
                id: 1,
                title: 'title',
                specialLectureReservations: [],
            },
        }

        specialLectureReservationWriter.write = jest
            .fn()
            .mockResolvedValue(reservation)

        await expect(manager.writeReservation(1)).resolves.toBe(reservation)
    })
})
