var storyLine = [
    {
        sprite: ["", "../spritePics/evanF0.png"],
        speaker: "Evan",
        text: "Where am I?",
    },
    {
        sprite: ["../spritePics/alcor.png", ""],
        speaker: "???",
        text: "...",
    },
    {
        sprite: ["../spritePics/alcor.png", "../spritePics/evanF7.png"],
        speaker: "Evan",
        text: "WHOA! You startled me!",
    },
    {
        sprite: ["../spritePics/alcor.png", "../spritePics/evanF5.png"],
        speaker: "???",
        text: "My apologies.",
    },
    {
        sprite: ["../spritePics/alcor.png", "../spritePics/evanF5.png"],
        speaker: "Alcors",
        text: "My name is Alcor. Please to meet you.",
    },
];

var storyPic = [
    {
        picture: "../storyPic/bubbleAnimation.gif",
        start: 0,
        stop: 1,
    },
    {
        picture: "../storyPic/insertAnimation.gif",
        start: 2,
        stop: 2,
    },
    {
        picture: "../storyPic/selectAnimation.gif",
        start: 4,
        stop: 4,
    },
];

var currentLine = -1;
var currentPic = 0;
var user = "";
var questId = 0;
var expReward = 0;
var hasPlayedOnce = false;

var stageIndex = 0;
var chapterIndex = 0;

var newContent = "";

function addStoryLine(element, index) {
    $(element).append('<p><span class="font-weight-bold">' + storyLine[index].speaker + "</span></br>" + storyLine[index].text + "</p>");
    //$(element).append();
}

function getStoryContent(id) {
    questId = id;
    $.ajax({
        url: "./storyQuest/getStoryContent.php",
        data: { quest: id },
        type: "POST",
        success: function (response) {
            //gen battle detail or pass to some public variable
            var data = JSON.parse(response);
            storyLine = data.story;
            storyPic = data.pic;
            user = data.isGuest;

            //force player to view new content
            if (hasPlayedOnce == false && data.newContent.length > 0) {
                newContent = data.newContent;
                $("#storyModal button[value=back-quest]").hide();
                $("#storyModal button[value=library-quest]").show();
            } else {
                $("#storyModal button[value=back-quest]").show();
                $("#storyModal button[value=library-quest]").hide();
            }

            $(".dialogue").html("<p>Click anywhere to begin.</p>");
            $(".sprite-image img").attr("src", "");
            $(".mobile-story-image img").attr("src", "");
            $(".log-text").empty();

            $(".log-window").css("top", $(".story-background").offset().top);
            $(".log-window").css("width", $(".story-background").width());
        },
    });
}

$(document).ready(function () {
    //playBGM("../audio/storyBGM.mp3");
    $("html, body").animate({ scrollTop: $(".content").offset().top }, {
        duration: 100,
        done: function() {
            $("body").css("overflow-y", "hidden");
        }
    });

    if ($("html").innerWidth() <= 820) {
        $(".sprite-image > div:not(:eq(1))").removeClass("col-sm-3");
        $(".sprite-image > div:eq(1)").removeClass("col-sm-6");
    } else {
        $(".sprite-image > div:not(:eq(1))").addClass("col-sm-3");
        $(".sprite-image > div:eq(1)").addClass("col-sm-6");
    }

    $(window).unbind("resize");
    $(window).resize(function () {
        if ($("html").innerWidth() <= 820) {
            $(".sprite-image > div:not(:eq(1))").removeClass("col-sm-3");
            $(".sprite-image > div:eq(1)").removeClass("col-sm-6");
        } else {
            $(".sprite-image > div:not(:eq(1))").addClass("col-sm-3");
            $(".sprite-image > div:eq(1)").addClass("col-sm-6");
        }
        $(".log-window").css("top", $(".story-background").offset().top);
        $(".log-window").css("width", $(".story-background").width());
    });
});

$(".log-buttons button").click(function () {
    if ($(this).val() == "open-log") {
        $(".log-window").show();
    } else if ($(this).val() == "close-log") {
        $(".log-window").hide();
    }
});

