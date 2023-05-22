var max = 0;
var min = 0;
var clickedFunc = null;
var sortState = 0;
//0 = idle
//1 = wait for input
//2 = process
//3 = end
var seq_input = [];
var groupObj = [];
var heapObj = [];
var copiedObj = [];
var freq = [];
var move = 0;
var playerLog = [];
var treeView = false;
var originalValue = [];
var animationQueue = [];
var position = [];
var positionHeap = [];
var scoreWeight = { compare: 0.25, move: 0.25, correct: 0.25, procedure: 0.25 };
var animationDuration = localStorage.getItem("sort-duration") == null ? 450 : parseInt(localStorage.getItem("sort-duration"));
var addObject = 0;
var showValue = localStorage.getItem("show-value") == null ? 1 : parseInt(localStorage.getItem("show-value"));

var sortObj = [
    {
        label: "A",
        value: 9,
        position: [],
    },
    {
        label: "B",
        value: 8,
        position: [],
    },
    {
        label: "C",
        value: 12,
        position: [],
    },
    {
        label: "D",
        value: 8,
        position: [],
    },
];

//other system functions---------------------

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
    if (sortState == 3) {
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

function appendCompareLog(text) {
    $(".compare-log").each(function () {
        if ($(this).is("p")) {
            $(this).append(text + "</br>");
        } else if ($(this).is("tbody")) {
            $(this).append("<tr><td>" + text + "</td></tr>");
        }
    });
    $(".compare-result-latest").text(text);
}

function appendActionLog(clickedFunc, format, parameter, arr) {
    //clicked functions are modified before calling
    //format is text format to make logging readable
    if (clickedFunc != "") {
        playerLog.push({ func: clickedFunc, param: parameter });
        var text = format.replace("|func|", clickedFunc);
        for (let i = 0; i < parameter.length; i++) {
            text = text.replace("|param" + (i + 1) + "|", arr[parameter[i]].label);
        }
    } else {
        var text = format;
    }

    $(".action-log").each(function () {
        if ($(this).is("p")) {
            $(this).append(text + "</br>");
        } else if ($(this).is("tbody")) {
            $(this).append("<tr><td>" + text + "</td></tr>");
        }
    });
}

function executeAnimationQueue(start, complete) {
    if (animationQueue.length > 0) {
        //console.log(start);
        //console.log(complete);
        animationQueue[0].option["start"] = new Function("$('.sort-help').text('Running...');" + '$(".sort-func").prop("disabled", true);' + start);
        animationQueue[animationQueue.length - 1].option["complete"] = new Function(
            "$('.sort-help').text('Choose a function to perform!');" +
                "if (sortState != 3) {" +
                '$(".sort-func").prop("disabled", false);' +
                "}" +
                complete
        );
        //console.log(animationQueue);
        var seq = animationQueue.length;
        for (let i = 0; i < seq; i++) {
            $(animationQueue[i].object)
                .delay((animationDuration + 50) * (i + 1))
                .animate(animationQueue[i].action, animationQueue[i].option);
        }
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
    if(showValue == 1) {
        $(".sort-func[value=compare], .sort-func[value=min]").hide();
    }
    //$('.sort-func[value=]')
}

//-------------------------------------------

//sort functions----------------------------

function swap(arr, index1, index2) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
}

function partitioning(range, index) {
    var low = range[0];
    var high = range[1];

    if (high != index[0]) {
        animationQueue.push({
            object: $("#da_" + sortObj[high].label),
            action: { left: position[index[0]] },
            option: { duration: animationDuration },
        });
        animationQueue.push({
            object: $("#da_" + sortObj[index[0]].label),
            action: { left: position[high] },
            option: { duration: animationDuration },
        });
    }

    swap(sortObj, high, index[0]);

    var pivot = sortObj[high];
    var i_pivot = low - 1;
    //lomuto partition (waste time but more understandable than haore visually)
    for (let k = low; k < high; k++) {
        if (sortObj[k].value <= pivot.value) {
            i_pivot++;

            if (i_pivot != k) {
                animationQueue.push({
                    object: $("#da_" + sortObj[i_pivot].label),
                    action: { left: position[k] },
                    option: { duration: animationDuration },
                });
                animationQueue.push({
                    object: $("#da_" + sortObj[k].label),
                    action: { left: position[i_pivot] },
                    option: { duration: animationDuration },
                });
            }

            swap(sortObj, i_pivot, k);
        }
    }
    i_pivot++;

    if (i_pivot != high) {
        animationQueue.push({
            object: $("#da_" + sortObj[i_pivot].label),
            action: { left: position[high] },
            option: { duration: animationDuration },
        });
        animationQueue.push({
            object: $("#da_" + sortObj[high].label),
            action: { left: position[i_pivot] },
            option: { duration: animationDuration },
        });
    }

    swap(sortObj, i_pivot, high);

    executeAnimationQueue(
        '$(".sort-obj:first").hide();' + '$(".animation").show();',
        "setTimeout(function () {" + '$(".sort-obj:first").show();' + '$(".animation").hide();' + "}, 150 * animationQueue.length);"
    );
    //haore partition (recommend when programming but pivot may be placed in weird position)
    /*var i_pivot = low - 1
  var j_pivot = high + 1
  while(true)
  {
    do{
      i_pivot++
    }
    while(sortObj[i_pivot].value < pivot.value);

    do{
      j_pivot--
    }
    while(sortObj[j_pivot].value > pivot.value)

    if(i_pivot >= j_pivot)
    {
      //we need to notify the right index to know range of next recur
      $(".compare-log").append("The final right pointer points at " + j_index+1 + "<br>");
      break;
    }

    swap(sortObj, i_pivot, j_pivot)

  }*/
}

function compareShow(index1, index2) {
    var diff = sortObj[index1].value - sortObj[index2].value;
    if (diff > 0) {
        return sortObj[index1].label + " > " + sortObj[index2].label;
    } else if (diff < 0) {
        return sortObj[index1].label + " < " + sortObj[index2].label;
    } else {
        return sortObj[index1].label + " = " + sortObj[index2].label;
    }
}

function findMin(index1, index2) {
    //may change function later but this is classic method to find min
    min = sortObj[index1];
    //selected = "" + min.label + ", ";
    for (let i = index1; i <= index2; i++) {
        //selected = selected + sortObj[arr[i]].label + ", ";
        if (min.value > sortObj[i].value) {
            min = sortObj[i];
        }
    }
    return min;
}

function divideGroup() {
    if (groupObj.length <= 1) {
        if (groupObj.length == 1) {
            groupObj = [];
        }
        var half = Math.ceil(sortObj.length / 2);
        groupObj.push(sortObj.slice(0, half));
        groupObj.push(sortObj.slice(half));
    } else if (groupObj.length < sortObj.length) {
        var group_temp = [];
        for (let i = 0; i < groupObj.length; i++) {
            if (groupObj[i].length > 1) {
                var half = Math.ceil(groupObj[i].length / 2);
                group_temp.push(groupObj[i].slice(0, half));
                group_temp.push(groupObj[i].slice(half));
            } else {
                group_temp.push(groupObj[i]);
            }
        }
        groupObj = group_temp;
    }
}

function mergeGroup(index1, index2) {
    var left = groupObj[index1];
    var right = groupObj[index2];
    var groupObj_temp = [];
    //console.log(index)
    //console.log(left)
    //console.log(right)
    var i_merge = 0;
    var j_merge = 0;
    //var k_merge = 0;

    while (i_merge < left.length && j_merge < right.length) {
        if (left[i_merge].value <= right[j_merge].value) {
            groupObj_temp.push(left[i_merge]);
            i_merge++;
        } else {
            groupObj_temp.push(right[j_merge]);
            j_merge++;
        }
    }

    while (i_merge < left.length) {
        groupObj_temp.push(left[i_merge]);
        i_merge++;
    }

    while (j_merge < right.length) {
        groupObj_temp.push(right[j_merge]);
        j_merge++;
    }
    //replace merged data at first index and delete the second one
    groupObj[index1] = groupObj_temp;
    groupObj.splice(index2, 1);
    delete groupObj_temp;
}

function updateHeapNode(i, j) {
    var treeCode = "";
    treeCode = treeCode + '<input type="checkbox" id="cb_h' + (i + 1) + "_" + (j + 1) + '" value=' + i + "_" + j + " disabled />";
    treeCode =
        treeCode +
        '<label for="cb_h' +
        (i + 1) +
        "_" +
        (j + 1) +
        '"><div id="d' +
        (i + 1) +
        "_" +
        (j + 1) +
        '_h">' +
        heapObj[i][j].label +
        (showValue == 1 ? "<div class='value-label'>" + heapObj[i][j].value + "</div>" : "") +
        "</div></label>";
    return treeCode;
}

function updateHeap() {
    //since object inside heap is supposed to be interactable unlike group, we need to move both input and label
    $(".heap > li").empty();
    for (let i = 0; i < heapObj.length; i++) {
        if (heapObj[i].length == undefined) {
            //non-heap element
            $(".heap > li:eq(" + i + ")").append('<input type="checkbox" id="cb_h' + (i + 1) + '" value=' + i + " disabled />");
            $(".heap > li:eq(" + i + ")").append(
                '<label for="cb_h' +
                    (i + 1) +
                    '">' +
                    '<div id="d' +
                    (i + 1) +
                    '_h">' +
                    heapObj[i].label +
                    (showValue == 1 ? "<div class='value-label'>" + heapObj[i].value + "</div>" : "") +
                    "</div></label>"
            );
        } //heap element
        else {
            //make string of code first due to it being very long
            var treeCode = "";
            if (treeView == true) {
                treeCode = treeCode + '<div class="heap-tree">';
                //root
                treeCode = treeCode + '<div class="row d-flex justify-content-center mx-0">';
                treeCode = treeCode + updateHeapNode(i, 0);
                treeCode = treeCode + "</div>";
                //first level
                if (heapObj[i].length > 1) {
                    treeCode = treeCode + '<div class="row mx-0">';
                    for (let j = 1; j < 3; j++) {
                        if (j < heapObj[i].length) {
                            treeCode = treeCode + '<div class="col-sm-6 d-flex justify-content-center">';
                            treeCode = treeCode + updateHeapNode(i, j);
                            treeCode = treeCode + "</div>";
                        }
                    }
                    treeCode = treeCode + "</div>";
                }
                //second level
                if (heapObj[i].length > 3) {
                    treeCode = treeCode + '<div class="row mx-0">';
                    for (let j = 3; j < 7; j++) {
                        if (j < heapObj[i].length) {
                            treeCode = treeCode + '<div class="col-sm-3 d-flex justify-content-center">';
                            treeCode = treeCode + updateHeapNode(i, j);
                            treeCode = treeCode + "</div>";
                        }
                    }
                    treeCode = treeCode + "</div>";
                }
                treeCode = treeCode + "</div>"; //end code
            } else {
                treeCode = treeCode + '<div class="heap-tree d-flex justify-content-around">';
                for (let j = 0; j < heapObj[i].length; j++) {
                    treeCode = treeCode + updateHeapNode(i, j);
                }
                treeCode = treeCode + "</div>"; //end code
            }
            $(".heap > li:eq(" + i + ")").append(treeCode);
        }
    }
}

function heapify(arr, root, start) {
    var largest = root;
    var left = 2 * root + 1;
    var right = 2 * root + 2;

    //get largest direct children node (left and right)
    if (left < arr.length && arr[left].value > arr[largest].value) {
        largest = left;
    }
    if (right < arr.length && arr[right].value > arr[largest].value) {
        largest = right;
    }

    if (largest != root) {
        animationQueue.push({
            object: $("#dha_" + arr[root].label),
            action: { left: positionHeap[parseInt(start) + parseInt(largest)] },
            option: { duration: animationDuration },
        });
        animationQueue.push({
            object: $("#dha_" + arr[largest].label),
            action: { left: positionHeap[parseInt(start) + parseInt(root)] },
            option: { duration: animationDuration },
        });

        swap(arr, root, largest);
        heapify(arr, largest, start);
    }
}

function countFrequency() {
    $(".cumulative-tbl tr").empty();

    for (let i = 0; i < sortObj.length; i++) {
        freq[sortObj[i].value]++;
    }

    //add value to the table
    for (let i = 0; i < freq.length; i++) {
        $(".cumulative-tbl thead tr").append('<th style="opacity:0;">' + i + "</th>");
        $(".cumulative-tbl tbody tr").append('<td style="opacity:0;">' + freq[i] + "</td>");
    }

    //prepare animation queue
    for (let i = 0; i < freq.length; i++) {
        animationQueue.push({
            object: $(".cumulative-tbl thead tr > th:eq(" + i + ")"),
            action: { opacity: 1 },
            option: { duration: animationDuration },
        });
        animationQueue.push({
            object: $(".cumulative-tbl tbody tr > td:eq(" + i + ")"),
            action: { opacity: 1 },
            option: { duration: animationDuration },
        });
    }

    //update frequency to cumulative frequency to animate later
    for (let i = 1; i < freq.length; i++) {
        freq[i] = freq[i] + freq[i - 1];
    }

    //run animation for calculating frequency -> hide and update frequency row -> run update animation
    executeAnimationQueue(
        '""',
        "setTimeout(function () {" +
            "animationQueue = [];" +
            "for (let i = 0; i < freq.length; i++) {" +
            '$(".cumulative-tbl tbody tr > td:eq(" + i + ")").css("opacity", 0);' +
            '$(".cumulative-tbl tbody tr > td:eq(" + i + ")").text(freq[i]);' +
            "animationQueue.push({" +
            'object: $(".cumulative-tbl tbody tr > td:eq(" + i + ")"),' +
            "action: { opacity: 1 }," +
            "option: { duration: animationDuration }," +
            "});" +
            "}" +
            "executeAnimationQueue(" +
            '""' +
            ", " +
            '""' +
            ");" +
            "}, 400 * freq.length);"
    );
}

//init value of objects----------------------

function getRandom(size, sort, min, max) {
    var value = [];
    if (addObject > 2) {
        value = Array(size + addObject)
            .fill()
            .map(() => Math.floor(max * Math.random()) + min);
    } else {
        //if addobject <= 2 ie level less than 20, all values are unique so we ignore max value
        for (let i = 0; i < size + addObject; i++) {
            value.push(min + i);
        }
        for (let i = value.length - 1; i > 0; i--) {
            //Randomize array in-place using Durstenfeld shuffle algorithm
            var rand = Math.floor(Math.random() * (i + 1));
            swap(value, rand, i);
        }
    }   
    if (sort) {
        value.sort();
    }
    return value;
}

function checkDupe(arr, dupe) {
    var counts = [];
    arr.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });
    counts = counts.filter(function (x) {
        return x != null;
    });
    return Math.max(...counts) > dupe;
}

