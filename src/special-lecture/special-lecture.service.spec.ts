import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLectureService } from './special-lecture.service';

describe('SpecialLectureService', () => {
  let service: SpecialLectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialLectureService],
    }).compile();

    service = module.get<SpecialLectureService>(SpecialLectureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
