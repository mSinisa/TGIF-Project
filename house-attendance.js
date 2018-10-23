//var membersHouse = dataHouse.results[0].members;
var url = "https://api.propublica.org/congress/v1/113/house/members.json";
//TOTAL NUMBER OF MEMBERS
var democrats = [];
var republicans = [];
var independents = [];
//VOTED WITH PARTY ALL PERCENTAGES
var allDemocratsVotedPercantages = [];
var allRepublicansVotedPercantages = [];
var allIndependentsVotedPercantages = [];
var statisticsHouse;
//PARTY ENGAGEDMENT 10% ATTENDANCE 
var bottom10PctMembersByMissedVotesHouse = [];
var top10PctMembersByMissedVotesHouse = [];

fetch(url, {
        headers: {
            "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
        }
    })
    .then(function (data) {
        return data.json();
    })
    .then(function (myData) {
        console.log(myData);
        var membersHouse = myData.results[0].members;

        getMembersFromParties(membersHouse);
        fillTheObject();
        getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse(membersHouse), true);
        getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse(membersHouse), false);
        createLeastAndMostEngagedTables("leastEngagedHouse", bottom10PctMembersByMissedVotesHouse);
        createLeastAndMostEngagedTables("mostEngagedHouse", top10PctMembersByMissedVotesHouse);
        createTopTable(statisticsHouse, "topTableBodyHouse");
    })

function getMembersFromParties(membersHouse) {
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


function fillTheObject() {
    statisticsHouse = {
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

function partyPctVoted(arr) {
    var sum = 0;
    if (arr.length === 0) {
        return (0.00 + " %");
    } else {
        for (var i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }
    }
    var average = Math.round(sum / arr.length) + " %";
    return average;
}


//sort array of members by missed votes pct
function sortMembersByMissedVotesHouse(membersHouse) {
    var allMembers = Array.from(membersHouse);
    allMembers.sort(function (a, b) {
        return (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0);
    });
    return allMembers;
}

function getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse, acc) {
    //calculate 10percent of members and round the number to have a cut off point
    var num = Math.round(sortMembersByMissedVotesHouse.length * 0.1);
    if (acc) {
        for (var i = 0; i < num; i++) {
            top10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[i]);
        }

        for (var j = num; j < sortMembersByMissedVotesHouse.length; j++) {
            if (sortMembersByMissedVotesHouse[j].missed_votes_pct === sortMembersByMissedVotesHouse[num - 1].missed_votes_pct) {
                top10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[j]);
            }
        }
    } else {

        for (var k = sortMembersByMissedVotesHouse.length - 1; k > sortMembersByMissedVotesHouse.length - num - 1; k--) {
            bottom10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[k]);
        }
        for (var l = sortMembersByMissedVotesHouse.length - num - 1; l > 0; l--) {
            if (sortMembersByMissedVotesHouse[l].missed_votes_pct === sortMembersByMissedVotesHouse[sortMembersByMissedVotesHouse.length - num].missed_votes_pct) {
                bottom10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[l]);
            }
        }
    }
}

//TABLES
function createTopTable(statisticsHouse, idname) {
    var parties = statisticsHouse.parties;
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


function createLeastAndMostEngagedTables(idname, arr) {
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
