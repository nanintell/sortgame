var groups = [
    {
        name: "CPE Regular",
        deadline: "16/2/2566",
        member: [
            {
                studentId: "62070501060",
                name: "Wipada Wantaratorn",
            },
            {
                studentId: "62070501050",
                name: "Phoraphop",
            },
        ],
    },
    {
        name: "CPE Inter",
        deadline: "14/2/2566",
        member: [
            {
                studentId: "62070501048",
                name: "Pimpawee",
            },
        ],
    },
];
var noGroupUsers = [];

var groupIndex = -1;
var objectToDelete = {};
var groupEditOpened = false;
var importedObj = "";

function visualizeDatetime(datetime) {
    if (datetime != "") {
        var dateFormatter = new Date(datetime);
        return (
            dateFormatter.getDate() +
            "/" +
            (dateFormatter.getMonth() + 1) +
            "/" +
            dateFormatter.getFullYear() +
            " " +
            dateFormatter.getHours() +
            ":" +
            dateFormatter.getMinutes()
        );
    } else {
        return "-";
    }
}

function addGroupCard(append, id, name, memberCount, deadline) {
    var buttonHTML =
        '<button type="button" class="btn btn-secondary btn-block group-card" value="' +
        id +
        '">' +
        '<div class="p-3">' +
        '<h3 class="font-weight-bold">' +
        name +
        "</h3>" +
        '<h5><span class="font-weight-bold">Member: </span>' +
        memberCount +
        "</h5>" +
        '<h5><span class="font-weight-bold">Deadline: </span>' +
        visualizeDatetime(deadline) +
        "</h5>" +
        "</div>" +
        "</button>";
    if (append == true) {
        $(".master-group-card").append(buttonHTML);
    } else {
        $(".add-group").parent().remove();
        $(".master-group-card").prepend(buttonHTML);
        $(".master-group-card").prepend(
            '<div class="d-flex justify-content-between">' + 
            '<button type="button" class="btn btn-secondary import-group" '+ 
                'onclick="$(\'input[name=fileInput]\')[0].click();importedObj = \'group\';" ' + 
                'onmouseover="if(groupEditOpened == false){$(\'.import-group-desc\').slideDown();}"' + 
                'title="We only accept csv file with 3 columns which the first column is group name, the second one is member\'s student id and the other one is member\'s name. Note that, you need to set deadline manually.">' + 
                '<i class="fas fa-file-import"></i>' + "</button>" + 
            '<button type="button" class="btn btn-secondary add-group">' + '<i class="fas fa-plus"></i>' + "</button>" + 
            "</div>"
        );
    }
}

function updateGroupDetail(updateCard, updateEditor, id, name, deadline) {
    if (updateEditor == true) {
        $(".group-detail-editor .group-title").val(name);
        $(".group-detail-editor .group-deadline[type=text]").val(visualizeDatetime(deadline));
        $(".group-detail-editor .group-deadline[type=datetime-local]").val(deadline);
    }
    if (updateCard == true) {
        $(".group-card[value=" + id + "] h3").text(name);
        $(".group-card[value=" + id + "] h5:eq(1)").html('<span class="font-weight-bold">Deadline: </span>' + visualizeDatetime(deadline));
    }
}

function disableGroupEditor() {
    //readonly inputs
    $(".group-detail-editor input").prop("readonly", true);
    $(".group-detail-editor input").removeClass("form-control");
    $(".group-detail-editor input").removeClass("form-control-plaintext");
    $(".group-detail-editor input").addClass("form-control-plaintext");
    //edit button
    $(".group-detail-editor .edit-group").val("edit");
    $(".group-detail-editor .edit-group").html('<i class="fas fa-edit"></i>');
    //delete button
    $(".group-detail-editor .delete-group").val("delete");
    //enable all buttons
    $(".group-setting-bg button").prop("disabled", false);

    $(".import-member").prop("disabled", false);
}

function enableGroupEditor(add) {
    //readonly inputs
    $(".group-detail-editor input").prop("readonly", false);
    $(".import-member").prop("disabled", true);
    $(".group-detail-editor input").addClass("form-control");
    $(".group-detail-editor input").removeClass("form-control-plaintext");
    $(".group-detail-editor .edit-group").html('<i class="fas fa-check"></i>');
    if (add == false) {
        //enable save and cancel button only
        $(".group-setting-bg button").not(".group-detail-editor button").prop("disabled", true);
        //edit button = save button
        $(".group-detail-editor .edit-group").val("save");
        //delete button = cancel editing button
        $(".delete-group").val("cancel-edit");
    } else {
        //clear input values
        $(".group-detail-editor input").val("");
        //edit button = add button
        $(".group-detail-editor .edit-group").val("add");
        //delete button = cancel adding button
        $(".group-detail-editor .delete-group").val("cancel-add");
        //hide member editor
        $(".group-editor").show();
        $(".group-member-editor").hide();
        $(".group-editor tbody").empty();

        if ($("html").innerWidth() <= 820) {
            $(".master-group-card").hide();
            $(".prev-page").removeClass("go-to-homepage");
        } else {
            $(".master-group-card").show();
            $(".prev-page").addClass("homepage");
        }
        groupEditOpened = true;
    }
}

