function collapseLoginPage() {
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
    } else {
        $(".login-sidebar").css("width", "100%");
    }

    $("html, body").animate({ scrollTop: 0 }, 100);
    $("body").css("overflow-y", "hidden");
}

$(document).ready(function () {
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
        beforeSend: function () {
            $(".log-out").html('<i class="fas fa-sync-alt fa-spin"></i>');
        },
        success: function () {
            $(".log-out").text("Log out");
            expandLoginPage(true);
        },
    });
});

$(".log-in").click(function () {
    var adminId = $("#admin-id").val();
    var adminPwd = $("#admin-pwd").val();
    $.ajax({
        url: "./homepage/checkAdmin.php",
        type: "POST",
        beforeSend: function () {
            $(".log-in").html('<i class="fas fa-sync-alt fa-spin"></i>');
        },
        data: { id: adminId, pwd: adminPwd },
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            $(".log-in").text("Log in");
            if (data.adminId == "" || data.name == "") {
                $(".notif-card h3").text("Wrong Admin ID or Password");
                $(".notif-card").slideDown();
            } else {
                $(".notif-card").CardWidget("remove");
                collapseLoginPage();
                $(".welcome-card h3").text("Welcome, " + data.name);
            }
        },
    });
});
