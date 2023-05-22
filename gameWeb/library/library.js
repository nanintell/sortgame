var books = [
    {
        title: "swap",
        content: "html of swap",
    },
    {
        title: "bubble sort",
        content: "html of bubble sort",
    },
    {
        title: "insertion sort",
        content: "html of insertion sort",
    },
    {
        title: "finding minimum value",
        content: "html of find min",
    },
    {
        title: "selection sort",
        content: "html of selection sort",
    },
    {
        title: "dividing objects into groups",
        content: "html of divide",
    },
    {
        title: "merging 2 groups into one",
        content: "html of merge",
    },
    {
        title: "merge sort",
        content: "html of merge sort",
    },
];
var bookProgress = [
    {
        mode: "main quest",
        progress: [
            {
                quest: "quest 1-1",
                attempt: 2,
                clear: 1,
                maxScore: 100,
                meanScore: 50,
            },
            {
                quest: "quest 1-2",
                attempt: 1,
                clear: 0,
                maxScore: 25,
                meanScore: 25,
            },
        ],
    },
    {
        mode: "level quest",
        progress: [
            {
                quest: "level quest 1-1",
                attempt: 1,
                clear: 0,
                maxScore: 25,
                meanScore: 25,
            },
        ],
    },
    {
        mode: "hard quest",
        progress: [],
    },
];
var sortProgress = [
    {
        sort: "bubble",
        attempt: 1,
        fullScore: 0,
        maxScore: 40,
        meanScore: 30,
    },
];
var canOpen = false;
//content title change depends on which button is clicked
var contentTitle = "progress";

var firstPage = "";
var indexToOpen = 0;

