import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component"

describe("HeroesComponent", () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
     HEROES = [
      { id: 11, name: 'SuperDude', strength: 10 },
      { id: 12, name: 'Narcotic', strength: 5 },
      { id: 13, name: 'MonkeyParade', strength: 8 }
     ]
     mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

     component = new HeroesComponent(mockHeroService);
  })

  describe('delete', () => {

    it('should remove the indicated hero from the heroes list', () => {
        mockHeroService.deleteHero.and.returnValue(of(true));
        component.heroes = HEROES;

        component.delete(HEROES[2]);

        expect(component.heroes.length).toBe(2);
        expect(component.heroes[0].id).toBe(11);
        expect(component.heroes[1].id).toBe(12);
    })
    it('should call the deleteHero with correct value', () => {
        mockHeroService.deleteHero.and.returnValue(of(true));
        component.heroes = HEROES;

        component.delete(HEROES[2]);

        expect(mockHeroService.deleteHero).toHaveBeenCalled();
        expect(mockHeroService.deleteHero).toHaveBeenCalledOnceWith(HEROES[2]);

    })
  })

})