function addMemberRow(append, value, id, name) {
    var rowHTML =
        "<tr>" +
        '<td><input type="text" readonly class="form-control-plaintext" value="' +
        id +
        '" pattern="[0-9{11}]" title="Existed Student ID cannot be edited."></td>' +
        '<td><input type="text" readonly class="form-control-plaintext" value="' +
        name +
        '"></td>' +
        '<td><button type="button" class="btn btn-secondary btn-block edit-member" data-member-index="' +
        value +
        '" value="edit"><i class="fas fa-edit"></i></button></td>' +
        '<td><button type="button" class="btn btn-secondary btn-block delete-member" value="delete" data-member-index="' +
        value +
        '"><i class="fas fa-times"></i></button></td>' +
        "</tr>";
    if (append == true) {
        $(".group-member-editor tbody").append(rowHTML);
    } else {
        $(".group-member-editor tbody").prepend(rowHTML);
    }
}

function updateMemberRow(parentRow, studentId, name) {
    $(parentRow).find("input:first").val(studentId);
    $(parentRow).find("input:eq(1)").val(name);
}

function enableMemberEditor(parentRow, inputOnly) {
    var nameInput = $(parentRow).find("input:eq(1)");
    //readonly name input
    //users cannot edit student ID (as it affects user's log in)
    $(nameInput).prop("readonly", false);
    $(nameInput).addClass("form-control");
    $(nameInput).removeClass("form-control-plaintext");
    if (inputOnly == false) {
        var editButton = $(parentRow).find(".edit-member");
        var deleteButton = $(parentRow).find(".delete-member");
        //edit button = save button
        $(editButton).html('<i class="fas fa-check"></i>');
        $(editButton).val("save");
        //delete button = cancel button
        $(deleteButton).val("cancel-edit");
        //disable all buttons except edit and delete buttons of that row
        $(".group-setting-bg button").not(editButton).not(deleteButton).prop("disabled", true);
    }
}

function disableMemberEditor(parentRow, inputOnly) {
    var nameInput = $(parentRow).find("input:eq(1)");
    //readonly name input
    $(nameInput).prop("readonly", true);
    $(nameInput).addClass("form-control-plaintext");
    $(nameInput).removeClass("form-control");
    if (inputOnly == false) {
        var editButton = $(parentRow).find(".edit-member");
        var deleteButton = $(parentRow).find(".delete-member");
        //delete button
        $(deleteButton).val("delete");
        //edit button
        $(editButton).html('<i class="fas fa-edit"></i>');
        $(editButton).val("edit");
        //enable all buttons
        $(".group-setting-bg button").prop("disabled", false);
    }
}

function clearMemberAdder() {
    var parentRow = $(".group-member-editor table > thead > tr:eq(1)");
    var inputs = $(parentRow).find("input");
    $(inputs).prop("readonly", false);
    $(inputs).removeClass("form-control-plaintext");
    $(inputs).addClass("form-control");
    $(inputs).val("");
}

function updateMemberCount(id, memberCount) {
    $(".group-card[value=" + id + "] h5:first").html('<span class="font-weight-bold">Member: </span>' + memberCount);
}

function searchUser(searchName, studentId, name) {
    var foundGroup = -2;
    var foundIndex = -1;
    var search_user = function (x) {
        return x.studentId == studentId || (searchName == true && x.name.trim().toLowerCase() == name.trim().toLowerCase());
    };
    for (let i = 0; i < groups.length && foundIndex == -1; i++) {
        foundIndex = groups[i].member.findIndex(search_user);
        if (foundIndex != -1) {
            foundGroup = i;
        }
    }
    if (foundIndex == -1) {
        foundIndex = noGroupUsers.findIndex(search_user);
        if (foundIndex != -1) {
            foundGroup = -1;
        }
    }
    return { group: foundGroup, index: foundIndex };
}