function checkSort(arr) {
    var copied = arr.slice();
    copied.sort();
    var sorted = copied.toString();
    var sortedRe = copied.reverse().toString();
    return arr.toString() == sorted || arr.toString() == sortedRe;
}

function getValue(size, sort, dupe, min, max, checksort) {
    var value = getRandom(size, sort, min, max);
    while (checkDupe(value, dupe) || (checksort && checkSort(value))) {
        value = getRandom(size, sort, min, max);
    }
    return value;
}

function initSortValue(sortType) {
    var value = [];
    hideUnrelatedButton();
    //var size = 0;
    //var counts = []; //for counting duplicates
    if (sortType == "bubble") {
        //bubble
        move = Math.pow(4 + addObject, 2);
        //value = getValue(4, true, 2, 0, 5, false);
        value = getValue(4, false, 2, 1, 6, true);
        //swapping
        /*var starting = value.toString();
        while (starting == value.toString()) {
            var swaptime = Math.floor(Math.random() * 2); //0 = swap once, 1 = swap 2 times
            var pos = 0;
            var index = [];
            if (swaptime == 0) {
                index = [0, 1, 2];
                pos = index[Math.floor(Math.random() * index.length)];
                swap(value, pos, pos + 1);
            }
            if (swaptime == 1) {
                index = [0, 2];
                pos = index[Math.floor(Math.random() * index.length)];
                swap(value, pos, pos + 1);

                index = [0, 1, 2];
                index.splice(index.indexOf(pos), 1);
                pos = index[Math.floor(Math.random() * index.length)];
                swap(value, pos, pos + 1);
            }
        }*/
        scoreWeight.compare = 0.1;
        scoreWeight.correct = 0.4;
        scoreWeight.move = 0.1;
        scoreWeight.procedure = 0.4;
    } else if (sortType == "selection") {
        //select
        move = Math.pow(4 + addObject, 2);
        value = getValue(4, false, 2, 1, 6, true);
        scoreWeight.compare = 0.1;
        scoreWeight.correct = 0.4;
        scoreWeight.move = 0.1;
        scoreWeight.procedure = 0.4;
    } else if (sortType == "insertion") {
        //insert
        move = Math.pow(4 + addObject, 2);
        value = getValue(4, false, 2, 1, 6, true);
        //value = getValue(4, true, 2, 0, 5, false);
        //swapping
        /*var starting = value.toString();
        while (starting == value.toString()) {
            var swaptime = Math.floor(Math.random() * 2); //0 = swap once, 1 = swap 2 times
            var pos = 0;
            var index = [];
            if (swaptime >= 0) {
                index = [0, 1, 2];
                pos = index[Math.floor(Math.random() * index.length)];
                swap(value, pos, pos + 1);
            }
            if (swaptime >= 1) {
                index = [0, 1, 2];
                index.splice(index.indexOf(pos), 1);
                pos = index[Math.floor(Math.random() * index.length)];
                swap(value, pos, pos + 1);
            }
        }*/
        //nerf correct weight if show values
        if(showValue == 1) {
            scoreWeight.correct = 0.1;
            scoreWeight.procedure = 0.5;
        } else {
            scoreWeight.correct = 0.3;
            scoreWeight.procedure = 0.3;
        }

        scoreWeight.compare = 0.3;
        scoreWeight.move = 0.1;
    } else if (sortType == "merge") {
        //merge
        move = 10;
        value = getValue(4, false, 2, 1, 6, true);
        if(showValue == 1) {
            scoreWeight.correct = 0.1;
            scoreWeight.procedure = 0.45;
        } else {
            scoreWeight.correct = 0.2;
            scoreWeight.procedure = 0.35;
        }
        scoreWeight.compare = 0.25;
        scoreWeight.move = 0.2;
        
    } else if (sortType == "quick") {
        //quick
        move = 10;
        value = getValue(4, false, 2, 1, 6, true);
        if(showValue == 1) {
            scoreWeight.correct = 0.1;
            scoreWeight.procedure = 0.4;
        } else {
            scoreWeight.correct = 0.25;
            scoreWeight.procedure = 0.25;
        }
    } else if (sortType == "heap") {
        //heap
        move = (3 + addObject) * 3;
        value = getValue(4, false, 2, 1, 6, true);
        if(showValue == 1) {
            scoreWeight.correct = 0.1;
            scoreWeight.procedure = 0.4;
        } else {
            scoreWeight.correct = 0.25;
            scoreWeight.procedure = 0.25;
        }
    } else if (sortType == "counting") {
        //count
        move = 5 + addObject;
        value = getValue(4, false, 2, 1, 5, true);
        //counting needs to show values in the first place so no need to nerf
        scoreWeight.compare = 0.25;
        scoreWeight.correct = 0.1;
        scoreWeight.move = 0.1;
        scoreWeight.procedure = 0.55;
    }
    //console.log(value);

    return value;
}

