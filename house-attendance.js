var membersHouse = dataHouse.results[0].members;
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
    for (var i = 0; i < membersHouse.length; i++) {
        //if they are democrats
        if (membersHouse[i].party === "D") {
            //make an array of democrats
            democrats.push(membersHouse[i]);
            //make an array or percentage votes for democrats
            allDemocratsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
        } else if (membersHouse[i].party === "R") {
            republicans.push(membersHouse[i]);
            allRepublicansVotedPercantages.push(membersHouse[i].votes_with_party_pct);
        } else {
            independents.push(membersHouse[i]);
            allIndependentsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
        }
    }
}
getMembersFromParties();

var statisticsHouse = {
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

function partyPctVoted(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum = sum + arr[i];
    }
    var average = "% " + Math.round(sum / arr.length);
    return average;
}
partyPctVoted(allDemocratsVotedPercantages);
partyPctVoted(allRepublicansVotedPercantages);
partyPctVoted(allIndependentsVotedPercantages);

//sort array of members by missed votes pct
function sortMembersByMissedVotesHouse() {
    var allMembers = Array.from(membersHouse);
    allMembers.sort(function (a, b) {
        return (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0);
    });
    return allMembers;
}

//PARTY ENGAGEDMENT 10% ATTENDANCE 
var bottom10PctMembersByMissedVotesHouse = [];
var top10PctMembersByMissedVotesHouse = [];

function getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse, acc) {
    //calculate 10percent of members and round the number to have a cut off point
    var num = Math.round(sortMembersByMissedVotesHouse.length * 0.1);
    if (acc) {
        for (var i = 0; i <= num; i++) {
            bottom10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[i]);
        }

        for (var j = num + 1; j < sortMembersByMissedVotesHouse.length; j++) {
            if (sortMembersByMissedVotesHouse[j].missed_votes_pct === sortMembersByMissedVotesHouse[num].missed_votes_pct) {
                bottom10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[j]);
            }
        }
    } else {

        for (var k = sortMembersByMissedVotesHouse.length - 1; k >= sortMembersByMissedVotesHouse.length - num; k--) {
            top10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[k]);
        }
        for (var l = sortMembersByMissedVotesHouse.length - 1; l < sortMembersByMissedVotesHouse.length - num; l--) {
            if (sortMembersByMissedVotesHouse[l].missed_votes_pct === sortMembersByMissedVotesHouse[sortMembersByMissedVotesHouse.length - num].missed_votes_pct) {
                top10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[l]);
            }
        }
    }
}
getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse(), true);
getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse(), false);

////TABLES
//function createTopTable(idname, arr, obj) {
//    var parties = statistics.parties;
//    for (var i = 0; i < parties.length; i++) {
//        var tableRow = document.createElement("tr");
//        var party = parties[i].party;
//        var numberOfReps = parties[i].number_of_members;
//        var votesWithParty = parties[i].votes_with_party_pct;
//        var cells = [party, numberOfReps, votesWithParty];
//        for (var j = 0; j < cells.length; j++) {
//            var tableCell = document.createElement("td");
//            tableCell.append(cells[j]);
//            tableRow.append(tableCell);
//        }
//        document.getElementById("topTableBody").append(tableRow);
//    }
//}
//createTopTable();