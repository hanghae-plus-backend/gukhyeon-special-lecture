import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import { SpecialLecture } from '../entities/special-lecture.entity'
import { DataSource } from 'typeorm'
import { SpecialLectureReservation } from '../entities/special-lecture-reservation.entity'
import {
    SpecialLectureReservationReader,
    SpecialLectureReservationWriter,
} from './special-lecture-reservation.component'
import {
    SpecialLectureReader,
    SpecialLectureWriter,
} from './speical-lecture.component'

@Injectable()
export class SpecialLectureManager {
    private readonly logger = new Logger(SpecialLectureManager.name)

    constructor(
        private specialLectureReader: SpecialLectureReader,
        private specialLectureWriter: SpecialLectureWriter,
        private specialLectureReservationReader: SpecialLectureReservationReader,
        private specialLectureReservationWriter: SpecialLectureReservationWriter,
        private dataSource: DataSource,
    ) {}

    isAvailableUserId(userId: number): boolean {
        return userId > 0
    }

    async read(lectureId: number): Promise<SpecialLecture> {
        return await this.specialLectureReader.read(
            lectureId,
            this.dataSource.manager,
        )
    }

    async write(): Promise<SpecialLecture> {
        return this.specialLectureWriter.write(this.dataSource.manager)
    }

    async readReservation(userId: number): Promise<SpecialLectureReservation> {
        return this.specialLectureReservationReader.read(
            userId,
            this.dataSource.manager,
        )
    }

    async writeReservation(userId: number): Promise<SpecialLectureReservation> {
        if (!this.isAvailableUserId(userId)) {
            throw new BadRequestException('유효하지 않은 유저 아이디입니다.')
        }

        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction('SERIALIZABLE')

        try {
            const specialLecture = await this.specialLectureReader.read(
                1,
                queryRunner.manager,
            )

            if (!specialLecture) {
                throw new NotFoundException('강의를 찾을 수 없습니다.')
            }

            if (specialLecture.specialLectureReservations.length >= 30) {
                throw new ForbiddenException('강의가 꽉 찼습니다.')
            }

            if (
                specialLecture.specialLectureReservations.find(
                    reservation => reservation.userId == userId,
                )
            ) {
                throw new ConflictException('이미 신청한 유저입니다.')
            }

            const reservation =
                await this.specialLectureReservationWriter.write(
                    queryRunner.manager,
                    userId,
                    specialLecture,
                )

            await queryRunner.commitTransaction()
            return reservation
        } catch (error) {
            await queryRunner.rollbackTransaction()

            if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message)
            } else if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message)
            } else if (error instanceof ForbiddenException) {
                throw new ForbiddenException(error.message)
            } else if (error instanceof ConflictException) {
                throw new ConflictException(error.message)
            } else {
                this.logger.error(
                    `Error while creating reservation for user ID ${userId}: ${error.message}`,
                )
                throw new HttpException(
                    '서버 내의 오류가 발생했습니다',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                )
            }
        } finally {
            await queryRunner.release()
        }
    }
}
