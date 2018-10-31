var app = new Vue({
    
    el: "#app",

    data: {

        url: "",
        /* "https://api.propublica.org/congress/v1/113/house/members.json" */
        members: [],
        statistics: {

            "parties": [
                {
                    "party": "Democrats",
                    "number_of_members": 0,
                    "votes_with_party_pct": 0
        },
                {
                    "party": "Republicans",
                    "number_of_members": 0,
                    "votes_with_party_pct": 0
        },
                {
                    "party": "Independents",
                    "number_of_members": 0,
                    "votes_with_party_pct": 0
        },
                {
                    "party": "Total",
                    "number_of_members": 0,
                    "votes_with_party_pct": 0
            }
        ]
        },

        bottom10Pct: [],
        top10Pct: []

    },

    methods: {

        getData: function () {
            fetch(this.url, {
                    headers: {
                        "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
                    }
                })
                .then(function (data) {
                    return data.json();
                })
                .then(function (myData) {
                    app.members = myData.results[0].members;
                    app.getTopTableInfo();
                    app.getBottomAndTop10Pct(true);
                    app.getBottomAndTop10Pct(false);

                })
        },

        getTopTableInfo: function () {
            for (var i = 0; i < this.members.length; i++) {
                if (this.members[i].party === "D") {
                    this.statistics.parties[0].number_of_members += 1;
                    this.statistics.parties[0].votes_with_party_pct += this.members[i].votes_with_party_pct;
                } else if (this.members[i].party === "R") {
                    this.statistics.parties[1].number_of_members += 1;
                    this.statistics.parties[1].votes_with_party_pct += this.members[i].votes_with_party_pct;
                } else if (this.members[i].party === "I") {
                    this.statistics.parties[2].number_of_members += 1;
                    this.statistics.parties[2].votes_with_party_pct += this.members[i].votes_with_party_pct;
                }
                this.statistics.parties[3].votes_with_party_pct += this.members[i].votes_with_party_pct;
            }
            this.statistics.parties[0].votes_with_party_pct = (this.statistics.parties[0].votes_with_party_pct / this.statistics.parties[0].number_of_members).toFixed();
            this.statistics.parties[1].votes_with_party_pct = (this.statistics.parties[1].votes_with_party_pct / this.statistics.parties[1].number_of_members).toFixed();
            this.statistics.parties[3].number_of_members = this.members.length;
            if (this.statistics.parties[2].number_of_members == 0) {
                this.statistics.parties[2].votes_with_party_pct = 0;
                this.statistics.parties[3].votes_with_party_pct = ( (Number(this.statistics.parties[0].votes_with_party_pct) + Number(this.statistics.parties[1].votes_with_party_pct)) / 2).toFixed();
            } else {
                this.statistics.parties[2].votes_with_party_pct = (this.statistics.parties[2].votes_with_party_pct / this.statistics.parties[2].number_of_members).toFixed();
                this.statistics.parties[3].votes_with_party_pct = (this.statistics.parties[3].votes_with_party_pct / this.members.length).toFixed();
            }

     
        },

        getBottomAndTop10Pct: function (acc) {
            //sort array or senators by missed votes pct
            var sortedmembers = Array.from(this.members);
            sortedmembers.sort(function (a, b) {
                return (a.votes_with_party_pct > b.votes_with_party_pct) ? 1 : ((b.votes_with_party_pct > a.votes_with_party_pct) ? -1 : 0);
            });
            //calculate 10percent of members and round the number to have a cut off point
            var num = Math.round(sortedmembers.length * 0.1);
            //if its acsending order
            if (acc) {
                for (var i = 0; i < num; i++) {
                //push first 11 senators to top10Pct array
                    this.bottom10Pct.push(sortedmembers[i]);
                }
                for (var j = num; j < sortedmembers.length; j++) {
            //check if the 12th and onward senators have the same missed votes pct as the 11th and if they do add them to top10 array
                    if (sortedmembers[j].votes_with_party_pct === sortedmembers[num - 1].votes_with_party_pct) {
                        this.bottom10Pct.push(sortedmembers[j]);
                    }
                }

            } else {
                //starting from the back of the array conting down and getting first 11 senators into bottom10Pct array
                for (var k = sortedmembers.length - 1; k > sortedmembers.length - num - 1; k--) {
                    this.top10Pct.push(sortedmembers[k]);
                }
                for (var l = sortedmembers.length - num - 1; l > 0; l--) {
        //check if the 12th and onward senators have the same missed votes pct as the 11th and if they do add them to bottom10 arr
                    if (sortedmembers[l].votes_with_party_pct === sortedmembers[sortedmembers.length - num].votes_with_party_pct) {
                        this.top10Pct.push(sortedmembers[l]);
                    }
                }
            }

        }

    },

    computed: {

    },

    created: function () {
        this.getData();

    }

});


