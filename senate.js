var members;
var url = "https://api.propublica.org/congress/v1/113/senate/members.json";
//AJAX - Asincrone, this code needs some time to execute.  
fetch(url, {
        headers: {
            "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
        }
    })
    .then(function (data) {
        return data.json();
    })
    .then(function (myData) {
        members = myData.results[0].members;
        //createTable();
        //showMemberDropDown(members);
        //createStates();
        //addEventListenerToCheckboxes();
        //addEventListenerToDropDown();
        app.senators = members;
    })

var app = new Vue({
    el: "#app",
    data: {
        senators: [],
        checkedCheckboxes: [],
        options: "All"

    },
    methods: {

    },

computed: {
    states: function () {
        return [...new Set(this.senators.map((senator) => senator.state).sort())]
    },
    
     filterCheckedMembers: function () {
            var filteredMembers = [];
            if (this.checkedCheckboxes.length === 0 && this.options === "All") {
                return this.senators;
            } else {
                for (var i = 0; i < this.senators.length; i++) {
                    if (this.checkedCheckboxes.length === 0 && (this.options === "All" || this.options === this.senators[i].state)) {
                        filteredMembers.push(this.senators[i]);
                    } else {
                        for (var j = 0; j < this.checkedCheckboxes.length; j++) {
                            if ((this.senators[i].party === this.checkedCheckboxes[j]) && (this.options === "All" || this.options === this.senators[i].state)) {
                                filteredMembers.push(this.senators[i]);
                            }
                        }
                    }
                }
                return filteredMembers;
            }
        }
}
});

//        function filterCheckedMembers(membersSenate) {
//    var checkedCheckboxes = document.querySelectorAll('input[type=checkbox]:checked');
//    var filteredMembers = [];
//    var options = document.getElementById("dropDownBody").value;
//    if (checkedCheckboxes.length === 0 && options === "All") {
//        return membersSenate;
//    } else {
//        for (var i = 0; i < membersSenate.length; i++) {
//            if (checkedCheckboxes.length === 0 && (options === "All" || options === membersSenate[i].state)) {
//                filteredMembers.push(membersSenate[i]);
//            } else {
//                for (var j = 0; j < checkedCheckboxes.length; j++) {
//                    if (((membersSenate[i].party === checkedCheckboxes[j].value) && (options === "All" || options === membersSenate[i].state))) {
//                        filteredMembers.push(membersSenate[i]);
//                    }
//                }
//            }
//        }
//        return filteredMembers;
//    }
//}

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
        var votesParty = members[i].votes_with_party_pct + " %";
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

////SENATE CHECKBOXES
//function addEventListenerToCheckboxes() {
//    var checkboxes = document.querySelectorAll('input[type=checkbox]');
//    for (var i = 0; i < checkboxes.length; i++) {
//        checkboxes[i].addEventListener("click", createTable);
//    }
//}

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

//function addEventListenerToDropDown() {    document.getElementById("dropDownBody").addEventListener("change", createTable);
//}
//function createStates() {
//    var filteredStates = [];
//    for (i = 0; i < members.length; i++) {
//        if (filteredStates.indexOf(members[i].state) == -1) {
//            filteredStates.push(members[i].state);
//            filteredStates.sort();
//        }
//    }
//    for (var j = 0; j < filteredStates.length; j++) {
//        var option = document.createElement("option");
//        option.classList.add("stateOptions");
//        option.setAttribute("value", filteredStates[j]);
//        option.innerHTML = filteredStates[j];
//        var dropDownOptions = document.getElementById("dropDownBody");
//        dropDownOptions.appendChild(option);
//    }
//}
