var sortClass = undefined;
var addObject = 0;
var min = 0;
var max = 0;

//functions which don't need to know values of object are not included in class.

function toIdle() {
    $(".sort-obj label").show();
    $(".sort-obj input").prop("checked", false);
    $(".sort-obj input").prop("disabled", true);
    $(".cancel").prop("disabled", true);
    $(".done").prop("disabled", true);
    $(".master-sort-func").show();
    hideUnrelatedButton();
    $(".proc-button").hide();
    seq_input = []; //clear sequencd input from some functions
    if (sortClass.sortState == 3) {
        $(".sort-func").prop("disabled", true);
        return 3;
    } else {
        $(".sort-help").text("Choose a function to perform!");
        return 0; //return state
    }
}

function checkTarget(count) {
    if (count == max) {
        $(".sort-obj input:not(:checked)").prop("disabled", true);
    } else {
        $(".sort-obj input:not(:checked)").prop("disabled", false);
        $(".sort-obj input[value=-1]").prop("disabled", true);
    }

    if (count > max) {
        //if by any chance the checked > max input, clear them all
        $(".sort-obj input").prop("checked", false);
    }

    if (count < min) {
        $(".done").prop("disabled", true);
    } else {
        $(".done").prop("disabled", false);
    }
}

function hideUnrelatedButton() {
    var sortType = $(".sort-obj").attr("data-sort-type");
    if (sortType == "bubble" || sortType == "insertion") {
        $(".sort-func:not([value=compare], [value=swap])").hide();
    } else if (sortType == "selection") {
        $(".sort-func:not([value=min], [value=swap])").hide();
    } else if (sortType == "merge") {
        $(".sort-func:not([value=divide], [value=merge])").hide();
    } else if (sortType == "quick") {
        $(".sort-func:not([value=pivot])").hide();
    } else if (sortType == "heap") {
        $(".sort-func:not([value=swap], [value=heap], [value=popNode])").hide();
    } else if (sortType == "counting") {
        $(".sort-func:not([value=getCount], [value=copy])").hide();
    }
    if(sortClass.showValue == 1) {
        $(".sort-func[value=compare], .sort-func[value=min]").hide();
    }
}


$(document).ready(function () {
    var show = localStorage.getItem("show-value") == null ? 1 : parseInt(localStorage.getItem("show-value"));
    var animation = localStorage.getItem("sort-duration") == null ? 450 : parseInt(localStorage.getItem("sort-duration"));

    sortClass = new sortcai($(".sort-obj").attr("data-sort-type"), addObject, show, animation);
    var pos = [];
    for (var i = 0; i < 8; i++) {
        pos.push(parseInt($("#d" + (i + 1)).offset().left - $("#d1").offset().left) + "px");
    }

    $("label > div").hide();
    sortClass.initSortObj(pos);
    sortClass.initAnimationObj(
        $(".animation div"),
        $(".heap-animation div")
    );
    sortClass.displayObj("sort", 
        $("label > div").filter(function() {
            return this.id.match(/d[1-9]/) != null && this.id.length == 2
        }), 
        $("input").filter(function() {
            return this.id.match(/cb[1-9]/) != null && this.id.length == 3
        }),
    );
    
    hideUnrelatedButton();
    $(".group").hide();
    $(".heap").hide();
    $(".move-left").text(sortClass.move);

    if(sortClass.addObject >= 3) {
        $(".sort-obj.heap").attr("style", "padding-left:10px;display:none;");
    }
    $(".animation div, .heap-animation div").css("transition", "width " + animation / 250 + "s 1.5s, " + "left " + animation / 250 + "s 1.5ms");
});

