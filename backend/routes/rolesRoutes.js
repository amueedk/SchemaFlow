const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/rolesController')

router.get('/index', rolesController.index);
router.post('/update', rolesController.updateRole);
router.post('/delete', rolesController.deleteRole);
router.post('/create', rolesController.createRole);

router.post('/member/delete', rolesController.deleteMember)
router.post('/member/insert', rolesController.insertMember)

router.post('/table/delete', rolesController.deleteRoleTable)
router.post('/table/insert', rolesController.insertRoleTable)


module.exports = router;
