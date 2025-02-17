function getTaskTemplate(task, i) {
  return `<div onclick="openTaskDetails(${
    task.id
  })" draggable="true" ondragstart="startDragging(${
    task.id
  })" class="taskWrapper">
                <div class="task">
                    <div id="category" class="category${task.category[0]}">${
    task.category
  }</div>
                    <div class="taskTitleAndDscr">
                        <p id="taskTitle" class="taskTitle">${task.title}</p>
                        <p id="taskDscr" class="taskDscr">${task.dscr.substr(
                          0,
                          40
                        )}...</p>
                    </div>
                    <div class="subtaskStatus">
                        <div class="progressBar">
                          <div id="statusBar${
                            task.type
                          }${i}" class="statusBar"></div>
                        </div>
                        <span class="subTaskText">
                          <span id="subtask${
                            task.type
                          }${i}" class="statusTextSubtasks">
                            <p id="subTaskFrom">1</p>/<p id="subTaskTo">2</p>
                          </span>
                          <p>Substasks</p>
                        </span>
                      </div>
                    <div class="intialsAndPrio">
                        <div id="${task.type}${i}" class="initialWrapper">
                          
                        </div>

                        <img
                          id="prio"
                          class="prio"
                          src="./assets/icons/prio_${task.prio}.svg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>`;
}

function getNoTaskTemplate(type) {
  return `<div class="noTask">
                <p>No Tasks ${type}</p>
          </div>`;
}

function getIntialTemplateForBoard(intials, color, leftPos) {
  return `<div class="intial iPos" style="background-color: ${color}; left: ${leftPos}px">${intials}</div>`;
}

function getRemainingIntialsTemplate(counter, lenContacts, leftPos) {
  return `<div class="intial iPos" style="left: ${leftPos}px">+${
    lenContacts - counter
  }</div>`;
}

function getSubTaskTextTemplate(doneSubTasks, amountSubTasks) {
  return `<p id="subTaskFrom">${doneSubTasks}</p>/<p id="subTaskTo">${amountSubTasks}</p>`;
}

function getTaskDetailTemplate(i) {
  return `<div class="taskDetailHeader">
                  <div id="category" class="category${tasks[i].category[0]}">${
    tasks[i].category
  }</div>
                  <img onclick="closeEditTaskOverlay()" src="./assets/icons/close.svg">
                </div>
                <h2>${tasks[i].title}</h2>
                <p>${tasks[i].dscr}</p>
                <div class="taskDetails">
                  <div class="detail">
                    <p class="detailType">Due date:</p>
                    <p>${formatDate(tasks[i].date)}</p>
                  </div>
                  <div class="detail">
                    <p class="detailType">Prio:</p>
                    <div class="detailPrio">
                      <p>${fristLetterUpperCase(tasks[i].prio)}</p>
                      <img src="./assets/icons/prio_${tasks[i].prio}.svg">
                    </div>
                  </div>
                </div>
                <div class="detailContacts">
                  <p>Assigned to:</p>
                  <div class="detailContactsList">
                    <div class="detialContactListItem">
                      <div class="intial">MM</div>
                      <p>Max Muster</p>
                    </div>
                    <div class="detialContactListItem">
                      <div class="intial">MM</div>
                      <p>Max Muster</p>
                    </div>
                    <div class="detialContactListItem">
                      <div class="intial">MM</div>
                      <p>Max Muster</p>
                    </div>
                    <div class="detialContactListItem">
                      <div class="intial">MM</div>
                      <p>Max Muster</p>
                    </div>
                    <div class="detialContactListItem">
                      <div class="intial">MM</div>
                      <p>Max Muster</p>
                    </div>
                  </div>
                </div>
                <div class="detailSubtasks">
                  <p>Subtasks</p>
                  <div class="subtasksList">
                    <div class="subtasksListItem">
                      <input type="checkbox" name="detailSubtask">
                      <p>Implement recipe recommendation</p>
                    </div>
                    <div class="subtasksListItem">
                      <input class="detailInput" type="checkbox" name="detailSubtask">
                      <p>Start page layout</p>
                    </div>
                  </div>
                </div>
                <div class="taskDetailButtons">
                  <div onclick="deleteTask(${i})" class="taskDetailButton">
                    <img src="./assets/icons/delete_contact.svg">
                    <p>Delete</p>
                  </div>
                  <div class="taskDetailButtonsDivider"></div>
                  <div class="taskDetailButton">
                    <img src="./assets/icons/edit_contact.svg">
                    <p>Edit</p>
                  </div>
                </div>`;
}

function formatDate(date) {
  let year = date.substr(0, 4);
  let month = date[5] + date[6];
  let day = date[8] + date[9];
  let formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

function fristLetterUpperCase(word) {
  let firstLetter = word[0];
  let firstLetterCap = firstLetter.toUpperCase();
  let remainingLetters = word.slice(1);
  return (capitalizedWord = firstLetterCap + remainingLetters);
}
