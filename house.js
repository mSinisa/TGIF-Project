var app = new Vue({

    el: "#app",

    data: {

        url: "https://api.propublica.org/congress/v1/113/house/members.json",
        congressmen: [],
        checkedCheckboxes: [],
        options: "All"

    },

    methods: {

        getDataHouse: function () {
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
                    app.congressmen = myData.results[0].members;
                })
        }
    },

    computed: {

        states: function () {
            return [...new Set(this.congressmen.map((congressman) => congressman.state).sort())]
        },

        filterCheckedMembers: function () {
            var filteredMembers = [];
            if (this.checkedCheckboxes.length === 0 && this.options === "All") {
                return this.congressmen;
            } else {
                for (var i = 0; i < this.congressmen.length; i++) {
                    if (this.checkedCheckboxes.length === 0 && (this.options === "All" || this.options === this.congressmen[i].state)) {
                        filteredMembers.push(this.congressmen[i]);
                    } else {
                        for (var j = 0; j < this.checkedCheckboxes.length; j++) {
                            if ((this.congressmen[i].party === this.checkedCheckboxes[j]) && (this.options === "All" || this.options === this.congressmen[i].state)) {
                                filteredMembers.push(this.congressmen[i]);
                            }
                        }
                    }
                }
                return filteredMembers;
            }
        }
    },

    created: function () {
        this.getDataHouse();
    }

});