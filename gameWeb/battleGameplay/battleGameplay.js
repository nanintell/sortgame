//unique mobs (?)
var mobsUnique = [
    {
        id: 0,
        hp: 100,
        img: "./battleGameplay/mobSample.png",
        attack: 10,
        element: { bubble: "wk", insert: "st", selection: "--" },
    },
    {
        id: 1,
        hp: 100,
        img: "./battleGameplay/mobSample.png",
        attack: 10,
        element: { bubble: "wk", insert: "st", selection: "--" },
    },
    {
        id: 2,
        hp: 100,
        img: "./battleGameplay/mobSample.png",
        attack: 10,
        element: { bubble: "wk", insert: "st", selection: "--" },
    },
    /*{
    id: 3,
    hp: 100,
    img: "./battleGameplay/mobSample.png",
    attack: 10,
    element: { bubble: "wk", insert: "st", select: "--" },
  }*/
];
var player = [
    {
        hp: 100,
        maxHP: 100,
        skill: { name: "Bubble", sort: "bubble" },
        level: 2,
        name: "A-ya",
    },
    {
        hp: 250,
        maxHP: 250,
        skill: { name: "Heal", sort: "random" },
        level: 3,
        name: "B-ko",
    },
    {
        hp: 150,
        maxHP: 150,
        skill: { name: "Select", sort: "selection" },
        level: 1,
        name: "C-ta",
    },
];
//mob index used in each wave
var wave = [[0, 0, 0, 0], [0, 1, 1], [2]];
var turn = 0; //0 = player, 1 = enemy
var waveCount = 0; //wave count
var defend = false;
var score = [];
var heal = false;
var b_animationQueue = [];
var user = "";
var questId = 0;
var battleDetail = {};
var hasPlayedOnce = false;
var skillOwner;
var unlockedElement = [];
var expReward = 0;

var stageIndex = 0;
var chapterIndex = 0;

function b_executeAnimationQueue(delay, start, complete) {
    if (b_animationQueue.length > 0) {
        b_animationQueue[0].option["start"] = start;
        b_animationQueue[b_animationQueue.length - 1].option["complete"] = complete;
        //console.log(b_animationQueue);
        var seq = b_animationQueue.length;
        for (let i = 0; i < seq; i++) {
            $(b_animationQueue[i].object)
                .delay(delay + 300 * (i + 1))
                .animate(b_animationQueue[i].action, b_animationQueue[i].option);
        }
    }
}

function getPlayerHP() {
    var totalHP = 0;
    for (let i = 0; i < player.length; i++) totalHP = totalHP + player[i].hp;
    return totalHP;
}