$(".sort-func").click(function () {
    sortClass.sortState = 1; //shift state to waiting for input

    $(".master-sort-func").hide();
    $(".proc-button").show();
    $(".sort-obj input").prop("disabled", false);
    //$(".sort-obj input:lt(" + sortObj.length + ")").prop("disabled", false);
    $(".cancel").prop("disabled", false);

    clickedFunc = $(this).val(); //identify function user inputted

    if (clickedFunc == "compare") {
        min = 2;
        max = 2;
        $(".sort-help").text("Click 2 objects of which you want to compare with each other.");
    } else if (clickedFunc == "swap") {
        min = 2;
        max = 2;
        $(".sort-help").text("Click 2 objects of which you want to swap position.");
    } else if (clickedFunc == "min") {
        min = 2;
        max = 2;
        $(".sort-help").text("Click 2 objects to find the one with least value within objects between them.");
    } else if (clickedFunc == "pivot") {
        min = 2;
        max = 2;
        $(".sort-help").text("Click 2 objects to do partition within objects between them.");
    } else if (clickedFunc == "divide") {
        min = 0;
        max = 0;
        $(".sort-help").text(
            'Click "Done" to divide objects into groups. \
                                (An existed group will also be divided into 2 groups unless that group contains 1 member.)'
        );
    } else if (clickedFunc == "merge") {
        min = 2;
        max = 2;
        $(".sort-help").text("Click 2 groups to merge them into 1 group. You can only merge the groups which are next to each other.");
    } else if (clickedFunc == "heap") {
        if (heapObj.length > 0) {
            min = 0;
            max = 0;
            $(".sort-help").text('Click "Done" to re-arrange the tree into max-heap.');
        } else {
            min = 2;
            max = 2;
            $(".sort-help").text("Click 2 objects to create max-heap within objects between them.");
        }
    } else if (clickedFunc == "popNode") {
        min = 0;
        max = 0;
        $(".sort-help").text('Click "Done" to remove the rightmost node/object out of the tree.');
    } else if (clickedFunc == "getCount") {
        min = 0;
        max = 0;
        $(".sort-help").text('Click "Done" to calculate cumulative frequency of each value.');
    } else if (clickedFunc == "copy") {
        min = 2;
        max = 2;
        $(".sort-help").text(
            "Click an object a row above table and an empty object in a row under table to move the first object into the second object."
        );
    }

    if (min == 0 && max == 0) {
        $(".done").prop("disabled", false);
    }
});

//attach click event to parent since in heap, inputs are dynamically generated
$(".sort-obj").click(function (event) {
    if (event.target.tagName == "INPUT") {
        //if clicked element is input, run this
        count = $(".sort-obj input:checked").length;
        checkTarget(count);
    }
});

$(".cancel").click(function () {
    sortClass.sortState = toIdle();
    $(".sort-help").text("Choose a function to perform!");
});

