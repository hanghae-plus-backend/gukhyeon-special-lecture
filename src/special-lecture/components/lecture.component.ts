import { Inject } from '@nestjs/common'
import { LectureReaderType, LectureWriteType, LectureRepository, LockModeType } from '../repositories/lecture.repository'
import { Lecture } from '../entities/lecture.entity'
import { QueryRunner } from 'typeorm'

export class LectureReader {
    private readonly readType: LectureReaderType['read']
    private readonly readByTitleType: LectureReaderType['readByTitle']

    constructor(
        @Inject('LectureRepository')
        private repository: LectureRepository,
    ) {
        this.readType = this.repository.read.bind(this.repository)
        this.readByTitleType = this.repository.readByTitle.bind(this.repository)
    }

    async read(lectureId: number, lockMode?: LockModeType, queryRunner?: QueryRunner): Promise<Lecture> {
        return await this.readType(lectureId, lockMode, queryRunner)
    }

    async readByTitle(title: string): Promise<Lecture> {
        return await this.readByTitleType(title)
    }
}

export class LectureWriter {
    private readonly writeType: LectureWriteType

    constructor(
        @Inject('LectureRepository')
        private repository: LectureRepository,
    ) {
        this.writeType = this.repository.write.bind(this.repository)
    }

    async write(title: string): Promise<Lecture> {
        return await this.writeType(title)
    }
}