$(document).ready(function () {
    $("html, body").animate({ scrollTop: $(".content").offset().top }, 100);

    $.ajax({
        url: "./groupSetting/getGroupMember.php",
        type: "POST",
        success: function (response) {
            var data = JSON.parse(response);
            groups = data.group;
            noGroupUsers = data.outsider;
            $(".master-group-card").empty();
            $(".master-group-card").prepend(
                '<div class="d-flex justify-content-between">' + 
                '<button type="button" class="btn btn-secondary import-group" '+ 
                'onclick="$(\'input[name=fileInput]\')[0].click();importedObj = \'group\';" ' +
                'onmouseover="$(\'.import-group-desc\').slideDown();"' + 
                'title="We only accept csv file with 3 columns which the first column is group name, the second one is member\'s student id and the other one is member\'s name. Note that, you need to set deadline manually.">' + 
                '<i class="fas fa-file-import"></i>' + "</button>" + 
                '<button type="button" class="btn btn-secondary add-group">' + '<i class="fas fa-plus"></i>' + "</button>" + 
                "</div>"
            );
            for (let i = 0; i < groups.length; i++) {
                addGroupCard(true, i, groups[i].name, groups[i].member.length, groups[i].deadline);
            }
        },
    });

    $(window).unbind("resize");
    $(window).resize(function () {
        if ($("html").innerWidth() <= 820) {
            $(".master-group-card").removeClass("col-sm-3").addClass("col-sm-12");
            $(".group-editor").removeClass("col-sm-9").addClass("col-sm-12");
            $(".group-detail-editor > div").removeClass("d-flex");
            if(groupEditOpened == true) {
                $(".master-group-card").hide();
                $(".group-editor").show();
                $(".prev-page").removeClass("go-to-homepage");
                $(".prev-page").removeClass("homepage");
            } else {
                $(".master-group-card").show();
                $(".group-editor").hide();
                $(".prev-page").addClass("homepage");
            }
        } else {
            $(".master-group-card").removeClass("col-sm-12").addClass("col-sm-3");
            $(".group-editor").removeClass("col-sm-12").addClass("col-sm-9");
            $(".group-detail-editor > div").addClass("d-flex");
            $(".master-group-card").show();
            if($("prev-page").hasClass("homepage") == false) {
                $(".prev-page").addClass("homepage");
            }
            if(groupEditOpened == true) {
                $(".group-editor").show();
            }
        }
    });

    if ($("html").innerWidth() <= 820) {
        $(".master-group-card").removeClass("col-sm-3").addClass("col-sm-12");
        $(".group-editor").removeClass("col-sm-9").addClass("col-sm-12");
        $(".group-detail-editor > div").removeClass("d-flex");
        if(groupEditOpened == true) {
            $(".master-group-card").hide();
            $(".group-editor").show();
            $(".prev-page").removeClass("go-to-homepage");
        } else {
            $(".master-group-card").show();
            $(".group-editor").hide();
            $(".prev-page").addClass("homepage");
        }
    } else {
        $(".master-group-card").removeClass("col-sm-12").addClass("col-sm-3");
        $(".group-editor").removeClass("col-sm-12").addClass("col-sm-9");
        $(".group-detail-editor > div").addClass("d-flex");
        $(".master-group-card").show();
        if($("prev-page").hasClass("homepage") == false) {
            $(".prev-page").addClass("homepage");
        }
        if(groupEditOpened == true) {
            $(".group-editor").show();
        }
    }

});

