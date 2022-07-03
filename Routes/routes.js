const Router = require('express')
const router = new  Router()
const Controller = require('../Controllers/controller')


//--------CRUD цикл

router.get('/create', Controller.Create)
router.post('/read', Controller.Read)
router.post('/update', Controller.Update)
router.post('/delete', Controller.Delete)


module.exports = router