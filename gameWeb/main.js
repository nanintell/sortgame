function playBGM(music) {
    var soundOn = localStorage.getItem("sound");
    var bgmVolume = localStorage.getItem("volume") / 100;
    var trackChange = false;
    if(music != undefined && music != $("#bgm-player > source").attr("src"))
    {
        $("#bgm-player > source").attr("src", music);
        trackChange = true;
    }
    if (soundOn == 0) {
        $("#bgm-player")[0].pause();
    } else {
        if (trackChange == true || $("#bgm-player")[0].paused == true) {
            $("#bgm-player")[0].load();
            $("#bgm-player")[0].play();
            $("#bgm-player")[0].loop = true;
            //if audio doesn't play after play command due to browser or whatever, set sound setting to off
            /*if ($("#bgm-player")[0].paused == true) {
                localStorage.setItem("sound", 0);
                $(".sound-toggle label").removeClass("active");
                $(".sound-toggle input[value=sound-off]")
                    .parent()
                    .addClass("active");
                $(".sound-toggle input[value=sound-off]").prop("checked", true);
                $(".sound-value").hide();
            } else {
                localStorage.setItem("sound", 1);
                $(".sound-toggle label").removeClass("active");
                $(".sound-toggle input[value=sound-on]")
                    .parent()
                    .addClass("active");
                $(".sound-toggle input[value=sound-on]").prop("checked", true);
                $(".sound-value").show();
                $(".sound-value input").val(bgmVolume == null ? 100 : bgmVolume * 100);
            }*/
        }
        if (bgmVolume > 0) {
            $("#bgm-player")[0].volume = bgmVolume;
        }
    }
}

$(document).ready(function () {
    //apply setting stored in localstorage
    //theme
    $(".loading-page").show();
    var theme = localStorage.getItem("theme");
    var soundOn = localStorage.getItem("sound");
    var bgmVolume = localStorage.getItem("volume");
    var sortAnimation = localStorage.getItem("sort-duration");
    var showValue = localStorage.getItem("show-value");
    if (theme == "light-theme") {
        $("body").removeClass("dark-mode");
    } else {
        theme = "dark-theme"
        if ($("body").hasClass("dark-mode") == false) {
            $("body").addClass("dark-mode");
        }
    }

    //set setting values
    //theme
    $(".website-theme label").removeClass("active");
    $(".website-theme input[value=" + theme + "]")
        .parent()
        .addClass("active");
    $(".website-theme input[value=" + theme + "]").prop("checked", true);
    //sound
    var soundValue = "";
    if (soundOn == 0) {
        soundValue = "sound-off";
        $(".sound-value").hide();
    } else {
        soundValue = "sound-on";
        $(".sound-value").show();
    }
    $(".sound-toggle label").removeClass("active");
    $(".sound-toggle input[value=" + soundValue + "]")
        .parent()
        .addClass("active");
    $(".sound-toggle input[value=" + soundValue + "]").prop("checked", true);
    //volume
    $(".sound-value input").val(bgmVolume == null ? 100 : bgmVolume);
    //sort duration
    var sortSpeed = "default";
    if (sortAnimation == "300") {
        sortSpeed = "default";
    } else if (sortAnimation == "450") {
        sortSpeed = "slow";
    } else if (sortAnimation == "150") {
        sortSpeed = "fast";
    }
    $(".animation-duration label").removeClass("active");
    $(".animation-duration input[value=" + sortSpeed + "]")
        .parent()
        .addClass("active");
    $(".animation-duration input[value=" + sortSpeed + "]").prop("checked", true);
    //show value
    var showSettingValue = "show-value"
    if(showValue == 0) {
        showSettingValue = "hide-value"
        $(".value-toggle-desc").text("Values will be hidden. Turning this off will add additional functions to compare marbles.");
    } else {
        $(".value-toggle-desc").text("Values will be shown in each marble in CAI.");
    }
    $(".value-toggle label").removeClass("active");
    $(".value-toggle input[value=" + showSettingValue + "]")
        .parent()
        .addClass("active");
    $(".value-toggle input[value=" + showSettingValue + "]").prop("checked", true);

    //load homepage
    $(".content").empty();
    $(".content").load("./homepage/homepage.php", function () {
        expandLoginPage(false);
        $(".loading-page").fadeOut(500);
        $(".content-header").show();
    });
});