$(".group-setting-bg").click(function (event) {
    //console.log(event.target);
    if ($(event.target).is(".group-card:not(:disabled) *") || $(event.target).is(".group-card:not(:disabled)")) {
        if ($(event.target).is(".group-card *")) {
            groupIndex = $(event.target).parents(".group-card").val();
        } else if ($(event.target).is(".group-card")) {
            groupIndex = $(event.target).val();
        }
        updateGroupDetail(false, true, -1, groups[groupIndex].name, groups[groupIndex].deadline);
        disableGroupEditor();

        $(".group-member-editor tbody").empty();
        $(".group-member-editor thead input").val("");
        for (let i = 0; i < groups[groupIndex].member.length; i++) {
            addMemberRow(true, i, groups[groupIndex].member[i].studentId, groups[groupIndex].member[i].name);
        }
        //$(".group-editor").show();
        $(".group-member-editor").show();
        if($(".import-group-desc").css("display") != "none") {
            $(".import-group-desc").slideUp();
        } else {
            $(".import-group-desc").hide();
        }
        
        if ($("html").innerWidth() <= 820) {
            $(".master-group-card").hide();
            $(".group-editor").show();
            $(".prev-page").removeClass("go-to-homepage");
        } else {
            $(".master-group-card").show();
            $(".group-editor").show();
            $(".prev-page").addClass("homepage");
        }
        groupEditOpened = true;
    } else if ($(event.target).is(".edit-member:not(:disabled) *") || $(event.target).is(".edit-member:not(:disabled)")) {
        var parentRow = $(event.target).parents("tr");
        var button = undefined;
        if ($(event.target).is(".edit-member *")) {
            button = $(event.target).parents(".edit-member");
        } else if ($(event.target).is(".edit-member")) {
            button = $(event.target);
        }

        if ($(button).val() == "edit") {
            enableMemberEditor(parentRow, false);
        } else if ($(button).val() == "save") {
            var memberIndex = $(button).attr("data-member-index");
            var stuId = $(parentRow).find("input:first").val().trim();
            var stuName = $(parentRow).find("input:eq(1)").val().trim();

            $(button).html('<i class="fas fa-sync-alt fa-spin"></i>');
            if (/[0-9]{11}/.test(stuId) && stuName.length > 0 && groups[groupIndex].member[memberIndex] != undefined) {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                    },
                    data: {
                        method: "update-member",
                        memberIndex: groups[groupIndex].member[memberIndex].userId,
                        studentId: stuId,
                        studentName: stuName,
                    },
                    success: function (response) {
                        //var data = JSON.parse(response);
                        //console.log(response);
                        if (response == groups[groupIndex].member[memberIndex].userId) {
                            groups[groupIndex].member[memberIndex].studentId = stuId;
                            groups[groupIndex].member[memberIndex].name = stuName;
                        } else {
                            alert("Error saving user data in database.");
                            updateMemberRow(parentRow, groups[groupIndex].member[memberIndex].studentId, groups[groupIndex].member[memberIndex].name);
                        }
                        disableMemberEditor(parentRow, false);
                    },
                });
            } else {
                alert("Error data not matching format. Student ID must be 11-digit number and Student Name cannot be empty.");
                $(button).html('<i class="fas fa-check"></i>');
                $(button).val("save");
            }
        }
    } else if ($(event.target).is(".add-member:not(:disabled) *") || $(event.target).is(".add-member:not(:disabled)")) {
        var parentRow = $(event.target).parents("tr");

        var button = undefined;
        if ($(event.target).is(".add-member *")) {
            button = $(event.target).parents(".add-member");
        } else if ($(event.target).is(".add-member")) {
            button = $(event.target);
        }

        var stuId = $(parentRow).find("input:first").val();
        var stuName = $(parentRow).find("input:eq(1)").val().trim();

        $(button).html('<i class="fas fa-sync-alt fa-spin"></i>');
        if (/[0-9]{11}/.test(stuId) && stuName.length > 0) {
            //search for both name and studentid (if name matched, it will be treated as adding same student)
            var searched = searchUser(true, stuId, stuName);
            var foundIndex = searched.index;
            var foundGroup = searched.group;

            if (foundIndex != -1) {
                //if insert already existed user, move that user into that group instead (note that name is fixed)
                if (foundGroup != groupIndex) {
                    var userId = 0;
                    if (foundGroup == -1) {
                        userId = noGroupUsers[foundIndex].userId;
                    } else {
                        userId = groups[foundGroup].member[foundIndex].userId;
                    }
                    $.ajax({
                        url: "./groupSetting/updateGroupMember.php",
                        type: "POST",
                        beforeSend: function () {
                            $(".group-setting-bg button").prop("disabled", true);
                        },
                        data: {
                            method: "move-member",
                            userId: userId,
                            groupId: groups[groupIndex].groupId,
                        },
                        success: function (response) {
                            //console.log(response);
                            if (response != undefined) {
                                if (foundGroup == -1) {
                                    groups[groupIndex].member.push(noGroupUsers[foundIndex]);
                                    noGroupUsers.splice(foundIndex, 1);
                                } else {
                                    groups[groupIndex].member.push(groups[foundGroup].member[foundIndex]);
                                    groups[foundGroup].member.splice(foundIndex, 1);
                                    updateMemberCount(foundGroup, groups[foundGroup].member.length);
                                }
                                updateMemberCount(groupIndex, groups[groupIndex].member.length);

                                $(button).html('<i class="fas fa-plus"></i>');
                                addMemberRow(false, groups[groupIndex].member.length - 1, stuId, stuName);
                            } else {
                                alert("Error moving user data into a new group in database.");
                            }
                            $(".group-setting-bg button").prop("disabled", false);
                        },
                    });
                } else {
                    alert("This student ID is already in this group.");
                    $(button).html('<i class="fas fa-plus"></i>');
                }
                clearMemberAdder();
            } else {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                    },
                    data: {
                        method: "insert-member",
                        studentId: stuId,
                        studentName: stuName,
                        groupId: groups[groupIndex].groupId,
                    },
                    success: function (response) {
                        //console.log(response);
                        var data = JSON.parse(response);
                        if (data.userId != undefined) {
                            $(button).html('<i class="fas fa-plus"></i>');
                            groups[groupIndex].member.push({ studentId: stuId, name: stuName, userId: data.userId });
                            updateMemberCount(groupIndex, groups[groupIndex].member.length);
                            addMemberRow(false, groups[groupIndex].member.length - 1, stuId, stuName);
                            clearMemberAdder();
                        } else {
                            alert("Error inserting user data into database.");
                        }
                        $(".group-setting-bg button").prop("disabled", false);
                    },
                });
            }
        } else {
            alert("Error data not matching format. Student ID must be 11-digit number and Student Name cannot be empty.");
            $(button).html('<i class="fas fa-plus"></i>');
        }
    } else if ($(event.target).is(".edit-group:not(:disabled) *") || $(event.target).is(".edit-group:not(:disabled)")) {
        //var parentRow = $(event.target).parents("tr");
        var button = undefined;
        if ($(event.target).is(".edit-group *")) {
            button = $(event.target).parents(".edit-group");
        } else if ($(event.target).is(".edit-group")) {
            button = $(event.target);
        }

        if ($(button).val() == "edit") {
            enableGroupEditor(false);
        } else if ($(button).val() == "save") {
            var groupName = $(".group-detail-editor .group-title").val().trim();
            var groupDeadline = $(".group-detail-editor .group-deadline[type=datetime-local]").val();

            $(button).html('<i class="fas fa-sync-alt fa-spin"></i>');
            //<i class="fas fa-sync-alt fa-spin"></i>
            if (groupName.length > 0) {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                    },
                    data: {
                        method: "update-group",
                        name: groupName,
                        deadline: groupDeadline.replace("T", " "),
                        groupId: groups[groupIndex].groupId,
                    },
                    success: function (response) {
                        //var data = JSON.parse(response);
                        //console.log(response);
                        if (response == groups[groupIndex].groupId) {
                            groups[groupIndex].name = groupName;
                            groups[groupIndex].deadline = groupDeadline;
                            updateGroupDetail(true, true, groupIndex, groupName, groupDeadline);
                        } else {
                            alert("Error updating group data in database.");
                            updateGroupDetail(true, false, -1, groupName, groupDeadline);
                        }
                        //$(".group-setting-bg button").prop("disabled", false);
                        disableGroupEditor();
                    },
                });
            } else {
                alert("Error saving info");
                $(button).html('<i class="fas fa-check"></i>');
                $(button).val("save");
            }
        } else if ($(button).val() == "add") {
            var groupName = $(".group-detail-editor .group-title").val().trim();
            var groupDeadline = $(".group-detail-editor .group-deadline[type=datetime-local]").val();
            $(".group-deadline[type=text]").val(visualizeDatetime(groupDeadline));

            $(button).html('<i class="fas fa-sync-alt fa-spin"></i>');
            //<i class="fas fa-sync-alt fa-spin"></i>
            if (groupName.length > 0) {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                    },
                    data: {
                        method: "insert-group",
                        name: groupName,
                        deadline: groupDeadline.replace("T", " "),
                    },
                    success: function (response) {
                        //var data = JSON.parse(response);
                        //console.log(response);
                        var data = JSON.parse(response);
                        if (data.groupId != undefined) {
                            groups.push({ name: groupName, deadline: groupDeadline, groupId: data.groupId, member: [] });
                            groupIndex = groups.length - 1;
                            addGroupCard(false, groupIndex, groups[groupIndex].name, groups[groupIndex].member.length, groups[groupIndex].deadline);
                            $(".group-member-editor").show();
                        } else {
                            alert("Error adding new group data in database.");
                        }
                        disableGroupEditor();
                    },
                });
            } else {
                alert("Error adding group");
                $(button).html('<i class="fas fa-check"></i>');
                $(button).val("add");
            }
        }
    } else if ($(event.target).is(".add-group:not(:disabled) *") || $(event.target).is(".add-group:not(:disabled)")) {
        enableGroupEditor(true);
    } else if ($(event.target).is(".delete-group:not(:disabled) *") || $(event.target).is(".delete-group:not(:disabled)")) {
        var button = undefined;
        if ($(event.target).is(".delete-group *")) {
            button = $(event.target).parents(".delete-group");
        } else if ($(event.target).is(".delete-group")) {
            button = $(event.target);
        }

        if ($(button).val() == "cancel-add") {
            $(".group-editor").hide();
            $(button).val("delete");
            groupEditOpened = false;
            $(".master-group-card").show();
            if ($("html").innerWidth() <= 820) {
                if($("prev-page").hasClass("homepage") == false) {
                    $(".prev-page").addClass("homepage");
                }
            }
        } else if ($(button).val() == "cancel-edit") {
            updateGroupDetail(false, true, -1, groups[groupIndex].name, groups[groupIndex].deadline);
            disableGroupEditor();
        } else {
            //$(".confirm-commit").modal("show");
            //objectToDelete = { object: "group", index: groupIndex };
            if(confirm("Confirm deleting group? Members will not be deleted.") == true) {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                        $(".delete-group").html('<i class="fas fa-sync-alt fa-spin"></i>');
                    },
                    data: { method: "delete-group", groupId: groups[groupIndex].groupId },
                    success: function (response) {
                        //console.log(response);
                        if (response == 1) {
                            noGroupUsers = noGroupUsers.concat(groups[groupIndex].member);
                            groups.splice(groupIndex, 1);
                            $(".group-card[value=" + groupIndex + "]").remove();
                            $(".group-editor").hide();
                            $(".group-card").each(function () {
                                if ($(this).val() > groupIndex) {
                                    $(this).val($(this).val() - 1);
                                }
                            });
                        } else {
                            alert("Error deleting group in database");
                        }
                        $(".delete-group").html('<i class="fas fa-times"></i>');
                        $(".group-setting-bg button").prop("disabled", false);
                        //objectToDelete = {};
                    },
                });
            }
        }
    } else if ($(event.target).is(".delete-member:not(:disabled) *") || $(event.target).is(".delete-member:not(:disabled)")) {
        var button = undefined;
        if ($(event.target).is(".delete-member *")) {
            button = $(event.target).parents(".delete-member");
        } else if ($(event.target).is(".delete-member")) {
            button = $(event.target);
        }
        var memberIndex = $(button).attr("data-member-index");

        if ($(button).val() == "cancel-edit") {
            var parentRow = $(event.target).parents("tr");
            updateMemberRow(parentRow, groups[groupIndex].member[memberIndex].studentId, groups[groupIndex].member[memberIndex].name);
            disableMemberEditor(parentRow, false);
        } else {
            //objectToDelete = { object: "member", group: groupIndex, member: memberIndex };
            //$(".confirm-commit").modal("show");
            if(confirm("Confirm removing member from the group?") == true) {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                        $(".delete-group").html('<i class="fas fa-sync-alt fa-spin"></i>');
                    },
                    data: {
                        method: "delete-member",
                        userId: groups[groupIndex].member[memberIndex].userId,
                        groupId: groups[groupIndex].groupId,
                    },
                    success: function (response) {
                        //console.log(response);
                        if (response == 1) {
                            noGroupUsers.push(groups[groupIndex].member[memberIndex]);
                            groups[groupIndex].member.splice(memberIndex, 1);
                            updateMemberCount(groupIndex, groups[groupIndex].member.length);
                            $(".delete-member[data-member-index=" + memberIndex + "]")
                                .parents("tr")
                                .remove();
                            $(".group-member-editor tbody > tr").each(function () {
                                if ($(this).attr("data-member-index") > memberIndex) {
                                    $(this).attr("data-member-index", $(this).attr("data-member-index") - 1);
                                }
                            });
                        } else {
                            alert("Error removing member from the group");
                        }
                        //objectToDelete = {};
                        $(".delete-group").html('<i class="fas fa-times"></i>');
                        $(".group-setting-bg button").prop("disabled", false);
                    },
                });
            }
        }
    }
});