function enemyTurn() {
    var hitpoint = [];
    var playerHit = new Array(player.length).fill(0);
    var target = [];
    var status = 0;
    b_animationQueue = [];
    if (turn == 1) {
        //enemy turn
        $(".turn-owner").removeClass("btn-primary");
        $(".turn-owner").addClass("btn-warning");
        $(".turn-owner").text("Enemy Turn");
        $(".skill-list button").prop("disabled", true);
        //attack player
        for (let i = 0; i < wave[waveCount].length; i++) {
            //var target = Math.floor(Math.random() * player.length + 0);
            if ($(".mob-sprite:eq(" + i + ") .hp").attr("data-hp-now") > 0) {
                target[i] = Math.floor(Math.random() * player.length + 0);
                while (player[target[i]].hp <= 0) {
                    target[i] = Math.floor(Math.random() * player.length + 0);
                }
                //console.log(target);
                var mobTemp = mobsUnique.find(function (x) {
                    return x.id == wave[waveCount][i];
                });
                //console.log(mobTemp);
                if (defend == true) {
                    hitpoint[i] = Math.round(mobTemp.attack / 2);
                } else {
                    hitpoint[i] = mobTemp.attack;
                }

                if (player[target[i]].hp <= hitpoint[i]) {
                    hitpoint[i] = player[target[i]].hp;
                }
                player[target[i]].hp = player[target[i]].hp - hitpoint[i];

                playerHit[target[i]] = playerHit[target[i]] + hitpoint[i];

                /*b_animationQueue.push({
                    object: $(".player-char .dmg-hit:eq(" + target[i] + ")"),
                    action: { opacity: 1 },
                    option: {
                        duration: 150,
                        start: function () {
                            $(".player-char .dmg-hit:eq(" + target[i] + ")").text("" + hitpoint[i]);
                        },
                    },
                });*/
                /*
                if (player[target[i]].hp <= 0) {
                    player[target[i]].hp = 0;
                    b_animationQueue.push({
                        object: $(".stat .hp"),
                        action: { width: "-=" + (100 * hitpoint[i]) / $(".stat .hp").attr("data-hp-max") + "%" },
                        option: {
                            duration: 150,
                            complete: function () {
                                $(".char-card:eq(" + target[i] + ")").removeClass("bg-secondary");
                                //add time to make it animation
                                $(".char-card:eq(" + target[i] + ")").addClass("bg-dark", 150);
                                $(".stat .hp").text(parseInt($(".stat .hp").text()) - hitpoint[i]);
                                $(".instruction").text(
                                    $(".player-char .char-card:eq(" + target[i] + ")").text() + " took " + hitpoint[i] + " damage and fainted!"
                                );
                            },
                        },
                    });
                } else {
                    b_animationQueue.push({
                        object: $(".stat .hp"),
                        action: { width: "-=" + (100 * hitpoint[i]) / $(".stat .hp").attr("data-hp-max") + "%" },
                        option: {
                            duration: 150,
                            complete: function () {
                                $(".stat .hp").text(parseInt($(".stat .hp").text()) - hitpoint[i]);
                                $(".instruction").text(
                                    $(".player-char .char-card:eq(" + target[i] + ")").text() + " took " + hitpoint[i] + " damage!"
                                );
                            },
                        },
                    });
                }
                */

                /*b_animationQueue.push({
                    object: $(".player-char .dmg-hit:eq(" + target[i] + ")"),
                    action: { opacity: 0 },
                    option: {
                        duration: 150,
                    },
                });*/

                var totalHP = getPlayerHP();

                if (totalHP <= 0) {
                    status = 1;
                    break;
                }
            }
        }

        var mobAtk = mobsUnique.map(x => x.attack);
        var lowestAtk = Math.min(...mobAtk);
        var highestAtk = Math.max(...mobAtk);

        var totalDmg = 0;
        $(".skill-list button").prop("disabled", false);
        for (let i = 0; i < playerHit.length; i++) {
            totalDmg = totalDmg + playerHit[i];
            if (playerHit[i] > 0) {
                $(".player-char .dmg-hit:eq(" + i + ")").text("" + playerHit[i]);
                $(".player-char .dmg-hit:eq(" + i + ")").animate({opacity: 1}, 150);
                $(".player-char .dmg-hit:eq(" + i + ")").delay(450).animate({opacity: 0}, 150);

                if (player[i].hp <= lowestAtk) {
                    $(".char-card:eq(" + i + ")").attr("class", "border border-dark char-card bg-danger");
                } 
                else if (player[i].hp <= highestAtk && player[i].hp > highestAtk) {
                    $(".char-card:eq(" + i + ")").attr("class", "border border-dark char-card bg-warning");
                }
                if (player[i].hp <= 0) {
                    player[i].hp = 0;
                    $(".char-card:eq(" + i + ")").attr("class", "border border-dark char-card bg-dark");
                    $(".skill-list button:eq(" + i + ")").prop("disabled", true);
                }
            }
        }
        $(".stat .hp").animate({width: "-=" + (100 * totalDmg) / $(".stat .hp").attr("data-hp-max") + "%" }, {
            duration: 150,
            complete: function() {
                $(".stat .hp").text(parseInt($(".stat .hp").text()) - totalDmg);
            }
        });

        $(".turn-owner").addClass("btn-primary");
        $(".turn-owner").removeClass("btn-warning");
        $(".turn-owner").text("Player Turn");
        $(".skill-list button[value=defend]").prop("disabled", false);
        $(".instruction").text("Choose Skill to use.");
        defend = false;
        /*
        b_executeAnimationQueue(
            0,
            function () {
                $(".player-char .dmg-hit:eq(" + target[0] + ")").text(hitpoint[0]);
            },
            function () {
                //player turn
                $(".turn-owner").addClass("btn-primary");
                $(".turn-owner").removeClass("btn-warning");
                $(".turn-owner").text("Player Turn");
                for (let i = 0; i < player.length; i++) {
                    if (player[i].hp > 0) {
                        $(".skill-list button:eq(" + i + ")").prop("disabled", false);
                    }
                }
                $(".skill-list button[value=defend]").prop("disabled", false);
                $(".instruction").text("Choose Skill to use.");
                defend = false;
            }
        );
        */

        return status;
    }
}