$(document).ready(function () {
    canOpen = false;
    contentTitle = $(".library-background").attr("data-content-title");

    $("html, body").animate({ scrollTop: $(".content").offset().top }, {
        duration: 100,
        done: function() {
            if (contentTitle == "library") {
                $("body").css("overflow-y", "hidden");
            }
        }
    });
    
    $(window).unbind("resize");
    $(window).resize(function() {
        var displayMode = "double";
        $(".library-book").css("width", "");
        if ($("html").innerWidth() <= 1200) {
            $(".library-background > .col-sm-6").removeClass("col-sm-6").addClass("col-sm-12");
            if($("html").innerWidth() <= 820) {
                displayMode = "single";
            } else {
                displayMode = "single";
                //$(".library-book").css("aspect-ratio", "");
                //$(".library-book").css("height", "80vh");
                //$(".library-book").css("width", "80vh");
                /*var height = $(".library-book").css("height");
                var maxheight = $(".library-book").css("max-height");
                if(height != undefined && maxheight != undefined) {
                    if(parseInt(height.replace("px", "")) >= parseInt(maxheight.replace("px", ""))) {
                        $(".library-book").css("aspect-ratio", "");
                        $(".library-book").css("height", "80vh");
                        $(".library-book").css("width", "80vh");
                    }
                }*/
            }
        } else {
            $(".library-background > .col-sm-12").addClass("col-sm-6").removeClass("col-sm-12");
            $(".label-modal").modal("hide");
        }
        $(".library-book").turn("display", displayMode);
        $(".library-book").turn("resize");

        //console.log($(".library-book").height());
        if($(".library-book").height() < 750) {
            $(".library-book").turn("size", "", "750");
        }

        if(displayMode == "single") {
            var currentpage = parseInt($(".library-book").turn("page"));
            var labelvalue = (currentpage / 2) - 1;
            if (labelvalue < 1) {
                $(".library-book").turn("page", 1);
            } else if (labelvalue % 1 != 0) {
                $(".library-book").turn("page", (Math.floor(labelvalue) + 1) * 2);
            } 
        }
    });

    var displayMode = "double";
    if ($("html").innerWidth() <= 1200) {
        $(".library-background > .col-sm-6").removeClass("col-sm-6").addClass("col-sm-12");
        if($("html").innerWidth() <= 820) {
            displayMode = "single";
        } else {
            displayMode = "single";
            //$(".library-book").css("aspect-ratio", "");
            //$(".library-book").css("height", "80vh");
            //$(".library-book").css("width", "80vh");
            /*var height = $(".library-book").css("height");
            var maxheight = $(".library-book").css("max-height");
            if(height != undefined && maxheight != undefined) {
                if(parseInt(height.replace("px", "")) >= parseInt(maxheight.replace("px", ""))) {
                    $(".library-book").css("aspect-ratio", "");
                    $(".library-book").css("height", "80vh");
                    $(".library-book").css("width", "80vh");
                }
            }*/
        }
    } else {
        $(".library-background > .col-sm-12").addClass("col-sm-6").removeClass("col-sm-12");
        $(".label-modal").modal("hide");
    }

    //ajax to get library content
    $.ajax({
        url: "./library/getContent.php",
        type: "POST",
        data: { content: contentTitle},
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            if (data.isGuest) {
                var localqrogress = JSON.parse(localStorage.getItem("questProgress"));
                //filter content in localstorage
                if (contentTitle == "library") {
                    books = data.allContent;
                    books = books.filter(function(x) {
                        return localqrogress.find(function(y){return y.questId == x.require}) != undefined;
                    });
                } else if (contentTitle == "progress") {
                    //get progress in localstorage
                    var allQuestList = data.questList;
                    bookProgress = [{mode: "Main Quest", progress: []}, {mode: "Level Quest", progress: []}, {mode: "Hard Quest", progress: []}];
                    for (let i = 0; i < localqrogress.length; i++) {
                        var findQuest = allQuestList.find(function(x){return x.questId == allQuestList[i].questId});
                        if (findQuest != undefined) {
                            var index = parseInt(findQuest.category) - 1;
                            bookProgress[index].progress.push({
                                quest: findQuest.title,
                                attempt: localqrogress[i].attempt,
                                clear: localqrogress[i].pass,
                                maxScore: localqrogress[i].maxScore,
                                meanScore: localqrogress[i].meanScore}
                            );
                        }
                    }
                    var localsprogress = JSON.parse(localStorage.getItem("sortProgress"));
                    sortProgress = [
                        {sort: "Bubble", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}, 
                        {sort: "Insertion", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}, 
                        {sort: "Selection", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}, 
                        {sort: "Heap", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}, 
                        {sort: "Merge", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}, 
                        {sort: "Quick", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}, 
                        {sort: "Distribution Counting", attempt: 0, fullScore: 0, maxScore: 0, meanScore: 0}
                    ];
                    for (let i = 0; i < localsprogress.length; i++) {
                        var index = parseInt(localsprogress[i].sort) - 1;
                        sortProgress[index].attempt = localsprogress[i].attempt;
                        sortProgress[index].fullScore = localsprogress[i].fullScore;
                        sortProgress[index].maxScore = localsprogress[i].maxScore;
                        sortProgress[index].meanScore = localsprogress[i].meanScore;
                    }
                }
            } else {
                if (contentTitle == "library") {
                    books = data.content;
                } else if (contentTitle == "progress") {
                    bookProgress = data.progress;
                    sortProgress = data.sort;
                }
            }
            //gen content
            $(".master-page-label > div").empty();
            $(".master-page-label > div").append('<div class="card bg-gradient-dark"><div class="card-body overflow-auto"></div></div>');

            if (contentTitle == "library") {
                $(".master-page-label .card").addClass("h-100");
                for (let i = 0; i < books.length; i++) {
                    $(".master-page-label .card-body").append(
                        '<button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="' +
                            (i + 1) +
                            '">' +
                            books[i].title +
                            "</button>"
                    );
                    if(books[i].title == firstPage && firstPage.length > 0) {
                        indexToOpen = i + 1;
                    }
                }
            } else if (contentTitle == "progress") {
                for (let i = 0; i < bookProgress.length; i++) {
                    $(".master-page-label .card-body").append(
                        '<button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="' +
                            (i + 1) +
                            '">' +
                            bookProgress[i].mode +
                            "</button>"
                    );
                }
                $(".master-page-label > div").append(
                    '<div class="card bg-gradient-dark">' +
                        '<div class="card-body overflow-auto">' +
                        '<button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="' +
                        (bookProgress.length + 1) +
                        '"> Sort Progress </button>' +
                        "</div>" +
                        "</div>"
                );
            }

            $(".library-book").turn({
                display: displayMode,
                when: {
                    start: function (event) {
                        if (canOpen == false) {
                            event.preventDefault();
                        }
                    },
                    turning: function (event) {
                        if (canOpen == false) {
                            event.preventDefault();
                            return false;
                        }
                        $(".library-book").animate({ left: 0 }, 150); //move book to right (default position)
                        $(".master-page-label").animate({ left: 0 }, 150);
                    },
                },
            });

            if (contentTitle == "library") {
                for (let i = 0; i < books.length; i++) {
                    //content
                    $(".library-book").turn("addPage", "<div></div>", 2 * i + 3);
                    $(".library-book").turn("addPage", "<div class='p-3 overflow-auto'>" + books[i].content + "</div>", 2 * i + 4);
                }

                if(firstPage != "" && indexToOpen > 0) {
                    canOpen = true;
                    if ($(".library-book").turn("hasPage", (indexToOpen + 1) * 2)) {
                        $(".library-book").turn("page", (indexToOpen + 1) * 2);
                    }
                }

            } else if (contentTitle == "progress") {
                for (let i = 0; i < bookProgress.length; i++) {
                    //content
                    $(".library-book").turn("addPage", "<div></div>", 2 * i + 3);
                    var tableHTML =
                        '<table class="table table-hover table-striped table-secondary table-bordered"> \
                            <thead> \
                              <tr> \
                                <th scope="col"> quest </th> \
                                <th scope="col"> attempt </th> \
                                <th scope="col" title="No game over and got score no less than 50"> clear </th> \
                                <th scope="col"> max score </th> \
                                <th scope="col"> average score </th> \
                              </tr> \
                            </thead> \
                            <tbody>';
                    if (bookProgress[i].progress.length > 0) {
                        for (let j = 0; j < bookProgress[i].progress.length; j++) {
                            tableHTML = tableHTML + "<tr>";
                            tableHTML = tableHTML + "<td>" + bookProgress[i].progress[j].quest + "</td>";
                            tableHTML = tableHTML + "<td>" + bookProgress[i].progress[j].attempt + "</td>";
                            tableHTML = tableHTML + "<td>" + bookProgress[i].progress[j].clear + "</td>";
                            tableHTML = tableHTML + "<td>" + bookProgress[i].progress[j].maxScore + "</td>";
                            tableHTML = tableHTML + "<td>" + bookProgress[i].progress[j].meanScore + "</td>";
                            tableHTML = tableHTML + "</tr>";
                        }
                    } else {
                        tableHTML =
                            tableHTML +
                            '<tr><th scope="row" colspan="5" style="text-align:center;">' +
                            "You have not played any quests in " +
                            bookProgress[i].mode +
                            " mode yet." +
                            "</th></tr>";
                    }
                    tableHTML = tableHTML + "</tbody></table>";
                    $(".library-book").turn("addPage", "<div class='p-3 overflow-auto'>" + tableHTML + "</div>", 2 * i + 4);
                }
                $(".library-book").turn("addPage", "<div></div>", 2 * bookProgress.length + 3);

                var tableHTML =
                    '<table class="table table-hover table-striped table-secondary table-bordered"> \
                          <thead> \
                            <tr> \
                              <th scope="col"> sort </th> \
                              <th scope="col"> attempt </th> \
                              <th scope="col"> full score </th> \
                              <th scope="col"> max score </th> \
                              <th scope="col"> average score </th> \
                            </tr> \
                          </thead> \
                          <tbody>';
                for (let i = 0; i < sortProgress.length; i++) {
                    tableHTML = tableHTML + "<tr>";
                    tableHTML = tableHTML + "<td>" + sortProgress[i].sort + "</td>";
                    tableHTML = tableHTML + "<td>" + sortProgress[i].attempt + "</td>";
                    tableHTML = tableHTML + "<td>" + sortProgress[i].fullScore + "</td>";
                    tableHTML = tableHTML + "<td>" + sortProgress[i].maxScore + "</td>";
                    tableHTML = tableHTML + "<td>" + sortProgress[i].meanScore + "</td>";
                    tableHTML = tableHTML + "</tr>";
                }
                $(".library-book").turn("addPage", "<div class='p-3 overflow-auto'>" + tableHTML + "</div>", 2 * bookProgress.length + 4);
            }

            //back cover
            $(".library-book").turn("addPage", "<div></div>");
            $(".library-book").turn("addPage", '<div class="hard"></div>');
            $(".library-book").turn("addPage", '<div class="hard"></div>');
        },
    });
});

$(document).mouseover(function (event) {
    canOpen = $(event.target).parents(".page-label").length != 0 || $(event.target).is(".page-label");
});

$(".master-page-label").click(function (event) {
    if ($(event.target).parents(".label-modal").length != 0) {
        $(".label-modal").modal("hide");
    }
    if ($(event.target).parents(".page-label").length != 0 || $(event.target).is(".page-label")) {
        var page = undefined;
        if($(event.target).is(".page-label")) {
            page = parseInt($(event.target).val());
        } else if($(event.target).parents(".page-label").length != 0){
            page = parseInt($(event.target).parents(".page-label").val());
        }
        if(page != undefined) {
            page = (page + 1) * 2;
            canOpen = true;
            if ($(".library-book").turn("hasPage", page)) {
                $(".library-book").turn("page", page);
            }
        }
    }
});
