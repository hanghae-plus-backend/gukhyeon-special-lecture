// special-lecture-writer.service.ts
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common'
import {
    SpecialLectureRepository,
    SpecialLectureReservationRepository,
} from '../repositories/special-lecture.repository'
import {
    SpecialLecture,
    SpecialLectureReservation,
} from '../entities/special-lecture.entity'
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class SpecialLectureReader {
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async read(
        lectureId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLecture> {
        return this.repository.read(lectureId, entityManager)
    }
}

@Injectable()
export class SpecialLectureWriter {
    constructor(
        @Inject('SpecialLectureRepository')
        private repository: SpecialLectureRepository,
    ) {}

    async write(entityManager: EntityManager): Promise<SpecialLecture> {
        return this.repository.write(entityManager)
    }
}

@Injectable()
export class SpecialLectureReservationReader {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async read(
        userId: number,
        entityManager: EntityManager,
    ): Promise<SpecialLectureReservation> {
        return this.repository.read(userId, entityManager)
    }
}

@Injectable()
export class SpecialLectureReservationWriter {
    constructor(
        @Inject('SpecialLectureReservationRepository')
        private repository: SpecialLectureReservationRepository,
    ) {}

    async write(
        entityManager: EntityManager,
        userId: number,
        specialLecture: SpecialLecture,
    ): Promise<SpecialLectureReservation> {
        return this.repository.write(entityManager, userId, specialLecture)
    }
}

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
        await queryRunner.startTransaction()

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
