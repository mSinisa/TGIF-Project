var app = new Vue({
    
    el: "#app",

    data: {

        url: "https://api.propublica.org/congress/v1/113/house/members.json",
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
                return (a.missed_votes_pct > b.missed_votes_pct) ? 1 : ((b.missed_votes_pct > a.missed_votes_pct) ? -1 : 0);
            });
            //calculate 10percent of members and round the number to have a cut off point
            var num = Math.round(sortedmembers.length * 0.1);
            //if its acsending order
            if (acc) {
                for (var i = 0; i < num; i++) {
                //push first 11 senators to top10Pct array
                    this.top10Pct.push(sortedmembers[i]);
                }
                for (var j = num; j < sortedmembers.length; j++) {
            //check if the 12th and onward senators have the same missed votes pct as the 11th and if they do add them to top10 array
                    if (sortedmembers[j].missed_votes_pct === sortedmembers[num - 1].missed_votes_pct) {
                        this.top10Pct.push(sortedmembers[j]);
                    }
                }

            } else {
                //starting from the back of the array conting down and getting first 11 senators into bottom10Pct array
                for (var k = sortedmembers.length - 1; k > sortedmembers.length - num - 1; k--) {
                    this.bottom10Pct.push(sortedmembers[k]);
                }
                for (var l = sortedmembers.length - num - 1; l > 0; l--) {
        //check if the 12th and onward senators have the same missed votes pct as the 11th and if they do add them to bottom10 arr
                    if (sortedmembers[l].missed_votes_pct === sortedmembers[sortedmembers.length - num].missed_votes_pct) {
                        this.bottom10Pct.push(sortedmembers[l]);
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