$(".group-editor table").keyup(function (event) {
    if ($(event.target).is("tr > td:first-child input")) {
        var parentRow = $(event.target).parents("tr");
        var stuId = $(parentRow).find("input:first").val();
        var priorHTML = $(parentRow).find("button").html();
        enableMemberEditor(parentRow, true);

        if (/[0-9]{11}/.test(stuId)) {
            $(parentRow).find("input").prop("readonly", true);
            $(parentRow).find("button").html('<i class="fas fa-sync-alt fa-spin"></i>');

            var searched = searchUser(false, stuId, "");
            var foundGroup = searched.group;
            var foundIndex = searched.index;
            if (foundIndex != -1) {
                var stuName = "";
                if (foundGroup != -1) {
                    stuName = groups[foundGroup].member[foundIndex].name;
                } else {
                    stuName = noGroupUsers[foundIndex].name;
                }
                updateMemberRow(parentRow, stuId, stuName);
                disableMemberEditor(parentRow, true);
            }

            $(parentRow).find("input").prop("readonly", false);
            $(parentRow).find("button").html(priorHTML);
        }
    }
});

$(".group-detail-editor .master-deadline").click(function () {
    if ($(".edit-group").val() == "save" || $(".edit-group").val() == "add") {
        document.querySelector(".group-deadline[type=datetime-local]").showPicker();
    }
});

