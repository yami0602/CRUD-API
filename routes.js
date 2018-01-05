module.exports = function (app, connection) {
  app.get('/', function (req, res) {
    res.send('<h1>CONNECTED</h1>')
  });

  app.get('/get-tasks', function (req, res) {
    connection.query(
      'SELECT * FROM tasks',
      function (err, rows, fields) {
        if (!err) {
          console.log('result ', rows);

          //Important! this is how you actually
          //send back a response
          res.send(JSON.stringify({
            success: true,
            rows: rows
          }));

        } else {
          console.log("There was an error in the query ", err);
          res.send({
            success: false,
          });
        }
      }
    );
  });

  app.post('/add-task', function (req, res) {
    var task = req.body.task;
  
    connection.query(
      `INSERT INTO tasks(tasks) VALUE('${task}')`,
      function (err, result, fields) {
        if (!err) {
          console.log('result ', result);

          //Important! this is how you actually
          //send back a response
          res.send(JSON.stringify({
            success: true,
            task: task,
            id: result.insertId
          }));

        } else {
          console.log("There was an error in the query ", err);
          res.send({
            success: false,
          });
        }
      });
  });

  app.post('/update-task', function (req, res) {
    var task = req.body.task.text;
    var id = req.body.task.id;

    console.log('task ', task, 'id ', id);

    connection.query(`
    UPDATE tasks 
    SET tasks = ${task}
    WHERE id = ${id}`,
      function (err, result, fields) {
        if (!err) {
          console.log('result ', result);

          //Important! this is how you actually
          //send back a response
          res.send(JSON.stringify({
            success: true,
            task: task
          }));

        } else {
          console.log("There was an error in the query ", err);
          res.send({
            success: false,
          });
        }
      });
  });

  app.post('/change-status', function (req, res) {
    var id = req.body.id;
    var complete = req.body.complete;

    console.log('complete ', complete, 'id ', id);

    connection.query(`
    UPDATE tasks
    SET complete = ${complete}
    WHERE id = ${id}`,
      function (err, result) {
        if (!err) {
          console.log('result ', result);

          //Important! this is how you actually
          //send back a response
          res.send(JSON.stringify({
            success: true,
          }));

        } else {
          console.log("There was an error in the query ", err);
          res.send({
            success: false,
          });
        }
      });
  });

  app.post('/delete-task', function (req, res) {
    var id = req.body.id;
    console.log('id ', id);

    connection.query(`
    DELETE FROM tasks 
    WHERE id = ${id}`,
      function (err, result) {
        if (!err) {
          console.log('result ', result);

          //Important! this is how you actually
          //send back a response
          res.send(JSON.stringify({
            success: true,
          }));

        } 
        else {
          console.log("There was an error in the query ", err);
          res.send({
            success: false,
          });
        }
    });
  });
}