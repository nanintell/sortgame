var chapterList = [
    {
        title: "Chapter 1: Strange World",
        stage: [
            {
                title: "Stage 1: Strange Creature",
                quest: [
                    {
                        id: 0,
                        title: "Quest 1-1: Beginning",
                        quest_desc: "You find yourself in a strange place. What happened here?",
                        star: "000",
                        type: "story",
                        require: null,
                        battle_desc: null,
                    },
                    {
                        id: 1,
                        title: "Quest 1-2: Let's battle",
                        quest_desc: "Monsters suddenly appear.",
                        require: 0,
                        star: "000",
                        type: "battle",
                        battle_desc: {
                            desc: "Bubble sort is about swapping elements but how can you know which elements to swap?",
                            element: { fire: "Nu", water: "Wk", earth: "Nu", wind: "Nu", light: "Nu", dark: "Nu", ice: "Nu" },
                            wave: 4,
                        },
                    },
                    {
                        id: 2,
                        title: "Quest 1-3: Question from the guardian",
                        quest_desc: "Water guardian stands on your way. Answer his riddle.",
                        require: 1,
                        star: "000",
                        type: "quiz",
                        battle_desc: null,
                    },
                ],
            },
        ],
    },
];
//note that star is in string not array
var questList = [];
var questCat = [];

var firstExpandStage = 0;
var firstExpandChapter = 0;

var openedQuest = undefined;

function updateDesc(id) {
    if (id == undefined || isNaN(id)) return;

    $(".quest-detail h4").text(questList[id].title);
    $(".quest-detail .quest-desc").text(questList[id].quest_desc);
    $(".quest-detail .exp-reward").text((questList[id].type == "battle" || questList[id].type == "quiz" ? "Starting from " : "") + questList[id].exp);
    var reqQuest = questList.find(function (quest) {
        return quest.id == questList[id].require;
    });
    $(".quest-detail .quest-req").text(reqQuest == undefined ? "-" : reqQuest.title);
    if (questList[id].battle_desc == null) {
        $(".quest-detail .battle-detail").html("-");
    } else {
        $(".quest-detail .battle-detail").html("");
        $(".quest-detail .battle-detail").append("<p>" + questList[id].battle_desc.desc + "</p>");
        $(".quest-detail .battle-detail").append('<p class="font-weight-bold">Enemies’ element affinities</p>');
        $(".quest-detail .battle-detail").append(
            '<table class="table table-sm table-bordered"><tbody><tr>' +
                '<td class="text-center"><img src="../elementPic/water.png" width="30px"></td>' +
                '<td class="text-center"><img src="../elementPic/fire.png" width="30px"></td>' +
                '<td class="text-center"><img src="../elementPic/earth.png" width="30px"></td>' +
                '<td class="text-center"><img src="../elementPic/wind.png" width="30px"></td>' +
                '<td class="text-center"><img src="../elementPic/dark.png" width="30px"></td>' +
                '<td class="text-center"><img src="../elementPic/light.png" width="30px"></td>' +
                '<td class="text-center"><img src="../elementPic/ice.png" width="30px"></td>' +
                "</tr><tr>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Water == null ? "??" : questList[id].battle_desc.element.Water) +
                "</td>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Fire == null ? "??" : questList[id].battle_desc.element.Fire) +
                "</td>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Earth == null ? "??" : questList[id].battle_desc.element.Earth) +
                "</td>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Wind == null ? "??" : questList[id].battle_desc.element.Wind) +
                "</td>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Dark == null ? "??" : questList[id].battle_desc.element.Dark) +
                "</td>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Light == null ? "??" : questList[id].battle_desc.element.Light) +
                "</td>" +
                '<td class="text-center">' +
                (questList[id].battle_desc.element.Ice == null ? "??" : questList[id].battle_desc.element.Ice) +
                "</td>" +
                "</tr></tbody></table>"
        );
        $(".quest-detail .battle-detail").append(
            '<p class="font-weight-bold" style="margin-top:1rem;margin-bottom:0px;">' +
                'Waves: <span class="font-weight-normal">' +
                questList[id].battle_desc.wave +
                "</span></p>"
        );
    }
}

function updateQuestDetail(query) {
    var chapterIndex = $(query).parents(".chapter-card").eq(0).attr("data-chapter-index");
    var stageIndex = $(query).parents(".stage-card").eq(0).attr("data-stage-index");
    if (chapterIndex != undefined && stageIndex != undefined) {
        questList = chapterList[chapterIndex].stage[stageIndex].quest;
        updateDesc(parseInt($(query).eq(0).attr("data-quest-index")));
    }
}

