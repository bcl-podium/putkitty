const express = require("express");
const sharp = require("sharp");
const fs = require("fs");

const app = express();

app.get("/:greyscale(g)?/:width/:height?", async (req, res) => {
  console.info(req.params);
  function dimensionsFromParams({ width: widthParam, height: heightParam }) {
    if (widthParam && !heightParam) {
      if (!parseInt(widthParam)) {
        return { width: 400, height: 400 };
      }
      return { width: parseInt(widthParam), height: parseInt(widthParam) };
    }

    if (widthParam && heightParam) {
      // if width params are bad and height params are good, use height for both
      // if height params are bad and width params are good, use width for both
      // if both params are good, parse them and use them
      if (parseInt(widthParam) === NaN && parseInt(heightParam) === NaN) {
        return { width: 400, height: 400 };
      } else if (parseInt(widthParam) === NaN && parseInt(heightParam)) {
        dimensions.width, (dimensions.length = parseInt(heightParam));
        return { width: parseInt(heightParam), height: parseInt(heightParam) };
      } else if (parseInt(heightParam) === NaN && parseInt(widthParam)) {
        return { width: parseInt(widthParam), height: parseInt(widthParam) };
      } else {
        return { width: parseInt(widthParam), height: parseInt(heightParam) };
      }
    }
  }

  async function throwErrorCat(err) {
    console.error(err);
    const errorCat = await sharp("./public/crying-cat.jpg")
      .resize(400, 400)
      .toFormat("jpg")
      .toBuffer();
    res.send(errorCat);
  }

  // first, obtain the target image or a random image if none specified
  let src = "";
  if (
    req.query.image &&
    fs.existsSync(`./public/kitty${req.query.image}.jpg`)
  ) {
    src = `./public/kitty${req.query.image}.jpg`;
    console.log(src);
  } else {
    // TODO - otherwise grab a random cat - landscape or portrait depending on params
    src = `./public/kitty1.jpg`;
  }

  try {
    let img;
    const dimensions = dimensionsFromParams(req.params);
    if (req.params.greyscale === "g") {
      img = await sharp(src)
        .resize(dimensions.width, dimensions.height)
        .greyscale()
        .toFormat("jpg")
        .toBuffer();
    } else {
      img = await sharp(src)
        .resize(dimensions.width, dimensions.height)
        .toFormat("jpg")
        .toBuffer();
    }
    res.send(img);
  } catch (err) {
    throwErrorCat(err);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
