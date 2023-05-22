var chapterList = [
    {
        title: "Chapter 1: Strange World",
        stage: [
            {
                title: "Stage 1: Strange Creature",
                quest: [
                    {
                        id: 0,
                        title: "Quest 1-1: Beginning",
                        quest_desc: "You find yourself in a strange place. What happened here?",
                        star: "000",
                        type: "story",
                        require: null,
                        battle_desc: null,
                    },
                    {
                        id: 1,
                        title: "Quest 1-2: Let's battle",
                        quest_desc: "Monsters suddenly appear.",
                        require: 0,
                        star: "000",
                        type: "battle",
                        battle_desc: {
                            desc: "Bubble sort is about swapping elements but how can you know which elements to swap?",
                            element: { fire: "Nu", water: "Wk", earth: "Nu", wind: "Nu", light: "Nu", dark: "Nu", ice: "Nu" },
                            wave: 4,
                        },
                    },
                    {
                        id: 2,
                        title: "Quest 1-3: Question from the guardian",
                        quest_desc: "Water guardian stands on your way. Answer his riddle.",
                        require: 1,
                        star: "000",
                        type: "quiz",
                        battle_desc: null,
                    },
                ],
            },
        ],
    },
];

var questList = [];
var questCat = [];

var backgroundPics = [
    {
        id: 1,
        name: "Beach",
    },
    {
        id: 2,
        name: "River",
    },
    {
        id: 3,
        name: "Volcano",
    },
    {
        id: 4,
        name: "Waterfall",
    },
];

var storyPics = ["bubbleAnimation.gif", "insertAnimation.gif", "selectAnimation.gif"];

var sorts = [
    {
        id: 1,
        name: "bubble",
    },
    {
        id: 2,
        name: "insertion",
    },
    {
        id: 3,
        name: "selection",
    },
    {
        id: 4,
        name: "heap",
    },
    {
        id: 5,
        name: "merge",
    },
    {
        id: 6,
        name: "quick",
    },
    {
        id: 7,
        name: "counting",
    },
];

var resist = [
    {
        id: 1,
        name: "--",
    },
    {
        id: 2,
        name: "Wk",
    },
    {
        id: 3,
        name: "St",
    },
    {
        id: 4,
        name: "Nu",
    },
    {
        id: 5,
        name: "Rf",
    },
    {
        id: 6,
        name: "Dr",
    },
];

var sprites = [
    {
        id: 1,
        name: "evan:embarrassed",
    },
    {
        id: 2,
        name: "evan:normal",
    },
    {
        id: 3,
        name: "evan:happy",
    },
    {
        id: 4,
        name: "evan:crying",
    },
    {
        id: 5,
        name: "evan:shocked",
    },
    {
        id: 6,
        name: "evan:smile",
    },
    {
        id: 7,
        name: "evan:serious",
    },
    {
        id: 8,
        name: "polwigle",
    },
];

var monsters = [
    {
        id: 1,
        name: "Polwigle - 1",
        hp: 150,
        spriteId: 8,
        attack: 50,
        resist: [
            {
                element: 1,
                resist: 2,
            },
            {
                element: 2,
                resist: 1,
            },
            {
                element: 3,
                resist: 4,
            },
            {
                element: 4,
                resist: 4,
            },
            {
                element: 5,
                resist: 4,
            },
            {
                element: 6,
                resist: 4,
            },
            {
                element: 7,
                resist: 4,
            },
        ],
    },
    {
        id: 1,
        name: "Polwigle - 2",
        hp: 200,
        spriteId: 8,
        attack: 60,
        resist: [
            {
                element: 1,
                resist: 2,
            },
            {
                element: 2,
                resist: 4,
            },
            {
                element: 3,
                resist: 4,
            },
            {
                element: 4,
                resist: 4,
            },
            {
                element: 5,
                resist: 4,
            },
            {
                element: 6,
                resist: 4,
            },
            {
                element: 7,
                resist: 4,
            },
        ],
    },
];

var characters = [];

var libraryContent = [];

var quests = [];

var imgInput = undefined;

function generateQuestList() {
    $(".category-option").hide();
    $(".master-quest-detail").hide();
    $(".master-quest").show();
    $(".prev-page").removeClass("homepage");

    $.ajax({
        url: "./questList/getQuestList.php",
        data: { category: $(".quest-background").attr("data-quest-category") },
        beforeSend: function () {
            $(".loading-page").show();
        },
        type: "POST",
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            $(".loading-page").fadeOut(500);
            //chapterList = data.chapters;
            //if user is a guest, filter all chapters
            //else data should be used to gen as it is.
            chapterList = data.chapters;
            if (data.isGuest == true) {
                //filter local storage
            }
            $(".master-quest").empty();
            $(".master-quest").append(
                '<div class="card card-primary add-chapter">' +
                    '<button type="button" class="btn btn-primary btn-lg btn-block"><i class="fas fa-plus"></i></button>' +
                    "</div>"
            );
            for (let i = 0; i < chapterList.length; i++) {
                $(".master-quest").append(getCardHTML("chapter", i, chapterList[i].title));

                for (let j = 0; j < chapterList[i].stage.length; j++) {
                    $(".chapter-card:eq(" + i + ") > .card-body").append(getCardHTML("stage", j, chapterList[i].stage[j].title));

                    for (let k = 0; k < chapterList[i].stage[j].quest.length; k++) {
                        $(".chapter-card:eq(" + i + ") .stage-card:eq(" + j + ") > .card-body").append(
                            getCardHTML("quest", k, chapterList[i].stage[j].quest[k].title)
                        );
                    }
                }
            }

            if ($("html").innerWidth() <= 820) {
                $(".master-quest-detail").hide();
            } else {
                $(".master-quest-detail").show();
            }

            getQuestFormData();
        },
    });
}

function toggleLockQuestCategory(qcat) {
    var icon = "";
    if (questCat[qcat] == "0") {
        icon = "unlock";
    } else {
        icon = "lock";
    }
    $('.category-option button[value="' + qcat + '"] .lock-quest-category').attr("data-lock-status", questCat[qcat]);
    $('.category-option button[value="' + qcat + '"] .lock-quest-category').html('<i class="fas fa-2x fa-' + icon + '"></i>');
}

function getCardHTML(type, index, title) {
    var minor = "";
    var color = "secondary";
    var minorColor = "";
    if (type == "chapter") {
        minor = "stage";
        color = "primary";
        minorColor = "dark";
    } else if (type == "stage") {
        minor = "quest";
        color = "dark";
        minorColor = "secondary";
    }

    var cardCode =
        '<div class="card card-' +
        color +
        " collapsed-card " +
        type +
        '-card" data-' +
        type +
        '-index="' +
        index +
        '">' +
        '<div class="card-header">' +
        '<input type="text" readonly class="form-control-plaintext float-left" value="' +
        title +
        '">' +
        '<div class="card-tools">' +
        '<button type="button" class="btn btn-tool edit-' +
        type +
        '"><i class="fas fa-2x fa-edit"></i></button>' +
        '<button type="button" class="btn btn-tool delete-' +
        type +
        '"><i class="fas fa-2x fa-times"></i></button>' +
        "</div>" +
        "</div>";
    if (minor != "") {
        cardCode =
            cardCode +
            '<div class="card-body" style="display:none;">' +
            '<div class="card card-' +
            minorColor +
            " add-" +
            minor +
            '">' +
            '<button type="button" class="btn btn-' +
            minorColor +
            ' btn-lg btn-block"><i class="fas fa-plus"></i></button>' +
            "</div>" +
            "</div>";
    }
    cardCode = cardCode + "</div>";

    return cardCode;
}

function enableEditCard(type, card) {
    var input = $(card).children(".card-header").find("input");
    var saveButton = $(card).find(".card-tools > .edit-" + type);
    var deleteButton = $(card).find(".card-tools > .delete-" + type);
    $(input).prop("readonly", false);
    $(input).removeClass("form-control-plaintext");
    $(input).addClass("form-control");

    $(saveButton).removeClass("edit-" + type);
    $(saveButton).addClass("save-" + type);
    $(saveButton).html('<i class="fas fa-2x fa-check"></i>');

    $(deleteButton).removeClass("delete-" + type);
    $(deleteButton).addClass("cancel-update-" + type);

    $(".master-quest button").not($(card).find(".card-header button")).prop("disabled", true);
}

function disableEditCard(type, card) {
    var input = $(card).children(".card-header").find("input");
    var saveButton = $(card).find(".card-tools > .save-" + type);
    var deleteButton = $(card).find(".card-tools > .cancel-update-" + type);

    $(input).prop("readonly", true);
    $(input).addClass("form-control-plaintext");
    $(input).removeClass("form-control");

    $(saveButton).addClass("edit-" + type);
    $(saveButton).removeClass("save-" + type);
    $(saveButton).html('<i class="fas fa-2x fa-edit"></i>');

    $(deleteButton).addClass("delete-" + type);
    $(deleteButton).removeClass("cancel-update-" + type);

    $(".master-quest button").prop("disabled", false);
}

function initQuestForm() {
    //reset forms
    $(".quest-form-modal input, textarea").val("");
    $(".quest-form-modal select").each(function () {
        $(this).find("option:first").prop("selected", true);
    });

    $(".required-quest").empty();
    $(".required-quest").append('<option value="">--</option>');
    for (let i = 0; i < quests.length; i++) {
        $(".required-quest").append('<option value="' + quests[i].id + '">' + quests[i].title + "</option>");
    }

    $(".quest-bg").empty();
    for (let i = 0; i < backgroundPics.length; i++) {
        $(".quest-bg").append('<option value="' + backgroundPics[i].id + '">' + backgroundPics[i].name + "</option>");
    }

    //clear dynamics
    $(".master-story-line").empty();
    $(".master-story-line").append(appendForm("storyline", 1));

    $(".master-story-pic").empty();
    $(".master-story-pic").append(appendForm("storypic", 1));
    $(".story-pic-line-range").attr("max", 1);
    //hide battle, quiz
    $(".quiz-quest-form").hide();
    $(".battle-quest-form").hide();
    //show story
    $(".story-quest-form").show();

    if ($("html").innerWidth() <= 820) {
        $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
        $(".quest-form-modal table").removeClass("table-responsive");
    } else {
        $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
        if ($("html").innerWidth() <= 991) {
            $(".quest-form-modal table").addClass("table-responsive");
        } else {
            $(".quest-form-modal table").removeClass("table-responsive");
        }
    }
}

function getQuestFormData() {
    $.ajax({
        url: "./questList/getQuestDetail.php",
        type: "POST",
        data: { operation: "init" },
        success: function (response) {
            //console.log(response);
            var data = JSON.parse(response);
            quests = data.quests;
            backgroundPics = data.bgpics;
            storyPics = data.storypics;
            sorts = data.sorts;
            sprites = data.sprites;
            monsters = data.mobs;
            characters = data.character;
            libraryContent = data.library;

            initQuestForm();

            $(".quest-bg").empty();
            for (let i = 0; i < backgroundPics.length; i++) {
                $(".quest-bg").append('<option value="' + backgroundPics[i].id + '">' + backgroundPics[i].name + "</option>");
            }

            $(".storypic-select").empty();
            $(".storypic-select").append('<option value="">--</option>');
            for (let i = 0; i < storyPics.length; i++) {
                $(".storypic-select").append('<option value="' + i + '">' + storyPics[i] + "</option>");
            }

            $(".sort-select").empty();
            for (let i = 0; i < sorts.length; i++) {
                if (sorts[i].name != "random") {
                    $(".sort-select").append('<option value="' + sorts[i].id + '">' + sorts[i].name + "</option>");
                }
            }

            $(".res-select").empty();
            $(".res-select:not(.monster-element)").append('<option value="">??</option>');
            for (let i = 0; i < resist.length; i++) {
                $(".res-select").append('<option value="' + resist[i].id + '">' + resist[i].name + "</option>");
            }

            $(".sprite-select").empty();
            $(".sprite-select").append('<option value="">--</option>');
            for (let i = 0; i < sprites.length; i++) {
                $(".sprite-select").append('<option value="' + sprites[i].id + '">' + sprites[i].name + "</option>");
            }

            $(".monster-select").empty();
            $(".monster-select").append('<option value="">--</option>');
            for (let i = 0; i < monsters.length; i++) {
                $(".monster-select").append('<option value="' + i + '">' + monsters[i].name + "</option>");
            }

            $(".character-unlock-form").empty();
            for (let i = 0; i < characters.length; i++) {
                $(".character-unlock-form").append(
                    '<div class="form-group" data-character-index="' +
                        i +
                        '"><label>' +
                        characters[i].name +
                        '</label><select class="form-control quest-list-form"></select></div>'
                );
            }

            $(".element-unlock-form").empty();
            $(".element-unlock-form").append(
                '<small>Please note that unlocked "elements" are used when a player uses a divine-element skill.' +
                    "One of those elements is randomly picked for him to sort with related sorting algorithm of it.</small>"
            );
            for (let i = 0; i < sorts.length; i++) {
                $(".element-unlock-form").append(
                    '<div class="form-group" data-element-index="' +
                        i +
                        '"><label>' +
                        sorts[i].element +
                        '</label><select class="form-control quest-list-form"></select></div>'
                );
            }

            $(".library-unlock-form").empty();
            for (let i = 0; i < libraryContent.length; i++) {
                $(".library-unlock-form").append(
                    '<div class="form-group" data-library-index="' +
                        i +
                        '"><label>' +
                        libraryContent[i].name +
                        '</label><select class="form-control quest-list-form"></select></div>'
                );
            }

            $(".required-quest, .quest-list-form").empty();
            $(".required-quest, .quest-list-form").append('<option value="">--</option>');
            for (let i = 0; i < quests.length; i++) {
                $(".required-quest, .quest-list-form").append('<option value="' + quests[i].id + '">' + quests[i].title + "</option>");
            }

            for (let i = 0; i < characters.length; i++) {
                $(".character-unlock-form .form-group[data-character-index=" + i + "] select").val(characters[i].required);
            }

            for (let i = 0; i < sorts.length; i++) {
                $(".element-unlock-form .form-group[data-element-index=" + i + "] select").val(sorts[i].required);
            }

            for (let i = 0; i < libraryContent.length; i++) {
                $(".library-unlock-form .form-group[data-library-index=" + i + "] select").val(libraryContent[i].required);
            }
        },
    });
}

function openUploadForm(input) {
    imgInput = $(input).parents(".input-group").children("select");
    //console.log(imgInput);
    $(".bg-import-form input, .story-img-form input").val("");
    if ($(input).val() == "story") {
        $(".bg-import-form").hide();
        $(".story-img-form").show();
    } else if ($(input).val() == "background") {
        $(".bg-import-form").show();
        $(".story-img-form").hide();
    }
    $(".upload-image").val($(input).val());
    $(".quest-form-modal").modal("hide");
    $(".img-save-modal").modal("show");
}

