var members = data.results[0].members;

//SENATE TABLE

function createTable() {
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    for (var i = 0; i < members.length; i++) {
        //for each member build a tr
        var tableRow = document.createElement("tr");
        //for each row create 5 cells (full name, party, state, seniority, precentage of votes)
        var firstName = members[i].first_name;
        var middleName = members[i].middle_name;
        //some members don't have middle names
        if (middleName === null) {
            middleName = "";
        }
        var lastName = members[i].last_name;
        var completeName = firstName + " " + middleName + " " + lastName;

        var link = document.createElement("a");
        link.setAttribute("href", members[i].url);
        //    completeName.link = members[i].url;
        link.innerHTML = completeName;
        var party = members[i].party;
        var state = members[i].state;
        var seniority = members[i].seniority;
        var votesParty = "% " + members[i].votes_with_party_pct;
        var cells = [link, party, state, seniority, votesParty];

        if (showMember(members[i])) {
            for (var j = 0; j < cells.length; j++) {
                var tableCell = document.createElement("td");
                tableCell.append(cells[j]);
                tableRow.append(tableCell);
            }
            document.getElementById("tableBody").append(tableRow);
        }
    }
}

createTable();

//SENATE CHECKBOXES

document.querySelectorAll("input[name=Party]")[0].addEventListener("click", createTable);
document.querySelectorAll("input[name=Party]")[1].addEventListener("click", createTable);
document.querySelectorAll("input[name=Party]")[2].addEventListener("click", createTable);

function showMember(member) {
    var options = document.getElementById("dropDownBody").value;
    var checkboxes = document.querySelectorAll("input[name=Party]");
    var checkedCheckboxes = document.querySelectorAll("input[name=Party]:checked");
    if (checkedCheckboxes.length == 0 && options == "All") {
        return true;
    }
    for (var j = 0; j < checkboxes.length; j++) {
        if (checkboxes[j].checked && (member.party == checkboxes[j].value) && ((options === member.state || options === "All"))) {
            return true;
        } else if (checkedCheckboxes.length === 0 && options === member.state) {
            return true;
        }
    }
    return false;
}

// DROPDOWN **************
function showMemberDropDown(member) {
    var options = document.getElementById("dropDownBody").value;
    if (options === member.state || options === "All") {
        return true;
    }
}
showMemberDropDown(members);

document.getElementById("dropDownBody").addEventListener("change", createTable);

function createStates() {
    var filteredStates = [];
    for (i = 0; i < members.length; i++) {
        if (filteredStates.indexOf(members[i].state) == -1) {
            filteredStates.push(members[i].state);
            filteredStates.sort();
        }
    }
    for (var j = 0; j < filteredStates.length; j++) {
        var option = document.createElement("option");
        option.classList.add("stateOptions");
        option.setAttribute("value", filteredStates[j]);
        option.innerHTML = filteredStates[j];
        var dropDownOptions = document.getElementById("dropDownBody");
        dropDownOptions.appendChild(option);
    }
}

createStates();

//function showMember(member) {
//    var checkboxes = document.querySelectorAll("input[name=Party]");
//    var checkedCheckboxes = document.querySelectorAll("input[name=Party]:checked");
//    if (checkedCheckboxes.length == 0) {
//        return true;
//    }
//    for (var j = 0; j < checkboxes.length; j++) {
//        if (checkboxes[j].checked && (member.party == checkboxes[j].value)) {
//            return true;
//        }
//    }
//    return false;
//}


////HOUSE TABLE
//
//function createTableHouse() {
//    var tableBodyHouse = document.getElementById("tableBodyHouse");
//    tableBodyHouse.innerHTML = "";
//    for (var i = 0; i < members.length; i++) {
//   
//        //for each member build a tr
//        var tableRow = document.createElement("tr");
//        //for each row create 5 cells (full name, party, state, seniority, precentage of votes)
//        var firstName = members[i].first_name;
//        var middleName = members[i].middle_name;
//        //some members don't have middle names
//        if (middleName === null) {
//            middleName = "";
//        }
//        var lastName = members[i].last_name;
//        var completeName = firstName + " " + middleName + " " + lastName;
//        var link = document.createElement("a");
//        link.setAttribute("href", members[i].url);
//        link.innerHTML = completeName;
//        console.log(link);
//        var party = members[i].party;
//        var state = members[i].state;
//        var seniority = members[i].seniority;
//        var votesParty = "% " + members[i].votes_with_party_pct;
//        var cells = [link, party, state, seniority, votesParty];
//
//        if (showMember(members[i])) {
//            for (var j = 0; j < cells.length; j++) {
//                var tableCell = document.createElement("td");
//                tableCell.append(cells[j]);
//                tableRow.append(tableCell);
//            }
//            document.getElementById("tableBodyHouse").append(tableRow);
//        }
//    }
//}
//
//createTableHouse();
//
//
//document.querySelectorAll("input[name=Party]")[0].addEventListener("click", createTableHouse);
//document.querySelectorAll("input[name=Party]")[1].addEventListener("click", createTableHouse);
//document.querySelectorAll("input[name=Party]")[2].addEventListener("click", createTableHouse);