//-------------------------------------------

//evaluation functions-----------------------

function bubbleLog(arr) {
    var log = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            log.push({ func: "compare", param: [j.toString(), (j + 1).toString()].sort() });
            if (arr[j] > arr[j + 1]) {
                //[arr[j], arr[j+1]] = [arr[j+1], arr[j]]
                swap(arr, j, j + 1);
                log.push({ func: "swap", param: [j.toString(), (j + 1).toString()].sort() });
            }
        }
    }
    //console.log(log);
    //console.log(arr);
    return log;
}

function insertLog(arr) {
    var log = [];
    for (let i = 1; i < arr.length; i++) {
        var j = i;
        if (j > 0) {
            log.push({ func: "compare", param: [(j - 1).toString(), j.toString()].sort() }); //compare first loop
        }
        while (j > 0 && arr[j] < arr[j - 1]) {
            log.push({ func: "swap", param: [(j - 1).toString(), j.toString()].sort() });
            swap(arr, j - 1, j);
            j--;
            if (j > 0) {
                log.push({ func: "compare", param: [(j - 1).toString(), j.toString()].sort() }); //compare next loop
            }
        }
    }
    //console.log(log);
    //console.log(arr);
    return log;
}

function selectLog(arr) {
    var min_idx = 0;
    var log = [];

    for (let i = 0; i < arr.length - 1; i++) {
        min_idx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        log.push({ func: "find min", param: [i.toString(), (arr.length - 1).toString()] });
        if (min_idx != i) {
            swap(arr, min_idx, i);
            log.push({ func: "swap", param: [min_idx.toString(), i.toString()].sort() });
        }
    }
    //console.log(log);
    //console.log(arr);
    return log;
}