function appendForm(type, index, value) {
    //value is array of values from first to last
    var formValue = {};
    var spriteDropdown = function(value) {
        var spriteOption = "";
        for (let i = 0; i < sprites.length; i++) {
            var selected = "";
            if (value == sprites[i].id && value != undefined) {
                selected = "selected";
            }
            spriteOption = spriteOption + '<option value="' + sprites[i].id + '" ' + selected + '>' + sprites[i].name + "</option>"
        }
        return spriteOption;
    };
    var storypicDropdown = function(value) {
        var storypicOption = "";
        for (let i = 0; i < storyPics.length; i++) {
            var selected = "";
            if (value == storyPics[i] && value != undefined) {
                selected = "selected";
            }
            storypicOption = storypicOption + '<option value="' + i + '" ' + selected + '>' + storyPics[i] + "</option>";
        }
        return storypicOption;
    };
    var sortDropdown = function(value) {
        var sortOptions = "";
        for (let i = 0; i < sorts.length; i++) {
            var selected = "";
            if (value == sorts[i].id) {
                selected = "selected";
            }
            sortOptions = sortOptions + '<option value="' + sorts[i].id + '" ' + selected + '>' + sorts[i].name + "</option>";
        }
        return sortOptions;
    };
    var resistDropdown = function(value) {
        var resistOptions = "";
        for (let j = 0; j < resist.length; j++) {
            var selected = "";
            if (value == resist[j].id) {
                selected = "selected";
            }
            resistOptions = resistOptions + '<option value="' + resist[j].id + '" ' + selected + '>' + resist[j].name + "</option>";
        }
        return resistOptions;
    };
    var monsterDropdown = function(value) {
        var monsterOptions = "";
        for (let j = 0; j < monsters.length; j++) {
            var selected = "";
            if (value == monsters[j].id) {
                selected = "selected";
            }
            monsterOptions = monsterOptions + '<option value="' + j + '" ' + selected + '>' + monsters[j].name + "</option>";
        }
        return monsterOptions;
    };

    if (type == "storyline") {
        formValue = {text: "", spriteLeft: "", spriteRight: ""};
        if (value != undefined && value.length == 3) {
            formValue.text = value[0];
            if (value[1] != null) {
                formValue.spriteLeft = spriteDropdown(value[1]);
            } else {
                formValue.spriteLeft = spriteDropdown();
            }
            if (value[2] != null) {
                formValue.spriteRight = spriteDropdown(value[2]);
            } else {
                formValue.spriteRight = spriteDropdown();
            }
        } else {
            formValue.spriteLeft = spriteDropdown();
            formValue.spriteRight = spriteDropdown();
        }
        return '<div class="story-line-form p-1 border"> \
                    <div class="form-group"><label>Line <span class="story-line-no">' + index + '</span> \
                    </label><div class="float-right"> \
                    <button type="button" class="btn btn-tool mr-3 px-0" onclick="swapLine(\'up\', this)"><i class="fas fa-arrow-up"></i></button> \
                    <button type="button" class="btn btn-tool px-0 mr-1" onclick="swapLine(\'down\', this)"><i class="fas fa-arrow-down"></i></button></div> \
                    <textarea type="text" class="form-control story-text" placeholder="Story Content">' + formValue.text + '</textarea></div> \
                    <div class="form-group"> \
                    <label>Sprites of Line <span class="story-line-no">' + index + '</span></label> \
                    <div class="input-group"> \
                    <select class="form-control sprite-select story-sprite-left" title="Left Sprite"> \
                    <option value="">--</option>' + formValue.spriteLeft + '</select> \
                    <select class="form-control sprite-select story-sprite-right" title="Right Sprite"> \
                    <option value="">--</option>' + formValue.spriteRight + '</select> \
                    </div></div></div>';
    } else if (type == "storypic") {
        formValue = {pic: "", start: "", stop: ""};
        if (value != undefined && value.length == 3) {
            formValue.pic = storypicDropdown(value[0]);
            formValue.start = value[1];
            formValue.stop = value[2];
        } else {
            formValue.pic = storypicDropdown();
        }
        return '<div class="story-pic-form p-1 border"> \
                    <div class="form-group"><label >Picture <span class="story-pic-no">' + index + '</span></label> \
                    <div class="input-group"> \
                    <select class="form-control storypic-select story-pic"><option value="">--</option>' + formValue.pic + '</select> \
                    <div class="input-group-append"> \
                    <button class="btn btn-secondary add-img" value="story" onclick="openUploadForm(this)"><i class="fas fa-plus"></i></button> \
                    </div></div></div><div class="form-group"> \
                    <label>Picture <span class="story-pic-no">' + index + '</span> appears between</label> \
                    <div class="input-group"> \
                    <input type="number" class="form-control story-pic-line-range" placeholder="Start Line" min="1" value="' + formValue.start + '"> \
                    <input type="number" class="form-control story-pic-line-range" placeholder="Stop Line" min="1" value="' + formValue.stop + '"> \
                    </div></div></div>'
    } else if (type == "quizchoice") {
        formValue = {label: "", correct: ["", "false", ""]};
        if (value != undefined && value.length == 2) {
            formValue.label = value[0];
            if (value[1] == 1) {
                formValue.correct[0] = "active";
                formValue.correct[1] = "true";
                formValue.correct[2] = "checked"
            }
        }
        return '<div class="input-group"> \
            <input type="text" class="form-control choice-label" placeholder="Choice in dropdown" value="' + formValue.label + '"> \
            <div class="input-group-append" data-toggle="button"> \
            <label class="btn btn-outline-dark ' + formValue.correct[0] + '" aria-pressed="' + formValue.correct[1] + '"> \
            <input type="checkbox" class="choice-correct" autocomplete="off" style="display:none;" ' + formValue.correct[2] + '> \
            <i class="fas fa-check"></i></label></div></div>';
    } else if (type == "quizdropdown") {
        formValue = {label: "", choice: ""};
        var choiceHTML = "";
        if (value != undefined && value.length == 2) {
            formValue.label = value[0];
            formValue.choice = value[1];
            //gen choice
            for(let i = 0; i < formValue.choice.length; i++) {
                choiceHTML = choiceHTML + appendForm("quizchoice", 0, [formValue.choice[i].text, formValue.choice[i].correct]);
            }
        } else {
            choiceHTML = appendForm("quizchoice", 0);
        }
        return '<div class="dropdown-form border p-1"> \
            <label class="mb-3">Dropdown <span class="dropdown-no">' + index + '</span></label> \
            <div class="row"><div class="col-sm-6"><div class="form-group"><label>Label</label> \
            <textarea type="text" class="form-control dropdown-label" placeholder="Label of dropdown">' + formValue.label + '</textarea> \
            </div></div><div class="col-sm-6"><div class="form-group"><label>Choice</label> \
            <div class="choice-detail-form">' + choiceHTML + '</div></div></div></div></div>';
    } else if (type == "quizwhole") {
        formValue = {question: "", sort: "", spriteLeft: "", spriteRight: "", pic: "", dropdown: ""};
        var dropdownHTML = "";
        if (value != undefined && value.length == 6) {
            formValue.question = value[0];
            formValue.sort = sortDropdown(value[1]);
            if (value[2] != null) {
                formValue.spriteLeft = spriteDropdown(value[2]);
            } else {
                formValue.spriteLeft = spriteDropdown();
            }
            if (value[3] != null) {
                formValue.spriteRight = spriteDropdown(value[3]);
            } else {
                formValue.spriteRight = spriteDropdown();
            }
            formValue.pic = storypicDropdown(value[4]);
            formValue.dropdown = value[5];

            //console.log(value[4]);
            //console.log(formValue);

            //gen dropdown
            for(let i = 0; i < formValue.dropdown.length; i++) {
                dropdownHTML = dropdownHTML + appendForm("quizdropdown", (i + 1), [formValue.dropdown[i].label, formValue.dropdown[i].choice]);
            }
        } else {
            formValue.sort = sortDropdown();
            formValue.spriteLeft = spriteDropdown();
            formValue.spriteRight = spriteDropdown();
            formValue.pic = storypicDropdown();
            dropdownHTML = appendForm("quizdropdown", 1);
        }
        return '<div class="quiz-detail-form border p-2"><div class="row"><div class="col-sm-6"> \
            <div class="form-group"><label>Question <span class="question-no">' + index + '</span></label> \
            <input type="text" class="form-control quiz-question" placeholder="Question" value="' + formValue.question + '"></div></div> \
            <div class="col-sm-6"><div class="form-group"><label>Test Sort</label> \
            <select class="form-control sort-select quiz-test-sort">' + formValue.sort + '</select></div></div></div> \
            <div class="row"><div class="col-sm-6"><div class="form-group"><label>Sprites</label> \
            <div class="input-group"> \
            <select class="form-control sprite-select quiz-sprite-left" title="Left Sprite"><option value="">--</option>' + formValue.spriteLeft + '</select> \
            <select class="form-control sprite-select quiz-sprite-right" title="Right Sprite"><option value="">--</option>' + formValue.spriteRight + '</select> \
            </div></div></div><div class="col-sm-6"><div class="form-group"><label>Picture</label> \
            <div class="input-group"><select class="form-control storypic-select quiz-pic"><option value="">--</option>' + formValue.pic + '</select> \
            <div class="input-group-append"> \
            <button class="btn btn-secondary add-img" value="story" onclick="openUploadForm(this)"><i class="fas fa-plus"></i></button> \
            </div></div></div></div></div> \
            <div class="master-dropdown-form">' + dropdownHTML + '</div></div>'
    } else if (type == "battle") {
        formValue = {wave: []};
        if (value != undefined && value.length == 1) {
            for (let i = 0; i < 2; i++) {
                var mobDetail = {mob: "", number: "", sprite: "", resistWater: "", resistFire: "", resistEarth: "",
                    resistWind: "", resistDark: "", resistLight: "", resistIce: "", name: "", attack: "", hp: ""};
                if (i < value[0].length) {
                    var mobid_db = monsters.find(function(x){return x.id == value[0][i].mob});
                    mobDetail.mob = monsterDropdown(value[0][i].mob);
                    mobDetail.number = value[0][i].number;
                    mobDetail.sprite = spriteDropdown(mobid_db.spriteId);
                    mobDetail.resistWater = resistDropdown(mobid_db.resist[0].resist);
                    mobDetail.resistFire = resistDropdown(mobid_db.resist[1].resist);
                    mobDetail.resistEarth = resistDropdown(mobid_db.resist[2].resist);
                    mobDetail.resistWind = resistDropdown(mobid_db.resist[3].resist);
                    mobDetail.resistDark = resistDropdown(mobid_db.resist[4].resist);
                    mobDetail.resistLight = resistDropdown(mobid_db.resist[5].resist);
                    mobDetail.resistIce = resistDropdown(mobid_db.resist[6].resist);
                    mobDetail.name = mobid_db.name;
                    mobDetail.attack = mobid_db.attack;
                    mobDetail.hp = mobid_db.hp;
                } else {
                    mobDetail.mob = monsterDropdown();
                    mobDetail.number = "";
                    mobDetail.sprite = spriteDropdown();
                    mobDetail.resistWater = resistDropdown();
                    mobDetail.resistFire = resistDropdown();
                    mobDetail.resistEarth = resistDropdown();
                    mobDetail.resistWind = resistDropdown();
                    mobDetail.resistDark = resistDropdown();
                    mobDetail.resistLight = resistDropdown();
                    mobDetail.resistIce = resistDropdown();
                    mobDetail.name = "";
                    mobDetail.attack = "";
                    mobDetail.hp = "";
                }
                formValue.wave.push(mobDetail);
            }
        } else {
            for (let i = 0; i < 2; i++) {
                var mobDetail = {mob: "", number: "", sprite: "", resistWater: "", resistFire: "", resistEarth: "",
                    resistWind: "", resistDark: "", resistLight: "", resistIce: "", name: "", attack: "", hp: ""};
                mobDetail.mob = monsterDropdown();
                mobDetail.number = "";
                mobDetail.sprite = spriteDropdown();
                mobDetail.resistWater = resistDropdown();
                mobDetail.resistFire = resistDropdown();
                mobDetail.resistEarth = resistDropdown();
                mobDetail.resistWind = resistDropdown();
                mobDetail.resistDark = resistDropdown();
                mobDetail.resistLight = resistDropdown();
                mobDetail.resistIce = resistDropdown();
                mobDetail.name = "";
                mobDetail.attack = "";
                mobDetail.hp = "";
                formValue.wave.push(mobDetail);
            }
        }

        return '<div class="wave-detail-form p-2 border"> \
        <label class="mb-3">Wave <span class="wave-no">' + index + '</span></label> \
        <div class="wave-monster-form p-1 border"><div class="form-group"><label>Monster 1</label> \
        <select class="form-control monster-select"><option value="">--</option>' + formValue.wave[0].mob + '</select></div> \
        <div class="monster-detail-form"><label class="mb-3">Monster 1 Detail</label> \
        <div class="row"><div class="col-sm-6"><div class="form-group"><label>Sprite</label> \
        <select class="form-control sprite-select monster-sprite" title="Sprite"><option value="">??</option>' + formValue.wave[0].sprite + '</select></div> \
        <div class="form-group"><label>Attack</label> \
        <input type="number" class="form-control monster-attack" min="0" value="' + formValue.wave[0].attack + '"></div> \
        <div class="form-group"><label>HP</label> \
        <input type="number" class="form-control monster-hp" min="0" value="' + formValue.wave[0].hp + '"></div></div> \
        <div class="col-sm-6"><div class="form-group"><label>Name</label> \
        <input type="text" class="form-control monster-name" value="' + formValue.wave[0].name + '"></div> \
        <div class="form-group"><label>Number</label> \
        <input type="number" class="form-control monster-number" min="1" value="' + formValue.wave[0].number + '"></div> \
        <div class="form-group"><label>Elements Resistance</label><table class="table table-sm table-bordered"> \
        <tbody><tr><td class="text-center"><img src="../elementPic/water.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/fire.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/earth.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/wind.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/dark.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/light.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/ice.png" width="30px"></td></tr><tr> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistWater + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistFire + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistEarth + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistWind + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistDark + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistLight + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[0].resistIce + '</select></td> \
        </tr></tbody></table></div></div></div></div></div> \
        <div class="wave-monster-form p-1 border"><div class="form-group"><label>Monster 2</label> \
        <select class="form-control monster-select"><option value="">--</option>' + formValue.wave[1].mob + '</select></div> \
        <div class="monster-detail-form"><label class="mb-3">Monster 2 Detail</label> \
        <div class="row"><div class="col-sm-6"><div class="form-group"><label>Sprite</label> \
        <select class="form-control sprite-select monster-sprite" title="Sprite"><option value="">??</option>' + formValue.wave[1].sprite + '</select></div> \
        <div class="form-group"><label>Attack</label> \
        <input type="number" class="form-control monster-attack" min="0" value="' + formValue.wave[1].attack + '"></div> \
        <div class="form-group"><label>HP</label> \
        <input type="number" class="form-control monster-hp" min="0" value="' + formValue.wave[1].hp + '"></div></div> \
        <div class="col-sm-6"><div class="form-group"><label>Name</label> \
        <input type="text" class="form-control monster-name" value="' + formValue.wave[1].name + '"></div> \
        <div class="form-group"><label>Number</label> \
        <input type="number" class="form-control monster-number" min="1" value="' + formValue.wave[1].number + '"></div> \
        <div class="form-group"><label>Elements Resistance</label><table class="table table-sm table-bordered"><tbody><tr> \
        <td class="text-center"><img src="../elementPic/water.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/fire.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/earth.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/wind.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/dark.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/light.png" width="30px"></td> \
        <td class="text-center"><img src="../elementPic/ice.png" width="30px"></td></tr><tr> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistWater + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistFire + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistEarth + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistWind + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistDark + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistLight + '</select></td> \
        <td class="p-0"><select class="form-control px-0 border-0 text-center res-select monster-element">' + formValue.wave[1].resistIce + '</select></td> \
        </tr></tbody></table></div></div></div></div></div></div>';
    }
}

