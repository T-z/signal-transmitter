import { TestBed } from '@angular/core/testing';

import { StateWatchService } from './state-watch.service';

describe('StateWatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateWatchService = TestBed.get(StateWatchService);
    expect(service).toBeTruthy();
  });
});