function generateQuestList() {
    $(".category-option").hide();
    //$(".master-quest-detail").show();
    $(".master-quest").show();
    $(".prev-page").removeClass("homepage");

    $.ajax({
        url: "./questList/getQuestList.php",
        data: { category: $(".quest-background").attr("data-quest-category") },
        type: "POST",
        beforeSend: function() {
            $(".loading-page").show();
        },
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            //chapterList = data.chapters;
            //if user is a guest, filter all chapters
            //else data should be used to gen as it is.
            chapterList = data.chapters;
            
            if (data.isGuest == true) {
                var localqprogress = JSON.parse(localStorage.getItem("questProgress"));
                var filterChapters = [];
                for (let i = 0; i < chapterList.length; i++) {
                    var filterStages = [];
                    for (let j = 0; j < chapterList[i].stage.length; j++) {
                        var filterQuests = [];
                        for (let k = 0; k < chapterList[i].stage[j].quest.length; k++) {
                            var unlocked = localqprogress.find(function(x){return x.questId == chapterList[i].stage[j].quest[k].require && x.pass > 0});
                            if (unlocked != undefined || chapterList[i].stage[j].quest[k].require == null) {
                                var playedQuest = localqprogress.find(function(x){return x.questId == chapterList[i].stage[j].quest[k].id});
                                if (playedQuest != undefined) {
                                    //console.log(playedQuest);
                                    var questStar = "";
                                    if (playedQuest.clear > 0) {
                                        questStar = questStar + "1";
                                    } else {
                                        questStar = questStar + "0";
                                    }
                                    if (playedQuest.pass > 0) {
                                        questStar = questStar + "1";
                                    } else {
                                        questStar = questStar + "0";
                                    }
                                    if (playedQuest.maxScore >= 100) {
                                        questStar = questStar + "1";
                                    } else {
                                        questStar = questStar + "0";
                                    }
                                    chapterList[i].stage[j].quest[k].star = questStar;
                                }
                                filterQuests.push(chapterList[i].stage[j].quest[k]);
                            }
                        }
                        chapterList[i].stage[j].quest = filterQuests;
                        if (chapterList[i].stage[j].quest.length > 0) {
                            filterStages.push(chapterList[i].stage[j]);
                        }
                    }
                    chapterList[i].stage = filterStages;
                    if (chapterList[i].stage.length > 0) {
                        filterChapters.push(chapterList[i]);
                    }
                }
                chapterList = filterChapters;
            }
            $(".master-quest").empty();
            for (let i = 0; i < chapterList.length; i++) {
                $(".master-quest").append('<div class="card card-primary chapter-card collapsed-card" data-chapter-index="' + i + '"></div>');
                $(".chapter-card:eq(" + i + ")").append(
                    '<div class="card-header">' +
                        chapterList[i].title +
                        "</div>" +
                        '<div class="card-body" style="display:none;"></div>'
                );

                for (let j = 0; j < chapterList[i].stage.length; j++) {
                    $(".chapter-card:eq(" + i + ") > .card-body").append(
                        '<div class="card card-dark collapsed-card stage-card" data-stage-index="' + j + '"></div>'
                    );
                    $(".chapter-card:eq(" + i + ") .stage-card:eq(" + j + ")").append(
                        '<div class="card-header">' +
                            chapterList[i].stage[j].title +
                            "</div>" +
                            '<div class="card-body" style="display:none;"></div>'
                    );

                    for (let k = 0; k < chapterList[i].stage[j].quest.length; k++) {
                        var playHTML = '<button type="button" class="btn btn-success" onclick="startQuest(this);">Play</button>';
                        if(chapterList[i].stage[j].quest[k].type == "battle") {
                            playHTML = '<button type="button" class="btn btn-success" data-toggle="modal" data-target=".team-edit-modal">Play</button>';
                        }

                        $(".chapter-card:eq(" + i + ") .stage-card:eq(" + j + ") > .card-body").append(
                            '<div class="card card-secondary collapsed-card quest-card" data-quest-index="' +
                                k +
                                '">' +
                                '<div class="card-header">' +
                                chapterList[i].stage[j].quest[k].title +
                                '<div class="card-tools">' +
                                '<i class="fas fa-star ' +
                                (chapterList[i].stage[j].quest[k].star[0] == "1" ? "text-warning" : "") +
                                '"></i>' +
                                '<i class="fas fa-star ' +
                                (chapterList[i].stage[j].quest[k].star[1] == "1" ? "text-warning" : "") +
                                '"></i>' +
                                '<i class="fas fa-star ' +
                                (chapterList[i].stage[j].quest[k].star[2] == "1" ? "text-warning" : "") +
                                '"></i>' +
                                "</div>" +
                                "</div>" +
                                '<div class="card-body" style="display:none;">' +
                                '<p class="mb-1">Proceed?</p>' +
                                '<div class="d-flex justify-content-around">' +
                                '<button type="button" class="btn btn-secondary" data-toggle="modal" data-target=".quest-detail-modal">Detail</button>' +
                                playHTML + 
                                '<button type="button" class="btn btn-danger" data-card-widget="collapse">Cancel</button>' +
                                "</div>" +
                                "</div>" +
                                "</div>"
                        );
                    }
                }
            }

            if($("html").innerWidth() <= 820) {
                $('button[data-target=".quest-detail-modal"]').show();
                $(".master-quest-detail").hide();
            } else {
                $('button[data-target=".quest-detail-modal"]').hide();
                $(".master-quest-detail").show();
            }

            $(".loading-page").fadeOut(500);
            //expand last quest
            $(".chapter-card:eq(0) > .card-header").trigger("click");
            $(".chapter-card:eq(0) .stage-card:eq(0) > .card-header").trigger("click");
            //expand latest played quest (default last quest)
            //$(".chapter-card:eq(" + firstExpandChapter + ") > .card-header").trigger("click");
            //$(".chapter-card:eq(" + firstExpandChapter + ") .stage-card:eq(" + firstExpandStage + ") > .card-header").trigger("click");
        },
    });
}

