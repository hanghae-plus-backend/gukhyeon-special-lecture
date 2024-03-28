import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { LectureModule } from './../src/special-lecture/lecture.module'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, LectureModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    it('/ (POST) /lecture', async () => {
        for (let i = 0; i < 3; i++) {
            const response = await request(app.getHttpServer())
                .post('/lecture')
                .send({ title: `Lecture ${i + 1}` })
            expect(response.status).toBe(HttpStatus.CREATED)
        }
    })

    it('/ (POST) /lecture/timeTable', async () => {
        const lectures = []

        // Fetch 3 special lectures individually
        for (let i = 1; i <= 3; i++) {
            const fetchLectureResponse = await request(app.getHttpServer()).get(`/lecture/${i}`)
            expect(fetchLectureResponse.status).toBe(HttpStatus.OK)
            lectures.push(fetchLectureResponse.body)
        }

        let day = 0
        for (const lecture of lectures) {
            day++
            const requests = Array.from({ length: 10 }, (_, i) => {
                const startTime = new Date()
                startTime.setHours(startTime.getHours() + 2 * i + day * 24) // Adjust start time for each timetable
                const endTime = new Date(startTime)
                endTime.setHours(endTime.getHours() + 1) // End time is one hour after start time

                return request(app.getHttpServer())
                    .post('/lecture/timeTable')
                    .send({
                        lectureId: lecture.id,
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                    })
                    .then(response => {
                        if (response.status >= 400) {
                            throw new Error(response.body.message || 'Bad request')
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

            const successCount = responses.filter(r => r.status === 'fulfilled').length

            const failedCount = rejectedResponses.length

            console.log('Success count:', successCount, 'Failed count:', failedCount)
        }
    })

    it('/ (POST) /lecture/reservation', async () => {
        const fetchTimeTablesResponse = await request(app.getHttpServer()).get('/lecture/timeTable')
        expect(fetchTimeTablesResponse.status).toBe(HttpStatus.OK)
        expect(fetchTimeTablesResponse.body.length).toBeGreaterThanOrEqual(3)

        // Select the first three time tables for creating reservations
        const timeTables = fetchTimeTablesResponse.body.slice(0, 3)

        for (const timeTable of timeTables) {
            const requests = Array.from({ length: 40 }, (_, i) => {
                const userId = i + 1 // Incrementing userId for each reservation
                return request(app.getHttpServer())
                    .post(`/lecture/reservation/${userId}/${timeTable.id}`)
                    .send()
                    .then(response => {
                        if (response.status >= 400) {
                            throw new Error(response.body.message || 'Bad request')
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

            const successCount = responses.filter(r => r.status === 'fulfilled').length

            const failedCount = rejectedResponses.length

            console.log('Success count:', successCount, 'Failed count:', failedCount)
        }
    })
})
