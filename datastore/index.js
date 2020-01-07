const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const counter = require("./counter");

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// function to post data
exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (!err) {
      //exports.dataDir, `${id}.txt`
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, err => {
        if (!err) {
          items[id] = text;
          callback(null, { id, text });
        }
      });
    }
  });
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

// function to get all data
exports.readAll = callback => {
  fs.readdir(exports.dataDir, { withFileTypes: false }, (err, files) => {
    if (!err) {
      callback(
        null,
        files.map(file => {
          const id = file.slice(0, -4);
          return {
            id: id,
            text: id
          };
        })
      );
    }
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

// function get just a specific piece of data by id
exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

// function to put() and replace existing data
exports.update = (id, text, callback) => {
  if (id in items) {
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, err => {
      if (!err) {
        items[id] = text;
        callback(null, { id, text });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }

  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

// function to delete existing data
exports.delete = (id, callback) => {
  if (id in items) {
    fs.unlink(path.join(exports.dataDir, `${id}.txt`), err => {
      if (!err) {
        delete items[id];
        callback(null);
      }
    });
  } else {
    callback(new Error(`No item to delete with id: ${id}`));
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, "data");

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