$(".story-background").click(function (e) {
    //not run if clicking log buttons
    if (!($(e.target).is(".log-buttons *"))) {
        //shift line
        currentLine++;
        //append old line to log
        if (currentLine > 0 && currentLine <= storyLine.length) {
            addStoryLine(".log-text", currentLine - 1);
        }
        if (currentLine < storyLine.length) {
            //line
            $(".dialogue").empty();
            addStoryLine(".dialogue", currentLine);

            //sprite
            for (let i = 0; i < storyLine[currentLine].sprite.length; i++) {
                $(".sprite-image img").not(".story-image").eq(i).attr("src", storyLine[currentLine].sprite[i]);
            }

            //picture
            var inc = true;
            while (inc && currentPic < storyPic.length) {
                if (currentLine < storyPic[currentPic].start) {
                    //out of picture range
                    $(".story-image").hide();
                    inc = false;
                } else if (currentLine <= storyPic[currentPic].stop) {
                    //if picture to show is not the same as the current one, update it
                    if (storyPic[currentPic].picture != $(".story-image").attr("src")) {
                        $(".story-image").show();
                        $(".story-image").attr("src", storyPic[currentPic].picture);
                        $(".log-text").append('<img src="' + storyPic[currentPic].picture + '" class="col-sm-6 mb-3">');
                    }
                    inc = false;
                } else {
                    //if shift picture, we need to check if this new picture is already in range
                    currentPic++;
                    if (currentPic < storyPic.length) {
                        inc = true;
                    } else {
                        //out of picture range -> hide it
                        $(".story-image").hide();
                        inc = false;
                    }
                }
            }
        } else {
            //alert("Story ended.");
            //give only exp
            //record quest progress
            $(".story-background button").hide();
            $("#storyModal").modal("show");
            $(".log-window").css("width", $(".story-background").width());
            $(".exp-obtained").text(expReward);

            if (user !== true) {
                $.ajax({
                    url: "./storyQuest/recordStoryProgress.php",
                    data: { quest: questId, user: user, exp: expReward, played: hasPlayedOnce },
                    type: "POST",
                    beforeSend: function () {
                        $("#storyModal button").prop("disabled", true);
                    },
                    success: function (data) {
                        $("#storyModal button").prop("disabled", false);
                        $("#storyModal .modal-body").append("</br>");
                        if (newContent.length > 0) {
                            $("#storyModal .modal-body").append(
                                '<p><span class="font-weight-bold">New content in Library unlocked!: </span>' + newContent.join(", ") + "</p>"
                            );
                        }
                        if (data.length > 0) {
                            var unlockedContent = JSON.parse(data);
                            if (unlockedContent.quest != undefined && unlockedContent.quest.length > 0) {
                                $("#storyModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New Quests unlocked!: </span>' + unlockedContent.quest.join(", ") + "</p>"
                                );
                            }
                            if (unlockedContent.character != undefined && unlockedContent.character.length > 0) {
                                $("#storyModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New characters unlocked!: </span>' +
                                        unlockedContent.character.join(", ") +
                                        "</p>"
                                );
                            }
                            if (unlockedContent.element != undefined && unlockedContent.element.length > 0) {
                                $("#storyModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New elements added to Divine Element Skill: </span>' +
                                        unlockedContent.element.join(", ") +
                                        "</p>"
                                );
                            }
                        }
                    },
                });
            } else {
                var localqprogress = JSON.parse(localStorage.getItem("questProgress"));
                var playedQuest = localqprogress.findIndex(function(x){return x.questId == questId});
                if (playedQuest != -1) {
                    hasPlayedOnce = true;
                } else {
                    hasPlayedOnce = false;
                }
                $.ajax({
                    url: "./storyQuest/recordStoryProgress.php",
                    data: { user: "guest", quest: questId, played: hasPlayedOnce },
                    type: "POST",
                    beforeSend: function () {
                        $("#storyModal button").prop("disabled", true);
                    },
                    success: function (data) {
                        //console.log(data);
                        //record in localstorage
                        if (hasPlayedOnce == true) {
                            expReward = parseInt(expReward / 2);
                            localqprogress[playedQuest].attempt = parseInt(localqprogress[playedQuest].attempt) + 1;
                            localqprogress[playedQuest].clear = parseInt(localqprogress[playedQuest].clear) + 1;
                            localqprogress[playedQuest].pass = parseInt(localqprogress[playedQuest].pass) + 1;
                        } else {
                            localqprogress.push({
                                questId: questId, attempt: 1, clear: 1, pass: 1, maxScore: 100, meanScore: 100
                            });
                        }
                        var localplayer = JSON.parse(localStorage.getItem("player"));
                        for (let i = 0 ; i < localplayer.length; i++) {
                            localplayer[i].exp = parseInt(localplayer[i].exp) + expReward;
                        }
                        
                        $("#storyModal button").prop("disabled", false);
                        $("#storyModal .modal-body").append("</br>");
                        if (newContent.length > 0) {
                            $("#storyModal .modal-body").append(
                                '<p><span class="font-weight-bold">New content in Library unlocked!: </span>' + newContent.join(", ") + "</p>"
                            );
                        }
                        if (data.length > 0) {
                            var unlockedContent = JSON.parse(data);
                            if (unlockedContent.quest != undefined && unlockedContent.quest.length > 0) {
                                $("#storyModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New Quests unlocked!: </span>' + unlockedContent.quest.join(", ") + "</p>"
                                );
                            }
                            if (unlockedContent.character != undefined && unlockedContent.character.length > 0) {
                                var message = "";
                                for (let i = 0; i < unlockedContent.character.length; i++) {
                                    message = message + unlockedContent.character[i].name;
                                    if (i < unlockedContent.character.length - 1) {
                                        message = message + ", ";
                                    }
                                    localplayer.push({charId: unlockedContent.character[i].charId, exp: 0, inTeam: 0});
                                }
                                $("#storyModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New characters unlocked!: </span>' +
                                        message +
                                        "</p>"
                                );
                            }
                            if (unlockedContent.element != undefined && unlockedContent.element.length > 0) {
                                $("#storyModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New elements added to Divine Element Skill: </span>' +
                                        unlockedContent.element.join(", ") +
                                        "</p>"
                                );
                            }
                        }
                        localStorage.setItem("player", JSON.stringify(localplayer));
                        localStorage.setItem("questProgress", JSON.stringify(localqprogress));
                    }
                });
                
            }
        }
    }
});

$("#storyModal button").click(function () {
    if ($(this).val() == "open-log") {
        $(".log-window").show();
    } else if ($(this).val() == "back-quest") {
        $("#storyModal").modal("hide");
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("overflow-y", "");

        var category = $(this).attr("data-quest-category");
        $(".content").empty();
        playBGM("../audio/questBGM.mp3");
        $(".content").load("./questList/questList.php", function () {
            $(".quest-background").attr("data-quest-category", category);
            firstExpandChapter = chapterIndex;
            firstExpandStage = stageIndex;
        });
    } else if ($(this).val() == "library-quest") {
        $("#storyModal").modal("hide");
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $("body").css("overflow-y", "");

        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./library/library.php", function () {
            $(".library-background").attr("data-content-title", "library");
            $(".homepage").addClass("quest-list");
            $(".quest-list").removeClass("homepage"); //press back in library after this will go back to quest list instead of homepage
            $(".loading-page").fadeOut(500);
            firstPage = newContent[0];
        });
    }
});
