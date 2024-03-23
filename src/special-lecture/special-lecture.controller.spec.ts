import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLectureController } from './special-lecture.controller';

describe('SpecialLectureController', () => {
  let controller: SpecialLectureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialLectureController],
    }).compile();

    controller = module.get<SpecialLectureController>(SpecialLectureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
