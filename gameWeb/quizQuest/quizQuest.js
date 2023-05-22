var questions = [
    {
        question: "Tell me how to do selection sort",
        sprite: ["", "../spritePics/evanF0.png"],
        picture: "../storyPic/bubbleAnimation.gif",
        dropdownChoice: [
            {
                label: "First Step",
                correct: "Find min value element",
                option: ["Swap min and first element", "Find min value element"],
            },
            {
                label: "Second Step",
                correct: "Swap min and first element",
                option: ["Swap min and first element", "Find min value element"],
            },
            {
                label: "Third Step",
                correct: "Find min value from second to last element",
                option: ["Find min value from second to last element", "Swap min and second element"],
            },
            {
                label: "Fourth Step",
                correct: "Swap min and second element",
                option: ["Find min value from second to last element", "Swap min and second element"],
            },
        ],
    },
    {
        question: "What is selection sort's big-o notation?",
        sprite: ["../spritePics/alcor.png", ""],
        picture: "",
        dropdownChoice: [
            {
                label: "",
                correct: "O(n^2)",
                option: ["O(n^2)", "O(n)", "O(log(n))", "O(2^n)"],
            },
        ],
    },
    {
        question: "How many times do you swap elements when sorting [2,1,5,4,3] with selection sort?",
        sprite: ["../spritePics/alcor.png", "../spritePics/evanF7.png"],
        picture: "../storyPic/selectAnimation.gif",
        dropdownChoice: [
            {
                label: "",
                correct: "3",
                option: ["1", "2", "3"],
            },
        ],
    },
];
var currentQuestion = 0;
var totalScore = 0;
var user = "";
var questId = 0;
var hasPlayedOnce = false;
var expReward = 0;

var stageIndex = 0;
var chapterIndex = 0;

function shiftQuestion() {
    for (let i = 0; i < questions[currentQuestion].sprite.length; i++) {
        $(".sprite-image img").not(".story-image").eq(i).attr("src", questions[currentQuestion].sprite[i]);
        //console.log($(".sprite-image img").eq(i).not('.story-image'));
    }
    $(".story-image").attr("src", questions[currentQuestion].picture);

    $(".quiz-dialogue p").html(
        '<span class="font-weight-bold"> Question ' + (currentQuestion + 1) + " </span>" + questions[currentQuestion].question
    );
    $(".quiz-dialogue select").empty();
    $(".quiz-dialogue select").hide();
    $(".quiz-dialogue label").hide();
    $(".quiz-dialogue .form-row > div").hide();
    $(".quiz-dialogue .form-row > div:last").show();
    for (let i = 0; i < questions[currentQuestion].dropdownChoice.length; i++) {
        $(".quiz-dialogue .form-row > div:eq(" + i + ")").show();
        $(".quiz-dialogue label:eq(" + i + ")").show();
        $(".quiz-dialogue select:eq(" + i + ")").show();
        $(".quiz-dialogue label:eq(" + i + ")").text(questions[currentQuestion].dropdownChoice[i].label);
        for (let j = 0; j < questions[currentQuestion].dropdownChoice[i].option.length; j++)
            $(".quiz-dialogue select:eq(" + i + ")").append("<option>" + questions[currentQuestion].dropdownChoice[i].option[j] + "</option>");
    }
    $(".quiz-dialogue .form-row").animate({ scrollTop: 0 }, 100);
}

function evaluateAns() {
    var score = 0;
    var i = 0;
    $(".quiz-dialogue option:selected").each(function () {
        var answer = $(this).text();
        if (
            questions[currentQuestion].dropdownChoice[i].correct.find(function (x) {
                return x == answer;
            }) != undefined
        ) {
            score++;
        }
        i++;
    });
    return score;
}

function getQuizContent(id) {
    questId = id;
    $.ajax({
        url: "./quizQuest/getQuizContent.php",
        data: { quest: id },
        type: "POST",
        success: function (response) {
            //console.log(response);
            //gen battle detail or pass to some public variable
            var data = JSON.parse(response);
            user = data.isGuest;
            questions = data.quiz;
            //first question
            shiftQuestion();
        },
    });
}