$(".content").click(function (event) {
    if ($(event.target).hasClass("battle-gameplay")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./battleGameplay/battleGameplay.php", function () {
            $("body").css("padding-right", 0);
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("story-gameplay")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./storyQuest/storyQuest.php", function() {
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("quiz-gameplay")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./quizQuest/quizQuest.php", function() {
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("quest-list")) {
        $(".loading-page").show();
        $(".content").empty();
        playBGM("../audio/questBGM.mp3");
        $(".content").load("./questList/questList.php", function() {
            $(".quest-background").attr("data-quest-category", "");
            $(".prev-page").addClass("homepage");
            $(".category-option").show();
            $(".master-quest-detail").hide();
            $(".master-quest").hide();
            
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("library")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./library/library.php", function () {
            $(".library-background").attr("data-content-title", "library");
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("gameplay-progress")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./library/library.php", function () {
            $(".library-background").attr("data-content-title", "progress");
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("team-setting")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./teamSetting/teamSetting.php", function() {
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("homepage")) {
        $(".loading-page").show();
        $(".content").empty();
        playBGM("../audio/homepageBGM.mp3");
        $(".content").load("./homepage/homepage.php", function () {
            $.ajax({
                url: "./homepage/checkUser.php",
                data: { studentId: 0 },
                type: "POST",
                success: function (data) {
                    //console.log(data);
                    var response = JSON.parse(data);
                    $(".welcome-card .card-body").remove();
                    $(".quest-list").prop("disabled", false);
                    if (response.studentId != "guest") {
                        var firstName = response.name.trim().split(" ")[0];
                        firstName = firstName[0].toUpperCase() + firstName.slice(1);
                        $(".welcome-card h3").text("Welcome, " + firstName);
                        if(response.cleared == "1") {
                            $("footer").slideDown();
                        } else {
                            $("footer").hide();
                        }
                        //log in when deadline has already passed less than 7 days, no play
                        if (response.deadline != null) {
                            var due = new Date(response.deadline);
                            var today = new Date();
                            var nextWeek = new Date(response.deadline);
                            var next3days = new Date(response.deadline);
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            next3days.setDate(next3days.getDate() - 3);
                            //console.log(due);
                            //console.log(today);
                            //console.log(nextWeek);
                            //console.log(next3days);
                            if (due <= today) {
                                $("footer").slideDown();
                            } else if (response.cleared != "1") {
                                $("footer").hide();
                            }

                            if (due > today || nextWeek <= today) {
                                $(".quest-list").prop("disabled", false);
                                if (due > today && next3days <= today) {
                                    $(".welcome-card").append(
                                        '<div class="card-body"><h4 class="text-danger">HURRY! DUE DATE IN LESS THAN 3 DAYS</h4></div>'
                                    );
                                }
                            } else {
                                $(".welcome-card").append('<div class="card-body"><h4 class="text-danger">DUE DATE HAS PASSED</h4></div>');
                                $(".quest-list").prop("disabled", true);
                            }
                        }
                    } else {
                        $(".welcome-card h3").text("Welcome, Guest. (Please beware that progress you made is not shared with your account.)");
                    }
                    $(".loading-page").fadeOut(500);
                    $(".content-header").show();
                },
            });
        });
    } else if ($(event.target).hasClass("contact")) {
        window.open("http://m.me/Nanintell", "_blank"); //messenger nan
    }
});

//////////////////////////////////////////////////////////////
//setting event listeners
$(".sound-toggle input").click(function () {
    var soundOn = 1;
    if ($(this).val() == "sound-on") {
        $(".sound-value").show();
    } else {
        soundOn = 0;
        $(".sound-value").hide();
    }
    //store value
    localStorage.setItem("sound", soundOn);
    playBGM();
});

$(".sound-value input[type=range]").on("input", function () {
    $(".sound-value input[type=text]").val($(this).val());
    $("#bgm-player")[0].volume = $(this).val() / 100;

    //store value
    localStorage.setItem("volume", $(this).val());
});

$(".website-theme input").click(function () {
    var theme = $(this).val();
    //change theme
    if (theme == "light-theme") {
        $("body").removeClass("dark-mode");
    } else if (theme == "dark-theme") {
        if ($("body").hasClass("dark-mode") == false) {
            $("body").addClass("dark-mode");
        }
    }
    //store value
    localStorage.setItem("theme", theme);
});

$(".animation-duration input[type=range]").on("input", function () {
    $(".animation-duration input[type=text]").val($(this).val() / 100);
    //$("#bgm-player")[0].volume = $(this).val() / 100;
    /*var duration = 150;
    if (speed == "slow") {
        duration = 450;
    } else if (speed == "default") {
        duration = 300;
    } else if (speed == "fast") {
        duration = 150;
    }*/
});

$(".animation-duration input[type=range]").change(function() {
    var speed = $(this).val();
    //store value (animation will be used in sort cai file)
    localStorage.setItem("sort-duration", speed);
    //reload sort cai in homepage
    var sort = $(".sort-type-option").val();
    var addobj = parseInt($(".add-object option:selected").text());
    $(".sort-gameplay").empty();
    $(".sort-gameplay").load("./sortGameplay/sortGameplay.php", function () {
        $(".sort-obj").attr("data-sort-type", sort);
        addObject = addobj;
    });
});

/*
$(".animation-duration input").click(function () {
    var speed = $(this).val();
    var duration = 150;
    if (speed == "slow") {
        duration = 450;
    } else if (speed == "default") {
        duration = 300;
    } else if (speed == "fast") {
        duration = 150;
    }
    //store value (animation will be used in sort cai file)
    localStorage.setItem("sort-duration", duration);
    //reload sort cai in homepage
    var sort = $(".sort-type-option").val();
    var addobj = parseInt($(".add-object option:selected").text());
    $(".sort-gameplay").empty();
    $(".sort-gameplay").load("./sortGameplay/sortGameplay.php", function () {
        $(".sort-obj").attr("data-sort-type", sort);
        addObject = addobj;
    });
});
*/

$(".value-toggle input").click(function () {
    var showValue = 1;
    if ($(this).val() == "hide-value") {
        showValue = 0;
        $(".value-toggle-desc").text("Values will be hidden. Turning this off will add additional functions to compare marbles.");
    } else {
        $(".value-toggle-desc").text("Values will be shown in each marble in CAI.");
    }
    //store value
    localStorage.setItem("show-value", showValue);
    //reload sort cai in homepage
    var sort = $(".sort-type-option").val();
    var addobj = parseInt($(".add-object option:selected").text());
    $(".sort-gameplay").empty();
    $(".sort-gameplay").load("./sortGameplay/sortGameplay.php", function () {
        $(".sort-obj").attr("data-sort-type", sort);
        addObject = addobj;
    });
});

$(".close-setting").click(function() {
    $(".setting-modal .card").show();
});
//////////////////////////////////////////////////////////////
