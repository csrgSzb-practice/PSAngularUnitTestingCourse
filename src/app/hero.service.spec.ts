import { inject, TestBed } from "@angular/core/testing"
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"
import { HeroService } from "./hero.service"
import { MessageService } from "./message.service";

describe('HeroService', () => {

  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {

    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService}
      ]
    })

    //* inject nélkül
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroService);
    //* end
  })

  describe('getHero', ()=> {

    it('should call get with the correct URL', () => {
      // call getHero
      service.getHero(4).subscribe(hero => {
        expect(hero.id).toBe(4);
      }); //* FEL KELL iratkozni, mert különben nem lövi el a hívást

      // test that the URL was correct
      const req = httpTestingController.expectOne('api/heroes/4');

      req.flush({id: 4, name: 'SuperDude', strength: 100});
      expect(req.request.method).toBe('GET');
      httpTestingController.verify()
    });

    //* with inject
    // it('should call get with the correct URL', inject(
    //   [HeroService, HttpTestingController],
    //   (service: HeroService, controller: HttpTestingController) => {
    //   // call getHero
    //   service.getHero(4);

    //   // test that the URL was correct
    //   // ...

    // }))
    //* end with inject

  })

})
