function contactDropdownTemplate(contact, contactIndex) {
  return `
        <div class="dropDownContact" onclick='event.stopPropagation(); markCheckbox(${JSON.stringify(
          contact
        )}, ${contactIndex})' id="contact${contactIndex}">
            <div class="dropDownLeft">
                <div class="initials" style="background-color: ${
                  contact.color
                };">${getIntialsOfContact(contact.name)}</div>
                <div class="contactName">${contact.name}</div>
            </div>
                <input type="checkbox" name="checkbox" id="checkbox${contactIndex}">
                <label for="checkbox${contactIndex}"></label>
             </div>
    `;
}

function categorysDropdownTemplate(categorys, categorysIndex) {
  return `
    <div onclick="selectCategory(${categorysIndex})" class="singleCategory">
        <span id="category${categorysIndex}">${categorys}</span>
    </div>
    `;
}

function subtasksTemplate(subtask, subtasksIndex) {
  return `
    <div ondblclick="editSubtask(${subtasksIndex})" onmouseover="showSubtaskMenu(${subtasksIndex})" 
    onmouseleave="closeSubtaskMenu(${subtasksIndex})" class="singleSubtask hover" id="singleSubtask${subtasksIndex}">
        <div class="singleSubtaskLeft">
            <div class="dot"></div>
            <span id="editSpan${subtasksIndex}">${subtask}</span>
        </div>
        <div  class="singleSubtaskMenu d-none" id="singleSubtaskMenu${subtasksIndex}">
            <img onclick="editSubtask(${subtasksIndex})" src="./assets/icons/edit_contact.svg">
            <div class="subtaskMenuDivider"></div>
            <img onclick="deleteSubtask(${subtasksIndex})" src="./assets/icons/trash.svg">
        </div>
        <div class="editMenu d-none" id="editMenu${subtasksIndex}">
            <img onclick="deleteSubtask(${subtasksIndex})" src="./assets/icons/trash.svg">
            <div class="subtaskMenuDivider"></div>
            <img onclick="saveEditedSubtask(${subtasksIndex})" src="./assets/icons/checkBlue.svg" alt="" srcset="">
        </div>
    </div>
    `;
}
