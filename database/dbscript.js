var db = new PouchDB('bestscores');

db.bulkDocs([
  {
    _id: '0',
    name: 'marin',
    score: 56,
    time: 112,
    points: 9832
  },
  {
    _id: '1',
    name: 'kitten',
    score: 64,
    time: 160,
    points: 9776
  },
  {
    _id: '2',
    name: 'fdswe',
    score: 81,
    time: 151,
    points: 9768
  }
]);

db.info().then(function (info) {
  console.log(info);
});

db.allDocs(function(err, response) {
    if (err) { return console.log(err); }
    console.log(response.rows.length);
});