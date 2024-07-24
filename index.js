const express = require("express");
const sharp = require("sharp");
const fs = require("fs");

const app = express();

app.get("/:greyscale?/:width/:height", async (req, res) => {
  let src;
  if (req.query.image && fs.existsSync(`./img/kitty${req.query.image}.jpg`)) {
    src = `./img/kitty${req.query.image}.jpg`;
    console.log(src);
  } else {
    // TODO - otherwise grab a random cat - landscape or portrait depending on params
    src = `./img/kitty1.jpg`;
  }

  try {
    let img;
    if (req.params.greyscale === "g") {
      img = await sharp(src)
        .resize(parseInt(req.params.width), parseInt(req.params.height))
        .greyscale()
        .toFormat("jpg")
        .toBuffer();
    } else {
      img = await sharp(src)
        .resize(parseInt(req.params.width), parseInt(req.params.height))
        .toFormat("jpg")
        .toBuffer();
    }
    res.send(img);
  } catch (err) {
    console.error(err);
    const img = await sharp("./img/crying-cat.jpg").toFormat("jpg").toBuffer();
    res.send(img);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