function startQuest(target) {
    var stage = $(target).parents(".stage-card").attr("data-stage-index");
    var chapter = $(target).parents(".chapter-card").attr("data-chapter-index");
    var clickedQuest = 
        chapterList[$(target).parents(".chapter-card").attr("data-chapter-index")].stage[$(target).parents(".stage-card").attr("data-stage-index")]
            .quest[$(target).parents(".quest-card").attr("data-quest-index")];

    var type = clickedQuest.type;
    var questId = clickedQuest.id;
    var category = $(".quest-background").attr("data-quest-category");
    var backgroundPic = clickedQuest.background;
    var hasPlayed = (clickedQuest.star != "") && (clickedQuest.star != "000");
    var expPrize = clickedQuest.exp;

    $("#quizModal").modal("hide");
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").css("overflow-y", "");

    if (type == "battle") {
        if(teamMember.length == 0) {
            alert("Please put at least 1 member in your team.");
        } else {
            var battleDesc =
            chapterList[$(target).parents(".chapter-card").attr("data-chapter-index")].stage[
                $(target).parents(".stage-card").attr("data-stage-index")
            ].quest[$(target).parents(".quest-card").attr("data-quest-index")].battle_desc;
        
            $(".loading-page").show();
            $(".content").empty();
            playBGM("../audio/battleBGM.mp3");
            $(".content").load("./battleGameplay/battleGameplay.php", function () {
                $(".mobs").css("background-image", "url(" + backgroundPic + ")");
                $("button[value=back-quest]").attr("data-quest-category", category);
                getBattleContent(questId);
                //update battle description in menu
                updateMenuDetail(battleDesc);
                hasPlayedOnce = hasPlayed;
                expReward = expPrize;
                stageIndex = stage;
                chapterIndex = chapter;
                $(".loading-page").fadeOut(500);
            });
        }
    } else if (type == "story") {
        $(".loading-page").show();
        $(".content").empty();
        playBGM("../audio/storyBGM.mp3");
        $(".content").load("./storyQuest/storyQuest.php", function () {
            $(".story-background").css("background-image", "url(" + backgroundPic + ")");
            $("button[value=back-quest]").attr("data-quest-category", category);
            getStoryContent(questId);
            hasPlayedOnce = hasPlayed;
            expReward = expPrize;
            stageIndex = stage;
            chapterIndex = chapter;
            $(".loading-page").fadeOut(500);
        });
    } else if (type == "quiz") {
        $(".loading-page").show();
        $(".content").empty();
        playBGM("../audio/quizBGM.mp3");
        $(".content").load("./quizQuest/quizQuest.php", function () {
            $(".story-background").css("background-image", "url(" + backgroundPic + ")");
            $("button[value=back-quest]").attr("data-quest-category", category);
            getQuizContent(questId);
            hasPlayedOnce = hasPlayed;
            expReward = expPrize;
            stageIndex = stage;
            chapterIndex = chapter;
            $(".loading-page").fadeOut(500);
            //console.log(category);
        });
    }
}

