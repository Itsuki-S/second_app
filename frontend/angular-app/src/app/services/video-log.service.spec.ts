import { TestBed } from '@angular/core/testing';

import { VideoLogService } from './video-log.service';

describe('VideoLogService', () => {
  let service: VideoLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
