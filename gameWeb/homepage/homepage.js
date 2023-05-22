function collapseLoginPage() {
    $(".log-in").prop("disabled", true);
    $(".log-in").ControlSidebar("collapse");
    $(".login-sidebar").css("width", "100%");
    $(".login-sidebar").animate({ width: "0%" }, 300);

    $("body").css("overflow-y", "auto");

    playBGM("../audio/homepageBGM.mp3");
}

function expandLoginPage(animate) {
    $("#bgm-player")[0].pause();

    $(".log-in").ControlSidebar("show");
    $(".login-box input").val("");
    $(".login-sidebar").css("width", "0%");
    if (animate) {
        $(".login-sidebar").animate({ width: "100%" }, 300);
        if ($("footer").css("display") != "none") {
            $("footer").slideUp();
        }
    } else {
        $(".login-sidebar").css("width", "100%");
        $("footer").hide();
    }

    $("html, body").animate({ scrollTop: 0 }, {
        duration: 100,
        complete: function() {
            $("body").css("overflow-y", "hidden");
        }
    });
}

$(document).ready(function () {
    var sort = $(".sort-type-option").val();
    $(".sort-gameplay").empty();
    $(".sort-gameplay").load("./sortGameplay/sortGameplay.php", function () {
        $(".sort-obj").attr("data-sort-type", sort);
    });

    $(window).unbind("resize");
    $(window).resize(function () {
        //console.log($("html").innerWidth());
        $(".game-menu > .card-header").hide();
        if ($("html").innerWidth() <= 820) {
            $(".cai-playground").parents(".col-sm-9").removeClass("col-sm-9").addClass("col-sm-12");
            $(".game-menu").parents(".col-sm-3").removeClass("col-sm-3").addClass("col-sm-12");
            $(".cai-playground").CardWidget("collapse");
            $(".game-menu").CardWidget("expand");
    
            //event listener exclusive to mobile
            $(".cai-playground > .card-header").click(function () {
                if ($(this).parent().hasClass("collapsed-card") || $(this).parent().hasClass("collapsing-card")) {
                    $(this).parent().CardWidget("expand");
                    $(".game-menu").CardWidget("collapse");
                    $(".game-menu > .card-header").slideDown();
                    $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem - 3.1rem)" });
                } else {
                    $(".game-menu").CardWidget("expand");
                    $(".game-menu > .card-header").slideUp();
                    $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem)" });
                }
            });
    
            $(".game-menu > .card-header").click(function () {
                if ($(this).parent().hasClass("collapsed-card") || $(this).parent().hasClass("collapsing-card")) {
                    $(this).parent().CardWidget("expand");
                    $(".cai-playground").CardWidget("collapse");
                    $(".game-menu > .card-header").slideUp();
                    $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem)" });
                } else {
                    $(this).parent().CardWidget("collapse");
                    $(".cai-playground").CardWidget("expand");
                    $(".game-menu > .card-header").slideDown();
                    $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem - 3.1rem)" });
                }
            });
        } else {
            $(".cai-playground").parents(".col-sm-12").removeClass("col-sm-12").addClass("col-sm-9");
            $(".game-menu").parents(".col-sm-12").removeClass("col-sm-12").addClass("col-sm-3");
            $(".cai-playground").CardWidget("expand");
            $(".game-menu").CardWidget("expand");
            $(".cai-playground > .card-header").unbind("click");
            $(".game-menu > .card-header").unbind("click");
        }
    });

    //adjustment for mobile and table portrait mode user
    $(".game-menu > .card-header").hide();
    if ($("html").innerWidth() <= 820) {
        $(".cai-playground").parents(".col-sm-9").removeClass("col-sm-9").addClass("col-sm-12");
        $(".game-menu").parents(".col-sm-3").removeClass("col-sm-3").addClass("col-sm-12");
        $(".cai-playground").CardWidget("collapse");
        $(".game-menu").CardWidget("expand");

        //event listener exclusive to mobile
        $(".cai-playground > .card-header").click(function () {
            if ($(this).parent().hasClass("collapsed-card") || $(this).parent().hasClass("collapsing-card")) {
                $(this).parent().CardWidget("expand");
                $(".game-menu").CardWidget("collapse");
                $(".game-menu > .card-header").slideDown();
                $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem - 3.1rem)" });
            } else {
                $(".game-menu").CardWidget("expand");
                $(".game-menu > .card-header").slideUp();
                $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem)" });
            }
        });

        $(".game-menu > .card-header").click(function () {
            if ($(this).parent().hasClass("collapsed-card") || $(this).parent().hasClass("collapsing-card")) {
                $(this).parent().CardWidget("expand");
                $(".cai-playground").CardWidget("collapse");
                $(".game-menu > .card-header").slideUp();
                $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem)" });
            } else {
                $(this).parent().CardWidget("collapse");
                $(".cai-playground").CardWidget("expand");
                $(".game-menu > .card-header").slideDown();
                $(".game-menu > .card-body").animate({ height: "calc(100vh - 2.3rem - 20px - 6.75rem - 3.25rem - 1rem - 3.1rem)" });
            }
        });
    }
});

