import {
    SpecialLectureManager,
    SpecialLectureReader,
    SpecialLectureWriter,
} from './entities/speical-lecture.components'

describe('특강 신청', () => {
    let specialLectureReader: SpecialLectureReader
    let specialLectureWriter: SpecialLectureWriter
    let manager: SpecialLectureManager

    beforeEach(() => {
        // Mock the repository to return predefined values or behaviors
        const specialLectureRepository = {
            read: jest.fn().mockResolvedValue({
                /* Mocked return value */
            }),
            write: jest.fn().mockResolvedValue({
                /* Mocked return value */
            }),
        }

        specialLectureReader = new SpecialLectureReader(
            specialLectureRepository,
        )
        specialLectureWriter = new SpecialLectureWriter(
            specialLectureRepository,
        )
        manager = new SpecialLectureManager(
            specialLectureReader,
            specialLectureWriter,
        )
    })

    it('유효 하지 않은 userId 체크', () => {
        const result = manager.isAvailableUserId(-1)
        expect(result).toBe(false)
    })
})
