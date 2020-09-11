const express = require("express");
const router = express.Router();
const Film = require("../models/filmovi");
const Zanr = require("../models/zanr");
const { query } = require("express");

router.get("/", (req, res) => {
  Film.find({})
    .populate("id_zanra")
    .exec(function (err, filmovi) {
      Zanr.find({}, (err, zanrovi) => {
        if (err) {
          console.log(err);
        } else {
          res.render("film", {
            film: filmovi,
            zanr: zanrovi,
          });
        }
      });
    });
});
router.get("/dodavanjeFilmova", (req, res) => {
  Zanr.find({}, (err, zanrovi) => {
    if (err) {
      console.log(err);
    } else {
      res.render("addFilm", {
        zanr: zanrovi,
      });
    }
  });
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  Film.findByIdAndRemove(id, (err, brisaniFilm) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Uspiješno izbrisan film" + brisaniFilm);
      res.status(200).send(brisaniFilm);
    }
  });
});

router.post("/edit/:id", (req, res) => {
  const uredjeniFlm = {
    ime: req.body.naziv,
    opis: req.body.opis,
    godina_izdanja: req.body.godina_izdanja,
    trajanje: req.body.trajanje,
    cijena: req.body.cijena,
    jezik: req.body.jezik,
    id_zanra: req.body.id_zanra,
  };
  Film.findByIdAndUpdate(req.params.id, uredjeniFlm, (err, uredjeni) => {
    if (err) console.log(err);
    else console.log("Uspjesno azuriran film", uredjeni);
  });

  res.redirect("/filmovi");
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  console.log("ID FILMA JE : " + id);

  Film.findById(id, (err, filmovi) => {
    console.log(filmovi);
    // _id: filmovi.id_zanra
    Zanr.find({}, (err, zanrovi) => {
      if (err) {
        console.log(err);
      } else {
        res.render("editFilm", {
          zanr: zanrovi,
          uredi: filmovi,
        });
      }
    });
  });
});

router.post("/", (req, res) => {
  console.log("USLI U POST");
  console.log(req.body);
  const film = new Film({
    ime: req.body.naziv,
    opis: req.body.opis,
    godina_izdanja: req.body.godina_izdanja,
    trajanje: req.body.trajanje,
    cijena: req.body.cijena,
    jezik: req.body.jezik,
    id_zanra: req.body.id_zanra,
  });
  film
    .save()
    .then((result) => {
      // console.log(result);
    })
    .catch((err) => console.log(err));
  console.log("Spremljno u bazu");
  res.redirect("/filmovi");
});

router.post("/trazi", (req, res) => {
  console.log("USLI U POST-TRAZI");
  console.log(req.body.query);
  if (req.body.query == undefined) {
    //Film.find({}, (err, sviFilmovi) => {
    //  if (err) console.log(err);
    //else res.send(sviFilmovi);
    //});
  } else {
    const regex = new RegExp(escapeRegex(req.body.query), "gi");

    var query = Film.find({ ime: regex })
      .sort({ updated_at: -1 })
      .sort({ created_at: -1 })
      .limit(10);
    query.exec(function (err, users) {
      if (!err) {
        console.log(users);
        res.send(
          users,
          {
            "Content-Type": "application/json",
          },
          200
        );
      } else {
        res.send(
          JSON.stringify(err),
          {
            "Content-Type": "application/json",
          },
          404
        );
      }
    });
  }
});
router.get("/:id", function (req, res) {
  console.log("USLI SMO U GET ZAHTJEV ZA 1 POPUP FILMA");
  Film.findById(req.params.id)
    .populate("id_zanra")
    .exec(function (err, film) {
      Zanr.find({}, (err, zanrovi) => {
        if (err) {
          console.log(err);
        } else {
          res.send(film);
        }
      });
    });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
