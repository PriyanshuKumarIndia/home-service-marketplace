const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { validateRole, validateCommon } = require('../middlewares/validation.middleware');


router.post("/add", [validateRole.add], roleController.createRole)
router.get("/getall", roleController.getRoleDropdown)
router.delete("/delete/:id", [validateCommon.id], roleController.destroyRole)
router.patch("/update/:id", [validateCommon.id, validateRole.update], roleController.updateRole)
router.get("/listing", [validateCommon.pagination], roleController.getRoleList)


module.exports = router