function swapLine(direction, line) {
    var swapping = function(index1, index2) {
        var index1Info = [
            $(".story-line-form:eq(" + (index1) + ") .story-text").val(),
            $(".story-line-form:eq(" + (index1) + ") .story-sprite-left").val(),
            $(".story-line-form:eq(" + (index1) + ") .story-sprite-right").val()
        ];
        var index2Info = [
            $(".story-line-form:eq(" + (index2) + ") .story-text").val(),
            $(".story-line-form:eq(" + (index2) + ") .story-sprite-left").val(),
            $(".story-line-form:eq(" + (index2) + ") .story-sprite-right").val()
        ];

        $(".story-line-form:eq(" + (index1) + ") .story-text").val(index2Info[0]);
        $(".story-line-form:eq(" + (index1) + ") .story-sprite-left").val(index2Info[1]);
        $(".story-line-form:eq(" + (index1) + ") .story-sprite-right").val(index2Info[2]);

        $(".story-line-form:eq(" + (index2) + ") .story-text").val(index1Info[0]);
        $(".story-line-form:eq(" + (index2) + ") .story-sprite-left").val(index1Info[1]);
        $(".story-line-form:eq(" + (index2) + ") .story-sprite-right").val(index1Info[2]);
    };
    var parentLine = $(line).parents(".story-line-form ");
    var clickedIndex = $(parentLine).index();
    if (direction == "up" && clickedIndex > 0) {
        swapping(clickedIndex, clickedIndex - 1);
    } else if (direction == "down" && clickedIndex < $(".story-line-form:last").index()) {
        swapping(clickedIndex, clickedIndex + 1);
    }
}

$(document).ready(function () {
    //playBGM("../audio/questBGM.mp3");
    $("html, body").animate({ scrollTop: $(".content").offset().top }, {
        duration: 100,
        done: function() {
            $("body").css("overflow-y", "hidden");
        }
    });

    $.ajax({
        url: "./questList/getQuestCat.php",
        type: "POST",
        success: function (response) {
            var data = JSON.parse(response);
            questCat = data.questCat;

            for (let cat in questCat) {
                toggleLockQuestCategory(cat);
            }
            if ($(".quest-background").attr("data-quest-category") == "") {
                $(".prev-page").addClass("homepage");
                $(".category-option").show();
                $(".master-quest-detail").hide();
                $(".master-quest").hide();
            } else {
                generateQuestList();
            }
            getQuestFormData();
        },
    });
    if ($("html").innerWidth() <= 820) {
        $(".quest-background").removeClass("row");
        $(".category-option").removeClass("col-sm-6").addClass("col-sm-12");
        $(".master-quest-detail").hide();
        $(".master-quest").removeClass("col-sm-6").addClass("col-sm-12");
        $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
        $(".quest-form-modal table").removeClass("table-responsive");
    } else {
        $(".quest-background").addClass("row");
        $(".category-option").removeClass("col-sm-12").addClass("col-sm-6");
        if ($(".quest-background").attr("data-quest-category") != "") {
            $(".master-quest-detail").show();
        }
        $(".master-quest").removeClass("col-sm-12").addClass("col-sm-6");
        $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
        if ($("html").innerWidth() <= 991) {
            $(".quest-form-modal table").addClass("table-responsive");
        } else {
            $(".quest-form-modal table").removeClass("table-responsive");
        }
    }

    $(window).unbind("resize");
    $(window).resize(function () {
        if ($("html").innerWidth() <= 820) {
            $(".quest-background").removeClass("row");
            $(".category-option").removeClass("col-sm-6").addClass("col-sm-12");
            $(".master-quest-detail").hide();
            $(".master-quest").removeClass("col-sm-6").addClass("col-sm-12");
            $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
            $(".quest-form-modal table").removeClass("table-responsive");
            //$("button[data-toggle=modal]").show();
        } else {
            $(".quest-background").addClass("row");
            $(".category-option").removeClass("col-sm-12").addClass("col-sm-6");
            if ($(".quest-background").attr("data-quest-category") != "") {
                $(".master-quest-detail").show();
            }
            $(".master-quest").removeClass("col-sm-12").addClass("col-sm-6");
            $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
            if ($("html").innerWidth() <= 991) {
                $(".quest-form-modal table").addClass("table-responsive");
            } else {
                $(".quest-form-modal table").removeClass("table-responsive");
            }
        }
    });
});

