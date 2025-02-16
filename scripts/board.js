let tasks = [];
let currentDraggedElement;

async function initBoard() {
  await initAddTask();
  await loadTasksData();
  renderTasks();
}

async function loadTasksData(path = "/tasks") {
  tasks = [];
  id = 0;
  try {
    let taskResponse = await fetch(FB_URL + path + ".json");
    let taskResponseToJson = await taskResponse.json();
    let taskKeys = Object.keys(taskResponseToJson);
    for (let i = 0; i < taskKeys.length; i++) {
      tasks.push({
        firebaseid: taskKeys[i],
        id: id,
        type: taskResponseToJson[taskKeys[i]].type,
        category: taskResponseToJson[taskKeys[i]].category,
        title: taskResponseToJson[taskKeys[i]].title,
        dscr: taskResponseToJson[taskKeys[i]].description,
        date: taskResponseToJson[taskKeys[i]].date,
        prio: taskResponseToJson[taskKeys[i]].prio,
        contacts: taskResponseToJson[taskKeys[i]].assignTo,
        subtasks: taskResponseToJson[taskKeys[i]].subtasks,
      });
      id++;
    }
  } catch (error) {
    showMessage("Error during loading of data");
  }
}

function renderTasks() {
  renderTodo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderTodo() {
  let todo = tasks.filter((task) => task.type == "todo");
  document.getElementById("todo").innerHTML = "";
  if (todo.length > 0) {
    for (let i = 0; i < todo.length; i++) {
      let taskObj = todo[i];
      document.getElementById("todo").innerHTML += getTaskTemplate(taskObj, i);
      renderContactIntials(taskObj, i);
      renderSubTasks(taskObj, i);
    }
  } else {
    document.getElementById("todo").innerHTML = getNoTaskTemplate("in to do");
  }
}

function renderInProgress() {
  let inProgress = tasks.filter((task) => task.type == "inProgress");
  document.getElementById("inProgress").innerHTML = "";
  if (inProgress.length > 0) {
    for (let i = 0; i < inProgress.length; i++) {
      let taskObj = inProgress[i];
      document.getElementById("inProgress").innerHTML += getTaskTemplate(
        taskObj,
        i
      );
      renderContactIntials(taskObj, i);
      renderSubTasks(taskObj, i);
    }
  } else {
    document.getElementById("inProgress").innerHTML =
      getNoTaskTemplate("in progress");
  }
}

function renderAwaitFeedback() {
  let awaitFeedback = tasks.filter((task) => task.type == "awaitFeedback");
  document.getElementById("awaitFeedback").innerHTML = "";
  if (awaitFeedback.length > 0) {
    for (let i = 0; i < awaitFeedback.length; i++) {
      let taskObj = awaitFeedback[i];
      document.getElementById("awaitFeedback").innerHTML += getTaskTemplate(
        taskObj,
        i
      );
      renderContactIntials(taskObj, i);
      renderSubTasks(taskObj, i);
    }
  } else {
    document.getElementById("awaitFeedback").innerHTML =
      getNoTaskTemplate("in await Feedback");
  }
}

function renderDone() {
  let done = tasks.filter((task) => task.type == "done");
  document.getElementById("done").innerHTML = "";
  if (done.length > 0) {
    for (let i = 0; i < done.length; i++) {
      let taskObj = done[i];
      document.getElementById("done").innerHTML += getTaskTemplate(taskObj, i);
      renderContactIntials(taskObj, i);
      renderSubTasks(taskObj, i);
    }
  } else {
    document.getElementById("done").innerHTML = getNoTaskTemplate("done");
  }
}

function renderContactIntials(task, i) {
  if (task.contacts != undefined) {
    let contactKeys = Object.keys(task.contacts);
    let leftPos = 0;
    let counter = 0;
    for (let index = 0; index < contactKeys.length; index++) {
      if (index <= 4) {
        let name = task.contacts[contactKeys[index]].name;
        let intials = getIntialsOfContact(name);
        let color = task.contacts[contactKeys[index]].color;
        document.getElementById(task.type + i).innerHTML +=
          getIntialTemplateForBoard(intials, color, leftPos);
        leftPos += 24;
        counter++;
      }
    }
    if (counter < contactKeys.length) {
      document.getElementById(task.type + i).innerHTML +=
        getRemainingIntialsTemplate(counter, contactKeys.length, leftPos);
      leftPos += 24;
    }
  } else {
    return;
  }
}

function getIntialsOfContact(contact) {
  let intials = "";
  let splittedContact = contact.split(" ");
  for (let i = 0; i < splittedContact.length; i++) {
    intials += splittedContact[i][0].toUpperCase();
  }
  return intials;
}

function renderSubTasks(task, i) {
  if (task.subtasks != undefined) {
    let subtasksKeys = Object.keys(task.subtasks);
    let amountDone = 0;
    let amountSubTasks = subtasksKeys.length;
    for (let index = 0; index < subtasksKeys.length; index++) {
      if (task.subtasks[subtasksKeys[index]].done === true) {
        amountDone++;
      }
    }
    document.getElementById("subtask" + task.type + i).innerHTML =
      getSubTaskTextTemplate(amountDone, amountSubTasks);
    updateStatusBar(amountDone, amountSubTasks, task, i);
  } else {
    return;
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  tasks[currentDraggedElement].type = category;
  renderTasks();
  document.getElementById(category).classList.remove("dragAreaHighlight");
  putData(`tasks/${tasks[currentDraggedElement].firebaseid}/type`, category);
}

function highlight(id) {
  document.getElementById(id).classList.add("dragAreaHighlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("dragAreaHighlight");
}
function updateStatusBar(amountDone, amountSubTasks, task, i) {
  let percent = (amountDone / amountSubTasks) * 100;
  percent = Math.round(percent);
  document.getElementById("statusBar" + task.type + i).style.width = `${
    percent + "%"
  }`;
}

function openAddTaskOverlay() {
  document.getElementById("overlayAddTask").classList.remove("overlayClosed");
}

function closeAddTaskOverlay() {
  document.getElementById("overlayAddTask").classList.add("overlayClosed");
}

function openTaskDetails(i) {
  document.getElementById("taskEditContainer").innerHTML = "";
  document.getElementById("taskEditContainer").innerHTML =
    getTaskDetailTemplate(i);
  renderContactsInTaskDetail(i);
  renderSubTasksInDetail(i);
  document.getElementById("overlayEditTask").classList.remove("overlayClosed");
  document.getElementById("overallContent").style.overflow = "hidden";
}

function closeEditTaskOverlay() {
  document.getElementById("overlayEditTask").classList.add("overlayClosed");
  document.getElementById("overallContent").style.overflow = "auto";
}

function renderContactsInTaskDetail(i) {
  document.getElementById("detailContactsList").innerHTML = "";
  if (tasks[i].contacts != undefined) {
    let contactKeys = Object.keys(tasks[i].contacts);
    for (let index = 0; index < contactKeys.length; index++) {
      let name = tasks[i].contacts[contactKeys[index]].name;
      let intials = getIntialsOfContact(name);
      let color = tasks[i].contacts[contactKeys[index]].color;
      document.getElementById("detailContactsList").innerHTML +=
        getDetialContactListItemTemplate(name, intials, color);
    }
  } else {
    return;
  }
}

function renderSubTasksInDetail(i) {
  document.getElementById("subtasksList").innerHTML = "";
  if (tasks[i].subtasks != undefined) {
    let subtasksKeys = Object.keys(tasks[i].subtasks);
    for (let index = 0; index < subtasksKeys.length; index++) {
      let status = tasks[i].subtasks[subtasksKeys[index]].done;
      let title = tasks[i].subtasks[subtasksKeys[index]].title;
      document.getElementById("subtasksList").innerHTML +=
        getDetialSubtaskListItemTemplate(status, title);
    }
  } else {
    return;
  }
}

async function deleteTask(i) {
  await deleteData(`/tasks/${tasks[i].firebaseid}`);
  await loadTasksData();
  renderTasks();
  closeEditTaskOverlay();
  showMessage("Task successfully deleted");
}