$(document).ready(function () {
    //playBGM("../audio/questBGM.mp3");
    $("html, body").animate({ scrollTop: $(".content").offset().top }, {
        duration: 100,
        done: function() {
            $("body").css("overflow-y", "hidden");
        }
    });

    if($("html").innerWidth() <= 820) {
        $(".quest-background").removeClass("row");
        $(".category-option").removeClass("col-sm-6").addClass("col-sm-12");
        $(".master-quest-detail").hide();
        $(".master-quest").removeClass("col-sm-6").addClass("col-sm-12");
    } else {
        $(".quest-background").addClass("row");
        $(".category-option").removeClass("col-sm-12").addClass("col-sm-6");
        if($(".quest-background").attr("data-quest-category") != "") {
            $(".master-quest-detail").show();
        }
        $(".master-quest").removeClass("col-sm-12").addClass("col-sm-6");
    }

    $.ajax({
        url: "./questList/getQuestCategory.php",
        type: "POST",
        success: function(response) {
            var data = JSON.parse(response);
            questCat = data.questCat;
            $('.category-option button[value="main"]').prop("disabled", questCat.main == "1");
            $('.category-option button[value="level"]').prop("disabled", questCat.level == "1");
            $('.category-option button[value="hard"]').prop("disabled", questCat.hard == "1");
            if ($(".quest-background").attr("data-quest-category") == "") {
                $(".prev-page").addClass("homepage");
                $(".category-option").show();
                $(".master-quest-detail").hide();
                $(".master-quest").hide();
            } else {
                generateQuestList();
            }
        }
    });

    $(".team-edit-modal .modal-body").load("./teamSetting/teamSetting.php", function() {
        $(".team-edit-modal .modal-body .homepage").parent().hide();
        $(".team-edit-modal .team-setting-bg").css("height", "70vh");
        $(".team-edit-modal .team-mobile-view .character-list, " + 
            ".team-edit-modal .team-mobile-view .team-list, " + 
            ".team-edit-modal .team-mobile-view .team-profile .team-detail, " + 
            ".team-edit-modal .team-mobile-view .mobile-view.character-detail").css("width", "calc(85vw - 2.5rem)");

        var teamTutor = $("#teamTutorial").html();
        $("#teamTutorial").remove();
        $(".content").append('<div class="modal fade" id="teamTutorial" data-backdrop="static">' + teamTutor + '</div>');
        $('#teamTutorial button[data-dismiss="modal"]').attr("onclick", '$(".team-edit-modal").modal("show");');


        if($("html").innerWidth() > 820) {
            $(".character-detail").css("left", "54vw");
            view = "pc";
        } else {
            $(".character-detail").css("left", "");
            view = "mobile";
        }
        updateTeam();
        updateChracterList();
        //due to all pages' clear resize event initially, we need to bind it again
        $(window).unbind("resize");
        $(window).resize(function () {
            $(".character-detail").hide();
            if($("html").innerWidth() <= 820) {
                $(".quest-background").removeClass("row");
                $(".category-option").removeClass("col-sm-6").addClass("col-sm-12");
                $(".master-quest-detail").hide();
                $(".master-quest").removeClass("col-sm-6").addClass("col-sm-12");
                $('button[data-target=".quest-detail-modal"]').show();
                $(".character-detail").css("left", "");
                view = "mobile";
            } else {
                $(".quest-background").addClass("row");
                $(".category-option").removeClass("col-sm-12").addClass("col-sm-6");
                if($(".quest-background").attr("data-quest-category") != "") {
                    $(".master-quest-detail").show();
                }
                $(".master-quest").removeClass("col-sm-12").addClass("col-sm-6");
                $('button[data-target=".quest-detail-modal"]').hide();
                $(".quest-detail-modal").modal("hide");
                $(".character-detail").css("left", "54vw");
                view = "pc";
            }
            updateTeam();
            updateChracterList();
        });
    });
});

