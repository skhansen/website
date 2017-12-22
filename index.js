const express   = require('express');
const app       = express();
const port      = process.env.PORT || 3000;

app.use(express.static('.'))


app.listen(port, (err) => {
  if (err) {
    return console.log('SHIT!', err);
  }

  console.log(`server is listening on ${port}`);
});