function initWave() {
    b_animationQueue = [];
    $(".mob-sprite:lt(" + wave[waveCount].length + ")").show();
    $(".mob-sprite:not(:lt(" + wave[waveCount].length + "))").hide();
    $(".mob-sprite:not(:lt(" + wave[waveCount].length + ")) .hp").attr("data-hp-now", 0);
    $(".mob-sprite:lt(" + wave[waveCount].length + ")").css("opacity", 0);
    $(".skill-list button").prop("disabled", true);

    //b_animationQueue.push({object: $(".mob-sprite:lt(" + (wave[waveCount].length) + ")"), action: {opacity: 1}, option: {duration: 150}});
    $(".mob-sprite .hp").css("width", "100%");
    for (let i = 0; i < wave[waveCount].length; i++) {
        var mobTemp = mobsUnique.find(function (x) {
            return x.id == wave[waveCount][i];
        });
        $(".mob-sprite .hp:eq(" + i + ")").attr("data-hp-now", mobTemp.hp);
        $(".mob-sprite img:eq(" + i + ")").attr("src", mobTemp.img);
        $(".mob-sprite:eq(" + i + ")").animate({opacity: 1}, 150);
        //b_animationQueue.push({ object: $(".mob-sprite:eq(" + i + ")"), action: { opacity: 1 }, option: { duration: 150 } });
    }
    if (waveCount < wave.length - 1) {
        $(".wave-number").text("Wave " + (waveCount + 1));
    } else {
        $(".wave-number").text("Last Wave");
    }
    $(".instruction").text("Choose Skill to use.");
    
    for (let i = 0; i < player.length; i++) {
        if (player[i].hp > 0) {
            $(".skill-list button:eq(" + i + ")").prop("disabled", false);
        }
    }
    $(".skill-list button[value=defend]").prop("disabled", false);
    /*b_executeAnimationQueue(
        300,
        function () {
            $(".skill-list button").prop("disabled", true);
        },
        function () {
            for (let i = 0; i < player.length; i++) {
                if (player[i].hp > 0) {
                    $(".skill-list button:eq(" + i + ")").prop("disabled", false);
                }
            }
            $(".skill-list button[value=defend]").prop("disabled", false);
            //$(".skill-list button").prop("disabled", false);
        }
    );*/
}

