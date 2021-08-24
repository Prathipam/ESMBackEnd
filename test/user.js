const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app.js')
const delay = require('delay')
//assertion style
chai.should()

chai.use(chaiHttp)
const PORT = process.env.APP_PORT
const KEY = process.env.APP_SECRET_KEY


/** 
 * Create Employee and its validation
 */
describe('POST /api/users', () => {
    // Create new employee
    it("Create New Employee 1", (done) => {
        const user = {
            id: 'emp0001',
            login: 'T6787H90',
            name: 'Roni',
            salary: 5000.00,
            startDate: '2021-10-11'
        }
        chai.request('http://localhost:' + PORT)
            .post('/api/users')
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(201)
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Successfully created')
                done();
            })
    })

    it("Create New Employee 2", (done) => {
        const user = {
            id: 'emp0002',
            login: 'T6787H91',
            name: 'Mani',
            salary: 6000.00,
            startDate: '2020-10-11'
        }
        chai.request('http://localhost:' + PORT)
            .post('/api/users')
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(201)
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Successfully created')
                done();
            })
    })

    it("Unique Employee ID validation", (done) => {
        const user = {
            id: 'emp0001',
            login: 'T6787890',
            name: 'Yusuf',
            salary: 4300.00,
            startDate: '2020-10-11'
        }
        chai.request('http://localhost:' + PORT)
            .post('/api/users')
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Employee ID already exists')
                done();
            })
    })
    it("Unique login validation", (done) => {
        const user = {
            id: 'emp0003',
            login: 'T6787H90',
            name: 'Yusuf',
            salary: 4300.00,
            startDate: '2020-10-11'
        }
        chai.request('http://localhost:' + PORT)
            .post('/api/users')
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Employee login not unique')
                done();
            })
    })

    it("Salary validation", (done) => {
        const user = {
            id: 'emp0003',
            login: 'T6787HHJ',
            name: 'Yusuf',
            salary: -4300.00,
            startDate: '2020-10-11'
        }
        chai.request('http://localhost:' + PORT)
            .post('/api/users')
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Invalid salary')
                done();
            })
    })
    it("Start Date validation", (done) => {
        const user = {
            id: 'emp0003',
            login: 'T6787HGH',
            name: 'Yusuf',
            salary: 4300.00,
            startDate: '20-10-11'
        }
        chai.request('http://localhost:' + PORT)
            .post('/api/users')
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Invalid start Date')
                done();
            })
    })
})

/** 
 * Get all Employees which supports pagination, sorting and filter
 */

describe('GET /api/users', () => {
    // Request sent without authorization
    it("It should return unauthorized", (done) => {
        chai.request('http://localhost:' + PORT)
            .get('/api/users')
            .end((err, response) => {
                response.should.have.status(401)
                response.error.text.should.be.equal('Unauthorized');
                done();
            })
    })

    // First n employees will be returned
    it("It should return an array", (done) => {
        chai.request('http://localhost:' + PORT)
            .get('/api/users')
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.should.have.property('results')
                response.body.should.have.property('totalItems')
                done();
            })
    })

    // Employee with filter
    it("It should return object that contains emp", (done) => {
        const filter = 'emp'
        chai.request('http://localhost:' + PORT)
            .get('/api/users?filter=' + filter)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.should.have.property('results')
                response.body.should.have.property('totalItems')
                done();
            })
    })

    // Employee with sort
    it("It should return object that contains emp", (done) => {
        const sort = 'salary-desc'
        chai.request('http://localhost:' + PORT)
            .get('/api/users?sort=' + sort)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.should.have.property('results')
                response.body.should.have.property('totalItems')
                done();
            })
    })

})

/** 
 * Get employee using id
 */
describe('GET /api/users/:id', () => {
    // Request sent without authorization
    it("Employee object with matching ID", (done) => {
        const id = 'emp0001'
        chai.request('http://localhost:' + PORT)
            .get('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.should.have.property('id')
                response.body.should.have.property('id').equal('emp0001')
                done();
            })
    })

    it("No Employee present with matching ID", (done) => {
        const id = 'emp0003'
        chai.request('http://localhost:' + PORT)
            .get('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('No such employee with Id:' + id)
                done();
            })
    })
})

/** 
 * Update employee using id
 */
describe('PUT /api/users/:id', () => {

    it("No employee to update", (done) => {
        const id = 'emp0003'
        const user = {
            name: "Roni Yusuf"
        }
        chai.request('http://localhost:' + PORT)
            .put('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .send(user)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('No such employee')
                done();
            })
    })

    it("Login already present", (done) => {
        const id = 'emp0001'
        const user = {
            login: "T6787H91"
        }
        chai.request('http://localhost:' + PORT)
            .put('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .send(user)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Employee login not unique')
                done();
            })
    })

    it("Invalid salary", function () {
        this.timeout(0)
        const id = 'emp0001'
        const user = {
            salary: -5000.00
        }
        chai.request('http://localhost:' + PORT)
            .put('/api/users/' + id)
            .send(user)
            .set('Authorization', 'Bearer ' + KEY)
            .then((err, response) => {
                console.log(response)
                response.should.have.status(400)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Invalid salary')

            })
    })


    it("Invalid start date", function () {
        this.timeout(0)
        const id = 'emp0001'
        const user = {
            startDate: '09-12-2021'
        }
        chai.request('http://localhost:' + PORT)
            .put('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .send(user)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Invalid start Date')
            })
    })

    it("Update employee with matching ID", function () {
        this.timeout(0)
        const id = 'emp0001'
        const user = {
            name: "Roni Yusuf"
        }
        chai.request('http://localhost:' + PORT)
            .put('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .send(user)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Successfully updated')
            })
    })
})

/** 
 * Delete employee using id
 */
describe('DELETE /api/users/:id', () => {
    // Request sent without authorization
    it("Delete employee with matching ID", (done) => {
        const id = 'emp0001'
        chai.request('http://localhost:' + PORT)
            .delete('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(200)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('Successfully deleted')
                done();
            })
    })

    it("No Employee present with matching ID", (done) => {
        const id = 'emp0001'
        chai.request('http://localhost:' + PORT)
            .delete('/api/users/' + id)
            .set('Authorization', 'Bearer ' + KEY)
            .end((err, response) => {
                response.should.have.status(400)
                response.body.should.be.a('object')
                response.body.message.should.be.a('string')
                response.body.message.should.be.equal('No Such Employee')
                done();
            })
    })
})
