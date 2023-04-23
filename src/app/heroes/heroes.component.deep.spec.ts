import { ComponentFixture, TestBed } from "@angular/core/testing"
import { HeroesComponent } from "./heroes.component"
import { Component, Directive, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";


@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;


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
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService}
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    })

    fixture = TestBed.createComponent(HeroesComponent);

  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // fire ngOnInit with this

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent)); //* ez is debugelementeket ad vissza

    expect(heroComponentDEs.length).toBe(3);
    // expect(heroComponentDEs[0].componentInstance.hero.name).toBe('SuperDude');
    // expect(heroComponentDEs[1].componentInstance.hero.name).toBe('Narcotic');
    // expect(heroComponentDEs[2].componentInstance.hero.name).toBe('MonkeyParade');

    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }

  });

  it(`should call heroService.deleteHero when the HeroComponent's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    //* elsütjük buttont
    // heroComponents[0].query(By.css('button'))
    //   .triggerEventHandler('click', {stopPropagation: ()=>{}});

    //* vagy elérjük, hogy legyen emit
    //* azért lehet undefined, mert a child nem sugároz fel semmit, a szülő adja bele a herot

    //! Ez a megközelítés azért lehet jó, mert feleslegesen nem teszteljük a gyereket, itt csak a kötéseket ellenőrizzük
    (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);

    //* 3. verzió nem is foglalkozunk a gyerek eventjével
    // heroComponents[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])

  })

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const name = 'Mr. Ice';
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
    const inputElement: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];


    inputElement.value = name;
    addButton.triggerEventHandler('click', null); //* 2. paraméter: milyen esemény
    fixture.detectChanges();

    const heroText =fixture.debugElement.query(By.css('ul')).nativeElement.textContent
    expect(heroText).toContain(name);

  })


  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/11');

  })

})