function getResult() {
    //var star = ["0","0","0"];
    if (getPlayerHP() > 0) {
        $("#resultModal .fa-star:first").addClass("text-warning");
        //star[0] = "1";
    }

    var mean = 0;
    for (let i = 0; i < score.length; i++) {
        mean = mean + parseInt(score[i]);
    }
    mean = Math.round(mean / score.length);
    if (isNaN(mean)) {
        mean = 0;
    }
    var exp = Math.round(mean / 2) + expReward;

    $(".exp-obtained").text(exp);
    $(".score-obtained").text(mean);

    if (getPlayerHP() > 0 && mean >= 50) {
        $("#resultModal .fa-star:eq(1)").addClass("text-warning");
        //star[1] = "1";
        if (mean == 100) {
            $("#resultModal .fa-star:eq(2)").addClass("text-warning");
            //star[2] = "1";
        }
    }

    //record quest progress
    if (user !== true) {
        $.ajax({
            url: "./battleGameplay/recordBattleProgress.php",
            data: {
                record: "progress",
                quest: questId,
                user: user,
                score: mean,
                pass: getPlayerHP() > 0 && mean >= 50,
                clear: getPlayerHP() > 0,
                played: hasPlayedOnce,
                exp: exp,
            },
            type: "POST",
            beforeSend: function () {
                $("button[value=retry]").prop("disabled", true);
                $("button[value=back-quest]").prop("disabled", true);
                //$("button[value=retry]").text("Saving Progress");
            },
            success: function (data) {
                //console.log(data);
                hasPlayedOnce = true;
                $("button[value=retry]").prop("disabled", false);
                $("button[value=back-quest]").prop("disabled", false);
                if (data.length > 0) {
                    var unlockedContent = JSON.parse(data);
                    $("#resultModal .modal-body").append("</br>");
                    if (unlockedContent.quest != undefined && unlockedContent.quest.length > 0) {
                        $("#resultModal .modal-body").append(
                            '<p><span class="font-weight-bold">New Quests unlocked!: </span>' + unlockedContent.quest.join(", ") + "</p>"
                        );
                    }
                    if (unlockedContent.character != undefined && unlockedContent.character.length > 0) {
                        $("#resultModal .modal-body").append(
                            '<p><span class="font-weight-bold">New characters unlocked!: </span>' + unlockedContent.character.join(", ") + "</p>"
                        );
                    }
                    if (unlockedContent.element != undefined && unlockedContent.element.length > 0) {
                        $("#resultModal .modal-body").append(
                            '<p><span class="font-weight-bold">New elements unlocked!: </span>' + unlockedContent.element.join(", ") + "</p>"
                        );
                    }
                }
                //$("button[value=retry]").text("Retry");
            },
        });
    } else {
        var localqprogress = JSON.parse(localStorage.getItem("questProgress"));
        var findQuest = localqprogress.findIndex(function(x){return x.questId == questId});
        if (findQuest != -1) {
            hasPlayedOnce = true;
        }
        $.ajax({
            url: "./battleGameplay/recordBattleProgress.php",
            data: {
                record: "progress",
                quest: questId,
                user: "guest",
                played: hasPlayedOnce,
                score: mean
            },
            type: "POST",
            beforeSend: function () {
                $("button[value=retry]").prop("disabled", true);
                $("button[value=back-quest]").prop("disabled", true);
            },
            success: function (data) {
                //console.log(data);
                //record in localstorage
                if (findQuest != -1) {
                    exp = parseInt(exp / 2);
                    localqprogress[findQuest].attempt = localqprogress[findQuest].attempt + 1;
                    if (getPlayerHP() > 0) {
                        localqprogress[findQuest].clear = localqprogress[findQuest].clear + 1;
                        if (mean >= 50) {
                            localqprogress[findQuest].pass = localqprogress[findQuest].pass + 1;
                        }
                    }
                    if (mean > localqprogress[findQuest].maxScore) {
                        localqprogress[findQuest].maxScore = mean;
                    }
                    localqprogress[findQuest].meanScore = 
                        parseInt((localqprogress[findQuest].meanScore * (localqprogress[findQuest].attempt - 1)) + mean) / localqprogress[findQuest].attempt;
                } else {
                    localqprogress.push({
                        questId: questId,
                        attempt: 1,
                        clear: (getPlayerHP() > 0) ? 1 : 0,
                        pass: (getPlayerHP() > 0 && mean >= 50) ? 1 : 0,
                        maxScore: mean,
                        meanScore: mean
                    });
                }
                var localplayer = JSON.parse(localStorage.getItem("player"));
                for (let i = 0 ; i < localplayer.length; i++) {
                    if (localplayer[i].inTeam == 1) {
                        localplayer[i].exp = parseInt(localplayer[i].exp) + exp;
                    } else {
                        localplayer[i].exp = parseInt(localplayer[i].exp) + parseInt(exp / 2);
                    }
                }
                hasPlayedOnce = true;
                $("button[value=retry]").prop("disabled", false);
                $("button[value=back-quest]").prop("disabled", false);
                if (data.length > 0) {
                    var unlockedContent = JSON.parse(data);
                    $("#resultModal .modal-body").append("</br>");
                    if (unlockedContent.quest != undefined && unlockedContent.quest.length > 0) {
                        $("#resultModal .modal-body").append(
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
                        $("#resultModal .modal-body").append(
                            '<p><span class="font-weight-bold">New characters unlocked!: </span>' +
                                message +
                                "</p>"
                        );
                    }
                    if (unlockedContent.element != undefined && unlockedContent.element.length > 0) {
                        $("#resultModal .modal-body").append(
                            '<p><span class="font-weight-bold">New elements unlocked!: </span>' + unlockedContent.element.join(", ") + "</p>"
                        );
                    }
                }
                localStorage.setItem("player", JSON.stringify(localplayer));
                localStorage.setItem("questProgress", JSON.stringify(localqprogress));
            },
        });
    }

    $("#resultModal").modal("show");
}

function getBattleContent(id) {
    questId = id;
    $.ajax({
        url: "./battleGameplay/getBattleContent.php",
        data: { quest: questId },
        type: "POST",
        success: function (response) {
            //gen battle detail or pass to some public variable
            //console.log(response);
            var data = JSON.parse(response);
            player = data.player;
            mobsUnique = data.mob;
            wave = data.wave;
            user = data.isGuest;
            unlockedElement = data.element;

            if (data.isGuest === true) {
                var filterPlayer = [];
                var localplayer = JSON.parse(localStorage.getItem("player"));
                for (let i = 0; i < localplayer.length; i++) {
                    if (localplayer[i].inTeam == 1) {
                        var findChar = player.find(function(x){return x.id == localplayer[i].charId});
                        var charExp = 0;
                        var charLevel = 0;
                        for (let j = 1; j <= 50 && charExp <= localplayer[i].exp; j++) {
                            charExp = Math.round(0.32 * (j - 1) ** 3 + 6.4 * (j - 1) ** 2 + 16 * (j - 1));
                            if (charExp > localplayer[i].exp) {
                                charLevel = j - 1;
                            }
                        }
                        if (charExp > Math.round(0.32 * 49 ** 3 + 6.4 * 49 ** 2 + 16 * 49)) {
                            charLevel = 49;
                        }
                        var charHp = parseInt(findChar.hp) + (charLevel - 1) * 20;
                        var playerData = {
                            hp: charHp,
                            maxHP: charHp, 
                            skill: findChar.skill,
                            name: findChar.name,
                            level: charLevel
                        };
                        filterPlayer.push(playerData);
                    }
                }
                player = filterPlayer;

                var filterSort = [];
                var localqprogress = JSON.parse(localStorage.getItem("questProgress"));
                for (let i = 0; i < unlockedElement.length; i++) {
                    var findQuest = localqprogress.find(function(x){return x.questId == unlockedElement[i].requireQuest});
                    if (findQuest != undefined) {
                        filterSort.push(unlockedElement[i].sort);
                    }
                }
                unlockedElement = filterSort;
            }

            var totalHP = getPlayerHP();
            var i = 0;
            $(".char-card").each(function () {
                if (i < player.length) {
                    $(this).text(player[i].name);
                } else {
                    $(this).removeClass("bg-secondary");
                    $(this).addClass("bg-dark");
                    $(this).html("&nbsp;");
                }
                i++;
            });

            i = 0;
            $(".skill-list button").each(function () {
                if (i < player.length) {
                    $(this).show();
                    $(this).html(player[i].skill.name + ' (' + player[i].skill.element + ') <img src="../elementPic/' + player[i].skill.element + '.png" style="width:30px;height:30px;">');
                    i++;
                } else if (i == player.length) {
                    $(this).show();
                    $(this).text("Defend");
                    $(this).val("defend");
                    i++;
                } else {
                    $(this).hide();
                }
            });

            $(".stat .hp").text(totalHP);
            $(".stat .hp").attr("data-hp-max", totalHP);

            initWave();
        },
    });
}

function updateMenuDetail(battleDesc) {
    battleDetail = battleDesc;
    //console.log(battleDesc);
    $(".battle-description .quest-detail").text(battleDesc.desc);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(0)").text(battleDesc.element.Water == null ? "??" : battleDesc.element.Water);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(1)").text(battleDesc.element.Fire == null ? "??" : battleDesc.element.Fire);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(2)").text(battleDesc.element.Earth == null ? "??" : battleDesc.element.Earth);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(3)").text(battleDesc.element.Wind == null ? "??" : battleDesc.element.Wind);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(4)").text(battleDesc.element.Dark == null ? "??" : battleDesc.element.Dark);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(5)").text(battleDesc.element.Light == null ? "??" : battleDesc.element.Light);
    $(".battle-description .element-affinity tr:eq(1) > td:eq(6)").text(battleDesc.element.Ice == null ? "??" : battleDesc.element.Ice);
    $(".battle-description .total-wave").text(battleDesc.wave);
}

