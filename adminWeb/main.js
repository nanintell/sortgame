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
    var theme = localStorage.getItem("theme");
    var soundOn = localStorage.getItem("sound");
    var bgmVolume = localStorage.getItem("volume");
    if (theme == "light-theme" || theme == null) {
        if(theme == null) {
            theme = "light-theme"
        }
        $("body").removeClass("dark-mode");
    } else if (theme == "dark-theme") {
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

    //load homepage
    $(".loading-page").show();
    $(".content").empty();
    $(".content").load("./homepage/homepage.php", function () {
        expandLoginPage(false);
        $(".loading-page").fadeOut(500);
    });
});

$(".content").click(function (event) {
    /*if ($(event.target).hasClass("battle-gameplay")) {
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
    } else*/ if ($(event.target).hasClass("quest-list")) {
        $(".loading-page").show();
        playBGM("../audio/questBGM.mp3");
        $(".content").empty();
        $(".content").load("./questList/questList.php", function() {
            $(".loading-page").fadeOut(500);
            $(".quest-background").attr("data-quest-category", "");
            $(".prev-page").addClass("homepage");
            $(".category-option").show();
            $(".master-quest-detail").hide();
            $(".master-quest").hide();
            $(".content-header").hide();
        });
    } /*else if ($(event.target).hasClass("library")) {
        $(".content").empty();
        $(".content").load("./library/library.php", function () {
            $(".library-background").attr("data-content-title", "library");
        });
    }*/ else if ($(event.target).hasClass("gameplay-progress")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./library/library.php", function () {
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
            //$(".library-background").attr("data-content-title", "progress");
        });
    } else if ($(event.target).hasClass("group-setting")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./groupSetting/groupSetting.php", function() {
            $(".loading-page").fadeOut(500);
            $(".content-header").hide();
        });
    } else if ($(event.target).hasClass("homepage")) {
        $(".loading-page").show();
        $(".content").empty();
        $(".content").load("./homepage/homepage.php", function () {
            playBGM("../audio/homepageBGM.mp3");
            $.ajax({
                url: "./homepage/checkAdmin.php",
                data: { id: -1 },
                type: "POST",
                success: function (data) {
                    //console.log(data);
                    var response = JSON.parse(data);
                    if (response.adminId != undefined) {
                        $(".welcome-card h3").text("Welcome, " + response.name);
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

/*$(".animation-duration input").click(function () {
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
    var sort = $(".sort-type-option option:selected").text();
    $(".sort-gameplay").empty();
    $(".sort-gameplay").load("./sortGameplay/sortGameplay.php", function () {
        $(".sort-obj").attr("data-sort-type", sort);
    });
});*/

$(".close-setting").click(function() {
    $(".setting-modal .card").show();
    $(".setting-modal .card").CardWidget('collapse');
})
//////////////////////////////////////////////////////////////