$(".quest-background").click(function (event) {
    if ($(event.target).hasClass("card-header")) {
        if ($(event.target).parent().hasClass("quest-card")) {
            if ($(event.target).parent().hasClass("collapsed-card") == true) {
                $(".quest-card")
                    .not($(event.target).parent())
                    .each(function () {
                        $(this).CardWidget("collapse");
                    });
            }
        } else if (
            $(event.target).not("button") &&
            $(event.target).not("i") &&
            ($(event.target).parent().hasClass("stage-card") || $(event.target).parent().hasClass("chapter-card"))
        ) {
            //$(".quest-detail").hide();
            if ($(event.target).parent().hasClass("stage-card")) {
                if ($(event.target).parent().hasClass("collapsed-card") == true) {
                    $(".stage-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).CardWidget("remove");
                        });
                    $(event.target).parent().CardWidget("expand");
                } else {
                    $(".stage-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).slideDown();
                        });
                    $(event.target).parent().CardWidget("collapse");
                }
            } else if ($(event.target).parent().hasClass("chapter-card")) {
                if ($(event.target).parent().hasClass("collapsed-card") == true) {
                    $(".chapter-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).CardWidget("remove");
                        });
                    $(event.target).parent().CardWidget("expand");
                } else {
                    $(".chapter-card")
                        .not($(event.target).parent())
                        .each(function () {
                            $(this).slideDown();
                        });
                    $(event.target).parent().CardWidget("collapse");
                }
            }
            if ($(event.target).parent().hasClass("collapsed-card") == false) {
                //$(".quest-detail").hide();
                $(event.target)
                    .parent()
                    .find(".card")
                    .each(function () {
                        if ($(this).css("display") == "none" && $(this).hasClass("quest-card") == false) {
                            $(this).show();
                        }
                        $(this).CardWidget("collapse");
                    });
            }
        }
    } else if ($(event.target).parent().is(".stage-card > .card-header") || $(event.target).parent().is(".chapter-card > .card-header")) {
        if ($(event.target).hasClass("form-control") == false) {
            $(event.target).parent().trigger("click");
        }
    } else if ($(event.target).is("category-option button")) {
        $(".category-option button").trigger("click");
    } else if ($(event.target).is(".add-chapter *") || $(event.target).hasClass("add-chapter")) {
        $(".add-chapter").remove();
        $(".master-quest").prepend(
            '<div class="card card-primary collapsed-card" data-chapter-index="' +
                chapterList.length +
                '">' +
                '<div class="card-header">' +
                '<input type="text" class="form-control float-left py-0" value="">' +
                '<div class="card-tools">' +
                '<button type="button" class="btn btn-tool insert-chapter"><i class="fas fa-2x fa-check"></i></button>' +
                '<button type="button" class="btn btn-tool cancel-add-chapter"><i class="fas fa-2x fa-times"></i></button>' +
                "</div>" +
                "</div>" +
                "</div>"
        );

        $(".master-quest button").not(".insert-chapter, .cancel-add-chapter").prop("disabled", true);
    } else if ($(event.target).is(".add-stage *") || $(event.target).hasClass("add-stage")) {
        var parentChapter = $(event.target).parents(".chapter-card");
        var chapter = $(parentChapter).attr("data-chapter-index");

        $(parentChapter).find(".add-stage").remove();
        $(parentChapter)
            .children(".card-body")
            .prepend(
                '<div class="card card-dark collapsed-card" data-stage-index="' +
                    chapterList[chapter].stage.length +
                    '">' +
                    '<div class="card-header">' +
                    '<input type="text" class="form-control float-left py-0" value="">' +
                    '<div class="card-tools">' +
                    '<button type="button" class="btn btn-tool insert-stage"><i class="fas fa-2x fa-check"></i></button>' +
                    '<button type="button" class="btn btn-tool cancel-add-stage"><i class="fas fa-2x fa-times"></i></button>' +
                    "</div>" +
                    "</div>" +
                    "</div>"
            );

        $(".master-quest button").not($(parentChapter).find(".insert-stage, .cancel-add-stage")).prop("disabled", true);
    } else if ($(event.target).is(".add-quest *") || $(event.target).hasClass("add-quest")) {
        var chapterId = $(event.target).parents(".chapter-card").attr("data-chapter-index");
        var stageId = $(event.target).parents(".stage-card").attr("data-stage-index");

        var questCat = "";
        if ($(".quest-background").attr("data-quest-category") == "main") {
            questCat = 1;
        } else if ($(".quest-background").attr("data-quest-category") == "level") {
            questCat = 2;
        } else if ($(".quest-background").attr("data-quest-category") == "hard") {
            questCat = 3;
        }

        if (
            confirm(
                'Do you want to manually fill in the quest? Press "OK" to open quest form. Press "Cancel" to import csv files.' +
                    " (For importing quests, you can import more than 1 file where each file is csv file which contains each quest's detail)"
            ) == true
        ) {
            initQuestForm();
            $(".quest-form-modal .general-quest-form").attr("data-chapter-index", chapterId);
            $(".quest-form-modal .general-quest-form").attr("data-stage-index", stageId);
            $(".quest-form-modal .general-quest-form").attr("data-quest-index", "");
            $(".quest-cat").val(questCat);
            $(".quest-form-modal").modal("show");
        } else {
            $("input[name=questInput]")[0].click();
            $("input[name=import-quest-cat]").val(questCat);
            $("input[name=import-quest-chapter]").val(chapterId);
            $("input[name=import-quest-stage]").val(stageId);
        }
    } else if ($(event.target).hasClass("cancel-add-chapter") || $(event.target).parent().hasClass("cancel-add-chapter")) {
        $(".master-quest .card[data-chapter-index=" + chapterList.length + "]").remove();
        $(".master-quest").prepend(
            '<div class="card card-primary add-chapter">' +
                '<button type="button" class="btn btn-primary btn-lg btn-block"><i class="fas fa-plus"></i></button>' +
                "</div>"
        );

        $(".master-quest button").prop("disabled", false);
    } else if ($(event.target).hasClass("cancel-add-stage") || $(event.target).parent().hasClass("cancel-add-stage")) {
        var parentChapter = $(event.target).parents(".chapter-card");
        var chapter = $(parentChapter).attr("data-chapter-index");

        $(parentChapter)
            .find(".card[data-stage-index=" + chapterList[chapter].stage.length + "]")
            .remove();
        $(parentChapter)
            .children(".card-body")
            .prepend(
                '<div class="card card-dark add-stage">' +
                    '<button type="button" class="btn btn-dark btn-lg btn-block"><i class="fas fa-plus"></i></button>' +
                    "</div>"
            );

        $(".master-quest button").prop("disabled", false);
    } else if ($(event.target).hasClass("insert-chapter") || $(event.target).parent().hasClass("insert-chapter")) {
        var chapterTitle = $(".insert-chapter").parents(".card").find("input").val();

        if (chapterTitle.length > 0) {
            $.ajax({
                url: "./questList/updateChStName.php",
                data: { method: "insert-chapter", title: chapterTitle, category: $(".quest-background").attr("data-quest-category") },
                type: "POST",
                success: function (response) {
                    var data = JSON.parse(response);
                    if (data.chId != undefined) {
                        chapterList.push({ title: chapterTitle, id: data.chId, stage: [] });
                        $(".master-quest .card[data-chapter-index=" + (chapterList.length - 1) + "]").remove();
                        $(".master-quest").prepend(getCardHTML("chapter", chapterList.length - 1, chapterTitle));
                        $(".master-quest").prepend(
                            '<div class="card card-primary add-chapter">' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block"><i class="fas fa-plus"></i></button>' +
                                "</div>"
                        );

                        $(".master-quest button").prop("disabled", false);
                    } else {
                        alert("Error inserting chapter into database");
                    }
                },
            });
        }
    } else if ($(event.target).hasClass("insert-stage") || $(event.target).parent().hasClass("insert-stage")) {
        var parentChapter = $(event.target).parents(".chapter-card");
        var chapter = $(parentChapter).attr("data-chapter-index");
        var stageTitle = $(".insert-stage").parents(".chapter-card .card").find("input").val().trim();

        if (stageTitle.length > 0) {
            $.ajax({
                url: "./questList/updateChStName.php",
                data: { method: "insert-stage", title: stageTitle, chapter: chapterList[chapter].id },
                type: "POST",
                success: function (response) {
                    var data = JSON.parse(response);
                    if (data.stageId != undefined) {
                        chapterList[chapter].stage.push({ title: stageTitle, id: data.stageId, quest: [] });
                        $(parentChapter)
                            .find(".card[data-stage-index=" + (chapterList[chapter].stage.length - 1) + "]")
                            .remove();

                        $(parentChapter)
                            .children(".card-body")
                            .prepend(getCardHTML("stage", chapterList[chapter].stage.length - 1, stageTitle));

                        $(parentChapter)
                            .children(".card-body")
                            .prepend(
                                '<div class="card card-dark add-stage">' +
                                    '<button type="button" class="btn btn-dark btn-lg btn-block"><i class="fas fa-plus"></i></button>' +
                                    "</div>"
                            );

                        $(".master-quest button").prop("disabled", false);
                    } else {
                        alert("Error inserting stage into database");
                    }
                },
            });
        }
    } else if ($(event.target).hasClass("edit-chapter") || $(event.target).parent().hasClass("edit-chapter")) {
        var chapterCard = $(event.target).parents(".chapter-card");
        enableEditCard("chapter", chapterCard);
    } else if ($(event.target).hasClass("edit-stage") || $(event.target).parent().hasClass("edit-stage")) {
        var stageCard = $(event.target).parents(".stage-card");
        enableEditCard("stage", stageCard);
    } else if ($(event.target).hasClass("edit-quest") || $(event.target).parent().hasClass("edit-quest")) {
        var chapterId = $(event.target).parents(".chapter-card").attr("data-chapter-index");
        var stageId = $(event.target).parents(".stage-card").attr("data-stage-index");
        var questId = $(event.target).parents(".quest-card").attr("data-quest-index");
        initQuestForm();
        $(".general-quest-form .quest-title").val(chapterList[chapterId].stage[stageId].quest[questId].title);
        $(".general-quest-form .required-quest").val(chapterList[chapterId].stage[stageId].quest[questId].require);
        $(".general-quest-form .quest-type").val(chapterList[chapterId].stage[stageId].quest[questId].type);
        $(".general-quest-form .quest-bg").val(chapterList[chapterId].stage[stageId].quest[questId].background);
        $(".general-quest-form .quest-exp").val(chapterList[chapterId].stage[stageId].quest[questId].exp);
        $(".general-quest-form .quest-desc").val(chapterList[chapterId].stage[stageId].quest[questId].quest_desc);

        var questCat = "";
        if ($(".quest-background").attr("data-quest-category") == "main") {
            questCat = 1;
        } else if ($(".quest-background").attr("data-quest-category") == "level") {
            questCat = 2;
        } else if ($(".quest-background").attr("data-quest-category") == "hard") {
            questCat = 3;
        }
        $(".quest-cat").val(questCat);

        $.ajax({
            url: "./questList/getQuestDetail.php",
            type: "POST",
            data: {
                operation: "quest",
                questId: chapterList[chapterId].stage[stageId].quest[questId].id,
                qTypeId: chapterList[chapterId].stage[stageId].quest[questId].type,
            },
            success: function (response) {
                //console.log(response);
                var data = JSON.parse(response);
                if (chapterList[chapterId].stage[stageId].quest[questId].type == 1) {
                    var storytext = data.text;
                    var storypic = data.pic;
                    $(".quiz-quest-form").hide();
                    $(".battle-quest-form").hide();
                    $(".story-quest-form").show();

                    $(".master-story-line").empty();
                    for (let i = 0; i < storytext.length; i++) {
                        $(".master-story-line").append(
                            appendForm("storyline", i + 1, [storytext[i].text, storytext[i].sprites[0], storytext[i].sprites[1]])
                        );
                    }
                    $(".master-story-line").append(appendForm("storyline", storytext.length + 1));

                    $(".master-story-pic").empty();
                    for (let i = 0; i < storypic.length; i++) {
                        $(".master-story-pic").append(
                            appendForm("storypic", i + 1, [storypic[i].picture, storypic[i].range[0], storypic[i].range[1]])
                        );
                    }
                    $(".master-story-pic").append(appendForm("storypic", storypic.length + 1));
                    $(".story-pic-line-range").attr("max", storytext.length);
                } else if (chapterList[chapterId].stage[stageId].quest[questId].type == 2) {
                    var quiz = data.question;

                    $(".quiz-quest-form").show();
                    $(".battle-quest-form").hide();
                    $(".story-quest-form").hide();

                    $(".master-quiz-form").empty();
                    for (let i = 0; i < quiz.length; i++) {
                        $(".master-quiz-form").append(
                            appendForm("quizwhole", i + 1, 
                                [quiz[i].question, quiz[i].sort, quiz[i].sprites[0], quiz[i].sprites[1], quiz[i].picture, quiz[i].dropdown]
                            )
                        );
                    }
                    $(".master-quiz-form").append(appendForm("quizwhole", quiz.length + 1));
                } else if (chapterList[chapterId].stage[stageId].quest[questId].type == 3) {
                    var battle = data.battle;

                    $(".quiz-quest-form").hide();
                    $(".battle-quest-form").show();
                    $(".story-quest-form").hide();

                    $(".battle-quest-form .battle-desc").val(battle.bDesc);
                    for (let i = 0; i < battle.elemresist.length; i++) {
                        if (battle.elemresist[i].resist != null) {
                            $(".battle-quest-form .battle-desc-element:eq(" + i + ")").val(battle.elemresist[i].resist);
                        }
                    }

                    $(".battle-quest-form .master-wave-form").empty();
                    for (let i = 0; i < battle.wave.length; i++) {
                        $(".battle-quest-form .master-wave-form").append(appendForm("battle", i + 1, [battle.wave[i]]));
                    }
                    $(".battle-quest-form .master-wave-form").append(appendForm("battle", battle.wave.length + 1));
                }
            },
        });

        $(".quest-form-modal .general-quest-form").attr("data-chapter-index", chapterId);
        $(".quest-form-modal .general-quest-form").attr("data-stage-index", stageId);
        $(".quest-form-modal .general-quest-form").attr("data-quest-index", questId);
        $(".quest-form-modal").modal("show");
    } else if ($(event.target).hasClass("delete-chapter") || $(event.target).parent().hasClass("delete-chapter")) {
        if (
            confirm(
                "Deleting a chapter will result in deleting ALL stages and ALL quests (including users' progress on those quests.) inside. This change cannot be undone. Confirm deleting?"
            ) == true
        ) {
            var chapterCard = $(event.target).parents(".chapter-card");
            var chapterId = $(chapterCard).attr("data-chapter-index");

            $.ajax({
                url: "./questList/updateChStName.php",
                data: { method: "delete-chapter", id: chapterList[chapterId].id },
                type: "POST",
                success: function (data) {
                    if (data == 1) {
                        $(chapterCard).remove();
                        $(".chapter-card").slideDown();
                        chapterList.splice(chapterId, 1);
                        $(".chapter-card").each(function () {
                            if ($(this).attr("data-chapter-index") > chapterId) {
                                $(this).attr("data-chapter-index", $(this).attr("data-chapter-index") - 1);
                            }
                        });
                    } else {
                        alert("Error deleting chapter in database");
                    }
                },
            });
        }
    } else if ($(event.target).hasClass("delete-stage") || $(event.target).parent().hasClass("delete-stage")) {
        if (
            confirm(
                "Deleting a stage will result in deleting ALL quests (including users' progress on those quests.) inside. This change cannot be undone. Confirm deleting?"
            ) == true
        ) {
            var chapterCard = $(event.target).parents(".chapter-card");
            var stageCard = $(event.target).parents(".stage-card");
            var chapterId = $(chapterCard).attr("data-chapter-index");
            var stageId = $(stageCard).attr("data-stage-index");

            $.ajax({
                url: "./questList/updateChStName.php",
                data: { method: "delete-stage", id: chapterList[chapterId].stage[stageId].id },
                type: "POST",
                success: function (data) {
                    if (data == 1) {
                        $(stageCard).remove();
                        chapterList[chapterId].stage.splice(stageId, 1);
                        $(chapterCard)
                            .find(".stage-card")
                            .each(function () {
                                if ($(this).attr("data-stage-index") > stageId) {
                                    $(this).attr("data-stage-index", $(this).attr("data-stage-index") - 1);
                                }
                            });
                    } else {
                        alert("Error deleting stage in database");
                    }
                },
            });
        }
    } else if ($(event.target).hasClass("delete-quest") || $(event.target).parent().hasClass("delete-quest")) {
        if (confirm("Deleting a quest will result in deleting users' progress on it. This change cannot be undone. Confirm deleting?") == true) {
            var chapterCard = $(event.target).parents(".chapter-card");
            var stageCard = $(event.target).parents(".stage-card");
            var questCard = $(event.target).parents(".quest-card");
            var chapterId = $(chapterCard).attr("data-chapter-index");
            var stageId = $(stageCard).attr("data-stage-index");
            var questId = $(questCard).attr("data-quest-index");
            //not test with ajax yet but queries should work
            $.ajax({
                url: "./questList/updateChStName.php",
                data: { method: "delete-quest", id: chapterList[chapterId].stage[stageId].quest[questId].id },
                type: "POST",
                success: function (data) {
                    if (data == 1) {
                        $(questCard).remove();
                        var index = quests.findIndex(function (x) {
                            return x.id == chapterList[chapterId].stage[stageId].quest[questId].id;
                        });
                        quests.splice(index, 1);
                        chapterList[chapterId].stage[stageId].quest.splice(questId, 1);
                        $(stageCard)
                            .find(".quest-card")
                            .each(function () {
                                if ($(this).attr("data-quest-index") > questId) {
                                    $(this).attr("data-quest-index", $(this).attr("data-quest-index") - 1);
                                }
                            });
                    } else {
                        alert("Error deleting quest in database");
                    }
                },
            });
        }
    } else if ($(event.target).hasClass("save-chapter") || $(event.target).parent().hasClass("save-chapter")) {
        var chapterCard = $(event.target).parents(".chapter-card");
        var chapterId = $(chapterCard).attr("data-chapter-index");
        var input = $(chapterCard).children(".card-header").find("input");

        $.ajax({
            url: "./questList/updateChStName.php",
            data: { method: "update-chapter", id: chapterList[chapterId].id, title: $(input).val().trim() },
            type: "POST",
            success: function (data) {
                if (data == 1) {
                    chapterList[chapterId].title = $(input).val().trim();
                } else {
                    alert("Error updating chapter name in database.");
                    $(input).val(chapterList[chapterId].title);
                }

                disableEditCard("chapter", chapterCard);
            },
        });
    } else if ($(event.target).hasClass("save-stage") || $(event.target).parent().hasClass("save-stage")) {
        var stageCard = $(event.target).parents(".stage-card");
        var stageId = $(stageCard).attr("data-stage-index");
        var chapterCard = $(event.target).parents(".chapter-card");
        var chapterId = $(chapterCard).attr("data-chapter-index");
        var input = $(stageCard).children(".card-header").find("input");

        $.ajax({
            url: "./questList/updateChStName.php",
            data: { method: "update-stage", id: chapterList[chapterId].stage[stageId].id, title: $(input).val().trim() },
            type: "POST",
            success: function (data) {
                if (data == 1) {
                    chapterList[chapterId].stage[stageId].title = $(input).val().trim();
                } else {
                    alert("Error updating chapter name in database.");
                    $(input).val(chapterList[chapterId].stage[stageId].title);
                }

                disableEditCard("stage", stageCard);
            },
        });
    } else if ($(event.target).hasClass("cancel-update-chapter") || $(event.target).parent().hasClass("cancel-update-chapter")) {
        var chapterCard = $(event.target).parents(".chapter-card");
        var chapterId = $(chapterCard).attr("data-chapter-index");
        $(chapterCard).children(".card-header").find("input").val(chapterList[chapterId].title);

        disableEditCard("chapter", chapterCard);
    } else if ($(event.target).hasClass("cancel-update-stage") || $(event.target).parent().hasClass("cancel-update-stage")) {
        var stageCard = $(event.target).parents(".stage-card");
        var stageId = $(stageCard).attr("data-stage-index");
        var chapterCard = $(event.target).parents(".chapter-card");
        var chapterId = $(chapterCard).attr("data-chapter-index");

        $(stageCard).children(".card-header").find("input").val(chapterList[chapterId].stage[stageId].title);

        disableEditCard("stage", stageCard);
    }
});

$(".prev-page").click(function () {
    if (!$(this).hasClass("go-homepage")) {
        $(".quest-background").attr("data-quest-category", "");
        $(".category-option").show();
        $(".master-quest-detail").hide();
        $(".master-quest").hide();
        $(".prev-page").addClass("go-homepage");
        $(".loading-page").show();
        $(".loading-page").fadeOut(500);
    } else {
        $(".prev-page").removeClass("go-homepage");
        $(".prev-page").addClass("homepage");
    }
});

$(".category-option button").click(function (event) {
    var category = $(event.target).parents(".category-option button").val();
    if ($(event.target).is(".lock-quest-category > i")) {
        var lockButton = $(event.target).parent(".lock-quest-category");
        var locked = $(lockButton).attr("data-lock-status");

        $.ajax({
            url: "./questList/updateQuestCat.php",
            data: { cat: category, lock: locked == 0 ? 1 : 0 },
            type: "POST",
            success: function (data) {
                questCat[category] = data;
                toggleLockQuestCategory(category);
            },
        });
    } else {
        if (category == undefined) {
            category = $(event.target).val();
        }
        $(".quest-background").attr("data-quest-category", category);
        $(".prev-page").removeClass("go-homepage");
        generateQuestList();
    }
});

