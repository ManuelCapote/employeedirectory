const employeeDivs = document.querySelector('.main');
const employeeWidget = document.querySelector('.empInfoBox');
const overlayDiv = document.querySelector('.overlayDiv');
const employeeModalCard = overlayDiv.firstElementChild;
const url = 'https://randomuser.me/api/?nat=us&results=12';
const searchBar = document.querySelector('.searchBar');
const searchBox = searchBar.getElementsByTagName('input');
let employeeArray = [];
const filteredEmp = [{results: []}];
let empDataA = employeeArray.results;
let searchActive = false;

let empIndex = 0;
let widgetClicked = 0;

// Fetch Function 
fetch(url)
    .then(checkStatus)
    .then( res => res.json() )
    .then( data => createArrayOfEmp(data))



//Helper Function
function checkStatus(response) {
    if(response.ok) { 
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


function createArrayOfEmp(data) {
    employeeArray = data;
    generateEmployeeImg(employeeArray);
} 


function generateEmployeeImg(employeeArray) 
{
    const employeeInfo = employeeArray.results.map( (item, index) =>
    `
    <div class="empInfoBox" id=${index}>
        <div class="empImgBox">
            <img src='${item.picture.large}' alt>
        </div>
        <div class="empText">
            <h3 class='name'>${item.name.first} ${item.name.last}</h3>
            <span class="email">${item.email}</span>
            <span class="city">${item.location.city}</span>
        </div>
    </div>
    `).join('')
    employeeDivs.innerHTML = employeeInfo;
}

function generateModalWindow (modalIndex) {
    let modalPrefix = [];
    if(searchActive) {
        modalPrefix = filteredEmp.results[modalIndex];
    } else modalPrefix = employeeArray.results[modalIndex];

    let tel = modalPrefix.cell;
    let loc = modalPrefix.location;
    let strNmbr = loc.street.number;
    let strState = loc.state;
    let strName = loc.street.name;
    let pic = modalPrefix.picture.large;
    let strPc = loc.postcode;
    let dob = modalPrefix.dob;
    let name =`${modalPrefix.name.first} ${modalPrefix.name.last}`;
    let email = `${modalPrefix.email}`;
    let city = `${modalPrefix.location.city}`;
    let date = new Date(dob.date); 
    
    const newModalHtml = 
    `
    <div id="new-modal-html" index="${modalIndex}">
        <div class="hide">${modalIndex}</div>
        <div class="cardimage">
        <img src="${pic}" alt="employee">
        </div>
        <div class="cardtext">
        <h3 id="name">${name}</h3>
        <p>${email}</p>
        <p>${city}</p>
    </div>
    <div id="divider"><p> <hr> </p></div>
        <div id="new-modal-items">
            <p>${tel}</p>
            <p>${strNmbr} ${strName}, ${strState} ${strPc}</p>
            <p>Birthday: ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}</p>
        </div>
        <div class='action'>
            <div class="back">back</div>
            <div class="next">next</div>
        </div>
    </div>
    `;
    
    employeeModalCard.innerHTML = newModalHtml;  
}


addEventListener('click', (e) => {
    if(e.target.parentElement.className == 'empInfoBox') {
        overlayDiv.style.display = 'block';
        employeeModalCard.style.display = 'block';
        empIndex = e.target.parentElement.id;

        generateModalWindow(empIndex);
        
    } else if(e.target.parentElement.parentElement.className == 'empInfoBox') {
        overlayDiv.style.display = 'block';
        employeeModalCard.style.display = 'block';
        empIndex = e.target.parentElement.parentElement.id;

        generateModalWindow(empIndex);

    } else if (e.target.parentElement.parentElement.parentElement.className == 'empInfoBox') {
        overlayDiv.style.display = 'block';
        employeeModalCard.style.display = 'block';
        empIndex = e.target.parentElement.parentElement.parentElement.id;

        generateModalWindow(empIndex);
    }
    else if(e.target.className == 'overlayDiv') {
        overlayDiv.style.display = 'none';
        employeeModalCard.style.display = 'none';
    }
});


searchBar.addEventListener('keyup', (e)=> {
    searchActive = true;    
    const searchString = e.target.value.toLowerCase();
    console.log(searchString);
    filteredEmp.results = employeeArray.results.filter((user) => {
        return (
            user.name.first.toLowerCase().includes(searchString) ||
            user.name.last.toLowerCase().includes(searchString)
        );
    });
    maxIndex = filteredEmp.length;
    console.log(filteredEmp);
    generateEmployeeImg(filteredEmp);
});

employeeModalCard.addEventListener('click', (e) => {
    if(e.target.className == "next") {
        const currentCardIndex = e.target.parentElement.parentElement.firstElementChild.innerHTML;
        const nextCardIndex = parseInt(currentCardIndex) + 1;

        generateModalWindow(nextCardIndex);

    } else if(e.target.className == "back") {
        const currentCardIndex = e.target.parentElement.parentElement.firstElementChild.innerHTML;
        const previousCardIndex = parseInt(currentCardIndex) - 1;

            generateModalWindow(previousCardIndex);
    }
})