$(document).ready(function () {
    //playBGM("../audio/battleBGM.mp3");
    $("html, body").animate({ scrollTop: $(".content").offset().top }, 100);
    $(".hp").css("width", "100%");

    $(window).unbind("resize");
    $(window).resize(function () {
        if ($("html").innerWidth() <= 820) {
            $(".battle-bg > div").removeClass("col-sm-4").addClass("col-sm-12");
            $(".hp-bar > div:first").removeClass("col-sm-1");
            $(".hp-bar > div:last").removeClass("col-sm-11");
            $("#menuModal .modal-body .row > div").removeClass("col-sm-6").addClass("col-sm-12");
            $(".compare-result-latest").parent().show();
        } else {
            $(".battle-bg > div").removeClass("col-sm-12").addClass("col-sm-4");
            $(".hp-bar > div:first").addClass("col-sm-1");
            $(".hp-bar > div:last").addClass("col-sm-11");
            $("#menuModal .modal-body .row > div").removeClass("col-sm-12").addClass("col-sm-6");
            $(".compare-result-latest").parent().hide();
            $("#logModal").modal("hide");
        }
    });

    //adjustment for mobile and table portrait mode user
    if ($("html").innerWidth() <= 820) {
        $(".battle-bg > div").removeClass("col-sm-4").addClass("col-sm-12");
        $(".hp-bar > div:first").removeClass("col-sm-1");
        $(".hp-bar > div:last").removeClass("col-sm-11");
        $("#menuModal .modal-body .row > div").removeClass("col-sm-6").addClass("col-sm-12");
        $(".compare-result-latest").parent().show();
    } else {
        $(".battle-bg > div").removeClass("col-sm-12").addClass("col-sm-4");
        $(".hp-bar > div:first").addClass("col-sm-1");
        $(".hp-bar > div:last").addClass("col-sm-11");
        $("#menuModal .modal-body .row > div").removeClass("col-sm-12").addClass("col-sm-6");
        $(".compare-result-latest").parent().hide();
    }
});

