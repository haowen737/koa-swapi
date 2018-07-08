describe('module', function() {
  it('should expose Swapi', function(done) {
    const { Swapi } = require('../built')
    should.exist(Swapi)
    Swapi.should.be.type('function')
    done()
  })
})