$(document).ready(function () {
    //playBGM("../audio/quizBGM.mp3");
    $("html, body").animate({ scrollTop: $(".content").offset().top }, {
        duration: 100,
        done: function() {
            $("body").css("overflow-y", "hidden");
        }
    });

    $(".sprite-image img").attr("src", "");
    $(".mobile-story-image img").attr("src", "");

    if ($("html").innerWidth() <= 820) {
        $(".sprite-image > div:not(:eq(1))").removeClass("col-sm-3");
        $(".sprite-image > div:eq(1)").removeClass("col-sm-6");
        $(".quiz-dialogue .form-row > div").removeClass("col-sm-2").addClass("col-sm-12");
    } else {
        $(".sprite-image > div:not(:eq(1))").addClass("col-sm-3");
        $(".sprite-image > div:eq(1)").addClass("col-sm-6");
        $(".quiz-dialogue .form-row > div").removeClass("col-sm-12").addClass("col-sm-2");
    }

    $(window).unbind("resize");
    $(window).resize(function () {
        if ($("html").innerWidth() <= 820) {
            $(".sprite-image > div:not(:eq(1))").removeClass("col-sm-3");
            $(".sprite-image > div:eq(1)").removeClass("col-sm-6");
            $(".quiz-dialogue .form-row > div").removeClass("col-sm-2").addClass("col-sm-12");
        } else {
            $(".sprite-image > div:not(:eq(1))").addClass("col-sm-3");
            $(".sprite-image > div:eq(1)").addClass("col-sm-6");
            $(".quiz-dialogue .form-row > div").removeClass("col-sm-12").addClass("col-sm-2");
        }
    });
});

