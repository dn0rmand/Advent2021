const readline = require("n-readlines");

const preloaded = {};

function getPath(filename) {
  let idx = filename.lastIndexOf("/");
  if (idx >= 0) {
    return filename.substr(0, idx + 1) + "Data/";
  } else {
    return "Data/";
  }
}

function loadFile(filename) {
  if (preloaded[filename]) {
    return preloaded[filename];
  }
  const stream = new readline(filename);

  const lines = [];
  while ((line = stream.next())) {
    lines.push(line.toString("ascii"));
  }
  preloaded[filename] = lines;
  return lines;
}

function doPreload(filename, day) {
  const dataFile = getPath(filename) + `day${day}.data`;
  return loadFile(dataFile);
}

module.exports = function (filename, day) {
  function read() {
    let idx = filename.lastIndexOf(".");
    if (idx < 0) {
      throw `. not found in ${filename}`;
    }
    filename = filename.substr(0, idx + 1) + "data";
    idx = filename.lastIndexOf("/");
    if (idx >= 0) {
      filename =
        filename.substr(0, idx + 1) + "Data/" + filename.substr(idx + 1);
    } else {
      filename = "Data/" + filename;
    }
    try {
      return loadFile(filename);
    } catch {}
  }

  if (day !== undefined) {
    return doPreload(filename, day);
  } else {
    return read();
  }
};
