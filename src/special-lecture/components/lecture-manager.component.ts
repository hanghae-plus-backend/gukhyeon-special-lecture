import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { LectureReader, LectureWriter } from './lecture.component'
import { DataSource } from 'typeorm'
import { Lecture } from '../entities/lecture.entity'
import { LectureTimeTableReader, LectureTimeTableWriter } from './lecture-timetable.component'
import { LectureReservationReader, LectureReservationWriter } from './lecture-reservation.component'
import { LectureTimeTable } from '../entities/lecture-timetable.entity'
import { CreateLectureTimeTableDto } from '../dto/create-lecture-timetable.dto'
import { LectureReservation } from '../entities/lecture-reservation.entity'

@Injectable()
export class LectureManager {
    private readonly logger = new Logger(LectureManager.name)

    constructor(
        private lectureReader: LectureReader,
        private lectureWriter: LectureWriter,
        private lectureTimeTableReader: LectureTimeTableReader,
        private lectureTimeTableWriter: LectureTimeTableWriter,
        private lectureReservationReader: LectureReservationReader,
        private lectureReservationWriter: LectureReservationWriter,
        private dataSource: DataSource,
    ) {}

    isAvailableUserId(userId: number): boolean {
        return userId > 0
    }

    async validTitle(title: string) {
        if (title.length > 30) {
            throw new BadRequestException('강의 제목은 30자 이하여야 합니다.')
        }

        if (await this.lectureReader.readByTitle(title)) {
            throw new ConflictException('이미 존재하는 강의입니다.')
        }
    }

    async validTimeTable(startTime: Date, endTime: Date) {
        if (startTime.getTime() < new Date().getTime()) {
            throw new BadRequestException('과거 시간으로는 강의를 등록할 수 없습니다.')
        }

        if (startTime.getTime() === endTime.getTime()) {
            throw new BadRequestException('시작 시간과 종료 시간이 같을 수 없습니다.')
        }

        if (endTime.getTime() - startTime.getTime() < 0) {
            throw new BadRequestException('시작 시간은 종료 시간보다 빨라야 합니다.')
        }
    }

    async read(lectureId: number): Promise<Lecture> {
        return await this.lectureReader.read(lectureId)
    }

    async write(title: string): Promise<Lecture> {
        await this.validTitle(title)

        return this.lectureWriter.write(title)
    }

    async readTimeTables(): Promise<LectureTimeTable[]> {
        return this.lectureTimeTableReader.read()
    }

    async writeTimeTable(dto: CreateLectureTimeTableDto): Promise<LectureTimeTable> {
        await this.validTimeTable(dto.startTime, dto.endTime)

        const specialLecture = await this.lectureReader.read(dto.lectureId)

        if (!specialLecture) {
            throw new NotFoundException('강의를 찾을 수 없습니다.')
        }

        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction('REPEATABLE READ')

        try {
            const timeTables = await this.lectureTimeTableReader.read('pessimistic_write', queryRunner)

            if (
                timeTables.find(
                    timeTable => timeTable.startTime.getTime() <= dto.startTime.getTime() && timeTable.endTime.getTime() >= dto.startTime.getTime(),
                ) ||
                timeTables.find(timeTable => timeTable.startTime.getTime() <= dto.endTime.getTime() && timeTable.endTime.getTime() >= dto.endTime.getTime())
            ) {
                throw new ConflictException('시간이 겹치는 강의가 이미 존재합니다.')
            }

            const timeTable = await this.lectureTimeTableWriter.write(dto, specialLecture, queryRunner)

            await queryRunner.commitTransaction()
            return timeTable
        } catch (error) {
            await queryRunner.rollbackTransaction()

            this.errorHandling(error, dto.lectureId, 'writeTimeTable')
        } finally {
            await queryRunner.release()
        }
    }

    async readReservation(userId: number): Promise<LectureReservation> {
        return this.lectureReservationReader.read(userId)
    }

    async writeReservation(userId: number, timeTableId: number): Promise<LectureReservation> {
        if (!this.isAvailableUserId(userId)) {
            throw new BadRequestException('유효하지 않은 유저 아이디입니다.')
        }

        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction('REPEATABLE READ')

        try {
            const timeTable = await this.lectureTimeTableReader.readById(
                timeTableId,
                'pessimistic_write', // 트랜잭션 내에서 비관적 락 사용
                queryRunner,
            )

            if (!timeTable) {
                throw new NotFoundException('강의를 찾을 수 없습니다.')
            }

            if (timeTable.lectureReservations.length >= 30) {
                throw new ForbiddenException('강의가 꽉 찼습니다.')
            }

            if (timeTable.lectureReservations.find(reservation => reservation.userId == userId)) {
                throw new ConflictException('이미 신청한 유저입니다.')
            }

            const reservation = await this.lectureReservationWriter.write(userId, timeTable, queryRunner)

            await queryRunner.commitTransaction()
            return reservation
        } catch (error) {
            await queryRunner.rollbackTransaction()

            this.errorHandling(error, userId, 'writeReservation')
        } finally {
            await queryRunner.release()
        }
    }

    errorHandling(error: Error, id: number, where: string) {
        if (error instanceof BadRequestException) {
            throw new BadRequestException(error.message)
        } else if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message)
        } else if (error instanceof ForbiddenException) {
            throw new ForbiddenException(error.message)
        } else if (error instanceof ConflictException) {
            throw new ConflictException(error.message)
        } else {
            this.logger.error(`Error while ${where} by ${id}: ${error.message}`)
            throw new HttpException('서버 내의 오류가 발생했습니다', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
