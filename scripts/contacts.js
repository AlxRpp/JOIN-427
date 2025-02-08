let FB_URL = "https://join-427-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];
let activeContact = null;

async function init() {
  await loadContactsData();
  renderContacts();
}

async function loadContactsData(path = "/contacts") {
  contacts = [];
  try {
    let contactResponse = await fetch(FB_URL + path + ".json");
    let contactResponseToJson = await contactResponse.json();
    let contactKeys = Object.keys(contactResponseToJson);
    for (let i = 0; i < contactKeys.length; i++) {
      contacts.push({
        firebaseid: contactKeys[i],
        name: contactResponseToJson[contactKeys[i]].name,
        email: contactResponseToJson[contactKeys[i]].email,
        phone: contactResponseToJson[contactKeys[i]].phone,
        color: contactResponseToJson[contactKeys[i]].color,
      });
    }
  } catch (error) {
    console.log("Fehler beim Laden");
  }
}

function getFirstLettersSorted(contactsArr) {
  let firstLettersOfContacts = [];
  for (let i = 0; i < contactsArr.length; i++) {
    let firstLetter = contactsArr[i].name[0];
    if (!firstLettersOfContacts.includes(firstLetter)) {
      firstLettersOfContacts.push(firstLetter);
    }
  }
  let sortedLetters = firstLettersOfContacts.sort();
  return sortedLetters;
}

function renderContacts() {
  let contactContentRef = document.getElementById("contactList");
  contactContentRef.innerHTML = "";
  let firstLetters = getFirstLettersSorted(contacts);
  for (let i = 0; i < firstLetters.length; i++) {
    contactContentRef.innerHTML += getContactHeaderTemplate(firstLetters[i]);
  }
  for (let i = 0; i < contacts.length; i++) {
    let firstCharContact = contacts[i].name[0].toLowerCase();
    let contactGroupRef = document.getElementById(firstCharContact);
    let intials = getIntialsOfContact(contacts[i].name);
    contactGroupRef.innerHTML += getSingleContactTemplate(i, intials);
    setBackgroundColorOfIntial(i);
  }
}

function setBackgroundColorOfIntial(i) {
  let initialRef = document.getElementById("initial" + i);
  initialRef.style.backgroundColor = contacts[i].color;
}

function setBackgroundColorOfBigIntial(i) {
  let initialRef = document.getElementById("bigInitial" + i);
  initialRef.style.backgroundColor = contacts[i].color;
}

function getIntialsOfContact(contact) {
  let intials = "";
  let splittedContact = contact.split(" ");
  for (let i = 0; i < splittedContact.length; i++) {
    intials += splittedContact[i][0].toUpperCase();
  }
  return intials;
}

function openDetails(i, contactID) {
  let screenWidth = window.innerWidth;
  if (screenWidth <= 1100) {
    openDetailsMobile(i, contactID);
  } else {
    openDetailsDesktop(i, contactID);
  }
}

function openDetailsDesktop(i, contactID) {
  let contactInfoRef = document.getElementById("contactInfo");
  if (activeContact == contactID) {
    contactInfoRef.classList.add("detailClosed");
    activeContact = null;
    return;
  }
  contactInfoRef.classList.remove("detailClosed");
  renderContactInfo(i);
  activeContact = contactID;
}

function renderContactInfo(i) {
  let contactInfoRef = document.getElementById("contactInfo");
  contactInfoRef.innerHTML = "";
  let initials = getIntialsOfContact(contacts[i].name);
  contactInfoRef.innerHTML = getContactInfoTemplateDesktop(i, initials);
  setBackgroundColorOfBigIntial(i);
}

function openDetailsMobile(i, contactID) {
  let contactInfoRef = document.getElementById("mobileContactInfo");
  if (activeContact == contactID) {
    contactInfoRef.classList.add("dNone");
    activeContact = null;
    return;
  }
  contactInfoRef.classList.remove("dNone");
  renderContactInfoMobile(i);
  activeContact = contactID;
}