//
//fetch(url, {
//        headers: {
//            "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
//        }
//    })
//    .then(function (data) {
//        return data.json();
//    })
//    .then(function (myData) {
//        console.log(myData);
//        var membersHouse = myData.results[0].members;

//        getMembersFromParties(membersHouse);
//        fillTheObject();
//        getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse(membersHouse), true);
//        getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse(membersHouse), false);
//        createLeastAndMostEngagedTables("leastEngagedHouse", bottom10PctMembersByMissedVotesHouse);
//        createLeastAndMostEngagedTables("mostEngagedHouse", top10PctMembersByMissedVotesHouse);
//        createTopTable(statisticsHouse, "topTableBodyHouse");
//    })

//function getMembersFromParties(membersHouse) {
//    //loop through all members 
//    for (var i = 0; i < membersHouse.length; i++) {
//        //if they are democrats
//        if (membersHouse[i].party === "D") {
//            //make an array of democrats
//            democrats.push(membersHouse[i]);
//            //make an array or percentage votes for democrats
//            allDemocratsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
//        } else if (membersHouse[i].party === "R") {
//            republicans.push(membersHouse[i]);
//            allRepublicansVotedPercantages.push(membersHouse[i].votes_with_party_pct);
//        } else {
//            independents.push(membersHouse[i]);
//            allIndependentsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
//        }
//    }
//}
//
//
//function fillTheObject() {
//    statisticsHouse = {
//        "parties": [
//            {
//                "party": "Democrats",
//                "number_of_members": democrats.length,
//                "votes_with_party_pct": partyPctVoted(allDemocratsVotedPercantages) + " %"
//        },
//            {
//                "party": "Republicans",
//                "number_of_members": republicans.length,
//                "votes_with_party_pct": partyPctVoted(allRepublicansVotedPercantages) + " %"
//        },
//            {
//                "party": "Independents",
//                "number_of_members": independents.length,
//                "votes_with_party_pct": partyPctVoted(allIndependentsVotedPercantages) + " %"
//        },
//            {
//                "party": "Total",
//                "number_of_members": democrats.length + republicans.length + independents.length,
//                "votes_with_party_pct": 0
//            }
//        ]
//    }
//    getTotalAvgPercentage(statisticsHouse);
//}
//
//function partyPctVoted(arr) {
//    var sum = 0;
//    if (arr.length === 0) {
//        return (0.00);
//    } else {
//        for (var i = 0; i < arr.length; i++) {
//            sum = sum + arr[i];
//        }
//    }
//    var average = Math.round(sum / arr.length);
//    return average;
//}
//
//
////sort array of members by missed votes pct
//function sortMembersByMissedVotesHouse(membersHouse) {
//    var allMembers = Array.from(membersHouse);
//    allMembers.sort(function (a, b) {
//        return (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0);
//    });
//    return allMembers;
//}
//
//function getBottomAndTop10PctAttendanceHouse(sortMembersByMissedVotesHouse, acc) {
//    //calculate 10percent of members and round the number to have a cut off point
//    var num = Math.round(sortMembersByMissedVotesHouse.length * 0.1);
//    if (acc) {
//        for (var i = 0; i < num; i++) {
//            top10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[i]);
//        }
//
//        for (var j = num; j < sortMembersByMissedVotesHouse.length; j++) {
//            if (sortMembersByMissedVotesHouse[j].missed_votes_pct === sortMembersByMissedVotesHouse[num - 1].missed_votes_pct) {
//                top10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[j]);
//            }
//        }
//    } else {
//
//        for (var k = sortMembersByMissedVotesHouse.length - 1; k > sortMembersByMissedVotesHouse.length - num - 1; k--) {
//            bottom10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[k]);
//        }
//        for (var l = sortMembersByMissedVotesHouse.length - num - 1; l > 0; l--) {
//            if (sortMembersByMissedVotesHouse[l].missed_votes_pct === sortMembersByMissedVotesHouse[sortMembersByMissedVotesHouse.length - num].missed_votes_pct) {
//                bottom10PctMembersByMissedVotesHouse.push(sortMembersByMissedVotesHouse[l]);
//            }
//        }
//    }
//}
//
////TABLES
//function createTopTable(statisticsHouse, idname) {
//    var parties = statisticsHouse.parties;
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
//        document.getElementById(idname).append(tableRow);
//    }
//}
//
//
//function createLeastAndMostEngagedTables(idname, arr) {
//    for (var i = 0; i < arr.length; i++) {
//        var tableRow = document.createElement("tr");
//        var firstName = arr[i].first_name;
//        var middleName = arr[i].middle_name;
//        //some members don't have middle names
//        if (middleName === null) {
//            middleName = "";
//        }
//        var lastName = arr[i].last_name;
//        var completeName = firstName + " " + middleName + " " + lastName;
//        var numMissedVotes = arr[i].missed_votes;
//        var pctMissedVotes =arr[i].missed_votes_pct + " %";
//        var cells = [completeName, numMissedVotes, pctMissedVotes];
//        for (var j = 0; j < cells.length; j++) {
//            var tableCell = document.createElement("td");
//            tableCell.append(cells[j]);
//            tableRow.append(tableCell);
//        }
//        document.getElementById(idname).append(tableRow);
//    }
//}
//
//function getTotalAvgPercentage(statisticsHouse) {
//    if (statisticsHouse.parties[2].number_of_members == 0) {
//        statisticsHouse.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages)) / 2)+ " %") ;
//    } else {
//        statisticsHouse.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages) + partyPctVoted(allIndependentsVotedPercantages)) / 3)+ " %")
//    }
//}







