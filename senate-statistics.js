var app = new Vue({
    
    el: "#app",

    data: {

        url: "https://api.propublica.org/congress/v1/113/senate/members.json",
        senators: [],
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
                    app.senators = myData.results[0].members;
                    app.getTopTableInfo();
                    app.getBottomAndTop10Pct(true);
                    app.getBottomAndTop10Pct(false);

                })
        },

        getTopTableInfo: function () {
            //run a loop through all senators
            for (var i = 0; i < this.senators.length; i++) {
                //if they are democrats 
                if (this.senators[i].party === "D") {
                    //access their location in statistics and start adding each member to the total
                    this.statistics.parties[0].number_of_members += 1;
                    //also locate the votes with party pct in the object and start adding all percentages
                    this.statistics.parties[0].votes_with_party_pct += this.senators[i].votes_with_party_pct;
                } else if (this.senators[i].party === "R") {
                    this.statistics.parties[1].number_of_members += 1;
                    this.statistics.parties[1].votes_with_party_pct += this.senators[i].votes_with_party_pct;
                } else if (this.senators[i].party === "I") {
                    this.statistics.parties[2].number_of_members += 1;
                    this.statistics.parties[2].votes_with_party_pct += this.senators[i].votes_with_party_pct;
                }
                //total that adds all party percentages-later we will need to divide it by number of mem for avg
                this.statistics.parties[3].votes_with_party_pct += this.senators[i].votes_with_party_pct;
            }
            //dividing total percentages number by number of members to get the avg pct and add toFixed to round
            //the number and add a string with %
            this.statistics.parties[0].votes_with_party_pct = (this.statistics.parties[0].votes_with_party_pct / this.statistics.parties[0].number_of_members).toFixed();
            this.statistics.parties[1].votes_with_party_pct = (this.statistics.parties[1].votes_with_party_pct / this.statistics.parties[1].number_of_members).toFixed();
            this.statistics.parties[2].votes_with_party_pct = (this.statistics.parties[2].votes_with_party_pct / this.statistics.parties[2].number_of_members).toFixed();
            //total number of members= senators array lenght
            this.statistics.parties[3].number_of_members = this.senators.length;
            //since independents might be equal to 0 adding an if statement for it
            if (this.statistics.parties[2].number_of_members == 0) {
                this.statistics.parties[3].votes_with_party_pct = ((this.statistics.parties[0].votes_with_party_pct + this.statistics.parties[1].votes_with_party_pct) / 2).toFixed();
            } else {
                this.statistics.parties[3].votes_with_party_pct = (this.statistics.parties[3].votes_with_party_pct / this.senators.length).toFixed();
            }
        },

        getBottomAndTop10Pct: function (acc) {
            //sort array or senators by missed votes pct
            var sortedSenators = Array.from(this.senators);
            sortedSenators.sort(function (a, b) {
                return (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0);
            });
            //calculate 10percent of members and round the number to have a cut off point
            var num = Math.round(sortedSenators.length * 0.1);
            //if its acsending order
            if (acc) {
                for (var i = 0; i < num; i++) {
                //push first 11 senators to top10Pct array
                    this.top10Pct.push(sortedSenators[i]);
                }
                for (var j = num; j < sortedSenators.length; j++) {
            //check if the 12th and onward senators have the same missed votes pct as the 11th and if they do add them to top10 array
                    if (sortedSenators[j].missed_votes_pct === sortedSenators[num - 1].missed_votes_pct) {
                        this.top10Pct.push(sortedSenators[j]);
                    }
                }

            } else {
                //starting from the back of the array conting down and getting first 11 senators into bottom10Pct array
                for (var k = sortedSenators.length - 1; k > sortedSenators.length - num - 1; k--) {
                    this.bottom10Pct.push(sortedSenators[k]);
                }
                for (var l = sortedSenators.length - num - 1; l > 0; l--) {
        //check if the 12th and onward senators have the same missed votes pct as the 11th and if they do add them to bottom10 arr
                    if (sortedSenators[l].missed_votes_pct === sortedSenators[sortedSenators.length - num].missed_votes_pct) {
                        this.bottom10Pct.push(sortedSenators[l]);
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