function mergeLog(arr) {
    var log = [];
    for (let i = 0; i < Math.ceil(Math.log2(arr.length)); i++) {
        log.push({ func: "divide", param: [] });
    }
    mergeSort(log, arr, 0, arr.length - 1);
    //console.log(log);
    //console.log(arr);
    return log;
}

function mergeSort(log, arr, left, right) {
    if (left >= right) {
        return;
    }
    var middle = left + parseInt((right - left) / 2);
    mergeSort(log, arr, left, middle);
    mergeSort(log, arr, middle + 1, right);
    log.push({ func: "merge", param: [left.toString(), right.toString()].sort() });
    //due to difficulty in verifying group's index, parameters are object's range
}

function quickLog(arr) {
    var log = [];
    quickSort(log, arr, 0, arr.length - 1);
    //console.log(log);
    //console.log(arr);
    return log;
}

function partition(log, arr, low, high) {
    log.push({ func: "pivot", param: [low.toString(), high.toString(), low.toString()] });
    swap(arr, low, high);

    // pivot
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}

function quickSort(log, arr, low, high) {
    if (low < high) {
        let pi = partition(log, arr, low, high);
        quickSort(log, arr, low, pi - 1);
        quickSort(log, arr, pi + 1, high);
    }
}

function heapLog(arr) {
    //unlike other methods, heap can be visualized without doing actual sorting
    var log = [];
    log.push({ func: "heap", param: ["0", (arr.length - 1).toString()] }); //init heap
    for (let i = arr.length - 1; i > 0; i--) {
        log.push({ func: "swap", param: ["0", i.toString()] });
        log.push({ func: "pop node", param: [] });
        if (i >= 2) log.push({ func: "heap", param: [] });
    }
    return log;
}

