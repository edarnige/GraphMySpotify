import { TestBed } from '@angular/core/testing';

import { SearchPlaylistService } from './search-playlist.service';

describe('SearchPlaylistService', () => {
  let service: SearchPlaylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchPlaylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