//////////////////////////////////////////////////////////////
//log in event listeners
$(".log-out").click(function () {
    $.ajax({
        url: "./homepage/clearSession.php",
        success: function () {
            expandLoginPage(true);
        },
    });
});

$(".log-in").click(function () {
    collapseLoginPage();
});

$(".guest-log-in").click(function () {
    //send data to let server know
    $.ajax({
        url: "./homepage/checkUser.php",
        type: "POST",
        data: { studentId: "guest" },
        success: function (response) {
            if (localStorage.getItem("questProgress") == null) {
                localStorage.setItem("questProgress", "[]");
            }
            if (localStorage.getItem("sortProgress") == null) {
                localStorage.setItem("sortProgress", 
                    JSON.stringify(
                        [{sort: 1, attempt:0, fullScore:0, maxScore:0, meanScore:0}, 
                            {sort: 2, attempt:0, fullScore:0, maxScore:0, meanScore:0}, 
                            {sort: 3, attempt:0, fullScore:0, maxScore:0, meanScore:0}, 
                            {sort: 4, attempt:0, fullScore:0, maxScore:0, meanScore:0}, 
                            {sort: 5, attempt:0, fullScore:0, maxScore:0, meanScore:0}, 
                            {sort: 6, attempt:0, fullScore:0, maxScore:0, meanScore:0}, 
                            {sort: 7, attempt:0, fullScore:0, maxScore:0, meanScore:0}]
                    )
                );
            }
            if (localStorage.getItem("player") == null) {
                var data = JSON.parse(response);
                localStorage.setItem("player", JSON.stringify(data.freeChar));
            }
            collapseLoginPage();
            $(".welcome-card h3").text("Welcome, Guest. (Please beware that progress you made is not shared with your account.)");
        },
    });
});

$("#student-id").on("input", function () {
    if (/[0-9]{11}/.test($(this).val())) {
        //ajax to check if student id exists
        $.ajax({
            url: "./homepage/checkUser.php",
            type: "POST",
            data: { studentId: $(this).val() },
            beforeSend: function() {
                $(".log-in").html('<i class="fas fa-sync-alt fa-spin"></i>');
            },
            success: function (data) {
                //console.log(data);
                var response = JSON.parse(data);
                $(".log-in").html('Log in');
                if (response.name == "") {
                    $(".notif-card h3").text("This student ID is not registered in our database.");
                    $(".notif-card").slideDown();
                    $(".log-in").prop("disabled", true);
                } else {
                    $(".notif-card").CardWidget("remove");
                    $(".log-in").prop("disabled", false);
                    $(".welcome-card .card-body").remove();
                    $(".quest-list").prop("disabled", false);
                    var firstName = response.name.trim().split(" ")[0];
                    firstName = firstName[0].toUpperCase() + firstName.slice(1);
                    $(".welcome-card h3").text("Welcome, " + firstName);
                    if(response.cleared == "1") {
                        $("footer").hide();
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
                }
            },
        });
    } else {
        $(".log-in").prop("disabled", true);
        if ($("footer").css("display") != "none") {
            $("footer").slideUp();
        }
    }
});
//////////////////////////////////////////////////////////////

$(".sort-type-option, .add-object").change(function () {
    $(".sort-gameplay").attr("data-sort-score", "");
    var sort = $(".sort-type-option").val();
    var addobj = parseInt($(".add-object option:selected").text());
    $(".sort-gameplay").empty();
    $(".sort-gameplay").load("./sortGameplay/sortGameplay.php", function () {
        $(".sort-obj").attr("data-sort-type", sort);
        addObject = addobj;
    });
});

$(".get-sort-score").click(function () {
    if ($(".sort-gameplay").attr("data-sort-score") == undefined || $(".sort-gameplay").attr("data-sort-score") == "") {
        closeSortGameplay($(this));
    }
});
