//name, level, hp, skill, sprite image
var teamMember = [
    {
        id: 0,
        name: "Aqua",
        level: 1,
        hp: 100,
        skill: "Bubble",
        sprite: "../spritePics/alcor.png",
    },
    {
        id: 0,
        name: "Fire",
        level: 1,
        hp: 50,
        skill: "Insertion",
        sprite: "../spritePics/evanF0.png",
    },
    {
        id: 0,
        name: "Earth",
        level: 1,
        hp: 150,
        skill: "Selection",
        sprite: "../spritePics/evanF5.png",
    },
];
var character = [
    {
        id: 0,
        name: "Wind",
        level: 1,
        hp: 100,
        skill: "Heap",
        sprite: "../spritePics/evanF7.png",
    },
    {
        id: 0,
        name: "Light",
        level: 1,
        hp: 50,
        skill: "Quick",
        sprite: "../spritePics/evanF7.png",
    },
    {
        id: 0,
        name: "Dark",
        level: 1,
        hp: 150,
        skill: "Merge",
        sprite: "../spritePics/evanF7.png",
    },
    {
        id: 0,
        name: "Ice",
        level: 1,
        hp: 150,
        skill: "Counting",
        sprite: "../spritePics/evanF7.png",
    },
];
var firstClicked = [];
var view = "pc";

function updateTeamMember(index) {
    $(".team-" + view + "-view .team-profile:eq(" + index + ") .name").text("Name: " + teamMember[index].name);
    $(".team-" + view + "-view .team-profile:eq(" + index + ") .level").text(
        "Level: " + teamMember[index].level + (teamMember[index].level == 49 ? " (MAX)" : "")
    );
    $(".team-" + view + "-view .team-profile:eq(" + index + ") .hp").text("HP: " + teamMember[index].hp);
    $(".team-" + view + "-view .team-profile:eq(" + index + ") .skill").html("Skill: " + teamMember[index].skill);
    $(".team-" + view + "-view .team-profile:eq(" + index + ") img").show();
    if (view == "mobile") {
        $(".team-" + view + "-view .team-profile:eq(" + index + ") .team-image img").attr("src", teamMember[index].sprite);
    } else {
        $(".team-" + view + "-view .team-profile:eq(" + index + ") .card-body img").attr("src", teamMember[index].sprite);
    }
    
    $(".team-" + view + "-view .team-profile:eq(" + index + ") .remove-member").show();
}

function updateTeam() {
    //cancel glow effect of that team member
    $(".team-profile .card").css("box-shadow", "");
    $(".character-list > .card").css("box-shadow", "");
    firstClicked = [];

    $(".team-" + view + "-view .team-profile  p").empty();
    $(".team-" + view + "-view .team-profile img").hide();
    $(".team-" + view + "-view .team-profile .remove-member").hide();

    for (let i = 0; i < teamMember.length; i++) {
        if (teamMember[i] != undefined) {
            updateTeamMember(i);
        }
    }
}

function updateChracterList() {
    //cancel glow effect of that team member
    $(".team-profile .card").css("box-shadow", "");
    $(".character-list > .card").css("box-shadow", "");
    firstClicked = [];

    $(".character-list").empty();
    for (let i = 0; i < character.length; i++) {
        $(".character-list").append('<div class="card"><img src="' + character[i].sprite + ' "></div>');
    }
}

function storeClick(value, property, glow) {
    var temp = {};
    temp[property] = value;
    firstClicked.push(temp);
    $(glow).css("box-shadow", "0 0 10px 10px gold");
    //firstClicked.push({ store: $(event.target).parents(".character-list > .card").index() });
    //$(".character-list > .card:eq(" + firstClicked[0].store + ")").css("box-shadow", "0 0 10px 10px gold");
}

