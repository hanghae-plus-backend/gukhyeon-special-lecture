import {
    SpecialLectureManager,
    SpecialLectureReader,
    SpecialLectureWriter,
} from './entities/speical-lecture.components'

describe('특강 신청', () => {
    let specialLectureReader: SpecialLectureReader
    let specialLectureWriter: SpecialLectureWriter
    let manager: SpecialLectureManager
    const userId = 1
    const maxCount = 30

    beforeEach(() => {
        // Mock the repository to return predefined values or behaviors
        const specialLectureRepository = {
            read: jest.fn(),
            count: jest.fn(),
            write: jest.fn(),
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

    it('유효한 유저 아이디 체크', () => {
        const result = manager.isAvailableUserId(userId)
        expect(result).toBe(true)
    })

    describe('유효한 특별 강의 체크', () => {
        it('강의가 꽉참', async () => {
            specialLectureReader.getCount = jest
                .fn()
                .mockResolvedValue(maxCount)

            const userId = 1 // example user ID
            const canApply = await manager.canApplyForSpecialLecture(userId)
            expect(canApply).toBe(false)
        })

        it('강의가 사용 가능함', async () => {
            specialLectureReader.getCount = jest.fn().mockResolvedValue(20)

            const userId = 2 // example user ID
            const canApply = await manager.canApplyForSpecialLecture(userId)
            expect(canApply).toBe(true)
        })
    })
})
