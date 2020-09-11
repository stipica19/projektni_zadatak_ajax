const express = require('express');
const router = express.Router();
const Film = require('../models/filmovi');
const Zanr = require('../models/zanr');

router.get("/", (req, res) => {
    Zanr.find({}, (err, sviZanrovi) => {
        if (err) console.log(err);
        else res.render("zanr", { zanr: sviZanrovi });
    });
});

router.get("/dodavanjeZanra", (req, res) => {

    res.render("addZanr");

});
router.post("/", (req, res) => {
    const zanr = new Zanr({
        naziv: req.body.naziv
    });
    zanr.save()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        })
    console.log("Uspjesno spremljen zanr u bazu ");
    res.redirect("/zanr");
});

router.delete("/delete/:id", (req, res, next) => {
    console.log("BRISEMO ZANR S ID-om : " + req.params.id);
    Film.count({ id_zanra: req.params.id }, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            if (res > 0) {
                console.log(err);
            } else
                Zanr.findByIdAndRemove(req.params.id, (err, res) => {
                    if (err) {
                        console.log("error");
                    }
                    else
                        console.log("Zanr izbrisan: ");

                })
        }
    })

});

router.get("/edit/:id", (req, res) => {

    const id = req.params.id;
    console.log("ID ZANRA JE : " + id);

    Zanr.findById(id, (err, zanrovi) => {
        if (err) { console.log(err) }
        else {
            res.render("editZanra", {
                uredi: zanrovi,
            });
        }
    })
});

router.post("/edit/:id", (req, res) => {

    Zanr.findByIdAndUpdate(req.params.id, req.body, (err, uredjeni) => {
        if (err) console.log(err)
        else console.log("Uspjesno azuriran zanr", uredjeni)
    })

    res.redirect("/zanr");
});


module.exports = router;

