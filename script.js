let cardId = 0;
let currentColumn = null;

function initDragAndDrop() {
  $(".column").sortable({
    connectWith: ".column",
    placeholder: "ui-state-highlight",
    stop: saveState
  }).disableSelection();
}

function addCard(columnId) {
  currentColumn = columnId;
  $('#taskInput').val('');
  $('#exampleModalCenter').modal('show');
}

function saveState() {
  const state = {};

  $(".column").each(function () {
    state[this.id] = $(this).children(".card").map(function () {
      return {
        text: $(this).text(),
        id: $(this).data("id")
      };
    }).get();
  });

  localStorage.setItem("taskBoardState", JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem("taskBoardState");
  if (!saved) return;

  const state = JSON.parse(saved);
  $(".column").empty();

  for (const columnId in state) {
    state[columnId].forEach(card => {
      const $card = $("<div>")
        .addClass("card card-item")
        .attr("data-id", card.id)
        .append($("<div>").addClass("card-body p-2").text(card.text));
      $("#" + columnId).append($card);
    });
  }
}

function resetBoard() {
  if (confirm("Are you sure you want to reset the task board?")) {
    localStorage.removeItem("taskBoardState");
    location.reload();
  }
}

$(document).ready(() => {
  loadState();
  initDragAndDrop();

  $('#saveTaskBtn').click(function () {
    const taskText = $('#taskInput').val().trim();
    if (!taskText || !currentColumn) return;

    const $card = $('<div>')
      .addClass('card card-item')
      .attr('data-id', 'card' + ++cardId)
      .append($('<div>').addClass('card-body p-2').text(taskText));

    $('#' + currentColumn).append($card);
    $('#exampleModalCenter').modal('hide');

    initDragAndDrop();
    saveState();
  });
});