$(".group-detail-editor .group-deadline[type=datetime-local]").on("input", function () {
    $(".group-deadline[type=text]").val(visualizeDatetime($(this).val()));
});

$(".prev-page").click(function() {
    if($(this).hasClass("go-to-homepage") == true) {
        $(".prev-page").addClass("homepage");
    }
    if($(this).hasClass("homepage") == false) {
        if ($("html").innerWidth() <= 820) {
            $(".group-setting-bg button").prop("disabled", false);
            $(".master-group-card").show();
            $(".group-editor").hide();
            $(".prev-page").addClass("go-to-homepage");
        } else {
            $(".master-group-card").show();
            $(".group-editor").show();
            $(".prev-page").addClass("homepage");
        }
        groupEditOpened = false;
    }
});

$("input[name=fileInput]").change(function() {
    var file = $(this)[0].files[0]; //uploaded file object
    var fileDetail = file.name.split('.');
    var extension = fileDetail[fileDetail.length - 1].toLowerCase().trim();

    if (importedObj == "member" && $(this).val() != "" && (extension == 'csv' || extension == 'txt')) {
        if (confirm("Confirm importing member data from file:" + file.name + " into group:" + groups[groupIndex].name + "?")) {
            var reader = new FileReader();  
            reader.readAsText(file);
            reader.onload = function(event) {
                var content = event.target.result.replace(/"/g, "");
                var userRow = content.split("\n");
                var importedData = [];
                for (row of userRow) {
                    var userDetail = row.split(',');
                    if(userDetail.length == 2) {
                        var stuId = userDetail[0].trim();
                        var stuName = userDetail[1].trim();
                        if (/[0-9]{11}/.test(stuId) == true && stuId.length == 11) {
                            var checkExist = searchUser(false, stuId);
                            var userId = -1;
                            if(checkExist.group == -1 && checkExist.index != -1) {
                                userId = noGroupUsers[checkExist.index].userId;
                            } else if (checkExist.group != -1 && checkExist.index != -1) {
                                userId = groups[checkExist.group].member[checkExist.index].userId;
                            }
                            if((checkExist.group != groupIndex && checkExist.index != -1) || checkExist.index == -1) {
                                importedData.push({userId: userId, stuId: stuId, name: stuName});
                            }
                        };
                    }
                }

                if (importedData.length > 0) {
                    if(confirm(importedData.length + " out of " + userRow.length + "rows are valid user data. Import?") == true) {
                        //console.log(importedData);
                        $.ajax({
                            url: "./groupSetting/updateGroupMember.php",
                            type: "POST",
                            data: {method: "import-member", member: importedData, groupIndex: groups[groupIndex].groupId},
                            beforeSend: function() {
                                $(".group-setting-bg button").prop("disabled", true);
                            },
                            success: function (response) {
                                //console.log(response);
                                $("input[name=fileInput]").val('');
                                $(".group-setting-bg button").prop("disabled", false);
                                var movedUser = importedData.filter(function(x){return x.userId != -1});
                                for (row of movedUser) {
                                    var search = searchUser(false, row.stuId);
                                    var foundGroup = search.group;
                                    var foundIndex = search.index;

                                    if (foundGroup != -1 && foundIndex != -1) {
                                        groups[foundGroup].member[foundIndex].name = row.name;
                                        groups[foundGroup].member.splice(foundIndex, 1);
                                    } else if (foundGroup == -1 && foundIndex != -1) {
                                        noGroupUsers[foundIndex].name = row.name;
                                        noGroupUsers.splice(foundIndex, 1);
                                    }
                                    
                                    groups[groupIndex].member.push(groups[foundGroup].member[foundIndex]);
                                    
                                    updateMemberCount(foundGroup, groups[foundGroup].member.length);
                                    updateMemberCount(groupIndex, groups[groupIndex].member.length);
                                    addMemberRow(false, groups[groupIndex].member.length - 1, row.stuId, row.name);
                                }
                                var data = JSON.parse(response);
                                if(data.newUsers != undefined && data.newUsers.length > 0) {
                                    for(let i = 0; i < data.newUsers.length; i++) {
                                        addMemberRow(false, groups[groupIndex].member.length + i, data.newUsers[i].studentId, data.newUsers[i].name);
                                    }   
                                    groups[groupIndex].member = groups[groupIndex].member.concat(data.newUsers);
                                    updateMemberCount(groupIndex, groups[groupIndex].member.length);
                                }
                            },
                        });
                    }
                }
            }
        }
    } else if (importedObj == "group" && $(this).val() != "" && extension == 'csv'){
        if (confirm("Confirm importing group data from file:" + file.name + "?")) {
            var reader = new FileReader();  
            reader.readAsText(file);
            reader.onload = function(event) {
                var content = event.target.result.replace(/"/g, "");
                var userRow = content.split("\n");
                var importedData = [];
                for (row of userRow) {
                    var userDetail = row.split(',');
                    if(userDetail.length == 3) {
                        var groupName = userDetail[0].trim();
                        var stuId = userDetail[1].trim();
                        var stuName = userDetail[2].trim();
                        var group_id = importedData.findIndex(function(x){
                            return x.name.toLowerCase().trim() == groupName.toLowerCase().trim();
                        });

                        if (/[0-9]{11}/.test(stuId) == true && stuId.length == 11) {
                            if(group_id == -1) {
                                var group_dbId = groups.findIndex(function(x){
                                    return x.name.toLowerCase().trim() == groupName.toLowerCase().trim();
                                });
                                var exist = group_dbId;
                                if (group_dbId != -1) {
                                    group_dbId = groups[group_dbId].groupId;
                                }
                                importedData.push({groupId: group_dbId, exist: exist, name: groupName, member: []});
                                group_id = importedData.length - 1;
                            }

                            var checkExist = searchUser(false, stuId);
                            var userId = -1;
                            if(checkExist.group == -1 && checkExist.index != -1) {
                                userId = noGroupUsers[checkExist.index].userId;
                            } else if (checkExist.group != -1 && checkExist.index != -1) {
                                userId = groups[checkExist.group].member[checkExist.index].userId;
                            }
                            importedData[group_id].member.push({userId: userId, stuId: stuId, name: stuName});
                        };
                    }
                }

                if (importedData.length > 0) {
                    if(confirm(importedData.length + "groups found. Import?") == true) {
                        importedData.sort(function(a, b){return a.name.toLowerCase().trim().localeCompare(b.name.toLowerCase().trim())});
                        //console.log(importedData);
                        $.ajax({
                            url: "./groupSetting/updateGroupMember.php",
                            type: "POST",
                            data: {method: "import-group", group: importedData},
                            beforeSend: function() {
                                $(".group-setting-bg button").prop("disabled", true);
                            },
                            success: function (response) {
                                //console.log(response);
                                $(".group-setting-bg button").prop("disabled", false);
                                $("input[name=fileInput]").val('');
                                $(".master-group-card").show();
                                $(".group-editor").hide();
                                groupEditOpened = false;

                                var data = JSON.parse(response);
                                if(data.group != undefined && data.group.length > 0) {
                                    for (let i = 0 ; i < data.group.length; i++) {
                                        var group_id = - 1;
                                        if(data.group[i].exist == -1) {
                                            groups.push({ name: data.group[i].name, deadline: '', groupId: data.group[i].groupId, member: [] });
                                            group_id = groups.length - 1;
                                            addGroupCard(false, group_id, groups[group_id].name, groups[group_id].member.length, groups[group_id].deadline);
                                        } else {
                                            group_id = data.group[i].exist;
                                        }
                                        if(group_id != -1) {
                                            for (let j = 0 ; j < data.group[i].member.length; j++) {
                                                var search = searchUser(false, data.group[i].member[j].studentId);
                                                var foundGroup = search.group;
                                                var foundIndex = search.index;
                                                if (foundGroup != -1 && foundIndex != -1) {
                                                    groups[foundGroup].member[foundIndex].name = data.group[i].member[j].name;
                                                    groups[foundGroup].member.splice(foundIndex, 1);
                                                    updateMemberCount(foundGroup, groups[foundGroup].member.length);
                                                } else if (foundGroup == -1 && foundIndex != -1) {
                                                    noGroupUsers[foundIndex].name = data.group[i].member[j].name;
                                                    noGroupUsers[foundIndex].splice(foundIndex, 1);
                                                }
                                            }
                                            groups[group_id].member = groups[group_id].member.concat(data.group[i].member);
                                            updateMemberCount(group_id, groups[group_id].member.length);
                                        }
                                    }
                                }
                            },
                        });
                    }
                }
            }
        }
    }
});

/*
$(".confirm-commit .modal-footer button").click(function () {
    var commit = $(this).val() == "1";
    if (commit == true) {
        if (JSON.stringify(objectToDelete) != "{}") {
            if (objectToDelete.object == "group") {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                        $(".delete-group").html('<i class="fas fa-sync-alt fa-spin"></i>');
                    },
                    data: { method: "delete-group", groupId: groups[objectToDelete.index].groupId },
                    success: function (response) {
                        //console.log(response);
                        if (response == 1) {
                            noGroupUsers = noGroupUsers.concat(groups[objectToDelete.index].member);
                            groups.splice(objectToDelete.index, 1);
                            $(".group-card[value=" + objectToDelete.index + "]").remove();
                            $(".group-editor").hide();
                            $(".group-card").each(function () {
                                if ($(this).val() > objectToDelete.index) {
                                    $(this).val($(this).val() - 1);
                                }
                            });
                        } else {
                            alert("Error deleting group in database");
                        }
                        $(".delete-group").html('<i class="fas fa-times"></i>');
                        $(".group-setting-bg button").prop("disabled", false);
                        objectToDelete = {};
                    },
                });
            } else if (objectToDelete.object == "member") {
                $.ajax({
                    url: "./groupSetting/updateGroupMember.php",
                    type: "POST",
                    beforeSend: function () {
                        $(".group-setting-bg button").prop("disabled", true);
                        $(".delete-group").html('<i class="fas fa-sync-alt fa-spin"></i>');
                    },
                    data: {
                        method: "delete-member",
                        userId: groups[objectToDelete.group].member[objectToDelete.member].userId,
                        groupId: groups[objectToDelete.group].groupId,
                    },
                    success: function (response) {
                        //console.log(response);
                        if (response == 1) {
                            noGroupUsers.push(groups[objectToDelete.group].member[objectToDelete.member]);
                            groups[objectToDelete.group].member.splice(objectToDelete.member, 1);
                            updateMemberCount(objectToDelete.group, groups[objectToDelete.group].member.length);
                            $(".delete-member[data-member-index=" + objectToDelete.member + "]")
                                .parents("tr")
                                .remove();
                            $(".group-member-editor tbody > tr").each(function () {
                                if ($(this).attr("data-member-index") > objectToDelete.member) {
                                    $(this).attr("data-member-index", $(this).attr("data-member-index") - 1);
                                }
                            });
                        } else {
                            alert("Error removing member from the group");
                        }
                        objectToDelete = {};
                        $(".delete-group").html('<i class="fas fa-times"></i>');
                        $(".group-setting-bg button").prop("disabled", false);
                    },
                });
            }
        }
    }
});
*/
