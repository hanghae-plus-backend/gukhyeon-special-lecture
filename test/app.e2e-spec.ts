import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { SpecialLectureModule } from './../src/special-lecture/special-lecture.module'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, SpecialLectureModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('/ (POST) /special-lecture/:userId', async () => {
        const requests = Array(30)
            .fill(null)
            .map(() => {
                return request(app.getHttpServer())
                    .post(`/special-lectures/reservation/1`)
                    .then(response => {
                        if (response.status >= 400) {
                            throw new Error(
                                response.body.message || 'Bad request',
                            )
                        }
                        return response
                    })
            })

        const responses = await Promise.allSettled(requests)

        const rejectedResponses = responses.filter(r => r.status === 'rejected')

        const groupedByReason = rejectedResponses.reduce((groups, response) => {
            if (response.status === 'rejected') {
                const reason = response.reason
                if (!groups[reason]) {
                    groups[reason] = 0
                }
                groups[reason]++
            }
            return groups
        }, {})

        console.log(groupedByReason)

        const successCount = responses.filter(
            r => r.status === 'fulfilled',
        ).length

        const failedCount = rejectedResponses.length

        console.log(
            'Success count:',
            successCount,
            'Failed count:',
            failedCount,
        )
    })
})
