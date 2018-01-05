$(document).ready(function () {
  $.ajax({
    url: "http://localhost:9030/get-tasks",
    success: function (response) {
      
      var res = JSON.parse(response);

      console.log('response ', res);

      if (res.success) {
        if (res.rows.length) {
          res.rows.forEach(row => {
            console.log('row ', row);

            $('#tasks_div').append(`
            <div 
            id=${row.id} 
            class="task ${row.complete ? 'complete' : ''}" 
            data-complete="${row.complete}" 
            data-id="${row.id}"
            >
              ${row.tasks}
              <span class='remove'><i class="fa fa-trash"></i></span>
            </div>
          `);
          });
        }
        else {
          $('#no_tasks').show();
        }
      }
      return events();
    }
  });

  function events() {
    $('div#tasks_div').on('click', 'div.task', function () {
      var complete = $(this).data('complete');
      var id = $(this).data('id');

      console.log('div id ', id);
      console.log('div status ', complete);

      $.ajax({
        url: "http://localhost:9030/change-status",
        method: 'POST',
        data: {
          complete: !complete,
          id: id
        },
        success: function (response) {
          var res = JSON.parse(response);

          if (res.success) {
            console.log('response ', res);
            var lid = '#' + id;
            $(lid).toggleClass('complete');
          }
        }
      });
    });

    $('div#tasks_div').on('click', 'div.task > span.remove', function (e) {
      e.stopPropagation();
      // console.log('removing ', this);

      var id = $(this).parent().data('id');
      var divid = '#'+id;
      console.log('id ', id);

      $.ajax({
        url: "http://localhost:9030/delete-task",
        method: 'POST',
        data: {
          id: id
        },
        success: function (response) {
          var res = JSON.parse(response);

          if (res.success) {
            $(divid).remove();
          }
        }
      });
    });
  }

  $('#task_input').keyup(function(e) {
    var text = $(this).val();
    $(this).val(text.replace(/[^a-zA-Z 0-9\$\.\-\_%@#\*\+'=!&"?<>,;:]/g, ''));
  })

  function addTask(){
    var text = $('#task_input').val();

    if(text.trim()){
      console.log('pressed enter');
      $.ajax({
        url: "http://localhost:9030/add-task",
        method: 'POST',
        data: {task: text},
        success: function(response) {
          var res = JSON.parse(response);

          console.log('response ', res);

          if (res.success) {
            var id = '#'+res.id;
            var removeId = '#'+res.id;

            $('#no_tasks').hide();

            $('#tasks_div').append(`
              <div 
              id=${res.id} 
              class="task ${res.complete ? 'complete' : ''}" 
              data-complete="false" 
              data-id="${res.id}"
              >
                ${res.task}
                <span class='remove'>
                <i class="fa fa-trash"></i></span>
              </div>
            `);

            $('#task_input').val('');
          }
          
        }
      });
    }
  }

  $('#task_input').keypress(function(e){
    if(e.which === 13){
      addTask();
    }
  });

  
});

