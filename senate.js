//AJAX - Asincrone, this code needs some time to execute.  
var app = new Vue({

    el: "#app",

    data: {

        url: "",
        /*"https://api.propublica.org/congress/v1/113/senate/members.json"*/
        members: [],
        checkedCheckboxes: [],
        options: "All",
        dataOptions: "",

        statistics: {

            "parties": [{
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
        top10Pct: [],
        bottom10PctLoyalty: [],
        top10PctLoyalty: []

    },

    methods: {

        webInit: function () {
            var pageLocation = window.location.pathname;
            switch (pageLocation) {

                case "/senate-data.html":
                    pageLocation = "senate";
                    this.dataOptions = "filters"
                    break;

                case "/house-data.html":
                    pageLocation = "house";
                    this.dataOptions = "filters"
                    break;

                case "/senate-party-loyalty.html":
                    pageLocation = "senate";
                    this.dataOptions = "loyalty"
                    break;

                case "/house-party-loyalty.html":
                    pageLocation = "house";
                    this.dataOptions = "loyalty"
                    break;

                case "/senate-attendance.html":
                    pageLocation = "senate";
                    this.dataOptions = "attendance"
                    break;

                case "/house-attendance.html":
                    pageLocation = "house";
                    this.dataOptions = "attendance"
                    break;

                case "/index.html":
                    this.dataOptions = "home"
                    break;

                case "/":
                    this.dataOptions = "home"
                    break;

            }

            this.url = "https://api.propublica.org/congress/v1/113/" + pageLocation + "/members.json";

        },

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
                    //if (this.dataOptions === "attendance") 
                    //app.members = myData.results[0].members;
                    app.getTopTableInfo();
                    app.top10Pct = app.getBottomAndTop10Pct(true, "missed_votes_pct");
                    app.bottom10Pct = app.getBottomAndTop10Pct(false, "missed_votes_pct");
                    app.top10PctLoyalty = app.getBottomAndTop10Pct(true, "votes_with_party_pct");
                    app.bottom10PctLoyalty = app.getBottomAndTop10Pct(false, "votes_with_party_pct");

                })
        },

        /*******  SENATE AND HOUSE ATTENDANCE ******/
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
            this.statistics.parties[0].votes_with_party_pct = (this.statistics.parties[0].votes_with_party_pct / this.statistics.parties[0].number_of_members).toFixed(2);
            this.statistics.parties[1].votes_with_party_pct = (this.statistics.parties[1].votes_with_party_pct / this.statistics.parties[1].number_of_members).toFixed(2);
            this.statistics.parties[3].number_of_members = this.members.length;
            if (this.statistics.parties[2].number_of_members == 0) {
                this.statistics.parties[2].votes_with_party_pct = 0;
                this.statistics.parties[3].votes_with_party_pct = ((Number(this.statistics.parties[0].votes_with_party_pct) + Number(this.statistics.parties[1].votes_with_party_pct)) / 2).toFixed(2);
            } else {
                this.statistics.parties[2].votes_with_party_pct = (this.statistics.parties[2].votes_with_party_pct / this.statistics.parties[2].number_of_members).toFixed(2);
                this.statistics.parties[3].votes_with_party_pct = (this.statistics.parties[3].votes_with_party_pct / this.members.length).toFixed(2);
            }
        },

        getBottomAndTop10Pct: function (acc, key) {
            var filtered = [];
            //sort array or members by missed votes pct
            /* key- missed_votes percentage and votes_with_party_pac*/
            /* arr for party attendence top10Pct then bottom10Pct and for loyalty pages reverse*/
            var sortedmembers = Array.from(this.members);
            sortedmembers.sort(function (a, b) {
                return (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
            });
            console.log(sortedmembers);
            //calculate 10percent of members and round the number to have a cut off point
            var num = Math.round(sortedmembers.length * 0.1);
            //if its acsending order
            if (acc) {
                for (var i = 0; i < num; i++) {
                    //push first 11 members to top10Pct array
                    filtered.push(sortedmembers[i]);
                }
                for (var j = num; j < sortedmembers.length; j++) {
                    //check if the 12th and onward members have the same missed votes pct as the 11th and if they do add them to top10 array
                    if (sortedmembers[j][key] == filtered[num - 1][key]) {
                        filtered.push(sortedmembers[j]);

                    }
                }

            } else {

                //starting from the back of the array conting down and getting first 11 members into bottom10Pct array
                for (var k = sortedmembers.length - 1; k > sortedmembers.length - num - 1; k--) {
                    filtered.push(sortedmembers[k]);
                }
                for (var l = sortedmembers.length - num - 1; l > 0; l--) {
                    //check if the 12th and onward members have the same missed votes pct as the 11th and if they do add them to bottom10 arr
                    if (sortedmembers[l][key] === sortedmembers[sortedmembers.length - num][key]) {
                        filtered.push(sortedmembers[l]);
                    }
                }
            }
            return filtered;
        },

        hideAndShowText: function (id1, id2, id3) {

            var dots = document.getElementById(id1);
            var moreText = document.getElementById(id2);
            var btnText = document.getElementById(id3);

            if (dots.style.display === "none") {
                dots.style.display = "inline";
                btnText.innerHTML = "+ Read more";
                moreText.style.display = "none";
            } else {
                dots.style.display = "none";
                btnText.innerHTML = "- Read less";
                moreText.style.display = "inline";
            }

        }

    },

    computed: {
        /*****  FILTER PAGE ******/
        states: function () {
            return [...new Set(this.members.map((member) => member.state).sort())]
        },

        filterCheckedMembers: function () {
            var filteredMembers = [];
            if (this.checkedCheckboxes.length === 0 && this.options === "All") {
                return this.members;
            } else {
                for (var i = 0; i < this.members.length; i++) {
                    if (this.checkedCheckboxes.length === 0 && (this.options === "All" || this.options === this.members[i].state)) {
                        filteredMembers.push(this.members[i]);
                        document.getElementById("messageDisplay").style.display = "none";
                    } else {
                        for (var j = 0; j < this.checkedCheckboxes.length; j++) {
                            if ((this.members[i].party === this.checkedCheckboxes[j]) && (this.options === "All" || this.options === this.members[i].state)) {
                                filteredMembers.push(this.members[i]);
                                document.getElementById("messageDisplay").style.display = "none";
                            } else if (filteredMembers.length == 0) {
                                document.getElementById("messageDisplay").style.display = "block";
                            } else if (filteredMembers.length > 0) {
                                document.getElementById("messageDisplay").style.display = "none";
                            }
                        }
                    }
                }
                return filteredMembers;
            }
        },


    },

    created: function () {
        this.webInit();
        if (this.dataOptions !== "home") {
            this.getData();
        }

        if (document.getElementById("messageDisplay")) {
            document.getElementById("messageDisplay").style.display = "none";
        }
    },
    mounted: function () {

    }
});