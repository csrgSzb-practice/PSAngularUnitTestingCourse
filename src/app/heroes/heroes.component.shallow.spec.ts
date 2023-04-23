import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { Component, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  //* mokcing child component

  @Component({
    selector: 'app-hero',
    template: '<div></div>'
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }

  //* mock child end

  beforeEach(() => {
    HEROES = [
      { id: 11, name: 'SuperDude', strength: 10 },
      { id: 12, name: 'Narcotic', strength: 5 },
      { id: 13, name: 'MonkeyParade', strength: 8 }
     ]
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        FakeHeroComponent
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService}
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    })

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // fire ngOnInit with this

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });

  it('should create one li for each hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // fire ngOnInit with this

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);

  })

})
