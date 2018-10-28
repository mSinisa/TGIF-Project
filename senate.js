//AJAX - Asincrone, this code needs some time to execute.  
var app = new Vue({
    el: "#app",

    data: {

        url: "https://api.propublica.org/congress/v1/113/senate/members.json",
        senators: [],
        checkedCheckboxes: [],
        options: "All"

    },

    methods: {

        getData: function () {
            console.log(this);
            fetch(this.url, {
                    headers: {
                        "X-API-Key": "B0XqY0T7xhm1JCRGP4GMP96DmFErfu3wWcm2uu4O"
                    }
                })
                .then(function (data) {
                    return data.json();
                })
                .then(function (myData) {
                    console.log(this);
                    app.senators = myData.results[0].members;
                })
        }

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
    },

    created: function () {
        this.getData();
    }
});