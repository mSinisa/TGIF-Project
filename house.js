var app = new Vue({

    el: "#app",

    data: {

        url: "https://api.propublica.org/congress/v1/113/house/members.json",
        members: [],
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
                    app.members = myData.results[0].members;
                })
        }
    },

    computed: {

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
                    } else {
                        for (var j = 0; j < this.checkedCheckboxes.length; j++) {
                            if ((this.members[i].party === this.checkedCheckboxes[j]) && (this.options === "All" || this.options === this.members[i].state)) {
                                filteredMembers.push(this.members[i]);
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