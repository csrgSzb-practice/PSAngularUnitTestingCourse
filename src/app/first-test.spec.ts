describe('my first test', () => {
  let sut;

  beforeEach(()=> {
    sut = {};
  })

  it('should be true if true', () => {
    // arrange initial state
    sut.a = false;

    // act change state
    sut.a = true;

    // assert
    expect(sut.a).toBe(true);
  })

})