function swapMember(teamIndex, characterIndex) {
    //swap member from team into backup (store)
    if (teamMember[teamIndex] != undefined) {
        [teamMember[teamIndex], character[characterIndex]] = [character[characterIndex], teamMember[teamIndex]];
    } else {
        teamMember[teamIndex] = character[characterIndex];
        character.splice(characterIndex, 1);
    }
    //update team in database/localstorage here
    $.ajax({
        url: "./teamSetting/updateTeamMember.php",
        data: {
            team: jQuery.isEmptyObject(teamMember[teamIndex]) ? null : teamMember[teamIndex].id,
            member: character[characterIndex] == undefined ? null : character[characterIndex].id,
        },
        type: "POST",
        success: function (response) {
            var data = JSON.parse(response);
            //console.log(response);
            if (data.isGuest) {
                var localplayers = JSON.parse(localStorage.getItem("player"));
                if(jQuery.isEmptyObject(teamMember[teamIndex]) == false) {
                    localplayers[teamMember[teamIndex].id].inTeam = 1;
                }
                if (character[characterIndex] != undefined) {
                    localplayers[character[characterIndex].id].inTeam = 0;
                }
                //update localstorage
                localStorage.setItem("player", JSON.stringify(localplayers));
            }
        },
    });
    //update team profile
    updateTeamMember(teamIndex);
    //update character icon
    updateChracterList();
    //cancel glow effect of that team member
    $(".team-profile .card").css("box-shadow", "");
    $(".character-list > .card").css("box-shadow", "");
    //clear firstClicked
    firstClicked = [];
}

$(document).ready(function () {
    $("html, body").animate({ scrollTop: $(".content").offset().top }, {
        duration: 100,
        done: function() {
            if ($("html").innerWidth() <= 820) {
                $("body").css("overflow-y", "");
            } else {
                $("body").css("overflow-y", "hidden");
            }
        }
    });

    if ($(".team-setting-bg").parent(".content").length > 0) {
        $(window).unbind("resize");
        $(window).resize(function () {
            $(".character-detail").hide();
            if ($("html").innerWidth() <= 820) {
                view = "mobile";
                $("body").css("overflow-y", "");
            } else {
                view = "pc";
                $("html, body").animate({ scrollTop: $(".content").offset().top }, {
                    duration: 100,
                    done: function() {
                        $("body").css("overflow-y", "hidden");
                    }
                });
                $
            }
            updateTeam();
            updateChracterList();
        });

        if ($("html").innerWidth() <= 820) {
            view = "mobile";
        } else {
            view = "pc";
        }
    }

    //get team member
    $.ajax({
        url: "./teamSetting/getTeamMember.php",
        method: "POST",
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            if (data.isGuest == true) {
                //query in localstorage
                character = [];
                teamMember = [];
                var allChars = data.allChars;
                var localplayers = JSON.parse(localStorage.getItem("player"));
                for (let i = 0; i < localplayers.length; i++) {
                    var findChar = allChars.find(function (x) {
                        return x.id == localplayers[i].charId;
                    });
                    var charExp = 0;
                    var charLevel = 0;
                    for (let j = 1; j <= 50 && charExp <= localplayers[i].exp; j++) {
                        charExp = Math.round(0.32 * (j - 1) ** 3 + 6.4 * (j - 1) ** 2 + 16 * (j - 1));
                        if (charExp > localplayers[i].exp) {
                            charLevel = j - 1;
                        }
                    }
                    if (charExp > Math.round(0.32 * 49 ** 3 + 6.4 * 49 ** 2 + 16 * 49)) {
                        charLevel = 49;
                    }
                    var charHp = parseInt(findChar.hp) + (charLevel - 1) * 20;
                    var playerData = {
                        id: i,
                        name: findChar.name,
                        level: charLevel,
                        hp: charHp,
                        skill: findChar.skill,
                        sprite: findChar.sprite,
                    };
                    if (localplayers[i].inTeam == 1) {
                        teamMember.push(playerData);
                    } else {
                        character.push(playerData);
                    }
                }
            } else {
                teamMember = data.team;
                character = data.member;
            }
            //gen team and member
            updateTeam();
            updateChracterList();
        },
    });
    //updateTeam();
    //updateChracterList();
});

