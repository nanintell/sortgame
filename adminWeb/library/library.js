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
var canOpen = false;

function getCSVcontent(page) {
    var tablecsv = "Student ID, Progress, Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort, Heap Sort, Distribution Counting Sort \n";
    for (user of bookProgress[page].members) {
        tablecsv = tablecsv + user.studentId + ", " + 
                    user.progressPercentage + ", " + 
                    user.sortLevel.bubble + ", " + 
                    user.sortLevel.insertion + ", " + 
                    user.sortLevel.selection + ", " + 
                    user.sortLevel.merge + ", " + 
                    user.sortLevel.quick + ", " + 
                    user.sortLevel.heap + ", " + 
                    user.sortLevel.counting + "\n"
    }
    return tablecsv;
}

function exportCSV(button, page) {
    var csvcontent = undefined;
    if(page != -1) {
        csvcontent = getCSVcontent(page);
        $(button).attr("download",  bookProgress[page].group + "_progressReport.csv");
        $(button).attr("href", 'data:application/csv;charset=utf-8,' + csvcontent);
    } else {
        var zip = new JSZip();
        csvcontent = [];
        for (let i = 0 ; i < bookProgress.length; i++) {
            csvcontent.push({
                filename: bookProgress[i].group + "_progressReport.csv",
                content: getCSVcontent(i)
            });
            zip.file("progressReport/" + bookProgress[i].group + "_progressReport.csv", getCSVcontent(i));
        }
        zip.generateAsync({type:"base64"}).then(function (base64) {
            //open link to download file in new tab
            window.open("data:application/zip;base64, " + base64, "_blank");
        }, function (err) {
            alert("error zipping file");
        });

    }
}

$(document).ready(function () {
    canOpen = false;

    $("html, body").animate({ scrollTop: $(".content").offset().top }, 100);

    $(window).unbind("resize");
    $(window).resize(function() {
        var displayMode = "double";
        $(".library-book").css("width", "");
        $(".library-book").css("height", "");
        $(".library-book .page, .library-book .hard").css("width", "");
        $(".library-book .page, .library-book .hard").css("height", "");
        if ($("html").innerWidth() <= 1200) {
            $(".library-background > .col-sm-6").removeClass("col-sm-6").addClass("col-sm-12");
            if($("html").innerWidth() <= 820) {
                displayMode = "single";
            } else {
                displayMode = "single";
            }
        } else {
            $(".library-background > .col-sm-12").addClass("col-sm-6").removeClass("col-sm-12");
        }

        $(".library-book").turn("display", displayMode);
        $(".library-book").turn("resize");

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
        }
    } else {
        $(".library-background > .col-sm-12").addClass("col-sm-6").removeClass("col-sm-12");
    }

    //ajax to get library content
    $.ajax({
        url: "./library/getProgress.php",
        type: "POST",
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);

            bookProgress = data;
            //gen content
            $(".master-page-label > div").empty();
            $(".master-page-label > div").append('<div class="card bg-gradient-dark"><div class="card-body overflow-auto"></div></div>');

            for (let i = 0; i < bookProgress.length; i++) {
                $(".master-page-label .card-body").append(
                    '<button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="' +
                        (i + 1) +
                        '">' +
                        bookProgress[i].group +
                        "</button>"
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

            for (let i = 0; i < bookProgress.length; i++) {
                //content
                $(".library-book").turn("addPage", "<div></div>", 2 * i + 3);
                var tableHTML = 
                    '<p class="export-page-desc" style="width:100%;text-align:right;display:none;">This button will export this group\'s progress into a csv file.</p> \
                    <a class="mb-3 export-progress" target="_blank" onclick="exportCSV($(this), ' + i + ');" \
                        onmouseover="$(this).parent().children(\'p.export-page-desc\').slideDown();"> \
                        <button type="button" class="btn btn-secondary"> \
                        <i class="fas fa-file-export"></i> \
                    </button></a> \
                    <div style="width:100%;overflow-x:auto;"> \
                     <table class="table table-hover table-striped table-secondary table-bordered"> \
                      <thead> \
                        <tr> \
                          <th scope="col"> Student ID </th> \
                          <th scope="col"> Progress </th> \
                          <th scope="col"> Bubble </th> \
                          <th scope="col"> Insertion </th> \
                          <th scope="col"> Selection </th> \
                          <th scope="col"> Merge </th> \
                          <th scope="col"> Quick </th> \
                          <th scope="col"> Heap </th> \
                          <th scope="col"> Distribution Counting </th> \
                        </tr> \
                      </thead> \
                      <tbody>';
                if (bookProgress[i].members.length > 0) {
                    for (let j = 0; j < bookProgress[i].members.length; j++) {
                        tableHTML = tableHTML + "<tr>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].studentId + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].progressPercentage + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.bubble + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.insertion + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.selection + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.merge + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.quick + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.heap + "</td>";
                        tableHTML = tableHTML + "<td>" + bookProgress[i].members[j].sortLevel.counting + "</td>";
                        tableHTML = tableHTML + "</tr>";
                    }
                } else {
                    tableHTML =
                        tableHTML +
                        '<tr><th scope="row" colspan="9">' +
                        "You have not added any students in " +
                        bookProgress[i].group +
                        " yet." +
                        "</th></tr>";
                }
                tableHTML = tableHTML + "</tbody></table></div>";
                $(".library-book").turn("addPage", "<div class='p-3 overflow-auto'>" + tableHTML + "</div>", 2 * i + 4);
            }
            $(".library-book").turn("addPage", "<div></div>", 2 * bookProgress.length + 3);

            //back cover
            $(".library-book").turn("addPage", "<div></div>");
            $(".library-book").turn("addPage", '<div class="hard">');
            $(".library-book").turn("addPage", '</div><div class="hard"></div>');
        },
    });
});

$(document).mouseover(function (event) {
    canOpen = $(event.target).parents(".page-label").length != 0 || $(event.target).is(".page-label")
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
