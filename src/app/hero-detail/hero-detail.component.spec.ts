import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";

describe('HeroeDetailsComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService, mockLocation, mockActivatedRoute;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 11, name: 'SuperDude', strength: 10 },
      { id: 12, name: 'Narcotic', strength: 5 },
      { id: 13, name: 'MonkeyParade', strength: 8 }
     ]
    mockActivatedRoute = {
      snapshot: {
        paramMap: { get: () => '3'}
      }
    }
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);


    TestBed.configureTestingModule({
      declarations: [
        HeroDetailComponent,

      ],
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService},
        { provide: ActivatedRoute, useValue: mockActivatedRoute},
        { provide: Location, useValue: mockLocation}
      ],

    })

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperFucker', strength: 100}))

  });

  it('should render the hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERFUCKER')

  })

  it('should call updateHero when save is called', fakeAsync(() => { // ez Promisokkal is megy :)
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    // tick(250); // ezzel tekerjük előre az időt
    flush() // ezzel mindent előretekerünk, nem kell tudni az időt

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }))

  // it('should call updateHero when save is called', waitForAsync(() => { // ez csak Promisokkal működik!
  //   mockHeroService.updateHero.and.returnValue(of({}));
  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   fixture.whenStable().then( () => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   })
  // }))

  // ng test --no-watch --code-coverage

})