$(".skill-list button").click(function () {
    if ($(this).val() == "defend") {
        //defend
        defend = true;
        $(".instruction").text("Everyone puts on a guarding pose!");
        //shift turn
        turn = 1;
        turn = enemyTurn();
        if (turn == 1) {
            getResult();
        }
    } else {
        defend = false;
        var clickedSkill = player[$(this).val()].skill.sort; //{skill: "heal", sort: "random"}
        skillOwner = player[$(this).val()];
        if (clickedSkill == "random") {
            heal = true;
            clickedSkill = unlockedElement[Math.floor(Math.random() * unlockedElement.length)];
        }
        var sortFullName = "";
        if (clickedSkill == "bubble") {
            sortFullName = "Bubble Sort";
        } else if (clickedSkill == "insertion") {
            sortFullName = "Insertion Sort";
        } else if (clickedSkill == "selection") {
            sortFullName = "Selection Sort";
        } else if (clickedSkill == "merge") {
            sortFullName = "Merge Sort";
        } else if (clickedSkill == "quick") {
            sortFullName = "Quick Sort";
        } else if (clickedSkill == "heap") {
            sortFullName = "Heap Sort";
        } else if (clickedSkill == "counting") {
            sortFullName = "Distribution Counting Sort";
        }

        $(".instruction").text("Sort objects in ascending order, using " + sortFullName);
        $(".skill-list div").hide();
        $(".sort-calc").show();
        $(".dmg-calc").empty();
        $(".dmg-calc").load("./sortGameplay/sortGameplay.php", function () {
            //$(".dmg.calc").attr("data-sort-type", clickedSkill);
            addObject = Math.floor(parseInt(skillOwner.level) / 10);
            $(".dmg-calc .sort-help").parent().hide();
            $(".dmg-calc .compare-log").hide();
            $(".dmg-calc .action-log").hide();
            $("tbody.compare-log").empty();
            $("tbody.action-log").empty();
            $(".dmg-calc").attr("data-sort-score", null);
            $(".sort-obj").attr("data-sort-type", clickedSkill);
            $(".action-list > button").show();
        });
    }
});

