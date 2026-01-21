const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { validateService, validateCommon } = require('../middlewares/validation.middleware');


router.post("/add", [validateService.add], serviceController.createService)
router.delete("/delete/:id", [validateCommon.id], serviceController.destroyService)
router.get("/listing", [validateCommon.pagination], serviceController.getServiceList)
router.get("/types", serviceController.getServiceTypeDropdown)


module.exports = router