$(".quest-form-modal").change(function (event) {
    if ($(event.target).is(".quest-type")) {
        var type = $(".quest-type").val();
        if (type == "1") {
            $(".story-quest-form input, textarea").val("");
            $(".story-quest-form select").each(function () {
                $(this).find("option:first").prop("selected", true);
            });
            $(".story-quest-form .story-line-form:gt(0)").remove();

            $(".story-quest-form").show();
            $(".quiz-quest-form").hide();
            $(".battle-quest-form").hide();
        } else if (type == "2") {
            $(".quiz-quest-form input,.quiz-quest-form textarea").val("");
            $(".quiz-quest-form select").each(function () {
                $(this).find("option:first").prop("selected", true);
            });
            $(".quiz-quest-form .quiz-detail-form:gt(0)").remove();
            $(".quiz-quest-form .dropdown-form:gt(0)").remove();
            $(".quiz-quest-form .choice-detail-form .input-group:gt(0)").remove();
            $(".quiz-quest-form .choice-detail-form label.btn").attr("aria-pressed", "false");
            $(".quiz-quest-form .choice-detail-form label.btn").removeClass("active");
            $(".quiz-quest-form .choice-detail-form label.btn > input").prop("checked", false);

            $(".quiz-quest-form").show();
            $(".battle-quest-form").hide();
            $(".story-quest-form").hide();
        } else if (type == "3") {
            $(".battle-quest-form input").val("");
            $(".battle-quest-form textarea").val("");
            $(".battle-quest-form select").each(function () {
                $(this).find("option:first").prop("selected", true);
            });
            $(".battle-quest-form .wave-detail-form:gt(0)").remove();

            $(".battle-quest-form").show();
            $(".quiz-quest-form").hide();
            $(".story-quest-form").hide();
        }
    } else if ($(event.target).is(".story-line-form *")) {
        var lastStoryNo = parseInt($(".master-story-line .story-line-no:last").text());
        var emptyLine = [];
        var allFilled = true;

        for (let i = 0; i < lastStoryNo; i++) {
            var parentLine = $(".master-story-line .story-line-form:eq(" + i + ")");
            var storytext = $(parentLine).find(".story-text");
            var storySpriteL = $(parentLine).find(".story-sprite-left");
            var storySpriteR = $(parentLine).find(".story-sprite-right");
            if ($(storytext).val() == "" && $(storySpriteL).val() == "" && $(storySpriteR).val() == "" && i < lastStoryNo - 1) {
                emptyLine.push($(parentLine));
            }
            if ($(storytext).val() == "" || ($(storySpriteL).val() == "" && $(storySpriteR).val() == "")) {
                allFilled = false;
            }
        }

        if (allFilled == true) {
            $(".master-story-line").append(appendForm("storyline", lastStoryNo + 1));
            $(".story-pic-line-range").attr("max", lastStoryNo);
            if ($("html").innerWidth() <= 820) {
                $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
            } else {
                $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
            }
        }
        if (lastStoryNo - emptyLine.length >= 2 && emptyLine.length != 0) {
            for (let i = 0; i < emptyLine.length; i++) {
                $(emptyLine[i]).remove();
            }
            var index = 1;
            $(".story-line-form").each(function () {
                $(this).find(".story-line-no").text(index);
                index++;
            });
        }
    } else if ($(event.target).is(".story-pic-form *")) {
        var lastStoryNo = parseInt($(".master-story-pic .story-pic-no:last").text());
        var emptyLine = [];
        var allFilled = true;

        for (let i = 0; i < lastStoryNo; i++) {
            var parentPic = $(".master-story-pic .story-pic-form:eq(" + i + ")");
            var storypic = $(parentPic).find(".story-pic");
            var storyRangeStart = $(parentPic).find(".story-pic-line-range:first");
            var storyRangeEnd = $(parentPic).find(".story-pic-line-range:eq(1)");

            if ($(storypic).val() == "" && $(storyRangeStart).val() == "" && $(storyRangeEnd).val() == "" && i < lastStoryNo - 1) {
                emptyLine.push($(parentPic));
            }
            if (
                $(storypic).val() == "" ||
                $(storyRangeStart).val() == "" ||
                $(storyRangeEnd).val() == "" ||
                $(storyRangeStart).val() <= 0 ||
                $(storyRangeEnd).val() <= 0
            ) {
                allFilled = false;
            }
        }

        if (allFilled == true) {
            $(".master-story-pic").append(appendForm("storypic", lastStoryNo + 1));
            $(".story-pic-line-range").attr("max", parseInt($(".master-story-line .story-line-no:last").text()));
            if ($("html").innerWidth() <= 820) {
                $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
            } else {
                $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
            }
        }
        if (lastStoryNo - emptyLine.length >= 2 && emptyLine.length != 0) {
            for (let i = 0; i < emptyLine.length; i++) {
                $(emptyLine[i]).remove();
            }
            var index = 1;
            $(".story-pic-form").each(function () {
                $(this).find(".story-pic-no").text(index);
                index++;
            });
        }
        $(".story-pic-line-range").each(function () {
            if (parseInt($(this).val()) > parseInt($(this).attr("max"))) {
                $(this).val($(this).attr("max"));
            }
            if ($(this).val() < 0) {
                $(this).val(0);
            }
        });
    } else if ($(event.target).is(".master-wave-form *")) {
        if ($(event.target).is(".monster-select")) {
            var parentForm = $(event.target).parents(".wave-monster-form");
            var mobid = $(parentForm).find(".monster-select").val();
            if (mobid != "") {
                //auto fill detail
                $(parentForm).find(".monster-sprite").val(monsters[mobid].spriteId);
                $(parentForm).find(".monster-name").val(monsters[mobid].name);
                $(parentForm).find(".monster-attack").val(monsters[mobid].attack);
                $(parentForm).find(".monster-hp").val(monsters[mobid].hp);
                for (let i = 0; i < monsters[mobid].resist.length; i++) {
                    $(parentForm)
                        .find(".monster-element:eq(" + i + ")")
                        .val(monsters[mobid].resist[i].resist);
                }
            }
        } else if ($(event.target).is($(".monster-detail-form *").not(".monster-number"))) {
            var parentForm = $(event.target).parents(".wave-monster-form");
            $(parentForm).find(".monster-select option:first").prop("selected", true);
        }

        var lastWave = parseInt($(".wave-no:last").text());
        var allFilled = true;
        for (let i = 0; i < lastWave; i++) {
            var parentWaveForm = $(".master-wave-form .wave-detail-form:eq(" + i + ")");
            var mobfilled = [];

            $(parentWaveForm)
                .find(".wave-monster-form")
                .each(function () {
                    var formfilled = false;
                    if ($(this).find(".monster-select").val() == "") {
                        if (
                            $(this).find(".monster-detail-form .monster-sprite").val() != "" &&
                            $(this).find(".monster-detail-form .monster-name").val() != "" &&
                            $(this).find(".monster-detail-form .monster-attack").val() != "" &&
                            $(this).find(".monster-detail-form .monster-hp").val() != ""
                        ) {
                            formfilled = true;
                        }
                    } else {
                        formfilled = true;
                    }
                    if (formfilled == true && $(this).find(".monster-number").val() > 0) {
                        formfilled = true;
                    } else {
                        formfilled = false;
                    }
                    mobfilled.push(formfilled);
                });

            if (mobfilled.includes(true) == false) {
                allFilled = false;
            }
        }
        if (allFilled == true) {
            $(".master-wave-form").append(appendForm("battle", lastWave + 1));
        }
    } else if ($(event.target).is(".master-quiz-form *")) {
        if ($(event.target).is(".choice-detail-form *")) {
            var parentChoice = $(event.target).parents(".choice-detail-form");
            var emptyLine = [];
            var allFilled = true;
            var choiceLength = $(parentChoice).find(".choice-label").length;
            var index = 0;

            $(parentChoice)
                .find(".choice-label")
                .each(function () {
                    if ($(this).val() == "") {
                        allFilled = false;
                        var correctButton = $(this).parent().find(".choice-correct:checked");
                        if (index < choiceLength - 1 && correctButton.length == 0) {
                            emptyLine.push($(this));
                        }
                    }
                    index++;
                });

            if (allFilled == true) {
                $(parentChoice).append(appendForm("quizchoice", 0));
            }
            if (emptyLine.length != 0) {
                for (let i = 0; i < emptyLine.length; i++) {
                    $(emptyLine[i]).parent().remove();
                }
                var masterDropdown = $(parentChoice).parents(".master-dropdown-form");
                var parentDropdown = $(parentChoice).parents(".dropdown-form");
                var dropdownLabel = $(parentDropdown).find(".dropdown-label");
                if ($(parentChoice).find(".input-group").length == 1) {
                    if (
                        $(parentChoice).find(".choice-label").val() == "" &&
                        $(parentChoice).find(".choice-correct:checked").length == 0 &&
                        dropdownLabel.val() == "" &&
                        $(masterDropdown).find(".dropdown-form").length > 2
                    ) {
                        $(parentDropdown).remove();
                        var index = 1;
                        $(masterDropdown)
                            .find(".dropdown-form")
                            .each(function () {
                                $(this).find(".dropdown-no").text(index);
                                index++;
                            });
                    }
                }
            }
        }
        if ($(event.target).is(".master-dropdown-form *")) {
            var parentDropdown = $(event.target).parents(".master-dropdown-form");
            var lastDropdown = parseInt($(parentDropdown).find(".dropdown-no:last").text());
            var emptyLine = [];
            var allFilled = true;

            for (let i = 0; i < lastDropdown; i++) {
                var parentLine = $(parentDropdown).find(".dropdown-form:eq(" + i + ")");
                var dropdownLabel = $(parentLine).find(".dropdown-label");
                var choices = $(parentLine).find(".choice-detail-form");
                if (dropdownLabel.val() != "" && $(choices).find(".input-group:not(:last) .choice-correct:checked").length > 0) {
                    $(choices)
                        .find(".input-group:not(:last) .choice-label")
                        .each(function () {
                            if ($(this).val() == "") {
                                allFilled = false;
                            }
                        });
                } else {
                    allFilled = false;
                }
                if (
                    $(choices).find(".input-group").length == 1 &&
                    $(choices).find(".input-group .choice-label").val() == "" &&
                    dropdownLabel.val() == "" &&
                    $(choices).find(".input-group .choice-correct:checked").length == 0 &&
                    i < lastDropdown - 1
                ) {
                    emptyLine.push($(parentLine));
                }
            }
            //console.log(emptyLine);

            if (allFilled == true) {
                $(parentDropdown).append(appendForm("quizdropdown", lastDropdown + 1));

                if ($("html").innerWidth() <= 820) {
                    $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
                } else {
                    $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
                }
            }
            if (lastDropdown - emptyLine.length >= 2 && emptyLine.length != 0) {
                for (let i = 0; i < emptyLine.length; i++) {
                    $(emptyLine[i]).remove();
                }
                var index = 1;
                $(parentDropdown)
                    .find(".dropdown-form")
                    .each(function () {
                        $(this).find(".dropdown-no").text(index);
                        index++;
                    });
            }
        }
        if ($(event.target).is(".master-quiz-form *")) {
            var lastQuizNo = parseInt($(".question-no:last").text());
            var allFilled = true;

            for (let i = 0; i < lastQuizNo; i++) {
                var quiz = $(".master-quiz-form .quiz-detail-form:eq(" + i + ")");
                if ($(quiz).find(".quiz-question").val() != "") {
                    var parentDropdown = $(quiz).find(".master-dropdown-form");
                    var lastDropdown = parseInt($(parentDropdown).find(".dropdown-no:last").text());
                    if (lastDropdown == 1) {
                        lastDropdown++;
                    }

                    for (let j = 0; j < lastDropdown - 1; j++) {
                        var parentLine = $(parentDropdown).find(".dropdown-form:eq(" + j + ")");
                        var dropdownLabel = $(parentLine).find(".dropdown-label");
                        var choices = $(parentLine).find(".choice-detail-form");
                        if ($(dropdownLabel).val() != "" && $(choices).find(".input-group:not(:last) .choice-correct:checked").length > 0) {
                            $(choices)
                                .find(".input-group:not(:last) .choice-label")
                                .each(function () {
                                    if ($(this).val() == "") {
                                        allFilled = false;
                                    }
                                });
                        } else {
                            allFilled = false;
                        }
                    }
                } else {
                    allFilled = false;
                }
            }

            if (allFilled == true) {
                $(".master-quiz-form").append(appendForm("quizwhole", lastQuizNo + 1));
                if ($("html").innerWidth() <= 820) {
                    $(".quest-form-modal .row > div").removeClass("col-sm-6").addClass("col-sm-12");
                } else {
                    $(".quest-form-modal .row > div").removeClass("col-sm-12").addClass("col-sm-6");
                }
            }
            //note that quiz can not remove itself if it's empty
        }
    }
});