$(".quiz-dialogue button").click(function () {
    if ($(this).val() == "done") {
        //evaluate question
        thisquizScore = evaluateAns() / questions[currentQuestion].dropdownChoice.length;
        totalScore = totalScore + thisquizScore;
        //record sort progress
        if (user !== true) {
            $.ajax({
                url: "./quizQuest/recordQuizProgress.php",
                data: { record: "sort", sort: questions[currentQuestion].testSort, user: user, score: parseInt(thisquizScore * 100) },
                type: "POST",
                success: function (data) {
                    //console.log(data);
                    //console.log(parseInt(thisquizScore*100));
                },
            });
        } else {
            //record in localstorage
            var localsprogress = JSON.parse(localStorage.getItem("sortProgress"));
            var sortToRecord = localsprogress.findIndex(function(x){return x.sort == questions[currentQuestion].testSort});
            if (sortToRecord != -1) {
                localsprogress[sortToRecord].attempt = localsprogress[sortToRecord].attempt + 1;
                if (localsprogress[sortToRecord].maxScore < parseInt(thisquizScore * 100)) {
                    localsprogress[sortToRecord].maxScore = parseInt(thisquizScore * 100);
                }
                if (parseInt(thisquizScore * 100) >= 100) {
                    localsprogress[sortToRecord].fullScore = localsprogress[sortToRecord].fullScore + 1;
                }
                localsprogress[sortToRecord].meanScore = 
                    ((localsprogress[sortToRecord].meanScore * (localsprogress[sortToRecord].attempt - 1)) + 
                        parseInt(thisquizScore * 100)) / localsprogress[sortToRecord].attempt;
                localStorage.setItem("sortProgress", JSON.stringify(localsprogress));
            }
        }
        //shift question
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            shiftQuestion();
        } else {
            //alert("question finished\nscore: " + (100*totalScore/questions.length));

            var score = parseInt((100 * totalScore) / questions.length);
            var exp = Math.round(score / 2) + expReward;
            var star = ["0", "0", "0"];
            $(".exp-obtained").text(exp);
            $(".score-obtained").text(score);

            if (score >= 25) {
                $("#quizModal .fa-star:first").addClass("text-warning");
                star[0] = "1";
                if (score >= 50) {
                    $("#quizModal .fa-star:eq(1)").addClass("text-warning");
                    star[1] = "1";
                    if (score == 100) {
                        $("#quizModal .fa-star:eq(2)").addClass("text-warning");
                        star[0] = "2";
                    }
                }
            }

            if (user !== true) {
                $.ajax({
                    url: "./quizQuest/recordQuizProgress.php",
                    data: {
                        record: "progress",
                        quest: questId,
                        user: user,
                        score: score,
                        clear: score >= 25,
                        pass: score >= 50,
                        exp: exp,
                        played: hasPlayedOnce,
                    },
                    type: "POST",
                    beforeSend: function () {
                        $("#quizModal button").prop("disabled", true);
                    },
                    success: function (data) {
                        //console.log(data);
                        $("#quizModal button").prop("disabled", false);
                        hasPlayedOnce = true;
                        if (data.length > 0) {
                            var unlockedContent = JSON.parse(data);
                            $("#quizModal .modal-body").append("</br>");
                            if (unlockedContent.quest != undefined && unlockedContent.quest.length > 0) {
                                $("#quizModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New Quests unlocked!: </span>' + unlockedContent.quest.join(", ") + "</p>"
                                );
                            }
                            if (unlockedContent.character != undefined && unlockedContent.character.length > 0) {
                                $("#quizModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New characters unlocked!: </span>' +
                                        unlockedContent.character.join(", ") +
                                        "</p>"
                                );
                            }
                            if (quizModal.element != undefined && unlockedContent.element.length > 0) {
                                $("#resultModal .modal-body").append(
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
                var findQuest = localqprogress.findIndex(function(x){return x.questId == questId});
                if (findQuest != -1) {
                    hasPlayedOnce = true;
                }
                $.ajax({
                    url: "./quizQuest/recordQuizProgress.php",
                    data: {
                        record: "progress",
                        quest: questId,
                        user: "guest",
                        score: score,
                        played: hasPlayedOnce,
                    },
                    type: "POST",
                    beforeSend: function () {
                        $("#quizModal button").prop("disabled", true);
                    },
                    success: function (data) {
                        //console.log(data);
                        if (findQuest != -1) {
                            exp = parseInt(exp / 2);
                            localqprogress[findQuest].attempt = localqprogress[findQuest].attempt + 1;
                            if (score >= 25) {
                                localqprogress[findQuest].clear = localqprogress[findQuest].clear + 1;
                            }
                            if (score >= 50) {
                                localqprogress[findQuest].pass = localqprogress[findQuest].pass + 1;
                            }
                            if (score > localqprogress[findQuest].maxScore) {
                                localqprogress[findQuest].maxScore = score;
                            }
                            localqprogress[findQuest].meanScore = 
                                parseInt(((localqprogress[findQuest].meanScore * (localqprogress[findQuest].attempt - 1)) + score) 
                                    / localqprogress[findQuest].attempt)
                        } else {
                            localqprogress.push({
                                questId: questId, 
                                attempt: 1, 
                                clear: (score >= 25) ? 1 : 0, 
                                pass: (score >= 50) ? 1 : 0, 
                                maxScore: score, 
                                meanScore: score
                            });
                        }
                        var localplayer = JSON.parse(localStorage.getItem("player"));
                        for (let i = 0 ; i < localplayer.length; i++) {
                            localplayer[i].exp = parseInt(localplayer[i].exp) + exp;
                        }
                        $("#quizModal button").prop("disabled", false);
                        hasPlayedOnce = true;
                        if (data.length > 0) {
                            var unlockedContent = JSON.parse(data);
                            $("#quizModal .modal-body").append("</br>");
                            if (unlockedContent.quest != undefined && unlockedContent.quest.length > 0) {
                                $("#quizModal .modal-body").append(
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
                                $("#quizModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New characters unlocked!: </span>' +
                                        message +
                                        "</p>"
                                );
                            }
                            if (quizModal.element != undefined && unlockedContent.element.length > 0) {
                                $("#quizModal .modal-body").append(
                                    '<p><span class="font-weight-bold">New elements added to Divine Element Skill: </span>' +
                                        unlockedContent.element.join(", ") +
                                        "</p>"
                                );
                            }
                        }
                        localStorage.setItem("player", JSON.stringify(localplayer));
                        localStorage.setItem("questProgress", JSON.stringify(localqprogress));
                    },
                });
                //record in localstorage
            }

            $("#quizModal").modal("show");
        }
    }
});

$("#quizModal button").click(function () {
    $("#quizModal").modal("hide");
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $("body").css("overflow-y", "");

    if ($(this).val() == "retry") {
        //record score
        //reset
        var category = $("button[value=back-quest]:first").attr("data-quest-category");
        var quest_id_temp = questId;
        var has_played_temp = hasPlayedOnce;
        var exp_temp = expReward;
        var bgPic = $(".story-background").css("background-image");
        $(".content").empty();
        $(".content").load("./quizQuest/quizQuest.php", function () {
            $("button[value=back-quest]").attr("data-quest-category", category);
            $(".story-background").css("background-image", bgPic);
            getQuizContent(quest_id_temp);
            hasPlayedOnce = has_played_temp;
            expReward = exp_temp;
        });
    } else if ($(this).val() == "back-quest") {
        var category = $(this).attr("data-quest-category");
        $(".content").empty();
        playBGM("../audio/questBGM.mp3");
        $(".content").load("./questList/questList.php", function () {
            $(".quest-background").attr("data-quest-category", category);
            firstExpandChapter = chapterIndex;
            firstExpandStage = stageIndex;
        });
    }
});