function countLog(arr) {
    var log = [];
    var count = new Array(Math.max(...arr) + 1).fill(0);
    var output = new Array(arr.length).fill(0);

    log.push({ func: "get count", param: [] });
    for (let i = 0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    for (let i = 1; i < count.length; i++) {
        count[i] = count[i] + count[i - 1];
    }
    for (let i = 0; i < arr.length; i++) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
        log.push({ func: "copy", param: [i.toString(), count[arr[i]].toString()] });
    }
    //console.log(count);
    //console.log(output);
    //console.log(log);
    return log;
}

function getCorrectSort(sortType, arr) {
    //array = copy of sortObj value

    if (sortType == "bubble") {
        return bubbleLog(arr);
    } else if (sortType == "selection") {
        return selectLog(arr);
    } else if (sortType == "insertion") {
        return insertLog(arr);
    } else if (sortType == "merge") {
        return mergeLog(arr);
    } else if (sortType == "quick") {
        return quickLog(arr);
    } else if (sortType == "heap") {
        return heapLog(arr);
    } else if (sortType == "counting") {
        return countLog(arr);
    }
}

function findMax(a, b) {
    if (a > b) return a;
    else return b;
}

function lcsAlgor(X, Y, m, n) {
    //lcs algor.
    var L = new Array(m + 1);
    for (var i = 0; i < L.length; i++) {
        L[i] = new Array(n + 1);
    }
    var i, j;

    /* Following steps build L[m+1][n+1] in
      bottom up fashion. Note that L[i][j]
      contains length of LCS of X[0..i-1]
      and Y[0..j-1] */
    for (i = 0; i <= m; i++) {
        for (j = 0; j <= n; j++) {
            if (i == 0 || j == 0) {
                L[i][j] = 0;
            } else if (JSON.stringify(X[i - 1]) == JSON.stringify(Y[j - 1])) {
                L[i][j] = L[i - 1][j - 1] + 1;
            } else {
                L[i][j] = findMax(L[i - 1][j], L[i][j - 1]);
            }
        }
    }

    /* L[m][n] contains length of LCS
      for X[0..n-1] and Y[0..m-1] */
    return L[m][n];
}

function getResultCorrectness() {
    var sortSeq = 0;
    var maxSeq = 0;
    for (let i = 0; i < sortObj.length - 1; i++) {
        if (sortObj[i].value <= sortObj[i + 1].value) {
            sortSeq++;
        } else {
            if (sortSeq > maxSeq) maxSeq = sortSeq;
            sortSeq = 0;
        }
    }

    if (maxSeq > sortSeq) sortSeq = maxSeq;

    return sortSeq + 1;
}

function evaluateResult(sortType, playerLog, originalValue, sortObj) {
    var correctLog = getCorrectSort(sortType, originalValue);
    if(showValue == 1) {
        correctLog = correctLog.filter(function(x){
                        return x.func != "compare" && x.func != "find min"
                    });
    }
    var idealMove = correctLog.filter(function (x) {
        return x.func != "compare" && x.func != "find min";
    }).length;
    var move = playerLog.filter(function (x) {
        return x.func != "compare" && x.func != "find min";
    }).length;
    var actionSeq = lcsAlgor(playerLog, correctLog, playerLog.length, correctLog.length);

    var correctness = Math.round((getResultCorrectness() / sortObj.length) * 100);
    correctness = correctness > 0 ? correctness : 0;
    var correctAction = Math.round((actionSeq / correctLog.length) * 100);
    correctAction = correctAction > 0 ? correctAction : 0;
    var moveTaken = Math.round(100 * (1 - Math.abs(move - idealMove) / idealMove));
    var compareTaken = Math.round(100 * (1 - Math.abs(playerLog.length - move - (correctLog.length - idealMove)) / (correctLog.length - idealMove)));
    var totalMove = 0;

    totalMove = Math.round(
        (100 * ((moveTaken * scoreWeight.move || 0) + (compareTaken * scoreWeight.compare || 0))) /
            ((isNaN(moveTaken) ? 0 : 100 * scoreWeight.move) + (isNaN(compareTaken) ? 0 : 100 * scoreWeight.compare))
    );
    totalMove = totalMove > 0 ? totalMove : 0;

    //console.log(correctLog);
    //console.log(playerLog);
    //console.log(correctness + " " + correctAction + " " + moveTaken + " " + compareTaken);
    var result = [];
    for (let i = 0; i < sortObj.length; i++) {
        result.push(sortObj[i].value);
    }
    appendActionLog("", "<b>Result: </b>" + result.toString());
    appendActionLog("", "<b>Correct Answer: </b>" + originalValue.sort().toString());
    appendActionLog("", "<b>Score summary</b>");
    appendActionLog("", "Correctness: " + correctness);
    appendActionLog("", "Sort Procedure: " + correctAction);
    appendActionLog("", "Total used move and compare: " + totalMove);
    //appendActionLog("", "Move used: " + moveTaken);
    //appendActionLog("", "Compare used: " + compareTaken);
    return Math.round(
        correctness * scoreWeight.correct + correctAction * scoreWeight.procedure + totalMove * (scoreWeight.move + scoreWeight.compare)
    );
}

