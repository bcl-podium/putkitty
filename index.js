const express = require("express");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.get("/:greyscale(g)?/:width/:height?", async (req, res) => {
  function dimensionsFromParams({ width: widthParam, height: heightParam }) {
    if (widthParam && !heightParam) {
      if (!parseInt(widthParam)) {
        return { width: 400, height: 400 };
      }
      return { width: parseInt(widthParam), height: parseInt(widthParam) };
    }

    if (widthParam && heightParam) {
      if (parseInt(widthParam) === NaN && parseInt(heightParam) === NaN) {
        return { width: 400, height: 400 };
      } else if (parseInt(widthParam) === NaN && parseInt(heightParam)) {
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

  function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

  let src = "";
  if (
    req.query.image &&
    fs.existsSync(`./public/kitty${req.query.image}.jpg`)
  ) {
    src = `./public/kitty${req.query.image}.jpg`;
  } else {
    src = `./public/kitty${getRandomIntInclusive(1, 16)}.jpg`;
  }

  try {
    let img;
    const dimensions = dimensionsFromParams(req.params);
    if (req.params.greyscale === "g") {
      img = await sharp(src)
        .resize(dimensions.width, dimensions.height, {
          position: sharp.strategy.entropy,
        })
        .greyscale()
        .toFormat("jpg")
        .toBuffer();
    } else {
      img = await sharp(src)
        .resize(dimensions.width, dimensions.height, {
          // position: sharp.strategy.attention,
        })
        .toFormat("jpg")
        .toBuffer();
    }
    res.send(img);
  } catch (err) {
    throwErrorCat(err);
  }
});

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});
