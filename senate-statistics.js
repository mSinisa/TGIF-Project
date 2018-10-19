var members = data.results[0].members;
//TOTAL NUMBER OF MEMBERS
var democrats = [];
var republicans = [];
var independents = [];
//VOTED WITH PARTY ALL PERCENTAGES
var allDemocratsVotedPercantages = [];
var allRepublicansVotedPercantages = [];
var allIndependentsVotedPercantages = [];

function getMembersFromParties() {
    //loop through all members 
    for (var i = 0; i < members.length; i++) {
        //if they are democrats
        if (members[i].party === "D") {
            //make an array of democrats
            democrats.push(members[i]);
            //make an array or percentage votes for democrats
            allDemocratsVotedPercantages.push(members[i].votes_with_party_pct);
        } else if (members[i].party === "R") {
            republicans.push(members[i]);
            allRepublicansVotedPercantages.push(members[i].votes_with_party_pct);
        } else {
            independents.push(members[i]);
            allIndependentsVotedPercantages.push(members[i].votes_with_party_pct);
        }
    }
}
getMembersFromParties();

var statistics = {
    "parties": [
        {
            "party": "Democrats",
            "number_of_members": democrats.length,
            "votes_with_party_pct": democratsPctVoted()
        },
        {
            "party": "Republicans",
            "number_of_members": republicans.length,
            "votes_with_party_pct": republicansPctVoted()
        },
        {
            "party": "Independents",
            "number_of_members": independents.length,
            "votes_with_party_pct": independentsPctVoted()
        }
        ]
}

////FUNCTIONS
//function partyPctVoted(arr) {
//    var sum = 0;
//    for (var i = 0; i < arr.length; i++) {
//        sum = sum + arr[i];
//    }
//    var average = "% " + Math.round(sum / arr.length);
//    return average;
//}
//partyPctVoted(allDemocratsVotedPercantages);
//partyPctVoted(allRepublicansVotedPercantages);
//partyPctVoted(allIndependentsVotedPercantages);
//DEMOCRATS VOTED WITH PARTY
function democratsPctVoted() {
    var sum = 0;
    for (var i = 0; i < allDemocratsVotedPercantages.length; i++) {
        sum = sum + allDemocratsVotedPercantages[i];
    }
    var average = "% " + Math.round(sum / allDemocratsVotedPercantages.length);
    return average;
}
democratsPctVoted();

//REPUBLICANS VOTED WITH PARTY
function republicansPctVoted() {
    var sum = 0;
    for (var i = 0; i < allRepublicansVotedPercantages.length; i++) {
        sum = sum + allRepublicansVotedPercantages[i];
    }
    var average = "% " + Math.round(sum / allRepublicansVotedPercantages.length);
    return average;
}
republicansPctVoted();

//INDEPENDENTS VOTED WITH PARTY
function independentsPctVoted() {
    var sum = 0;
    for (var i = 0; i < allIndependentsVotedPercantages.length; i++) {
        sum = sum + allIndependentsVotedPercantages[i];
    }
    var average = "% " + Math.round(sum / allIndependentsVotedPercantages.length);
    return average;
}
independentsPctVoted();

//PARTY ENGAGEDMENT 10% ATTENDANCE 
var bottom10PctMembersByMissedVotes = [];
var top10PctMembersByMissedVotes = [];

//sort array of members by missed votes pct
function sortMembersByMissedVotes() {
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
            bottom10PctMembersByMissedVotes.push(sortMembersByMissedVotes[i]);
        }

        for (var j = num; j < sortMembersByMissedVotes.length; j++) {
            if (sortMembersByMissedVotes[j].missed_votes_pct === sortMembersByMissedVotes[num-1].missed_votes_pct) {
                bottom10PctMembersByMissedVotes.push(sortMembersByMissedVotes[j]);
            }
        }
    } else {

        for (var k = sortMembersByMissedVotes.length - 1; k > sortMembersByMissedVotes.length - num -1; k--) {
            top10PctMembersByMissedVotes.push(sortMembersByMissedVotes[k]);
        }
        for (var l = sortMembersByMissedVotes.length - num -1; l > 0 ; l--) {
            if (sortMembersByMissedVotes[l].missed_votes_pct === sortMembersByMissedVotes[sortMembersByMissedVotes.length - num].missed_votes_pct) {
                top10PctMembersByMissedVotes.push(sortMembersByMissedVotes[l]);
            }
        }
    }
}
getBottomAndTop10PctAttendance(sortMembersByMissedVotes(), true);
getBottomAndTop10PctAttendance(sortMembersByMissedVotes(), false);

//TABLES

function createTopTable() {
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
        document.getElementById("topTableBody").append(tableRow);
    }
}
createTopTable();

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
createLeastAndMostEngagedTable("leastEngagedtbody",bottom10PctMembersByMissedVotes);
createLeastAndMostEngagedTable("mostEngagedBody",top10PctMembersByMissedVotes);