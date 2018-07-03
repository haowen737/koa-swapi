describe('module', function() {
  it('should expose Swapi', function(done) {
    const { Swapi } = require('../built/lib')
    should.exist(Swapi)
    Swapi.should.be.type('function')
    done()
  })
})
