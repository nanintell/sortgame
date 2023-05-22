class sortcai {
    //private variables
    #originalValue = {};
    #sortObj = [];
    #scoreWeight = { compare: 0.25, move: 0.25, correct: 0.25, procedure: 0.25 };
    #position = [];
    #positionHeap = [];
    #freq = [];
    #copiedObj = [];
    #heapObj = [];
    #groupObj = [];

    //public variables
    sortState = 0;
    move = 0;
    showValue = 0;
    addObject = 0;
    animationDuration = 0;
    playerLog = [];

    #swap(arr, index1, index2) {
        [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    }

    #initSortValue(sortType) {
        var addi = this.addObject;
        var swapfunc = this.#swap;
        var getRandom = function (size, sort, min, max) {
            var value = [];
            if (addi > 2) {
                value = Array(size + addi)
                    .fill()
                    .map(() => Math.floor(max * Math.random()) + min);
            } else {
                //if addi <= 2 ie level less than 20, all values are unique so we ignore max value
                for (var i = 0; i < size + addi; i++) {
                    value.push(min + i);
                }
                for (var i = value.length - 1; i > 0; i--) {
                    //Randomize array in-place using Durstenfeld shuffle algorithm
                    var rand = Math.floor(Math.random() * (i + 1));
                    swapfunc(value, rand, i);
                }
            }
            if (sort) {
                value.sort();
            }
            return value;
        };

        var checkDupe = function (arr, dupe) {
            var counts = [];
            arr.forEach(function (x) {
                counts[x] = (counts[x] || 0) + 1;
            });
            counts = counts.filter(function (x) {
                return x != null;
            });
            return Math.max(...counts) > dupe;
        };

        var checkSort = function (arr) {
            var copied = arr.slice();
            copied.sort();
            var sorted = copied.toString();
            var sortedRe = copied.reverse().toString();
            return arr.toString() == sorted || arr.toString() == sortedRe;
        };

        var getValue = function (size, sort, dupe, min, max, checksort) {
            var value = getRandom(size, sort, min, max);
            while (checkDupe(value, dupe) || (checksort && checkSort(value))) {
                value = getRandom(size, sort, min, max);
            }
            return value;
        };

        var value = getValue(4, false, 2, 1, 6, true);
        if (sortType == "bubble") {
            //bubble
            this.move = Math.pow(4 + this.addObject, 2);
            this.#scoreWeight.compare = 0.1;
            this.#scoreWeight.correct = 0.4;
            this.#scoreWeight.move = 0.1;
            this.#scoreWeight.procedure = 0.4;
        } else if (sortType == "selection") {
            //select
            this.move = Math.pow(4 + this.addObject, 2);
            this.#scoreWeight.compare = 0.1;
            this.#scoreWeight.correct = 0.4;
            this.#scoreWeight.move = 0.1;
            this.#scoreWeight.procedure = 0.4;
        } else if (sortType == "insertion") {
            //insert
            this.move = Math.pow(4 + this.addObject, 2);
            if (this.showValue == 1) {
                this.#scoreWeight.correct = 0.1;
                this.#scoreWeight.procedure = 0.5;
            } else {
                this.#scoreWeight.correct = 0.3;
                this.#scoreWeight.procedure = 0.3;
            }

            this.#scoreWeight.compare = 0.3;
            this.#scoreWeight.move = 0.1;
        } else if (sortType == "merge") {
            //merge
            this.move = 10;
            if (this.showValue == 1) {
                this.#scoreWeight.correct = 0.1;
                this.#scoreWeight.procedure = 0.45;
            } else {
                this.#scoreWeight.correct = 0.2;
                this.#scoreWeight.procedure = 0.35;
            }
            this.#scoreWeight.compare = 0.25;
            this.#scoreWeight.move = 0.2;
        } else if (sortType == "quick") {
            //quick
            this.move = 10;
            if (this.showValue == 1) {
                this.#scoreWeight.correct = 0.1;
                this.#scoreWeight.procedure = 0.4;
            } else {
                this.#scoreWeight.correct = 0.25;
                this.#scoreWeight.procedure = 0.25;
            }
        } else if (sortType == "heap") {
            //heap
            this.move = (3 + this.addObject) * 3;
            if (this.showValue == 1) {
                this.#scoreWeight.correct = 0.1;
                this.#scoreWeight.procedure = 0.4;
            } else {
                this.#scoreWeight.correct = 0.25;
                this.#scoreWeight.procedure = 0.25;
            }
        } else if (sortType == "counting") {
            //count
            this.move = 5 + this.addObject;
            this.#scoreWeight.compare = 0.25;
            this.#scoreWeight.correct = 0.1;
            this.#scoreWeight.move = 0.1;
            this.#scoreWeight.procedure = 0.55;
        }
        return value;
    }

    #appendActionLog(clickedFunc, format, parameter, arr, actionLog) {
        //clicked functions are modified before calling
        //format is text format to make logging readable
        if (clickedFunc != "") {
            this.playerLog.push({ func: clickedFunc, param: parameter });
            var text = format.replace("|func|", clickedFunc);
            for (let i = 0; i < parameter.length; i++) {
                text = text.replace("|param" + (i + 1) + "|", arr[parameter[i]].label);
            }
        } else {
            var text = format;
        }
    
        $(actionLog).each(function () {
            if ($(this).is("p")) {
                $(this).append(text + "</br>");
            } else if ($(this).is("tbody")) {
                $(this).append("<tr><td>" + text + "</td></tr>");
            }
        });
    }

    #appendCompareLog(text, cmpLog, lastCmp) {
        $(cmpLog).each(function () {
            if ($(this).is("p")) {
                $(this).append(text + "</br>");
            } else if ($(this).is("tbody")) {
                $(this).append("<tr><td>" + text + "</td></tr>");
            }
        });
        $(lastCmp).text(text);
    }

    //constructor function
    constructor(type, add, show, animation) {
        this.addObject = add;
        this.showValue = show;
        this.animationDuration = animation;
        this.#originalValue = this.#initSortValue(type); //init
        this.#freq = new Array(Math.max(...this.#originalValue) + 1).fill(0);
        this.#copiedObj = new Array(this.#originalValue.length).fill({});
        /*console.log(this.#originalValue);
        console.log(this.addObject);
        console.log(this.#scoreWeight);
        console.log(this.move);
        console.log(this.showValue);*/
    }

    //public functions are for getting, recording and displaying values
    initSortObj(posArr) {
        for (var i = 0; i < this.#originalValue.length; i++) {
            var obj = {};
            this.#position.push(posArr[i]);
            this.#positionHeap.push(57 * i + "px");
            obj["label"] = String.fromCharCode(65 + i);
            obj["value"] = this.#originalValue[i];
            this.#sortObj.push(obj);
        }
    }

    displayObj(type, labels, inputs) {
        var i = 0;
        var obj = [];
        if (type == "sort") {
            obj = this.#sortObj;
        } else if (type == "group") {
            obj = this.#sortObj;
        } else if (type == "heap") {
            obj = this.#sortObj;
        } else if (type == "count") {
            obj = this.#sortObj;
        }
        for (var i = 0; i < this.#sortObj.length; i++) {
            $(inputs).eq(i).val(i);
            $(labels)
                .eq(i)
                .html(this.#sortObj[i].label + (this.showValue == 1 ? "<div class='value-label'>" + this.#sortObj[i].value + "</div>" : ""));
            $(labels).eq(i).show();
        }
    }

    initAnimationObj(normal, heap) {
        for (var i = 0; i < this.#sortObj.length; i++) {
            $(normal).eq(i).text(this.#sortObj[i].label);
            $(normal).eq(i).css("left", this.#position[i]);
            $(normal)
                .eq(i)
                .css("top", -40 * i + "px");
            $(normal).eq(i).show();

            $(heap).eq(i).text(this.#sortObj[i].label);
            $(heap)
                .eq(i)
                .css("left", 57 * i + "px");
            $(heap)
                .eq(i)
                .css("top", -40 * i + "px");
            $(heap).eq(i).show();
        }
    }

    executeFunction(func, index, object, animation, heapAnimation, actionLog, compareLog, lastCompareLog) {
        this.sortState = 2;

        if (func == "swap") {
            //for swapping with a node in heap tree, the other element must be another node in the same tree
            if (Array.isArray(index[0]) && Array.isArray(index[1]) && index[0][0] == index[1][0]) {
                /*appendActionLog("swap", "|func| |param1| with |param2|", [index[0][1], index[1][1]], heapObj[index[0][0]]);
    
                animationQueue.push({
                    object: $("#dha_" + heapObj[index[0][0]][index[1][1]].label),
                    action: { left: positionHeap[parseInt(index[0][0]) + parseInt(index[0][1])] },
                    option: { duration: animationDuration },
                });
                animationQueue.push({
                    object: $("#dha_" + heapObj[index[0][0]][index[0][1]].label),
                    action: { left: positionHeap[parseInt(index[0][0]) + parseInt(index[1][1])] },
                    option: { duration: animationDuration },
                });*/
    
                swap(heapObj[index[0][0]], index[0][1], index[1][1]);
            } else if (!(Array.isArray(index[0]) || Array.isArray(index[1]))) {
                //normal swap
                if (this.#heapObj.length == 0) {
                    this.#appendActionLog("swap", "|func| |param1| with |param2|", index, this.#sortObj, actionLog);
                    //force obj to toggle display in 5ms
                    $(animation).parents("ul").fadeIn(5);
                    $(object).fadeOut(5);
                    //move objects
                    $(animation).eq(index[0]).css("left", this.#position[index[1]]);
                    $(animation).eq(index[1]).css("left", this.#position[index[0]]);
                    //$("#da_" + this.#sortObj[index[0]].label).css("left", this.#position[index[1]]);
                    //$("#da_" + this.#sortObj[index[1]].label).css("left", this.#position[index[0]]);
                    //toggle display
                    $(object).delay(this.animationDuration * 5).fadeIn(5);
                    $(animation).parents("ul").delay(this.animationDuration * 5).fadeOut(5);
    
                    this.#swap(this.#sortObj, index[0], index[1]);
                }
                //in case of swapping elements outside the tree
                else {
                    //appendActionLog("swap", "|func| |param1| with |param2|", index, heapObj);
    
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
                    /*animationQueue.push({
                        object: $("#dha_" + heapObj[index[0]].label),
                        action: { left: positionHeap[posIndex[1]] },
                        option: { duration: animationDuration },
                    });
                    animationQueue.push({
                        object: $("#dha_" + heapObj[index[1]].label),
                        action: { left: positionHeap[posIndex[0]] },
                        option: { duration: animationDuration },
                    });*/
    
                    swap(heapObj, index[0], index[1]);
                }
            } else {
                sortClass.sortState = 1;
            }
        } else if (func == "compare") {
            appendCompareLog(compareShow(index[0], index[1]));
            appendActionLog("compare", "|func| |param1| with |param2|", index, sortObj);
        } else if (func == "min") {
            appendCompareLog(
                "Minimum value from " + sortObj[index[0]].label + " to " + sortObj[index[1]].label + " is " + findMin(index[0], index[1]).label
            );
            appendActionLog("find min", "find minimum value from |param1| to |param2|", index, sortObj);
        } else if (func == "pivot") {
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
        } else if (func == "divide") {
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
        } else if (func == "merge") {
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
        } else if (func == "heap") {
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
        } else if (func == "popNode") {
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
        } else if (func == "getCount") {
            $(".counting").show();
            $(".cumulative-tbl").show();
            $(".sort-func:not([value=copy])").hide();
            $(".sort-func[value=copy]").show();
            appendActionLog("get count", "get cumulative count of objects' values", [], sortObj);
            countFrequency();
        } else if (func == "copy") {
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

        if (this.sortState == 2) {
            if (func != "compare" && func != "min") {
                this.move--;
            }


        }

    }
}


/*

UPDATE AS OF 16.20 24/4/2566

ONLY NORMAL SWAP IS DONE
CAN UPDATE SORT OBJECT BUT NOT OTHER TYPES

*/