function renderContactInfoMobile(i) {
  let contactInfoRef = document.getElementById("mobileContactInfo");
  contactInfoRef.innerHTML = "";
  let initials = getIntialsOfContact(contacts[i].name);
  contactInfoRef.innerHTML = getContactInfoTemplateMobile(i, initials);
  setBackgroundColorOfBigIntial(i);
}

function closeMobileInfo() {
  let contactInfoRef = document.getElementById("mobileContactInfo");
  contactInfoRef.classList.add("dNone");
  activeContact = null;
}

function openMobileEditButton() {
  document.getElementById("mobileEditButton").classList.toggle("respBtnclosed");
}

function openOverlay() {
  document.getElementById("overlay").innerHTML = "";
  document.getElementById("overlay").innerHTML = getAddContactDesktopContent();
  document.getElementById("overlay").classList.remove("overlayClosed");
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("overlayClosed");
}

async function createNewContact() {
  document.getElementById("validationErrorMessage").innerHTML = "";
  let contactName = document.getElementById("contactName").value;
  let contactMail = document.getElementById("contactMail").value;
  let contactPhone = document.getElementById("contactPhone").value;
  let validationResult = validateInputs(contactName, contactMail, contactPhone);
  if (validationResult) {
    await saveContact(contactName, contactMail, contactPhone);
    await loadContactsData();
    renderContacts();
    closeOverlay();
    showSuccessMessage("Contact successfully created");
  }
}

function validateInputs(contactName, contactMail, contactPhone) {
  if (
    checkEmptyInput(contactName, contactMail, contactPhone) &&
    checkEmail(contactMail) &&
    checkPhone(contactPhone)
  ) {
    return true;
  } else {
    return false;
  }
}

function checkEmptyInput(contactName, contactMail, contactPhone) {
  if (contactName === "" || contactMail === "" || contactPhone === "") {
    document.getElementById("validationErrorMessage").innerHTML =
      "<p>Bitte alle drei Eingabefelder ausfüllen!</p>";
    return false;
  } else {
    return true;
  }
}

function checkEmail(contactMail) {
  if (!validateEmail(contactMail)) {
    document.getElementById("validationErrorMessage").innerHTML +=
      "<p>Bitte eine gültige Emailadresse eingeben</p>";
    return false;
  } else {
    return true;
  }
}

function checkPhone(contactPhone) {
  if (!validatePhoneNumber(contactPhone)) {
    document.getElementById("validationErrorMessage").innerHTML +=
      "<p>Telefonnummer ungültig! (Muss mit +49 beginnen und darf max. 15 Stellen lang sein)</p>";
    return false;
  } else {
    return true;
  }
}

function validateEmail(email) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{1,3}$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phoneNumber) {
  let phoneRegex = /^\+49\d{0,12}$/;
  return phoneRegex.test(phoneNumber);
}

async function saveContact(contactName, contactMail, contactPhone) {
  let newUserObj = {
    color: getRandomIntialColor(),
    email: contactMail,
    name: contactName,
    phone: contactPhone,
  };
  try {
    await postData("contacts/", newUserObj);
  } catch (error) {
    console.log("Fehler beim speichern");
  }
}

function showSuccessMessage(message) {
  document.getElementById("messageText").innerHTML = message;
  document.getElementById("message").classList.remove("messageClosed");
  const myTimeout = setTimeout(closeSuccessMessage, 2000);
}

function closeSuccessMessage() {
  document.getElementById("message").classList.add("messageClosed");
}

async function deleteContact(i) {
  let contactInfoRef = document.getElementById("contactInfo");
  await deleteData(`/contacts/${contacts[i].firebaseid}`);
  contactInfoRef.innerHTML = "";
  await loadContactsData();
  renderContacts();
  showSuccessMessage("Contact successfully deleted");
}