$(".action-list button").click(function () {
    if ($(this).val() == "cancel") {
        $(".skill-list div").show();
        $(".sort-calc").hide();
        $(".instruction").text("Choose Skill to use.");
        heal = false;
    }
    else if ($(this).val() == "done") {
        b_animationQueue = [];
        //evaluate score
        if ($(".dmg-calc").attr("data-sort-score") == undefined) {
            closeSortGameplay($(".dmg-calc"));
        }
        $(".action-list > button[value=done]").hide();

        var damage = parseInt($(".dmg-calc").attr("data-sort-score")) * skillOwner.level;
        score.push(parseInt($(".dmg-calc").attr("data-sort-score")));
        //record sort progress
        if (user !== true) {
            $.ajax({
                url: "./battleGameplay/recordBattleProgress.php",
                data: {
                    record: "sort",
                    user: user,
                    score: parseInt($(".dmg-calc").attr("data-sort-score")),
                    sort: $(".sort-obj").attr("data-sort-type"),
                },
                type: "POST",
            });
        } else {
            //record in localstorage
            var sort = $(".sort-obj").attr("data-sort-type");
            var sortId = 0;
            if (sort == "bubble") {
                sortId = 1;
            } else if (sort == "insertion") {
                sortId = 2;
            } else if (sort == "selection") {
                sortId = 3;
            } else if (sort == "heap") {
                sortId = 4;
            } else if (sort == "merge") {
                sortId = 5;
            } else if (sort == "quick") {
                sortId = 6;
            } else if (sort == "counting") {
                sortId = 7;
            }
            var localsprogress = JSON.parse(localStorage.getItem("sortProgress"));
            var sortToRecord = localsprogress.findIndex(function(x){return x.sort == sortId});
            if (sortToRecord != -1) {
                localsprogress[sortToRecord].attempt = localsprogress[sortToRecord].attempt + 1;
                if (localsprogress[sortToRecord].maxScore < parseInt($(".dmg-calc").attr("data-sort-score"))) {
                    localsprogress[sortToRecord].maxScore = parseInt($(".dmg-calc").attr("data-sort-score"));
                }
                if (parseInt($(".dmg-calc").attr("data-sort-score")) >= 100) {
                    localsprogress[sortToRecord].fullScore = localsprogress[sortToRecord].fullScore + 1;
                }
                localsprogress[sortToRecord].meanScore = 
                    ((localsprogress[sortToRecord].meanScore * (localsprogress[sortToRecord].attempt - 1)) + 
                        parseInt($(".dmg-calc").attr("data-sort-score"))) / localsprogress[sortToRecord].attempt;
                localStorage.setItem("sortProgress", JSON.stringify(localsprogress));
            }
        }
        //animation
        //damage calc (no element consideration yet)
        var i = 0;
        if (heal == false) {
            var mobWave = mobsUnique.find(function (x) {
                return x.id == wave[waveCount][0];
            });
            if (mobWave.element[$(".sort-obj").attr("data-sort-type")] == "Wk") {
                damage = damage * 2;
                $(".mob-sprite:visible .dmg-hit").text("Weak! " + damage);
            } else if (mobWave.element[$(".sort-obj").attr("data-sort-type")] == "St") {
                damage = Math.round(damage / 2);
                $(".mob-sprite:visible .dmg-hit").text("Strong... " + damage);
            } else if (mobWave.element[$(".sort-obj").attr("data-sort-type")] == "Nu") {
                damage = 0;
                $(".mob-sprite:visible .dmg-hit").text("BLOCK");
            } else if (mobWave.element[$(".sort-obj").attr("data-sort-type")] == "Rf") {
                damage = Math.round(damage / 3);
                $(".player-char .dmg-hit").text(damage);
                $(".mob-sprite:visible .dmg-hit").text("REFLECT");

                $(".player-char .dmg-hit").animate({opacity: 1}, 150);
                $(".player-char .dmg-hit").delay(450).animate({opacity: 0}, 150);
                $(".stat .hp").animate({width: "-=" + (100 * (player.length * damage)) / $(".stat .hp").attr("data-hp-max")}, {
                    duration: 150,
                    done: function() {
                        var hpRemain = parseInt($(".stat .hp").text()) - player.length * damage;
                        if (hpRemain <= 0) {
                            hpRemain = 0;
                        }
                        $(".stat .hp").text(hpRemain)
                    }
                });

                /*b_animationQueue.push({ object: $(".player-char .dmg-hit"), action: { opacity: 1 }, option: { duration: 150 } });
                b_animationQueue.push({ object: $(".player-char .dmg-hit"), action: { opacity: 0 }, option: { duration: 150 } });
                b_animationQueue.push({
                    object: $(".stat .hp"),
                    action: { width: "-=" + (100 * (player.length * damage)) / $(".stat .hp").attr("data-hp-max") },
                    option: {
                        duration: 150,
                        done: function () {
                            var hpRemain = parseInt($(".stat .hp").text()) - player.length * damage;
                            if (hpRemain <= 0) {
                                hpRemain = 0;
                            }
                            $(".stat .hp").text(hpRemain);
                        },
                    },
                });*/

                for (let i = 0; i < player.length; i++) {
                    if (player[i].hp > 0) {
                        player[i].hp = player[i].hp - damage;
                    }
                    //player dies
                    if (player[i].hp <= 0) {
                        player[i].hp = 0;
                        $(".char-card:eq(" + i + ")").removeClass("bg-secondary");
                        $(".char-card:eq(" + i + ")").addClass("bg-dark", 150);
                    }
                }
                //$(".stat .hp").text(getPlayerHP());
                //damage = 0;
            } else if (mobWave.element[$(".sort-obj").attr("data-sort-type")] == "Dr") {
                damage = -damage;
                $(".mob-sprite:visible .dmg-hit").text("DRAIN");
            } else {
                $(".mob-sprite:visible .dmg-hit").text(damage);
            }

            $(".mob-sprite .hp:visible").each(function () {
                var hpNow = $(this).attr("data-hp-now") - (mobWave.element[$(".sort-obj").attr("data-sort-type")] == "Rf" ? 0 : damage);
                var thisMob = mobsUnique.find(function (x) {
                    return x.id == wave[waveCount][i];
                });
                $(this).attr("data-hp-now", hpNow);

                /*
                b_animationQueue.push({ object: $(".mob-sprite:visible .dmg-hit:eq(" + i + ")"), action: { opacity: 1 }, option: { duration: 150 } });
                b_animationQueue.push({ object: $(this), action: { width: (hpNow / thisMob.hp) * 100 + "%" }, option: { duration: 150 } });
                b_animationQueue.push({ object: $(".mob-sprite:visible .dmg-hit:eq(" + i + ")"), action: { opacity: 0 }, option: { duration: 150 } });

                if (hpNow <= 0) {
                    //console.log("dead - mob" + i);
                    b_animationQueue.push({ object: $(".mob-sprite:visible:eq(" + i + ")"), action: { opacity: 0 }, option: { duration: 150 } });
                }
                */

                var optionObj = {duration: 150};
                if (i == $(".mob-sprite .hp:visible").length - 1) {
                    optionObj["done"] = function() {
                        $(".skill-list div").show();
                        $(".sort-calc").hide();

                        $(".mob-sprite .hp").each(function () {
                            if (i < wave[waveCount].length) {
                                if ($(this).attr("data-hp-now") <= 0) {
                                    //console.log("hide - mob" + i);
                                    $(".mob-sprite:eq(" + i + ")").hide();
                                    //$(".mob-sprite").css("opacity", 1);
                                } else {
                                    $(".mob-sprite:eq(" + i + ")").show();
                                }
                            }
                            i++;
                        });

                        if ($(".mob-sprite:visible").length == 0) {
                            waveCount++;
                            if (waveCount < wave.length) {
                                initWave();
                            } else {
                                //clear battle
                                //alert("battle cleared")
                                getResult();
                                //record score
                            }
                        } else {
                            turn = 1;
                            if (
                                player.filter(function (x) {
                                    return x.hp <= 0;
                                }).length < player.length
                            ) {
                                turn = enemyTurn();
                            } else {
                                getResult();
                            }
                            if (turn == 1) {
                                getResult();
                            }
                        }
                    }
                }

                $(".mob-sprite:visible .dmg-hit:eq(" + i + ")").animate({opacity: 1}, 150);
                $(".mob-sprite:visible .dmg-hit:eq(" + i + ")").delay(450).animate({opacity: 0}, 150);
                if (hpNow <= 0) {
                    $(".mob-sprite:eq(" + i + ")").delay(350).fadeOut(150);
                }
                $(this).delay(450).animate({width: (hpNow / thisMob.hp) * 100 + "%"}, optionObj);

                i++;
            });
        } else {
            heal = false;
            for (let i = 0; i < player.length; i++) {
                if (player[i].hp > 0) {
                    if (player[i].hp + damage <= player[i].maxHP) {
                        player[i].hp = player[i].hp + damage;
                    } else {
                        player[i].hp = player[i].maxHP;
                    }
                }
            }

            $(".stat .hp").animate({width: (100 * getPlayerHP()) / $(".stat .hp").attr("data-hp-max") + "%"}, { 
                duration: 150, 
                done: function(){ $(".stat .hp").text(getPlayerHP()); }
            });

            /*
            b_animationQueue.push({
                object: $(".stat .hp"),
                action: { width: (100 * getPlayerHP()) / $(".stat .hp").attr("data-hp-max") + "%" },
                option: {
                    duration: 150,
                    done: function () {
                        $(".stat .hp").text(getPlayerHP());
                    },
                },
            });
            */
        }

        /*
        b_executeAnimationQueue(
            0,
            function () {},
            function () {
                var i = 0;
                $(".mob-sprite .hp").each(function () {
                    if (i < wave[waveCount].length) {
                        if ($(this).attr("data-hp-now") <= 0) {
                            //console.log("hide - mob" + i);
                            $(".mob-sprite:eq(" + i + ")").hide();
                            //$(".mob-sprite").css("opacity", 1);
                        } else {
                            $(".mob-sprite:eq(" + i + ")").show();
                        }
                    }
                    i++;
                });

                $(".skill-list div").show();
                $(".sort-calc").hide();
                //console.log($(".mob-sprite:visible").length);
                if ($(".mob-sprite:visible").length == 0) {
                    waveCount++;
                    if (waveCount < wave.length) {
                        initWave();
                    } else {
                        //clear battle
                        //alert("battle cleared")
                        getResult();
                        //record score
                    }
                } else {
                    turn = 1;
                    if (
                        player.filter(function (x) {
                            return x.hp <= 0;
                        }).length < player.length
                    ) {
                        turn = enemyTurn();
                    } else {
                        getResult();
                    }
                    if (turn == 1) {
                        getResult();
                    }
                }
            }
        );
        */
    }
});

$("#menuModal button, #resultModal button").click(function () {
    $("#menuModal").modal("hide");
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");

    if ($(this).val() == "retry") {
        //reset
        var category = $("button[value=back-quest]:first").attr("data-quest-category");
        var battle_desc_temp = battleDetail;
        var quest_id_temp = questId;
        var bgPic = $(".mobs").css("background-image");
        var has_played_temp = hasPlayedOnce;
        var exp_temp = expReward;
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./battleGameplay/battleGameplay.php", function () {
            $("button[value=back-quest]").attr("data-quest-category", category);
            $(".mobs").css("background-image", bgPic);
            getBattleContent(quest_id_temp);
            updateMenuDetail(battle_desc_temp);
            hasPlayedOnce = has_played_temp;
            expReward = exp_temp;
            $(".loading-page").fadeOut(500);
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

$(".battle-setting").click(function () {
    $("#menuModal").modal("hide");
    $(".modal-backdrop").remove();
    $("body").removeClass("modal-open");
    $(".setting-modal .card:eq(2)").hide();
});