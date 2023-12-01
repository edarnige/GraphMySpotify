import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphMySpotifyComponent } from './graph-my-spotify.component';

describe('GraphMySpotifyComponent', () => {
  let component: GraphMySpotifyComponent;
  let fixture: ComponentFixture<GraphMySpotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphMySpotifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GraphMySpotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