$(document).mousemove(function () {
    if ($(".character-list > .card:hover").length == 1) {
        var index = $(".character-list > .card:hover").index();
        $(".character-detail .name").text("Name: " + character[index].name);
        $(".character-detail .level").text("Level: " + character[index].level + (character[index].level == 49 ? " (MAX)" : ""));
        $(".character-detail .hp").text("HP: " + character[index].hp);
        $(".character-detail .skill").html("Skill: " + character[index].skill);
        //console.log($(".character-list > .card:hover").offset().top + " vs " + ($(window).height() - $(".character-list > .card:hover").height()));
        if (view == "pc") {
            if (
                $(".character-list > .card:hover").offset().top - $(".team-setting-bg").offset().top >=
                $(window).height() - $(".character-list > .card:hover").height()
            ) {
                $(".character-detail").css("top", $(window).height() - $(".character-list > .card:hover").height());
            } else {
                $(".character-detail").css("top", $(".character-list > .card:hover").offset().top - $(".team-setting-bg").offset().top);
            }
            $(".character-detail").fadeIn(120);
        } else if (view == "mobile") {
            $(".character-detail").css("top", "");
            $(".mobile-view.character-detail").slideDown(120);
        }
    } else {
        if (view == "pc") {
            $(".character-detail").fadeOut(120);
        } else if (view == "mobile") {
            $(".mobile-view.character-detail").slideUp(120);
        }
    }
});

$(".team-setting-bg").click(function (event) {
    //if member in back up is clicked
    if ($(event.target).parents().hasClass("character-list")) {
        if (firstClicked.length == 0) {
            var clickedIndex = $(event.target)
                .parents(".team-" + view + "-view .character-list > .card")
                .index();
            storeClick(clickedIndex, "store", $(".team-" + view + "-view .character-list > .card:eq(" + clickedIndex + ")"));
        } else if (firstClicked[0].team != undefined) {
            swapMember(
                firstClicked[0].team,
                $(event.target)
                    .parents(".team-" + view + "-view .character-list > .card")
                    .index()
            );
        } else if (firstClicked[0].store != undefined) {
            var prevSelected = firstClicked[0].store;
            $(".team-" + view + "-view .character-list > .card:eq(" + firstClicked[0].store + ")").css("box-shadow", "");
            firstClicked = [];
            if (
                $(event.target)
                    .parents(".team-" + view + "-view .character-list > .card")
                    .index() != prevSelected
            ) {
                var clickedIndex = $(event.target)
                    .parents(".team-" + view + "-view .character-list > .card")
                    .index();
                storeClick(clickedIndex, "store", $(".team-" + view + "-view .character-list > .card:eq(" + clickedIndex + ")"));
            }
        }
    } else if ($(event.target).parents().hasClass("team-profile") && !$(event.target).parents().hasClass("remove-member")) {
        if (firstClicked.length == 0) {
            var clickedIndex = $(event.target)
                .parents(".team-" + view + "-view .team-list > .team-profile")
                .index();
            storeClick(clickedIndex, "team", $(".team-" + view + "-view .team-profile:eq(" + clickedIndex + ") .card"));
        } else if (firstClicked[0].store != undefined) {
            swapMember(
                $(event.target)
                    .parents(".team-" + view + "-view .team-list > .team-profile")
                    .index(),
                firstClicked[0].store
            );
        } else if (firstClicked[0].team != undefined) {
            var prevSelected = firstClicked[0].team;
            $(".team-" + view + "-view .team-profile:eq(" + firstClicked[0].team + ") .card").css("box-shadow", "");
            firstClicked = [];
            if (
                $(event.target)
                    .parents(".team-" + view + "-view .team-list > .team-profile")
                    .index() != prevSelected
            ) {
                var clickedIndex = $(event.target).parents(".team-list > .team-profile").index();
                storeClick(clickedIndex, "team", $(".team-" + view + "-view .team-profile:eq(" + clickedIndex + ") .card"));
            }
        }
    }
});

$(".remove-member").click(function () {
    var index = $(this).parents(".team-list > .team-profile").index();
    var removedMember = teamMember[index];
    var playerId = teamMember[index].id;
    //cancel glow effect of that team member
    $(".team-profile .card").css("box-shadow", "");
    $(".character-list > .card").css("box-shadow", "");
    firstClicked = [];
    teamMember.splice(index, 1);
    character.splice(0, 0, removedMember);
    //update team and member here
    $.ajax({
        url: "./teamSetting/updateTeamMember.php",
        data: { team: null, member: playerId },
        type: "POST",
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            if (data.isGuest) {
                var localplayers = JSON.parse(localStorage.getItem("player"));
                localplayers[playerId].inTeam = 0;
                //update localstorage
                localStorage.setItem("player", JSON.stringify(localplayers));
            }
        },
    });
    updateTeam();
    updateChracterList();
});
