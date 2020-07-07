exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handle400s = (err, req, res, next) => {
  if (err.msg) res.status(400).send({ msg: err.msg });
  if (!err.msg && err.status) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, " error in handle500");
  res.status(500).send({ msg: "Server Error" });
};