$(".save-quest").click(function () {
    var errorOccurred = false;
    var questinfo = {};

    $(".save-quest").html('<i class="fas fa-sync-alt fa-spin"></i>');

    //get general info
    questinfo["title"] = $(".quest-form-modal .quest-title").val();
    questinfo["required"] = $(".quest-form-modal .required-quest").val();
    questinfo["questCat"] = $(".quest-form-modal .quest-cat").val();
    questinfo["questType"] = $(".quest-form-modal .quest-type").val();
    questinfo["questDesc"] = $(".quest-form-modal .quest-desc").val();
    questinfo["questExp"] = $(".quest-form-modal .quest-exp").val();
    questinfo["questBg"] = $(".quest-form-modal .quest-bg").val();
    if (
        questinfo["title"] != "" &&
        questinfo["questCat"] != "" &&
        questinfo["questType"] != "" &&
        questinfo["questDesc"] != "" &&
        questinfo["questExp"] != "" &&
        questinfo["questBg"] != ""
    ) {
        //get type info
        if (questinfo["questType"] == "1") {
            var storytext = [];
            $(".quest-form-modal .story-line-form").each(function () {
                var storyline = $(this).find(".story-text").val();
                var storySprite = [$(this).find(".story-sprite-left").val(), $(this).find(".story-sprite-right").val()];
                if (storySprite.toString() != ["", ""].toString() && storyline != "") {
                    var speakerLine = storyline.split(":");
                    var speaker = "";
                    var text = "";
                    if (speakerLine.length < 2) {
                        text = storyline;
                    } else if (speakerLine.length > 2) {
                        speaker = speakerLine[0].trim();
                        speakerLine.shift();
                        text = speakerLine.join(":").trim();
                    } else {
                        speaker = speakerLine[0].trim();
                        text = speakerLine[1].trim();
                    }
                    storytext.push({ speaker: speaker, text: text, sprite: storySprite });
                } else if (!(storySprite.toString() == ["", ""].toString() && storyline == "") && errorOccurred == false) {
                    alert("Error. A story line cannot be empty and there must be at least 1 sprite in each line.");
                    errorOccurred = true;
                    return false;
                }
            });

            if (storytext.length == 0 && errorOccurred == false) {
                alert("Error. A story must have at least 1 line.");
                errorOccurred = true;
                return false;
            }

            var storypics = [];
            $(".quest-form-modal .story-pic-form").each(function () {
                var storyimg = $(this).find(".story-pic").val();
                var range = [$(this).find(".story-pic-line-range:first").val(), $(this).find(".story-pic-line-range:eq(1)").val()].sort();
                if (storyimg != "" && range[0] > 0 && range[1] > 0) {
                    storypics.push({ pic: "../storyPic/" + storyPics[storyimg], start: range[0], end: range[1] });
                } else if (!(storyimg == "" && range[0] == "" && range[1] == "") && errorOccurred == false) {
                    alert("Error. Story pictures cannot be empty and must have a range specified.");
                    errorOccurred = true;
                    return false;
                }
            });
            for (let i = 0; i < storypics.length - 1; i++) {
                for (let j = i + 1; j < storypics.length; j++) {
                    if (storypics[i].start <= storypics[j].end && storypics[i].end >= storypics[j].start && errorOccurred == false) {
                        alert("Error. Story Pictures' range cannot be overlapped.");
                        errorOccurred = true;
                        return false;
                    }
                }
            }

            if (errorOccurred == false) {
                var chapterId = $(".quest-form-modal .general-quest-form").attr("data-chapter-index");
                var stageId = $(".quest-form-modal .general-quest-form").attr("data-stage-index");
                var questId = $(".quest-form-modal .general-quest-form").attr("data-quest-index");

                if (storypics.length == 0) {
                    storypics = "";
                }
                //console.log(storypics);
                if (questId == "") {
                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".quest-form-modal .modal-footer button").prop("disabled", true);
                        },
                        data: {
                            method: "insert-quest",
                            storytext: storytext,
                            storypics: storypics,
                            questinfo: questinfo,
                            stageId: chapterList[chapterId].stage[stageId].id,
                            type: 1,
                        },
                        success: function (response) {
                            //console.log(response);
                            var data = JSON.parse(response);
                            if (data.questId != undefined) {
                                chapterList[chapterId].stage[stageId].quest.push({
                                    background: questinfo["questBg"],
                                    exp: questinfo["questExp"],
                                    id: data.questId,
                                    quest_desc: questinfo["questDesc"],
                                    require: questinfo["required"],
                                    title: questinfo["title"],
                                    type: 1,
                                });
                                quests.push({ id: data.questId, title: questinfo["title"] });

                                $(
                                    ".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body .add-quest"
                                ).remove();

                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    getCardHTML("quest", chapterList[chapterId].stage[stageId].quest.length - 1, questinfo["title"])
                                );

                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    '<div class="card card-secondary add-quest">' +
                                        '<button type="button" class="btn btn-secondary btn-lg btn-block">' +
                                        '<i class="fas fa-plus"></i>' +
                                        "</button>" +
                                        "</div>"
                                );
                            }
                            $(".quest-form-modal .modal-footer button").prop("disabled", false);
                            $(".quest-form-modal").modal("hide");
                        },
                    });
                } else {
                    var oldtype = "";
                    if (chapterList[chapterId].stage[stageId].quest[questId].type != 1) {
                        oldtype = chapterList[chapterId].stage[stageId].quest[questId].type;
                    }

                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".quest-form-modal .modal-footer button").prop("disabled", true);
                        },
                        data: {
                            method: "update-quest",
                            questId: chapterList[chapterId].stage[stageId].quest[questId].id,
                            storytext: storytext,
                            storypics: storypics,
                            questinfo: questinfo,
                            oldtype: oldtype,
                            type: 1,
                        },
                        success: function (response) {
                            //console.log(response);
                            if (response != 1) {
                                alert("Error. Adding story quest in database.");
                            } else {
                                chapterList[chapterId].stage[stageId].quest[questId].background = questinfo["questBg"];
                                chapterList[chapterId].stage[stageId].quest[questId].exp = questinfo["questExp"];
                                chapterList[chapterId].stage[stageId].quest[questId].quest_desc = questinfo["questDesc"];
                                chapterList[chapterId].stage[stageId].quest[questId].require = questinfo["required"];
                                chapterList[chapterId].stage[stageId].quest[questId].title = questinfo["title"];
                                chapterList[chapterId].stage[stageId].quest[questId].type = 1;
                                $(
                                    ".chapter-card[data-chapter-index=" +
                                        chapterId +
                                        "] .stage-card[data-stage-index=" +
                                        stageId +
                                        "] .quest-card[data-quest-index=" +
                                        questId +
                                        "] > .card-header > input"
                                ).val(questinfo["title"]);
                            }
                            $(".quest-form-modal .modal-footer button").prop("disabled", false);
                            $(".quest-form-modal").modal("hide");
                        },
                    });
                }
            }

            //ajax
        } else if (questinfo["questType"] == "2") {
            var question = [];
            $(".quest-form-modal .quiz-detail-form").each(function () {
                var dropdown = [];
                var quiz = $(this).find(".quiz-question").val();
                var testSort = $(this).find(".quiz-test-sort").val();
                var sprites = [$(this).find(".quiz-sprite-left").val(), $(this).find(".quiz-sprite-right").val()];
                var quizpic =
                    storyPics[$(this).find(".quiz-pic").val()] == undefined ? null : "../storyPic/" + storyPics[$(this).find(".quiz-pic").val()];
                if (quizpic == undefined) {
                    quizpic = "";
                }

                $(this)
                    .find(".dropdown-form")
                    .each(function () {
                        var choice = [];
                        var dropdownLabel = $(this).find(".dropdown-label").val();

                        $(this)
                            .find(".choice-detail-form .input-group")
                            .each(function () {
                                var choiceLabel = $(this).find(".choice-label").val();
                                var correct = $(this).find(".choice-correct").prop("checked");
                                if (correct == true) {
                                    correct = 1;
                                } else {
                                    correct = 0;
                                }
                                if (choiceLabel != "") {
                                    choice.push({ label: choiceLabel, correct: correct });
                                }
                            });
                        if (choice.length > 1) {
                            if (
                                choice.filter(function (x) {
                                    return x.correct == 1;
                                }).length != 1 &&
                                errorOccurred == false
                            ) {
                                alert("Error. A dropdown must have only 1 correct answer.");
                                errorOccurred = true;
                                return false;
                            } else {
                                dropdown.push({ label: dropdownLabel, choice: choice });
                            }
                        } else if (dropdownLabel.length > 0 && choice.length <= 1 && errorOccurred == false) {
                            alert("Error. A dropdown must contain at least 2 choices.");
                            errorOccurred = true;
                            return false;
                        }
                    });

                if (dropdown.length > 0) {
                    question.push({ question: quiz, sort: testSort, sprites: sprites, pic: quizpic, dropdown: dropdown });
                } else if (dropdown.length == 0 && quiz.length > 0 && errorOccurred == false) {
                    errorOccurred = true;
                    alert("Error. A question must contain at least 1 dropdown.");
                    return false;
                }
            });

            if (question.length == 0 && errorOccurred == false) {
                alert("Error. Quiz quest must have at least 1 question.");
                errorOccurred = true;
                return false;
            }

            if (errorOccurred == false) {
                var chapterId = $(".quest-form-modal .general-quest-form").attr("data-chapter-index");
                var stageId = $(".quest-form-modal .general-quest-form").attr("data-stage-index");
                var questId = $(".quest-form-modal .general-quest-form").attr("data-quest-index");

                if (questId == "") {
                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".quest-form-modal .modal-footer button").prop("disabled", true);
                        },
                        data: {
                            method: "insert-quest",
                            question: question,
                            questinfo: questinfo,
                            stageId: chapterList[chapterId].stage[stageId].id,
                            type: 2,
                        },
                        success: function (response) {
                            console.log(response);
                            var data = JSON.parse(response);
                            if (data.questId != undefined) {
                                chapterList[chapterId].stage[stageId].quest.push({
                                    background: questinfo["questBg"],
                                    exp: questinfo["questExp"],
                                    id: data.questId,
                                    quest_desc: questinfo["questDesc"],
                                    require: questinfo["required"],
                                    title: questinfo["title"],
                                    type: 2,
                                });
                                quests.push({ id: data.questId, title: questinfo["title"] });

                                $(
                                    ".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body .add-quest"
                                ).remove();

                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    getCardHTML("quest", chapterList[chapterId].stage[stageId].quest.length - 1, questinfo["title"])
                                );

                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    '<div class="card card-secondary add-quest">' +
                                        '<button type="button" class="btn btn-secondary btn-lg btn-block">' +
                                        '<i class="fas fa-plus"></i>' +
                                        "</button>" +
                                        "</div>"
                                );
                            }
                            $(".quest-form-modal .modal-footer button").prop("disabled", false);
                            $(".quest-form-modal").modal("hide");
                        },
                    });
                } else {
                    var oldtype = "";
                    if (chapterList[chapterId].stage[stageId].quest[questId].type != 2) {
                        oldtype = chapterList[chapterId].stage[stageId].quest[questId].type;
                    }

                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".quest-form-modal .modal-footer button").prop("disabled", true);
                        },
                        data: {
                            method: "update-quest",
                            questId: chapterList[chapterId].stage[stageId].quest[questId].id,
                            question: question,
                            questinfo: questinfo,
                            oldtype: oldtype,
                            type: 2,
                        },
                        success: function (response) {
                            if (response != 1) {
                                alert("Error. Adding quiz quest in database.");
                            } else {
                                chapterList[chapterId].stage[stageId].quest[questId].background = questinfo["questBg"];
                                chapterList[chapterId].stage[stageId].quest[questId].exp = questinfo["questExp"];
                                chapterList[chapterId].stage[stageId].quest[questId].quest_desc = questinfo["questDesc"];
                                chapterList[chapterId].stage[stageId].quest[questId].require = questinfo["required"];
                                chapterList[chapterId].stage[stageId].quest[questId].title = questinfo["title"];
                                chapterList[chapterId].stage[stageId].quest[questId].type = 2;
                                $(
                                    ".chapter-card[data-chapter-index=" +
                                        chapterId +
                                        "] .stage-card[data-stage-index=" +
                                        stageId +
                                        "] .quest-card[data-quest-index=" +
                                        questId +
                                        "] > .card-header > input"
                                ).val(questinfo["title"]);
                            }
                            $(".quest-form-modal .modal-footer button").prop("disabled", false);
                            $(".quest-form-modal").modal("hide");
                        },
                    });
                }
            }

            //console.log(question);
            //ajax
        } else if (questinfo["questType"] == "3") {
            var battle = {};
            var battledesc = $(".quest-form-modal .battle-desc").val();
            var battledesc_elem = [];
            var index = 1;

            $(".battle-desc-element").each(function () {
                battledesc_elem.push({ element: index, resist: $(this).val() });
                index++;
            });

            var wavemob = [];
            $(".quest-form-modal .wave-detail-form").each(function () {
                var mobs = [];
                $(this)
                    .find(".wave-monster-form")
                    .each(function () {
                        var mobid = $(this).find(".monster-select").val();
                        var mobnumber = $(this).find(".monster-number").val();
                        var mobdetail = {};
                        if (mobid == "") {
                            var mobsprite = $(this).find(".monster-sprite").val();
                            var mobname = $(this).find(".monster-name").val();
                            var mobatk = $(this).find(".monster-attack").val();
                            var mobhp = $(this).find(".monster-hp").val();
                            var mobelement = [];
                            var index = 1;

                            $(this)
                                .find(".monster-element")
                                .each(function () {
                                    mobelement.push({ element: index, resist: $(this).val() });
                                    index++;
                                });

                            if (mobsprite != "" && mobname != "" && mobatk != "" && mobhp != "") {
                                mobdetail = { sprite: mobsprite, name: mobname, atk: mobatk, hp: mobhp, element: mobelement };
                                var checkDetail = monsters.findIndex(function (x) {
                                    return (
                                        x.attack == mobatk &&
                                        x.hp == mobhp &&
                                        x.name.trim().toLowerCase() == mobname.trim().toLowerCase() &&
                                        x.resist.toString() == mobelement.toString() &&
                                        x.spriteId == mobsprite
                                    );
                                });
                                if (checkDetail != -1) {
                                    mobid = checkDetail;
                                    mobdetail = {};
                                }
                            } else if (!(mobsprite == "" && mobname == "" && mobatk == "" && mobhp == "") && errorOccurred == false) {
                                alert("Error. Please fill all monster detail");
                                errorOccurred = true;
                                return false;
                            }
                        } else {
                            mobid = monsters[mobid].id;
                        }
                        if ((JSON.stringify(mobdetail) != "{}" || mobid != "") && mobnumber > 0) {
                            if (JSON.stringify(mobdetail) == "{}") {
                                mobdetail = "";
                            }

                            mobs.push({ mobid: mobid, number: mobnumber, detail: mobdetail });
                        } else if ((JSON.stringify(mobdetail) != "{}" || mobid != "") && mobnumber == 0 && errorOccurred == false) {
                            alert("Error. No specified number of monsters");
                            errorOccurred = true;
                            return false;
                        }
                    });
                if (mobs.length >= 1) {
                    wavemob.push(mobs);
                }
            });
            if (battledesc != "" && battledesc_elem.length == 7 && wavemob.length > 0) {
                //process monster data and wave (to prevent the case where there are a new monster which exists in different wave)
                var uniqueMob = [];
                uniqueMob.push(wavemob[0][0]);
                for (let i = 0; i < wavemob.length; i++) {
                    for (let j = 0; j < wavemob[i].length; j++) {
                        if (
                            uniqueMob.find(function (x) {
                                return x.mobid == wavemob[i][j].mobid && JSON.stringify(x.detail) == JSON.stringify(wavemob[i][j].detail);
                            }) == undefined
                        ) {
                            uniqueMob.push(wavemob[i][j]);
                        }
                    }
                }

                for (let i = 0; i < wavemob.length; i++) {
                    for (let j = 0; j < wavemob[i].length; j++) {
                        var mobIndex = uniqueMob.findIndex(function (x) {
                            return x.mobid == wavemob[i][j].mobid && JSON.stringify(x.detail) == JSON.stringify(wavemob[i][j].detail);
                        });
                        if (mobIndex == -1 && errorOccurred == false) {
                            alert("Error. Processing wave data");
                            errorOccurred = true;
                        } else {
                            wavemob[i][j] = { mobid: mobIndex, number: wavemob[i][j].number };
                        }
                    }
                }
                battle = { desc: battledesc, elem: battledesc_elem, wave: wavemob, mob: uniqueMob };
            } else if (wavemob.length == 0 && errorOccurred == false) {
                alert("Error. Battle must have at least 1 wave.");
                errorOccurred = true;
                return false;
            }

            if (errorOccurred == false) {
                var chapterId = $(".quest-form-modal .general-quest-form").attr("data-chapter-index");
                var stageId = $(".quest-form-modal .general-quest-form").attr("data-stage-index");
                var questId = $(".quest-form-modal .general-quest-form").attr("data-quest-index");

                if (questId == "") {
                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".quest-form-modal .modal-footer button").prop("disabled", true);
                        },
                        data: {
                            method: "insert-quest",
                            battle: battle,
                            questinfo: questinfo,
                            stageId: chapterList[chapterId].stage[stageId].id,
                            type: 3,
                        },
                        success: function (response) {
                            //console.log(response);
                            var data = JSON.parse(response);
                            if (data.newMob != undefined) {
                                monsters = monsters.concat(data.newMob);
                            }
                            if (data.questId != undefined) {
                                chapterList[chapterId].stage[stageId].quest.push({
                                    background: questinfo["questBg"],
                                    exp: questinfo["questExp"],
                                    id: data.questId,
                                    quest_desc: questinfo["questDesc"],
                                    require: questinfo["required"],
                                    title: questinfo["title"],
                                    type: 3,
                                });
                                quests.push({ id: data.questId, title: questinfo["title"] });

                                if (data.newMob != undefined) {
                                    monsters = monsters.concat(data.newMob);
                                }

                                $(
                                    ".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body .add-quest"
                                ).remove();

                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    getCardHTML("quest", chapterList[chapterId].stage[stageId].quest.length - 1, questinfo["title"])
                                );

                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    '<div class="card card-secondary add-quest">' +
                                        '<button type="button" class="btn btn-secondary btn-lg btn-block">' +
                                        '<i class="fas fa-plus"></i>' +
                                        "</button>" +
                                        "</div>"
                                );
                            }
                            $(".quest-form-modal .modal-footer button").prop("disabled", false);
                            $(".quest-form-modal").modal("hide");
                        },
                    });
                } else {
                    var oldtype = "";
                    if (chapterList[chapterId].stage[stageId].quest[questId].type != 3) {
                        oldtype = chapterList[chapterId].stage[stageId].quest[questId].type;
                    }

                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".quest-form-modal .modal-footer button").prop("disabled", true);
                        },
                        data: {
                            method: "update-quest",
                            questId: chapterList[chapterId].stage[stageId].quest[questId].id,
                            battle: battle,
                            questinfo: questinfo,
                            oldtype: oldtype,
                            type: 3,
                        },
                        success: function (response) {
                            //console.log(response);
                            var data = JSON.parse(response);
                            if (data.status != 1) {
                                alert("Error. Adding battle quest in database.");
                            } else {
                                chapterList[chapterId].stage[stageId].quest[questId].background = questinfo["questBg"];
                                chapterList[chapterId].stage[stageId].quest[questId].exp = questinfo["questExp"];
                                chapterList[chapterId].stage[stageId].quest[questId].quest_desc = questinfo["questDesc"];
                                chapterList[chapterId].stage[stageId].quest[questId].require = questinfo["required"];
                                chapterList[chapterId].stage[stageId].quest[questId].title = questinfo["title"];
                                chapterList[chapterId].stage[stageId].quest[questId].type = 3;
                                $(
                                    ".chapter-card[data-chapter-index=" +
                                        chapterId +
                                        "] .stage-card[data-stage-index=" +
                                        stageId +
                                        "] .quest-card[data-quest-index=" +
                                        questId +
                                        "] > .card-header > input"
                                ).val(questinfo["title"]);

                                if (data.newMob != undefined) {
                                    monsters = monsters.concat(data.newMob);
                                }
                            }
                            $(".quest-form-modal .modal-footer button").prop("disabled", false);
                            $(".quest-form-modal").modal("hide");
                        },
                    });
                }
            }
        }
        $(".save-quest").html("Save");
    } else {
        alert("Error. Please fill all fields (except required quest which is optional) in the general detail section of the form.");
        $(".save-quest").html("Save");
        return false;
    }
});