$(".done").click(function () {
    animationQueue = [];
    var index = [];
    let i = 0;

    //shift state to processing
    sortState = 2;

    //get sort objects' index
    $(".sort-obj input:checked").each(function () {
        //note indexes are in string or array
        index[i] = this.value;
        if (index[i].split("_").length > 1) index[i] = index[i].split("_");
        i++;
    });

    //functions executing
    sortClass.executeFunction(clickedFunc, index, ".sort-obj:first", ".animation > label > div", ".heap-animation > label > div", ".action-log", ".compare-log", ".compare-log-latest");
    
    if (sortClass.sortState == 2) {
        //if passing execution and state is still 2, update list
        //setTimeout(function(){$("label > div").removeAttr("style");}, 200);
        $(".sort-help").empty();
        $(".move-left").text(sortClass.move);
        /*
        //wait for animation to finish and update values
        //$('label > div').removeAttr('style');
        //if group object has more than 1, update group
        if (groupObj.length > 1) {
            $("div[id^=g]").html("");
            var k = 1;
            for (let i = 0; i < groupObj.length; i++) {
                $("#cb_g" + (i + 1)).val(i);
                $("#g" + (i + 1)).html("");
                $("#g" + (i + 1)).show();
                for (let j = 0; j < groupObj[i].length; j++) {
                    $("#g" + (i + 1)).append(
                        '<div id="d' +
                            k +
                            '_g">' +
                            groupObj[i][j].label +
                            (showValue == 1 ? "<div class='value-label'>" + groupObj[i][j].value + "</div>" : "") +
                            "</div>"
                    );
                    if (clickedFunc == "merge" && i == index[0]) {
                        $("#g" + (i + 1) + " > div").css("opacity", 0);
                    }
                    k++;
                }
            }
        }
        //if group object has 1 left, copy value inside to sort object
        else if (groupObj.length == 1) {
            var sortObj_temp = [];
            for (let i = 0; i < groupObj.length; i++) {
                for (let j = 0; j < groupObj[i].length; j++) {
                    sortObj_temp.push(groupObj[i][j]);
                }
            }
            sortObj = sortObj_temp;
            delete sortObj_temp;
            groupObj = [];
            $(".group").hide();
            $(".group label > div").hide();
            $(".sort-obj:first").show();
            hideUnrelatedButton();
            $(".sort-func[value=merge]").hide();
            //closeSortGameplay($(this).parents().eq(1));
        }

        if (heapObj.length > 0) {
            var treeIndex = heapObj.findIndex(function (x) {
                return x.length != undefined;
            });
            if (heapObj[treeIndex].length > 1) {
                if (animationQueue.length == 0) {
                    updateHeap();
                }
                executeAnimationQueue(
                    '$(".heap").hide();' +
                        '$(".heap-animation").show();' +
                        "treeView = false;" +
                        "updateHeap();" +
                        '$(".toggle-heap").text("Tree View");' +
                        '$(".toggle-heap").removeClass("btn-danger");' +
                        '$(".toggle-heap").addClass("btn-success");',
                    "setTimeout(function () {" + '$(".heap").show();' + '$(".heap-animation").hide();' + "}, 300 * animationQueue.length);"
                );
            } else if (heapObj[treeIndex].length > 0) {
                var firstHalf = heapObj.slice(0, treeIndex);
                var secondHalf = heapObj.slice(treeIndex + 1);
                sortObj = firstHalf.concat(heapObj[treeIndex], secondHalf);
                heapObj = [];

                executeAnimationQueue(
                    '$(".heap").hide();' +
                        '$(".heap-animation").show();' +
                        "treeView = false;" +
                        "updateHeap();" +
                        '$(".toggle-heap").text("Tree View");' +
                        '$(".toggle-heap").removeClass("btn-danger");' +
                        '$(".toggle-heap").addClass("btn-success");',
                    "setTimeout(function () {" +
                        '$(".heap").hide();' +
                        '$(".sort-obj:first").show();' +
                        "hideUnrelatedButton();" +
                        '$(".sort-func[value=popNode]").hide();' +
                        '$(".toggle-heap").hide();' +
                        '$(".heap-animation").hide();' +
                        "closeSortGameplay($(this).parents().eq(1));" +
                        "}, 300 * animationQueue.length);"
                );
            }
        }
        */
        sortClass.displayObj("sort", 
            $("label > div").filter(function() {
                return this.id.match(/d[1-9]/) != null && this.id.length == 2
            }), 
            $("input").filter(function() {
                return this.id.match(/cb[1-9]/) != null && this.id.length == 3
            }),
        );
        /*
        for (let i = 0; i < sortObj.length; i++) {
            $("#cb" + (i + 1)).val(i);
            $("#d" + (i + 1)).html(
                sortObj[i].label +
                    (freq.find(function (x) {
                        return x != 0;
                    }) != undefined || showValue == 1
                        ? "<div class='value-label'>" + sortObj[i].value + "</div>"
                        : "")
            );
            if (clickedFunc == "merge") {
                $("#d" + (i + 1)).css("opacity", 0);
            }
            //sortObj[i].position = parseInt($("#d" + (i + 1)).offset().left);
        }
        */

        //merge animation
        /*
        if (clickedFunc == "merge") {
            setTimeout(function () {
                if (groupObj.length > 1) {
                    for (let i = 0; i < groupObj[index[0]].length; i++) {
                        animationQueue.push({
                            object: $("#g" + (parseInt(index[0]) + 1) + " > div:eq(" + i + ")"),
                            action: { opacity: 1 },
                            option: { duration: animationDuration },
                        });
                    }
                    executeAnimationQueue('""', '""');
                } else {
                    for (let i = 0; i < sortObj.length; i++) {
                        animationQueue.push({ object: $("#d" + (i + 1)), action: { opacity: 1 }, option: { duration: animationDuration } });
                    }
                    executeAnimationQueue('""', "closeSortGameplay($(this).parents().eq(1));");
                }
            }, 150);
        }
        */
        /*
        if (
            freq.find(function (x) {
                return x != 0;
            }) != undefined
        ) {
            if (
                copiedObj.find(function (x) {
                    return jQuery.isEmptyObject(x);
                }) != undefined
            ) {
                for (let i = 0; i < copiedObj.length; i++) {
                    $("#cb_c" + (i + 1)).val(i);
                    $("#d_c" + (i + 1)).show();
                }
            } else {
                sortObj = JSON.parse(JSON.stringify(copiedObj));
                copiedObj = [];
                freq = [];
                $(".counting").hide();
                $(".counting label > div").hide();
                $(".cumulative-tbl").hide();
                $(".sort-func[value=getCount]").show();
                $(".sort-func[value=copy]").hide();
                closeSortGameplay($(this).parents().eq(1)); //force done
            }
        }
        */
        if (sortClass.move <= 0 && sortClass.sortState != 3) {
            closeSortGameplay($(this).parents().eq(1));
            sortClass.sortState = 3;
        }
        sortClass.sortState = toIdle();
    }
});