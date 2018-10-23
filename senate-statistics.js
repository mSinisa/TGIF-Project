var url = "https://api.propublica.org/congress/v1/113/senate/members.json";
//AJAX - Asincrone, this code needs some time to execute. 
//TOTAL NUMBER OF MEMBERS
var democrats = [];
var republicans = [];
var independents = [];
//VOTED WITH PARTY ALL PERCENTAGES
var statistics;
var allDemocratsVotedPercantages = [];
var allRepublicansVotedPercantages = [];
var allIndependentsVotedPercantages = [];
//PARTY ENGAGEDMENT 10% ATTENDANCE 
var bottom10PctMembersByMissedVotes = [];
var top10PctMembersByMissedVotes = [];

fetch(url, {
        headers: {
            "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
        }
    })
    .then(function (data) {
        return data.json();
    })
    .then(function (myData) {
        var members = myData.results[0].members;

        getMembersFromParties(members);
        fillTheObject();
        getBottomAndTop10PctAttendance(sortMembersByMissedVotes(members), true);
        getBottomAndTop10PctAttendance(sortMembersByMissedVotes(members), false);
        createLeastAndMostEngagedTable("leastEngagedtbody", bottom10PctMembersByMissedVotes);
        createLeastAndMostEngagedTable("mostEngagedBody", top10PctMembersByMissedVotes);
        createTopTable(statistics, "topTableBody");
    })





function getMembersFromParties(obj) {
    //loop through all members 
    for (var i = 0; i < obj.length; i++) {
        //if they are democrats
        if (obj[i].party === "D") {
            //make an array of democrats
            democrats.push(obj[i]);
            //make an array or percentage votes for democrats
            allDemocratsVotedPercantages.push(obj[i].votes_with_party_pct);
        } else if (obj[i].party === "R") {
            republicans.push(obj[i]);
            allRepublicansVotedPercantages.push(obj[i].votes_with_party_pct);
        } else {
            independents.push(obj[i]);
            allIndependentsVotedPercantages.push(obj[i].votes_with_party_pct);
        }
    }
}

function fillTheObject() {
     statistics = {
        "parties": [
            {
                "party": "Democrats",
                "number_of_members": democrats.length,
                "votes_with_party_pct": partyPctVoted(allDemocratsVotedPercantages)
        },
            {
                "party": "Republicans",
                "number_of_members": republicans.length,
                "votes_with_party_pct": partyPctVoted(allRepublicansVotedPercantages)
        },
            {
                "party": "Independents",
                "number_of_members": independents.length,
                "votes_with_party_pct": partyPctVoted(allIndependentsVotedPercantages)
        }
        ]
    }
}

////FUNCTIONS
function partyPctVoted(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum = sum + arr[i];
    }
    var average = "% " + Math.round(sum / arr.length);
    return average;
}

//sort array of members by missed votes pct
function sortMembersByMissedVotes(members) {
    var allMembers = Array.from(members);
    allMembers.sort(function (a, b) {
        return (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0);
    });
    return allMembers;
}

function getBottomAndTop10PctAttendance(sortMembersByMissedVotes, acc) {
    //calculate 10percent of members and round the number to have a cut off point
    var num = Math.round(sortMembersByMissedVotes.length * 0.1);
    if (acc) {
        for (var i = 0; i < num; i++) {
            top10PctMembersByMissedVotes.push(sortMembersByMissedVotes[i]);
        }

        for (var j = num; j < sortMembersByMissedVotes.length; j++) {
            if (sortMembersByMissedVotes[j].missed_votes_pct === sortMembersByMissedVotes[num - 1].missed_votes_pct) {
                top10PctMembersByMissedVotes.push(sortMembersByMissedVotes[j]);
            }
        }
    } else {

        for (var k = sortMembersByMissedVotes.length - 1; k > sortMembersByMissedVotes.length - num - 1; k--) {
            bottom10PctMembersByMissedVotes.push(sortMembersByMissedVotes[k]);
        }
        for (var l = sortMembersByMissedVotes.length - num - 1; l > 0; l--) {
            if (sortMembersByMissedVotes[l].missed_votes_pct === sortMembersByMissedVotes[sortMembersByMissedVotes.length - num].missed_votes_pct) {
                bottom10PctMembersByMissedVotes.push(sortMembersByMissedVotes[l]);
            }
        }
    }
}
//TABLES
function createTopTable(statistics, idname) {
    var parties = statistics.parties
    for (var i = 0; i < parties.length; i++) {
        var tableRow = document.createElement("tr");
        var party = parties[i].party;
        var numberOfReps = parties[i].number_of_members;
        var votesWithParty = parties[i].votes_with_party_pct;
        var cells = [party, numberOfReps, votesWithParty];
        for (var j = 0; j < cells.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.append(cells[j]);
            tableRow.append(tableCell);
        }
        document.getElementById(idname).append(tableRow);
    }
}


function createLeastAndMostEngagedTable(idname, arr) {
    for (var i = 0; i < arr.length; i++) {
        var tableRow = document.createElement("tr");
        var firstName = arr[i].first_name;
        var middleName = arr[i].middle_name;
        //some members don't have middle names
        if (middleName === null) {
            middleName = "";
        }
        var lastName = arr[i].last_name;
        var completeName = firstName + " " + middleName + " " + lastName;
        var numMissedVotes = arr[i].missed_votes;
        var pctMissedVotes = "% " + arr[i].missed_votes_pct;
        var cells = [completeName, numMissedVotes, pctMissedVotes];
        for (var j = 0; j < cells.length; j++) {
            var tableCell = document.createElement("td");
            tableCell.append(cells[j]);
            tableRow.append(tableCell);
        }
        document.getElementById(idname).append(tableRow);
    }
}