function closeSortGameplay(postScore) {
    $(postScore).attr("data-sort-score", evaluateResult($(".sort-obj").attr("data-sort-type"), playerLog, originalValue, sortObj));
    //once evaluate, not allow players to play any further and not able to cancel
    $(".sort-help").text("Well Done!");
    $(".sort-func").prop("disabled", true);
    $(".sort-obj input").prop("checked", false);
    $(".action-list > button[value=cancel]").hide();

    $(".sort-obj label div[id^='d']").css("background-image", 'url("./sortGameplay/numberOrb.png")');
    $(".sort-obj label div[id^='d']").css("color", "#1B4F72");
    for (let i = 0; i < sortObj.length; i++) {
        $("#d" + (i + 1)).text(sortObj[i].value);
    }
    appendActionLog("", "Score obtained: " + $(postScore).attr("data-sort-score"));
    sortState = 3;
}

//-------------------------------------------

//init object
$(document).ready(function () {
    originalValue = initSortValue($(".sort-obj").attr("data-sort-type"));
    var value = originalValue.slice();
    //positionHeap = new Array(value.length).fill({tree: {}, normal: {}});
    //var treeLeft = [90, 30, 150, 10, 60, 115];
    //var treeTop = [0, 20, -20, 0, -40, -80];
    sortObj = [];

    $("label > div").hide();

    for (let i = 0; i < value.length; i++) {
        let obj = {};
        $("#cb" + (i + 1)).val(i);
        $("#d" + (i + 1)).html(String.fromCharCode(65 + i) + (showValue == 1 ? "<div class='value-label'>" + value[i] + "</div>" : ""));
        $("#d" + (i + 1)).show();

        $("#da_" + String.fromCharCode(65 + i)).text(String.fromCharCode(65 + i));
        $("#da_" + String.fromCharCode(65 + i)).show();
        $("#da_" + String.fromCharCode(65 + i)).css("left", parseInt($("#d" + (i + 1)).offset().left - $("#d1").offset().left) + "px");
        $("#da_" + String.fromCharCode(65 + i)).css("top", -40 * i + "px");
        position.push(parseInt($("#d" + (i + 1)).offset().left - $("#d1").offset().left) + "px");

        $("#dha_" + String.fromCharCode(65 + i)).text(String.fromCharCode(65 + i));
        $("#dha_" + String.fromCharCode(65 + i)).show();
        $("#dha_" + String.fromCharCode(65 + i)).css("left", 57 * i + "px");
        $("#dha_" + String.fromCharCode(65 + i)).css("top", -40 * i + "px");
        positionHeap[i] = 57 * i + "px";

        obj["label"] = String.fromCharCode(65 + i);
        obj["value"] = value[i];
        sortObj.push(obj);
    }
    $(".group").hide();
    $(".heap").hide();
    $(".move-left").text(move);

    freq = new Array(Math.max(...originalValue) + 1).fill(0);
    copiedObj = new Array(sortObj.length).fill({});

    if(addObject >= 3) {
        $(".sort-obj.heap").attr("style", "padding-left:10px;display:none;");
    }
});

$(".sort-func").click(function () {
    sortState = 1; //shift state to waiting for input

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

    /*if (clickedFunc == "min") {
        min = 2;
        max = 2;
    } else if (clickedFunc == "pivot") {
        min = 2;
        max = 2;
    } else if (clickedFunc == "divide" || clickedFunc == "popNode" || clickedFunc == "getCount") {
        min = 0;
        max = 0;
    } else if (clickedFunc == "heap" && heapObj.length > 0) {
        min = 0;
        max = 0;
    } else {
        min = 2;
        max = 2;
    }*/

    if (min == 0 && max == 0) {
        //$(".sort-help").text('Click "Done" to execute selected function.');
        $(".done").prop("disabled", false);
    } /*else {
        text = "Choose objects ";
        if (min == max) {
            text = text + min;
        } else {
            if (min != 0) text = text + "at least " + min + " ";
            if (max != 0) text = text + "up to " + max + " ";
        }
        $(".sort-help").text(text + "objects");
    }*/
});

//attach click event to parent since in heap, inputs are dynamically generated
$(".sort-obj").click(function (e) {
    if (e.target.tagName == "INPUT") {
        //if clicked element is input, run this
        count = $(".sort-obj input:checked").length;
        checkTarget(count);
    }
});

