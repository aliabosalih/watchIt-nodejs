const express = require('express'),
    router = express.Router();


router.get('/getMoviewsByRate',function (req, res) {

	res.status(200).json();

})
module.exports = router;
