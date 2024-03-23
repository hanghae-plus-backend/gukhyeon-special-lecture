import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { SpecialLectureController } from './special-lecture/special-lecture.controller'
import { SpecialLectureService } from './special-lecture/special-lecture.service'
import { SpecialLectureModule } from './special-lecture/special-lecture.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),

        TypeOrmModule.forRootAsync({
            useFactory: async () => {
                console.log(process.env)
                return {
                    type: process.env.DB_TYPE,
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    username: process.env.DB_USER_NAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DATABASE,
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                    logging: true,
                } as TypeOrmModuleOptions
            },
        }),
        SpecialLectureModule,
    ],
    controllers: [AppController, SpecialLectureController],
    providers: [AppService, SpecialLectureService],
})
export class AppModule {}