$(".cancel").click(function () {
    sortState = toIdle();
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
    if (clickedFunc == "swap") {
        //for swapping with a node in heap tree, the other element must be another node in the same tree
        if (Array.isArray(index[0]) && Array.isArray(index[1]) && index[0][0] == index[1][0]) {
            appendActionLog("swap", "|func| |param1| with |param2|", [index[0][1], index[1][1]], heapObj[index[0][0]]);

            animationQueue.push({
                object: $("#dha_" + heapObj[index[0][0]][index[1][1]].label),
                action: { left: positionHeap[parseInt(index[0][0]) + parseInt(index[0][1])] },
                option: { duration: animationDuration },
            });
            animationQueue.push({
                object: $("#dha_" + heapObj[index[0][0]][index[0][1]].label),
                action: { left: positionHeap[parseInt(index[0][0]) + parseInt(index[1][1])] },
                option: { duration: animationDuration },
            });

            swap(heapObj[index[0][0]], index[0][1], index[1][1]);
        } else if (!(Array.isArray(index[0]) || Array.isArray(index[1]))) {
            //normal swap
            if (heapObj.length == 0) {
                appendActionLog("swap", "|func| |param1| with |param2|", index, sortObj);

                animationQueue.push({
                    object: $("#da_" + sortObj[index[0]].label),
                    action: { left: position[index[1]] },
                    option: { duration: animationDuration },
                });
                animationQueue.push({
                    object: $("#da_" + sortObj[index[1]].label),
                    action: { left: position[index[0]] },
                    option: { duration: animationDuration },
                });
                executeAnimationQueue(
                    '$(".sort-obj:first").hide();' + '$(".animation").show();',
                    "setTimeout(function () {" + '$(".sort-obj:first").show();' + '$(".animation").hide();' + "}, 350);"
                );

                swap(sortObj, index[0], index[1]);
            }
            //in case of swapping elements outside the tree
            else {
                appendActionLog("swap", "|func| |param1| with |param2|", index, heapObj);

                var treeIndex = heapObj.findIndex(function (x) {
                    return x.length != undefined;
                });
                var posIndex = [0, 0];
                if (index[0] > treeIndex) {
                    posIndex[0] = parseInt(index[0]) + heapObj[treeIndex].length - 1;
                } else {
                    posIndex[0] = parseInt(index[0]);
                }
                if (index[1] > treeIndex) {
                    posIndex[1] = parseInt(index[1]) + heapObj[treeIndex].length - 1;
                } else {
                    posIndex[1] = parseInt(index[1]);
                }
                animationQueue.push({
                    object: $("#dha_" + heapObj[index[0]].label),
                    action: { left: positionHeap[posIndex[1]] },
                    option: { duration: animationDuration },
                });
                animationQueue.push({
                    object: $("#dha_" + heapObj[index[1]].label),
                    action: { left: positionHeap[posIndex[0]] },
                    option: { duration: animationDuration },
                });

                swap(heapObj, index[0], index[1]);
            }
        } else {
            sortState = 1;
        }
    } else if (clickedFunc == "compare") {
        appendCompareLog(compareShow(index[0], index[1]));
        appendActionLog("compare", "|func| |param1| with |param2|", index, sortObj);
    } else if (clickedFunc == "min") {
        appendCompareLog(
            "Minimum value from " + sortObj[index[0]].label + " to " + sortObj[index[1]].label + " is " + findMin(index[0], index[1]).label
        );
        appendActionLog("find min", "find minimum value from |param1| to |param2|", index, sortObj);
    } else if (clickedFunc == "pivot") {
        if (seq_input.length == 0) {
            //on first done, only store data then wait for input again
            if (index.length == 1) index.push(index[0]);

            seq_input.push(index); //CRITICAL NOTE: PUSH IN JS = INSERT DATA AT THE END OF ARRAY

            $(".sort-obj label").hide();
            for (let i = index[0]; i <= index[1]; i++) {
                $(".sort-obj label:eq(" + i + ")").show();
            }
            $(".sort-obj input").prop("checked", false);
            $(".sort-obj input").prop("disabled", false);
            //$(".sort-obj input:lt(" + sortObj.length + ")").prop("disabled", false);
            min = 1;
            max = 1;
            sortState = 1;
            $(".sort-help").text("Click an object chosen to be the pivot.");
        } else if (seq_input.length == 1) {
            //if seq_input has 1 data (pass first done), pivot
            appendActionLog("pivot", "partition from |param1| to |param2| using |param3| as pivot", seq_input[0].concat(index), sortObj);
            partitioning(seq_input[0], index);
        }
    } else if (clickedFunc == "divide") {
        $(".group").show();
        $(".sort-obj:not(.group)").hide();
        $(".sort-func:not([value=merge], [value=divide])").hide();
        $(".sort-func[value=merge], [value=divide]").show();
        //$(".sort-func[value=divide]").show();
        //all groups have only 1 member
        if (groupObj.length == sortObj.length) {
            sortState = 1;
        } else {
            appendActionLog("divide", "|func| objects into groups", [], sortObj);
            divideGroup();
        }
    } else if (clickedFunc == "merge") {
        if (index[1] - index[0] == 1) {
            //we need group next to each other
            var param = [];
            var count = 0;
            for (let i = 0; i < index[0]; i++) {
                count = count + groupObj[i].length;
            }
            param.push(count.toString());
            for (let i = index[0]; i < index[1]; i++) {
                count = count + groupObj[i].length;
            }
            param.push((count + groupObj[index[1]].length - 1).toString());
            appendActionLog(
                "merge",
                "|func| group " + (parseInt(index[0]) + 1) + " and group " + (parseInt(index[1]) + 1) + " together",
                param,
                sortObj
            );

            mergeGroup(index[0], index[1]);
        } else {
            sortState = 1;
        }
    } else if (clickedFunc == "heap") {
        $(".heap").show();
        $(".sort-obj:not(.heap)").hide();
        $(".sort-func:not([value=swap], [value=heap], [value=popNode])").hide();
        $(".sort-func[value=swap], [value=heap], [value=popNode]").show();
        //$(".sort-func[value=heap]").show();
        //$(".sort-func[value=popNode]").show();
        $(".toggle-heap").show();

        if (heapObj.length > 0) {
            var heapTree = heapObj.findIndex(function (x) {
                return x.length != undefined;
            });
            appendActionLog("heap", "re-heapify the tree", [], sortObj);
            heapify(heapObj[heapTree], 0, heapTree);
        } else {
            appendActionLog("heap", "create heap tree from |param1| to |param2|", index, sortObj);
            var heapTree = sortObj.slice(index[0], parseInt(index[1]) + 1);
            for (let i = Math.floor(heapTree.length / 2) - 1; i >= 0; i--) {
                heapify(heapTree, i, index[0]);
            }
        }

        if (heapObj.length <= 0) {
            heapObj = heapObj.concat(sortObj.slice(0, index[0]));
            heapObj.push(heapTree);
            heapObj = heapObj.concat(sortObj.slice(parseInt(index[1]) + 1));
            animationQueue.push({
                object: $(".heap-animation > div"),
                action: { left: positionHeap[index[0]] },
                option: { duration: animationDuration },
            });
            animationQueue.push({ object: $(".heap-animation > div"), action: { left: "+=25px" }, option: { duration: animationDuration } });
            animationQueue.push({
                object: $(".heap-animation > div"),
                action: { width: heapTree.length * 60 + "px" },
                option: { duration: animationDuration },
            });
        }
    } else if (clickedFunc == "popNode") {
        if (
            heapObj.length > 0 &&
            heapObj.find(function (x) {
                return x.length != undefined;
            }) != undefined
        ) {
            appendActionLog("pop node", "pop the last node out of the tree", [], sortObj);
            var index = heapObj.findIndex(function (x) {
                return x.length != undefined;
            });
            var lastChild = heapObj[index].pop();
            var firstHalf = heapObj.slice(0, index + 1);
            firstHalf.push(lastChild);
            var lastHalf = heapObj.slice(index + 1);
            heapObj = firstHalf.concat(lastHalf);
            if (heapObj[index].length >= 2) {
                animationQueue.push({
                    object: $(".heap-animation > div"),
                    action: { width: heapObj[index].length * 60 - 8 + "px" },
                    option: { duration: animationDuration },
                });
            } else {
                animationQueue.push({ object: $(".heap-animation > div"), action: { width: "0px" }, option: { duration: animationDuration } });
            }
        }
    } else if (clickedFunc == "getCount") {
        $(".counting").show();
        $(".cumulative-tbl").show();
        $(".sort-func:not([value=copy])").hide();
        $(".sort-func[value=copy]").show();
        appendActionLog("get count", "get cumulative count of objects' values", [], sortObj);
        countFrequency();
    } else if (clickedFunc == "copy") {
        if (
            $(".sort-obj:not(.counting) input:checked").length == 1 &&
            $(".counting input:checked").length == 1 &&
            jQuery.isEmptyObject(copiedObj[index[1]]) &&
            copiedObj.find(function (x) {
                return JSON.stringify(x) == JSON.stringify(sortObj[index[0]]);
            }) == undefined
        ) {
            appendActionLog("copy", "copy values of |param1| to position " + (parseInt(index[1]) + 1) + " of the blank group", index, sortObj);

            //copy value
            copiedObj[index[1]] = JSON.parse(JSON.stringify(sortObj[index[0]]));
            freq[sortObj[index[0]].value]--;

            //make label of moved object invisible (if only div is invisible, it becomes clickable invisible object)
            $("#d" + (parseInt(index[0]) + 1))
                .parent()
                .css("opacity", 0);
            $(".cumulative-tbl tbody td:eq(" + sortObj[index[0]].value + ")").css("opacity", 0);
            $(".cumulative-tbl tbody td:eq(" + sortObj[index[0]].value + ")").text(freq[sortObj[index[0]].value]);
            //animation queue
            animationQueue.push({
                object: $("#da_" + sortObj[index[0]].label),
                action: { top: "+=198px", left: position[index[1]] },
                option: { duration: animationDuration },
            });
            animationQueue.push({
                object: $(".cumulative-tbl tbody td:eq(" + sortObj[index[0]].value + ")"),
                action: { opacity: 1 },
                option: { duration: animationDuration },
            });
            //if this copy is the last, move copied row to replace the original
            if ($("div[id^=d_c].emptyBox:visible").length == 1) {
                animationQueue.push({ object: $("div[id^=da]"), action: { top: "-=198px" }, option: { duration: animationDuration } });
            }
            executeAnimationQueue(
                '$(".animation").show();' + '$(".sort-obj:first").hide();',
                "setTimeout(function () {" +
                    '$(".animation").hide();' +
                    '$(".sort-obj:first").show();' +
                    'if ($("div[id^=d_c].emptyBox:visible").length > 1) {' +
                    '$("#d_c" + (parseInt(' +
                    index[1] +
                    ') + 1)).removeClass("emptyBox");' +
                    '$("#d_c" + (parseInt(' +
                    index[1] +
                    ") + 1)).text(copiedObj[" +
                    index[1] +
                    "].label);" +
                    "} else {" +
                    '$(".sort-obj:first div[id^=d]").parent().css("opacity", 1);' +
                    "}" +
                    "}, 300 * animationQueue.length);"
            );
        } else {
            sortState = 1;
        }
    }

    if (sortState == 2) {
        //if passing execution and state is still 2, update list
        //setTimeout(function(){$("label > div").removeAttr("style");}, 200);
        $(".sort-help").empty();
        if (clickedFunc != "compare" && clickedFunc != "min") {
            move--;
        }
        $(".move-left").text(move);

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

        //merge animation
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
        if (move <= 0 && sortState != 3) {
            closeSortGameplay($(this).parents().eq(1));
            sortState = 3;
        }
        sortState = toIdle();
    }
});

$(".toggle-heap").click(function () {
    treeView = !treeView;

    var index = [];
    var i = 0;

    $(".sort-obj input:checked").each(function () {
        //get checked checkboxes before clearing
        index[i] = this.id;
        i++;
    });

    if (treeView == true) {
        $(this).text("Group View");
        $(this).addClass("btn-danger");
        $(this).removeClass("btn-success");
    } else {
        $(this).text("Tree View");
        $(this).removeClass("btn-danger");
        $(this).addClass("btn-success");
    }
    updateHeap();

    for (let i = 0; i < index.length; i++) {
        $("#" + index[i]).prop("checked", true);
    }

    if (sortState == 1) {
        $(".sort-obj input").prop("disabled", false);
        //$(".sort-obj input:lt(" + sortObj.length + ")").prop("disabled", false);
    }

    checkTarget(index.length);
});