$("input[name=questInput]").change(function () {
    var input = $(this)[0].files;
    var validFile = [];
    var promiseList = [];

    for (let i = 0; i < input.length; i++) {
        var file = input[i]; //uploaded file object
        var fileDetail = file.name.split(".");
        var extension = fileDetail[fileDetail.length - 1].toLowerCase().trim();

        if (extension == "csv" || extension == "txt") {
            var reader = new FileReader();
            //promise object for reading the file
            var promise = new Promise(function (resolve, reject) {
                reader.onload = function (event) {
                    resolve({ name: file.name, content: event.target.result });
                };
                reader.onerror = function () {
                    reader.abort();
                    reject(undefined);
                };
                reader.readAsText(file);
            });
            //push the promise in array (so we can tell the program to wait for which of promises)
            promiseList.push(promise);
        }
    }

    //wait for all promises ie. read all files to finish
    Promise.all(promiseList).then(function (value) {
        var errorRead = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] != undefined) {
                validFile.push(value[i]);
            } else {
                errorRead++;
            }
        }
        if (errorRead > 0) {
            alert(
                "There are " +
                    errorRead +
                    " files which we cannot read the content. Please make sure that inputs files are readable csv files or csv-format text files"
            );
        } else {
            var questListImport = [];
            for (let i = 0; i < validFile.length; i++) {
                var content = validFile[i].content.replace(/"/g, "").split("\n");
                var j = 0;
                var invalid = false;
                var questData = {};
                while (content[j] != undefined) {
                    if (
                        content[j].trim().toLowerCase() != "story quest detail" &&
                        content[j].trim().toLowerCase() != "quiz quest detail" &&
                        content[j].trim().toLowerCase() != "battle quest detail"
                    ) {
                        var row = content[j].trim().split(",");
                        if (row.length == 2) {
                            if (
                                row[0].trim().toLowerCase() == "quest type" ||
                                row[0].trim().toLowerCase() == "background picture" ||
                                row[0].trim().toLowerCase() == "required quest"
                            ) {
                                questData[row[0].trim().toLowerCase()] = row[1].trim().toLowerCase();
                            } else {
                                questData[row[0].trim().toLowerCase()] = row[1].trim();
                            }
                        }
                        j++;
                    } else {
                        break;
                    }
                }
                //check valid of general detail
                if (Object.keys(questData).length == 6 || Object.keys(questData).length == 5) {
                    if (
                        questData["title"] == undefined ||
                        questData["quest description"] == undefined ||
                        questData["quest type"] == undefined ||
                        (questData["quest type"] != "story" && questData["quest type"] != "quiz" && questData["quest type"] != "battle")
                    ) {
                        invalid = true;
                    }

                    if (questData["required quest"] != undefined) {
                        var reqQuest = quests.find(function (x) {
                            return x.title.trim().toLowerCase() == questData["required quest"];
                        });
                        if (reqQuest != undefined) {
                            questData["required quest"] = { inDb: 1, id: reqQuest.id };
                        }
                    } else {
                        questData["required quest"] = "";
                    }

                    if (isNaN(parseInt(questData["exp"])) == true) {
                        invalid = true;
                    } else {
                        questData["exp"] = parseInt(questData["exp"]);
                    }

                    if (
                        questData["background picture"] == undefined ||
                        backgroundPics.find(function (x) {
                            return x.name.trim().toLowerCase() == questData["background picture"];
                        }) == undefined
                    ) {
                        invalid = true;
                    } else {
                        var bgPic = backgroundPics.find(function (x) {
                            return x.name.trim().toLowerCase() == questData["background picture"];
                        });
                        questData["background picture"] = bgPic.id;
                    }
                } else {
                    invalid = true;
                }

                if (invalid == false) {
                    if (questData["quest type"] == "story" && content[j].trim().toLowerCase() == "story quest detail") {
                        questData["storyline"] = [];
                        questData["story picture"] = [];
                        //loop until find picture header
                        while (content[j] != undefined) {
                            var headerCheck = content[j]
                                .replace(/\s{0,},\s{0,}/g, ",")
                                .trim()
                                .toLowerCase();
                            if (headerCheck != "picture,start,stop") {
                                var row = content[j].trim().split(",");
                                //in template, we have "no" but remove here (i think user can easily insert line and no. itself makes thing harder a little.)
                                //>= 2 instead of 3 to handle line where only a left sprite is shown
                                //format for header is restricted to "line, left sprite, right sprite"
                                if (row.length == 2 || row.length == 3) {
                                    var lineFound = {};
                                    var speaker = row[0].trim().split(":")[0];
                                    if (row[0].trim().split(":").length == 1) {
                                        lineFound["speaker"] = "";
                                        lineFound["line"] = row[0].trim();
                                    } else if (row[0].trim().split(":").length >= 2) {
                                        lineFound["speaker"] = speaker;
                                        lineFound["line"] = row[0].replace(speaker, "").replace(":", "").trim();
                                    }
                                    lineFound["left sprite"] = "";
                                    lineFound["right sprite"] = "";
                                    var spriteFound = undefined;
                                    if (row[1] != undefined) {
                                        spriteFound = sprites.find(function (x) {
                                            return x.name.trim().toLowerCase() == row[1].trim().toLowerCase();
                                        });
                                        if (spriteFound != undefined) {
                                            lineFound["left sprite"] = spriteFound.id;
                                        }
                                    }

                                    if (row[2] != undefined) {
                                        spriteFound = sprites.find(function (x) {
                                            return x.name.trim().toLowerCase() == row[2].trim().toLowerCase();
                                        });
                                        if (spriteFound != undefined) {
                                            lineFound["right sprite"] = spriteFound.id;
                                        }
                                    }
                                    if (lineFound["left sprite"] != "" || lineFound["right sprite"] != "") {
                                        questData["storyline"].push(lineFound);
                                    }
                                }
                                j++;
                            } else {
                                break;
                            }
                        }
                        if (questData["storyline"].length == 0) {
                            invalid = true;
                        }
                        if (content[j] != undefined) {
                            if (content[j].replace(/\s{0,},\s{0,}/g, ",").trim() == "picture,start,stop") {
                                while (content[j] != undefined) {
                                    var row = content[j].trim().toLowerCase().split(",");
                                    if (row.length == 3) {
                                        var picFound = storyPics.find(function (x) {
                                            return x.trim().toLowerCase() == row[0].trim().toLowerCase();
                                        });
                                        if (
                                            picFound != undefined &&
                                            isNaN(parseInt(row[1].trim())) == false &&
                                            isNaN(parseInt(row[2].trim())) == false
                                        ) {
                                            questData["story picture"].push({
                                                picture: "../storyPic/" + picFound,
                                                start: parseInt(row[1].trim()),
                                                stop: parseInt(row[2].trim()),
                                            });
                                        }
                                    }
                                    j++;
                                }
                            }
                        }
                    } else if (questData["quest type"] == "quiz" && content[j].trim().toLowerCase() == "quiz quest detail") {
                        questData["question"] = [];
                        while (content[j] != undefined) {
                            var headerCheck = content[j]
                                .replace(/\s{0,},\s{0,}/g, ",")
                                .trim()
                                .toLowerCase();
                            if (headerCheck != "no,question no,dropdown label") {
                                var row = content[j].trim().split(",");
                                //no, question, test sort, sprite left, sprite right, picture
                                if (row.length >= 3 && row.length <= 6) {
                                    var q = {};
                                    q["left sprite"] = "";
                                    q["right sprite"] = "";
                                    q["picture"] = "";
                                    q["dropdown"] = [];
                                    if (isNaN(parseInt(row[0].trim())) == false && row[1].trim().length > 0 && row[2].trim().length > 0) {
                                        q["id"] = parseInt(row[0].trim());
                                        q["question"] = row[1].trim();
                                        q["sort"] = sorts.find(function (x) {
                                            return x.name.trim().toLowerCase() == row[2].trim().toLowerCase();
                                        });
                                        if (q["sort"] == undefined) {
                                            invalid = true;
                                        } else {
                                            q["sort"] = q["sort"].id;
                                        }

                                        var mediaFound = undefined;
                                        if (row[3] != undefined) {
                                            mediaFound = sprites.find(function (x) {
                                                return x.name.trim().toLowerCase() == row[3].trim().toLowerCase();
                                            });
                                            if (mediaFound != undefined) {
                                                q["left sprite"] = mediaFound.id;
                                            }
                                        }
                                        if (row[4] != undefined) {
                                            mediaFound = sprites.find(function (x) {
                                                return x.name.trim().toLowerCase() == row[4].trim().toLowerCase();
                                            });
                                            if (mediaFound != undefined) {
                                                q["right sprite"] = mediaFound.id;
                                            }
                                        }
                                        if (row[5] != undefined) {
                                            mediaFound = storyPics.find(function (x) {
                                                return x.trim().toLowerCase() == row[5].trim().toLowerCase();
                                            });
                                            if (mediaFound != undefined) {
                                                q["picture"] = mediaFound;
                                            }
                                        }
                                        questData["question"].push(q);
                                    }
                                }
                                j++;
                            } else {
                                break;
                            }
                        }
                        if (content[j] != undefined) {
                            if (
                                content[j]
                                    .replace(/\s{0,},\s{0,}/g, ",")
                                    .trim()
                                    .toLowerCase() == "no,question no,dropdown label"
                            ) {
                                while (content[j] != undefined) {
                                    var headerCheck = content[j]
                                        .replace(/\s{0,},\s{0,}/g, ",")
                                        .trim()
                                        .toLowerCase();
                                    if (headerCheck != "dropdown no,choice,correct") {
                                        var row = content[j].trim().split(",");
                                        if (row.length == 3) {
                                            var d = {};
                                            d["choice"] = [];
                                            if (
                                                isNaN(parseInt(row[0].trim())) == false &&
                                                isNaN(parseInt(row[1].trim())) == false &&
                                                row[2].trim().length > 0
                                            ) {
                                                d["label"] = row[2].trim();
                                                d["id"] = parseInt(row[0].trim());
                                                var qtopush = questData["question"].findIndex(function (x) {
                                                    return x.id == parseInt(row[1].trim());
                                                });
                                                questData["question"][qtopush]["dropdown"].push(d);
                                            }
                                        }
                                        j++;
                                    } else {
                                        break;
                                    }
                                }
                                if (
                                    content[j]
                                        .replace(/\s{0,},\s{0,}/g, ",")
                                        .trim()
                                        .toLowerCase() == "dropdown no,choice,correct"
                                ) {
                                    while (content[j] != undefined) {
                                        var row = content[j].trim().split(",");
                                        if (row.length == 3) {
                                            var c = {};
                                            if (isNaN(parseInt(row[0].trim())) == false && row[2].trim().length > 0 && row[1].trim().length > 0) {
                                                c["label"] = row[1].trim();
                                                if (row[2].trim().toLowerCase() == "true") {
                                                    c["correct"] = 1;
                                                } else {
                                                    c["correct"] = 0;
                                                }
                                                for (let i = 0; i < questData["question"].length; i++) {
                                                    for (let j = 0; j < questData["question"][i]["dropdown"].length; j++) {
                                                        if (questData["question"][i]["dropdown"][j]["id"] == parseInt(row[0].trim())) {
                                                            questData["question"][i]["dropdown"][j]["choice"].push(c);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        j++;
                                    }
                                } else {
                                    invalid = true;
                                }
                            } else {
                                invalid = true;
                            }
                        } else {
                            invalid = true;
                        }
                        //final validation test
                        if (questData["question"].length > 0) {
                            for (let i = 0; i < questData["question"].length; i++) {
                                if (questData["question"][i]["dropdown"].length > 0) {
                                    for (let j = 0; j < questData["question"][i]["dropdown"].length; j++) {
                                        if (questData["question"][i]["dropdown"][j]["choice"].length > 0) {
                                            if (
                                                questData["question"][i]["dropdown"][j]["choice"].filter(function (x) {
                                                    return x["correct"] == 1;
                                                }).length <= 0
                                            ) {
                                                invalid = true;
                                            }
                                        } else {
                                            invalid = true;
                                        }
                                    }
                                } else {
                                    invalid = true;
                                }
                            }
                        } else {
                            invalid = true;
                        }
                    } else if (questData["quest type"] == "battle" && content[j].trim().toLowerCase() == "battle quest detail") {
                        questData["battle desc"] = {};
                        while (content[j] != undefined) {
                            var headerCheck = content[j]
                                .replace(/\s{0,},\s{0,}/g, ",")
                                .trim()
                                .toLowerCase();
                            if (headerCheck != "no,name,sprite,attack,hp,water,fire,earth,wind,dark,light,ice") {
                                var row = content[j].trim().split(",");
                                if (row.length == 2) {
                                    if (row[0].trim().toLowerCase() == "description" && row[1].trim().length > 0) {
                                        questData["battle desc"]["desc"] = row[1].trim();
                                    } else {
                                        var checkResist = resist.find(function (x) {
                                            return x.name.trim().toLowerCase() == row[1].trim().toLowerCase();
                                        });
                                        if (checkResist != undefined) {
                                            questData["battle desc"][row[0].trim().toLowerCase()] = checkResist.id;
                                        } else {
                                            questData["battle desc"][row[0].trim().toLowerCase()] = "";
                                        }
                                    }
                                }
                                j++;
                            } else {
                                break;
                            }
                        }
                        if (content[j] != undefined) {
                            if (
                                content[j]
                                    .replace(/\s{0,},\s{0,}/g, ",")
                                    .trim()
                                    .toLowerCase() == "no,name,sprite,attack,hp,water,fire,earth,wind,dark,light,ice"
                            ) {
                                questData["monsters"] = [];
                                var monsterDetail = {};
                                while (content[j] != undefined) {
                                    var headerCheck = content[j]
                                        .replace(/\s{0,},\s{0,}/g, ",")
                                        .trim()
                                        .toLowerCase();
                                    if (headerCheck != "monster 1,number of monter 1,monster 2,number of monter 2") {
                                        var row = content[j].trim().split(",");
                                        monsterDetail = {};
                                        monsterDetail["existMob"] = "";
                                        checkMob = undefined;
                                        if (row.length >= 2 && row.length < 12) {
                                            if (row[1].length > 0) {
                                                monsterDetail["id"] = parseInt(row[0].trim());
                                                monsterDetail["name"] = row[1].trim();
                                                checkMob = monsters.find(function (x) {
                                                    return (
                                                        (monsterDetail["attack"] == x.attack &&
                                                            monsterDetail["hp"] == x.hp &&
                                                            monsterDetail["sprite"] == x.spriteId &&
                                                            monsterDetail["element"][0] == x.resist[0].resist &&
                                                            monsterDetail["element"][1] == x.resist[1].resist &&
                                                            monsterDetail["element"][2] == x.resist[2].resist &&
                                                            monsterDetail["element"][3] == x.resist[3].resist &&
                                                            monsterDetail["element"][4] == x.resist[4].resist &&
                                                            monsterDetail["element"][5] == x.resist[5].resist &&
                                                            monsterDetail["element"][6] == x.resist[6].resist) ||
                                                        monsterDetail["name"].toLowerCase() == x.name.trim().toLowerCase()
                                                    );
                                                });

                                                if (checkMob != undefined) {
                                                    monsterDetail["existMob"] = checkMob.id;
                                                    questData["monsters"].push(monsterDetail);
                                                } else {
                                                    invalid = true;
                                                }
                                            }
                                        } else if (row.length == 12) {
                                            if (
                                                isNaN(parseInt(row[0].trim())) == false &&
                                                row[1].length > 0 &&
                                                isNaN(parseInt(row[3].trim())) == false &&
                                                isNaN(parseInt(row[4].trim())) == false
                                            ) {
                                                monsterDetail["id"] = parseInt(row[0].trim());
                                                monsterDetail["name"] = row[1].trim();
                                                monsterDetail["attack"] = parseInt(row[3].trim());
                                                monsterDetail["hp"] = parseInt(row[4].trim());
                                                var spriteFound = sprites.find(function (x) {
                                                    return x.name.trim().toLowerCase() == row[2].trim().toLowerCase();
                                                });
                                                if (spriteFound != undefined) {
                                                    monsterDetail["sprite"] = spriteFound.id;
                                                } else {
                                                    invalid = true;
                                                }
                                                monsterDetail["element"] = {};
                                                for (let k = 5; k < 12; k++) {
                                                    var checkResist = resist.find(function (x) {
                                                        return x.name.trim().toLowerCase() == row[k].trim().toLowerCase();
                                                    });
                                                    if (checkResist != undefined) {
                                                        monsterDetail["element"][k - 5] = checkResist.id;
                                                    } else {
                                                        invalid = true;
                                                    }
                                                }
                                                if (invalid == false) {
                                                    checkMob = monsters.find(function (x) {
                                                        return (
                                                            (monsterDetail["attack"] == x.attack &&
                                                                monsterDetail["hp"] == x.hp &&
                                                                monsterDetail["sprite"] == x.spriteId &&
                                                                monsterDetail["element"][0] == x.resist[0].resist &&
                                                                monsterDetail["element"][1] == x.resist[1].resist &&
                                                                monsterDetail["element"][2] == x.resist[2].resist &&
                                                                monsterDetail["element"][3] == x.resist[3].resist &&
                                                                monsterDetail["element"][4] == x.resist[4].resist &&
                                                                monsterDetail["element"][5] == x.resist[5].resist &&
                                                                monsterDetail["element"][6] == x.resist[6].resist) ||
                                                            monsterDetail["name"].toLowerCase() == x.name.trim().toLowerCase()
                                                        );
                                                    });

                                                    if (checkMob != undefined) {
                                                        monsterDetail["existMob"] = checkMob.id;
                                                    }
                                                    questData["monsters"].push(monsterDetail);
                                                }
                                            }
                                        }
                                        j++;
                                    } else {
                                        break;
                                    }
                                }
                                if (content[j] != undefined) {
                                    if (
                                        content[j]
                                            .replace(/\s{0,},\s{0,}/g, ",")
                                            .trim()
                                            .toLowerCase() == "monster 1,number of monter 1,monster 2,number of monter 2"
                                    ) {
                                        questData["wave"] = [];
                                        while (content[j] != undefined) {
                                            var row = content[j].trim().split(",");
                                            if (row.length == 2 || row.length == 4) {
                                                var waveMon = [];
                                                if (isNaN(parseInt(row[0].trim())) == false && isNaN(parseInt(row[1].trim())) == false) {
                                                    var checkMob = questData["monsters"].find(function (x) {
                                                        return x.id == parseInt(row[0].trim());
                                                    });
                                                    if (checkMob != undefined) {
                                                        waveMon.push({ mob: checkMob.id, number: parseInt(row[1].trim()) });
                                                    } else {
                                                        invalid = true;
                                                    }
                                                }
                                                if (row[2] != undefined) {
                                                    if (isNaN(parseInt(row[2].trim())) == false && isNaN(parseInt(row[3].trim())) == false) {
                                                        var checkMob = questData["monsters"].find(function (x) {
                                                            return x.id == parseInt(row[2].trim());
                                                        });
                                                        if (checkMob != undefined) {
                                                            waveMon.push({ mob: checkMob.id, number: parseInt(row[3].trim()) });
                                                        } else {
                                                            invalid = true;
                                                        }
                                                    }
                                                }
                                                if (waveMon.length > 0) {
                                                    questData["wave"].push(waveMon);
                                                }
                                            }
                                            j++;
                                        }
                                    } else {
                                        invalid = true;
                                    }
                                } else {
                                    invalid = true;
                                }
                            } else {
                                invalid = true;
                            }
                        } else {
                            invalid = true;
                        }
                    } else {
                        invalid = true;
                    }
                    if (invalid == false) {
                        questListImport.push(questData);
                    }
                }
            }

            //check required quest once more
            for (let i = 0; i < questListImport.length; i++) {
                if (
                    questListImport[i]["required quest"] != undefined &&
                    questListImport[i]["required quest"] != null &&
                    questListImport[i]["required quest"]["inDb"] == undefined
                ) {
                    var reqQuest = questListImport.findIndex(function (x) {
                        return x.title.trim().toLowerCase() == questListImport[i]["required quest"];
                    });
                    if (reqQuest != -1) {
                        questListImport[i]["required quest"] = { inDb: 0, id: reqQuest };
                    } else {
                        questListImport[i]["required quest"] = "";
                    }
                }
            }

            if (questListImport.length > 0) {
                if (confirm(questListImport.length + " files out of " + validFile.length + " files are valid quest files. Import them?") == true) {
                    //console.log(validFile);
                    //console.log(questListImport);
                    var chapterId = $("input[name=import-quest-chapter]").val();
                    var stageId = $("input[name=import-quest-stage]").val();
                    var stageIndex = chapterList[chapterId].stage[stageId].id;

                    $.ajax({
                        url: "./questList/updateChStName.php",
                        type: "POST",
                        data: {
                            method: "import-quest",
                            questimport: questListImport,
                            stageId: stageIndex,
                        },
                        success: function (response) {
                            //console.log(response);
                            var data = JSON.parse(response);
                            if (data.newMob != undefined) {
                                monsters = monsters.concat(data.newMob);
                            }
                            if (data.questId.length == questListImport.length) {
                                $(
                                    ".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body .add-quest"
                                ).remove();
                                for (let i = 0; i < questListImport.length; i++) {
                                    var typeid = 0;
                                    if (questListImport[i]["quest type"] == "story") {
                                        typeid = 1;
                                    } else if (questListImport[i]["quest type"] == "battle") {
                                        typeid = 3;
                                    } else if (questListImport[i]["quest type"] == "quiz") {
                                        typeid = 2;
                                    }

                                    chapterList[chapterId].stage[stageId].quest.push({
                                        background: questListImport[i]["background picture"],
                                        exp: questListImport[i]["exp"],
                                        id: data.questId[i],
                                        quest_desc: questListImport[i]["quest description"],
                                        require: data.required[i],
                                        title: questListImport[i]["title"],
                                        type: typeid,
                                    });

                                    quests.push({ id: data.questId[i], title: questListImport[i]["title"] });

                                    $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                        getCardHTML("quest", chapterList[chapterId].stage[stageId].quest.length - 1, questListImport[i]["title"])
                                    );
                                }
                                $(".card[data-chapter-index=" + chapterId + "] .card[data-stage-index=" + stageId + "] > .card-body").prepend(
                                    '<div class="card card-secondary add-quest">' +
                                        '<button type="button" class="btn btn-secondary btn-lg btn-block">' +
                                        '<i class="fas fa-plus"></i>' +
                                        "</button>" +
                                        "</div>"
                                );
                            } else {
                                alert("Error importing quests into database");
                            }
                        },
                    });
                }
            } else {
                alert("None of imported files is valid quest file!");
            }
        }
    });
    $(this).parent().children("input").val("");
});

$(".character-unlock-form").change(function (event) {
    var changedform = $(event.target).parents(".form-group");
    var index = $(changedform).attr("data-character-index");
    var chosenquest = $(changedform).find(".quest-list-form").val();
    console.log(changedform);
    console.log(characters[index]);
    console.log(chosenquest);
    $.ajax({
        url: "./questList/updateChStName.php",
        type: "POST",
        data: { method: "update-require-character", charId: characters[index].id, require: chosenquest },
        success: function (response) {
            characters[index].required = chosenquest;
            console.log(response);
        },
    });
});

$(".element-unlock-form").change(function (event) {
    var changedform = $(event.target).parents(".form-group");
    var index = $(changedform).attr("data-element-index");
    var chosenquest = $(changedform).find(".quest-list-form").val();
    console.log(changedform);
    console.log(sorts[index]);
    console.log(chosenquest);
    $.ajax({
        url: "./questList/updateChStName.php",
        type: "POST",
        data: { method: "update-require-element", elemId: sorts[index].id, require: chosenquest },
        success: function (response) {
            sorts[index].required = chosenquest;
            console.log(response);
        },
    });
});

$(".library-unlock-form").change(function (event) {
    var changedform = $(event.target).parents(".form-group");
    var index = $(changedform).attr("data-library-index");
    var chosenquest = $(changedform).find(".quest-list-form").val();
    console.log(changedform);
    console.log(libraryContent[index]);
    console.log(chosenquest);
    $.ajax({
        url: "./questList/updateChStName.php",
        type: "POST",
        data: { method: "update-require-library", bookId: libraryContent[index].id, require: chosenquest },
        success: function (response) {
            libraryContent[index].required = chosenquest;
            console.log(response);
        },
    });
});

$(".upload-image").click(function () {
    var mode = $(this).val();
    if (mode == "story") {
        var formdata = new FormData($(".story-img-form")[0]);

        formdata.append("method", "import-storypic");
        //console.log(formdata.get("story-pic-name"));
        //console.log(formdata.get("story-pic-img-file"));
        //console.log(formdata.get("method"));

        if (formdata.get("story-pic-img-file").name.length == 0) {
            alert("Empty File. Please upload an image file.");
        } else if (formdata.get("story-pic-img-file").type.split("/")[0] != "image") {
            alert("Invalid file. Please upload an image file.");
        } else if (
            storyPics.find(function (x) {
                return (
                    x.trim().toLowerCase() == formdata.get("story-pic-img-file").name.trim().toLowerCase() ||
                    x.trim().toLowerCase().split(".")[0] == formdata.get("story-pic-name").trim().toLowerCase()
                );
            }) != undefined
        ) {
            alert("This file name already existed in directory.");
        } else {
            $.ajax({
                url: "./questList/updateChStName.php",
                type: "POST",
                data: formdata,
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,
                success: function (response) {
                    //console.log(response);
                    if (response.status == "1") {
                        storyPics.push(response.fileName);
                        $(".storypic-select").append('<option value="' + (storyPics.length - 1) + '">' + response.fileName + "</option>");
                        $(imgInput).val(storyPics.length - 1);
                        alert("Upload image success!");
                    } else {
                        alert("Error uploading image to directory");
                    }
                },
            });
        }
    } else if (mode == "background") {
        var formdata = new FormData($(".bg-import-form")[0]);
        formdata.append("method", "import-bg");
        //console.log(formdata.get("bg-name"));
        //console.log(formdata.get("bg-img-file"));
        //console.log(formdata.get("method"));

        if (formdata.get("bg-img-file").name.length == 0) {
            alert("Empty File. Please upload an image file.");
        } else if (formdata.get("bg-img-file").type.split("/")[0] != "image") {
            alert("Invalid file. Please upload an image file.");
        } else if (
            backgroundPics.find(function (x) {
                return (
                    x.path.trim().toLowerCase() == formdata.get("bg-img-file").name.trim().toLowerCase() ||
                    x.path.trim().toLowerCase().split(".")[0] == formdata.get("bg-name").trim().toLowerCase() ||
                    x.name.trim().toLowerCase() == formdata.get("bg-img-file").name.trim().toLowerCase() ||
                    x.name.trim().toLowerCase() == formdata.get("bg-name").trim().toLowerCase()
                );
            }) != undefined
        ) {
            alert("This file name already existed in directory.");
        } else {
            $.ajax({
                url: "./questList/updateChStName.php",
                type: "POST",
                data: formdata,
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,
                success: function (response) {
                    //console.log(response);
                    if (response.status == "1") {
                        backgroundPics.push({ id: response.id, name: response.fileName, path: response.path });
                        $(".quest-bg").append('<option value="' + response.id + '">' + response.fileName + "</option>");
                        $(imgInput).val(response.id);
                        alert("Upload image success!");
                    } else {
                        alert("Error uploading image to directory or database");
                    }
                },
            });
        }
    } else {
        alert("Error checking where to save image.");
    }
});