$('.quest-background *').mousemove(function () {
    if (
        $(".quest-card:hover").length != 0 ||
        $(".quest-card.collapsed-card").length < $(".quest-card").length ||
        $(".quest-card.expanding-card").length != 0
    ) {
        //show quest card when hovering a quest card or when there is an expanding or expanded quest card
        $(".quest-detail").show();
        if ($(".quest-card.collapsed-card").length >= $(".quest-card").length && $(".quest-card.expanding-card").length == 0) {
            updateQuestDetail(".quest-card:hover"); //display hovered quest detail
            //(for showing detail of clicked quest card, it's in click event handler.)
        }
    } //all quest cards are collapsed
    else {
        $(".quest-detail").hide();
    }
});

$('.quest-background *').click(function (event) {
    if ($(event.target).hasClass("card-header")) {
        if ($(event.target).parent().hasClass("quest-card")) {
            $(".quest-detail").show();
            updateQuestDetail($(event.target).parent());
            if ($(event.target).parent().hasClass("collapsed-card") == true) {
                $(".quest-card")
                    .not($(event.target).parent())
                    .each(function () {
                        $(this).CardWidget("collapse");
                    });
                $(event.target).parent().CardWidget("expand");
            } else {
                $(event.target).parent().CardWidget("collapse");
            }
        } else if ($(event.target).parent().hasClass("stage-card") || $(event.target).parent().hasClass("chapter-card")) {
            $(".quest-detail").hide();

            if ($(event.target).parent().hasClass("stage-card")) {
                if ($(event.target).parent().hasClass("collapsed-card") == true) {
                    $(".stage-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).CardWidget("remove");
                        });
                    $(event.target).parent().CardWidget("expand");
                } else {
                    $(".stage-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).slideDown();
                        });
                    $(event.target).parent().CardWidget("collapse");
                }
            } else if ($(event.target).parent().hasClass("chapter-card")) {
                if ($(event.target).parent().hasClass("collapsed-card") == true) {
                    $(".chapter-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).CardWidget("remove");
                        });
                    $(event.target).parent().CardWidget("expand");
                } else {
                    $(".chapter-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).slideDown();
                        });
                    $(event.target).parent().CardWidget("collapse");
                }
            }
            if ($(event.target).parent().hasClass("collapsed-card") == false) {
                $(".quest-detail").hide();
                $(event.target)
                    .parent()
                    .find(".card")
                    .each(function () {
                        if ($(this).css("display") == "none") {
                            $(this).show();
                        }
                        $(this).CardWidget("collapse");
                    });
            }
        }
    } else if ($(event.target).is(".category-option button") || $(event.target).is(".category-option button *")) {
        var category = undefined;
        if($(event.target).is(".category-option button *")) {
            category = $(event.target).parents(".category-option button").val();
        } else {
            category = $(event.target).val();
        }
        $(".quest-background").attr("data-quest-category", category);
        $(".prev-page").removeClass("go-homepage");
        generateQuestList();
    } else if ($(event.target).is('button[data-target=".team-edit-modal"]')) {
        openedQuest = $(event.target);
        $(".team-edit-modal .modal-footer").show();
    }
});

$(".prev-page").click(function(){
    if(!($(this).hasClass('go-homepage')))
    {
        $(".loading-page").show();
        $(".quest-background").attr("data-quest-category", "");
        $(".category-option").show();
        $(".master-quest-detail").hide();
        $(".master-quest").hide();
        $(".prev-page").addClass("go-homepage");
        $(".loading-page").fadeOut(500);
    }
    else
    {
        $(".prev-page").removeClass("go-homepage");
        $(".prev-page").addClass("homepage");
    }
});

/*
$(".team-setting-quest").click(function () {
    $(".loading-page").show();
    $(".content").empty();
    $(".content").load("./teamSetting/teamSetting.php", function () {
        $(".homepage").addClass("quest-list");
        $(".quest-list").removeClass("homepage"); //press back in team after this will go back to quest list instead of homepage
        $(".loading-page").fadeOut(500);
    });
});
*/

$(".library-quest").click(function () {
    $(".loading-page").show();
    $(".content").empty();
    $(".content").load("./library/library.php", function () {
        $(".library-background").attr("data-content-title", "library");
        $(".homepage").addClass("quest-list");
        $(".quest-list").removeClass("homepage"); //press back in library after this will go back to quest list instead of homepage
        $(".loading-page").fadeOut(500);
    });
});

$(".team-edit-modal .openTeamTutorial").click(function() {
    $(".team-edit-modal").modal("hide");
    $("#teamTutorial").modal("show");
});