//var membersHouse;
//var url = "https://api.propublica.org/congress/v1/113/house/members.json";
////TOTAL NUMBER OF MEMBERS
//var democrats = [];
//var republicans = [];
//var independents = [];
////VOTED WITH PARTY ALL PERCENTAGES
//var allDemocratsVotedPercantages = [];
//var allRepublicansVotedPercantages = [];
//var allIndependentsVotedPercantages = [];
////PARTY LOYALTY 10% 
//var statisticsHouse;
//var bottom10PctMembersByVotesWithPartyHouse = [];
//var top10PctMembersByVotesWithPartyHouse = [];


//fetch(url, {
//        headers: {
//            "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
//        }
//    })
//    .then(function (data) {
//        return data.json();
//    })
//    .then(function (myData) {
//        console.log(myData);
//        membersHouse = myData.results[0].members;
//
//        getMembersFromParties(membersHouse);
//        fillTheObject();
//        partyPctVoted(allDemocratsVotedPercantages);
//        partyPctVoted(allRepublicansVotedPercantages);
//        partyPctVoted(allIndependentsVotedPercantages);
//        getBottomAndTop10PctLoyaltyHouse(sortMembersByVotesWithPartyPctHouse(), true);
//        getBottomAndTop10PctLoyaltyHouse(sortMembersByVotesWithPartyPctHouse(), false);
//        createLeastAndMostLoyalTables("houseLeastLoyalTable", bottom10PctMembersByVotesWithPartyHouse);
//        createLeastAndMostLoyalTables("houseMostLoyalTable", top10PctMembersByVotesWithPartyHouse);
//        createTopTableHouse(statisticsHouse, "houseLoyaltyTable");
//
//    })
//
//function getMembersFromParties(membersHouse) {
//    //loop through all members 
//    for (var i = 0; i < membersHouse.length; i++) {
//        //if they are democrats
//        if (membersHouse[i].party === "D") {
//            //make an array of democrats
//            democrats.push(membersHouse[i]);
//            //make an array or percentage votes for democrats
//            allDemocratsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
//        } else if (membersHouse[i].party === "R") {
//            republicans.push(membersHouse[i]);
//            allRepublicansVotedPercantages.push(membersHouse[i].votes_with_party_pct);
//        } else {
//            independents.push(membersHouse[i]);
//            allIndependentsVotedPercantages.push(membersHouse[i].votes_with_party_pct);
//        }
//    }
//}
//
//function fillTheObject() {
//    statisticsHouse = {
//        "parties": [
//            {
//                "party": "Democrats",
//                "number_of_members": democrats.length,
//                "votes_with_party_pct": partyPctVoted(allDemocratsVotedPercantages) + " %"
//        },
//            {
//                "party": "Republicans",
//                "number_of_members": republicans.length,
//                "votes_with_party_pct": partyPctVoted(allRepublicansVotedPercantages) + " %"
//        },
//            {
//                "party": "Independents",
//                "number_of_members": independents.length,
//                "votes_with_party_pct": partyPctVoted(allIndependentsVotedPercantages) + " %"
//        },
//            {
//                "party": "Total",
//                "number_of_members": democrats.length + republicans.length + independents.length,
//                "votes_with_party_pct": 0
//            }
//        ]
//    }
//    getTotalAvgPercentage(statisticsHouse);
//}
//
//function partyPctVoted(arr) {
//    var sum = 0;
//    if (arr.length === 0) {
//        return (0.00);
//    } else {
//        for (var i = 0; i < arr.length; i++) {
//            sum = sum + arr[i];
//        }
//    }
//    var average =Math.round(sum / arr.length);
//    return average;
//}
//
//
////sort array of members by votes with party pct
//function sortMembersByVotesWithPartyPctHouse() {
//    var allMembers = Array.from(membersHouse);
//    allMembers.sort(function (a, b) {
//        return (a.votes_with_party_pct > b.votes_with_party_pct) ? 1 : ((b.votes_with_party_pct > a.votes_with_party_pct) ? -1 : 0);
//    });
//    return allMembers;
//}
//
//
//function getBottomAndTop10PctLoyaltyHouse(sortMembersByVotesWithPartyPctHouse, acc) {
//    //calculate 10percent of members and round the number to have a cut off point
//    var num = Math.round(sortMembersByVotesWithPartyPctHouse.length * 0.1);
//    if (acc) {
//        for (var i = 0; i < num; i++) {
//            bottom10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[i]);
//        }
//
//        for (var j = num; j < sortMembersByVotesWithPartyPctHouse.length; j++) {
//            if (sortMembersByVotesWithPartyPctHouse[j].votes_with_party_pct === sortMembersByVotesWithPartyPctHouse[num - 1].missed_votes_pct) {
//                bottom10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[j]);
//            }
//        }
//    } else {
//
//        for (var k = sortMembersByVotesWithPartyPctHouse.length - 1; k > sortMembersByVotesWithPartyPctHouse.length - num - 1; k--) {
//            top10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[k]);
//        }
//        for (var l = sortMembersByVotesWithPartyPctHouse.length - num - 1; l > 0; l--) {
//            if (sortMembersByVotesWithPartyPctHouse[l].votes_with_party_pct === sortMembersByVotesWithPartyPctHouse[sortMembersByVotesWithPartyPctHouse.length - num].votes_with_party_pct) {
//                top10PctMembersByVotesWithPartyHouse.push(sortMembersByVotesWithPartyPctHouse[l]);
//            }
//        }
//    }
//}
//
////TABLES
//function createTopTableHouse(statisticsHouse, idname) {
//    var parties = statisticsHouse.parties
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
//        document.getElementById(idname).append(tableRow);
//    }
//}
//
//
//function createLeastAndMostLoyalTables(idname, arr) {
//    for (var i = 0; i < arr.length; i++) {
//        var tableRow = document.createElement("tr");
//        var firstName = arr[i].first_name;
//        var middleName = arr[i].middle_name;
//        //some members don't have middle names
//        if (middleName === null) {
//            middleName = "";
//        }
//        var lastName = arr[i].last_name;
//        var completeName = firstName + " " + middleName + " " + lastName;
//        var numMissedVotes = arr[i].total_votes;
//        var pctMissedVotes = arr[i].votes_with_party_pct + " %";
//        var cells = [completeName, numMissedVotes, pctMissedVotes];
//        for (var j = 0; j < cells.length; j++) {
//            var tableCell = document.createElement("td");
//            tableCell.append(cells[j]);
//            tableRow.append(tableCell);
//        }
//        document.getElementById(idname).append(tableRow);
//    }
//}
//
//function getTotalAvgPercentage(statisticsHouse) {
//    if (statisticsHouse.parties[2].number_of_members == 0) {
//        statisticsHouse.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages)) / 2)+ " %") ;
//    } else {
//        statisticsHouse.parties[3].votes_with_party_pct = (((partyPctVoted(allDemocratsVotedPercantages) + partyPctVoted(allRepublicansVotedPercantages) + partyPctVoted(allIndependentsVotedPercantages)) / 3)+ " %")
//    }
//}