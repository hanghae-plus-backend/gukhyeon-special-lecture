import { QueryRunner, Repository } from 'typeorm'
import { Lecture } from '../entities/lecture.entity'
import { InjectRepository } from '@nestjs/typeorm'

export type LockModeType =
    | 'pessimistic_read'
    | 'pessimistic_write'
    | 'dirty_read'
    | 'pessimistic_partial_write'
    | 'pessimistic_write_or_fail'
    | 'for_no_key_update'
    | 'for_key_share'

export class LectureRepository extends Repository<Lecture> {
    constructor(
        @InjectRepository(Lecture)
        private repository: Repository<Lecture>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner)
    }

    async read(lectureId: number, lockMode?: LockModeType, queryRunner?: QueryRunner): Promise<Lecture> {
        if (queryRunner) {
            return queryRunner.manager.findOne(Lecture, {
                where: { id: lectureId },
                relations: ['lectureTimeTables'],
                lock: lockMode ? { mode: lockMode } : undefined,
            })
        } else {
            return this.repository.findOne({
                where: { id: lectureId },
                relations: ['lectureTimeTables'],
                lock: lockMode ? { mode: lockMode } : undefined,
            })
        }
    }

    async readByTitle(title: string): Promise<Lecture> {
        return this.repository.findOne({
            where: { title },
        })
    }

    async write(title: string): Promise<Lecture> {
        const lectureData = new Lecture()
        lectureData.title = title

        return this.repository.save(lectureData)
    }
}

export type LectureReaderType = {
    read: InstanceType<typeof LectureRepository>['read']
    readByTitle: InstanceType<typeof LectureRepository>['readByTitle']
}

export type LectureWriteType = InstanceType<typeof LectureRepository>['write']
