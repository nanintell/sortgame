<head>
    <link rel="stylesheet" href="./groupSetting/groupSetting.css">
    <script src="./groupSetting/groupSetting.js"></script>
</head>

<div class="mb-3">
    <button type="button" class="btn btn-danger prev-page homepage">Back</button>
    <button type="button" class="btn btn-secondary float-right mx-3" data-toggle="modal" data-target="#groupTutorial"><i class="fas fa-question"></i></button>
</div>

<form>
    <input type="file" name="fileInput" style="display:none;">
</form>

<p class="ml-3 import-group-desc" style="display:none;">Tip on importing groups: We only accept a csv file or csv-formatted txt file 
    which data is separated by commas and contain 3 columns which the first column is group name, 
    the second one is member's student id and the other one is member's name. 
    Note that, you need to set deadline manually.</p>
<div class="group-setting-bg row p-3">
    <div class="col-sm-3 p-3 bg-dark master-group-card overflow-auto">
        <button type="button" class="btn btn-secondary btn-block group-card">
            <div class="p-3">
                <h3 class="font-weight-bold">Group A</h3>
                <h5><span class="font-weight-bold">Member: </span>50</h5>
                <h5><span class="font-weight-bold">Deadline: </span>16/2/2566</h5>
            </div>
        </button>
        <button type="button" class="btn btn-secondary btn-block group-card" value="1">
            <div class="p-3">
                <h3 class="font-weight-bold">Group A</h3>
                <h5><span class="font-weight-bold">Member: </span>50</h5>
                <h5><span class="font-weight-bold">Deadline: </span>16/2/2566</h5>
            </div>
        </button>
        <button type="button" class="btn btn-secondary btn-block group-card" value="2">
            <div class="p-3">
                <h3 class="font-weight-bold">Group A</h3>
                <h5><span class="font-weight-bold">Member: </span>50</h5>
                <h5><span class="font-weight-bold">Deadline: </span>16/2/2566</h5>
            </div>
        </button>
        <button type="button" class="btn btn-secondary btn-block group-card" value="3">
            <div class="p-3">
                <h3 class="font-weight-bold">Group A</h3>
                <h5><span class="font-weight-bold">Member: </span>50</h5>
                <h5><span class="font-weight-bold">Deadline: </span>16/2/2566</h5>
            </div>
        </button>
        <button type="button" class="btn btn-secondary btn-block group-card" value="4">
            <div class="p-3">
                <h3 class="font-weight-bold">Group A</h3>
                <h5><span class="font-weight-bold">Member: </span>50</h5>
                <h5><span class="font-weight-bold">Deadline: </span>16/2/2566</h5>
            </div>
        </button>
    </div>
    <div class="col-sm-9 px-3 group-editor">
        <button type="button" class="btn btn-secondary import-member mr-2" 
            onclick="$('input[name=fileInput]')[0].click();importedObj = 'member';"
            onmouseover="$('.import-member-desc').slideDown();"
            title="We only accept csv file with 2 columns which the first column is student ID and the other one is student's name.">
            <i class="fas fa-file-import"></i>
        </button>
        <p class="import-member-desc" style="display:none;">Tip on importing members: 
            We only accept csv file or csv-format text file which data is separated by commas 
            and has 2 columns which the first column is student ID 
            and the other one is student's name.</p>
        <div class="mb-3 card group-detail-editor">
            <div class="d-flex justify-content-between">
                <div class="form-inline">
                    <label class="mr-2">Name</label>
                    <input type="text" readonly class="form-control-plaintext group-title" value="group title">
                </div>
                <div class="form-inline">
                    <label class="mr-2">Deadline</label>
                    <div class="input-group master-deadline">
                        <input type="text" readonly class="form-control-plaintext group-deadline" disabled>
                        <input type="datetime-local" readonly class="form-control-plaintext group-deadline">
                    </div>
                </div>
                <div>
                    <button type="button" class="btn btn-secondary edit-group mr-4" value="edit"><i
                            class="fas fa-edit"></i></button>
                    <button type="button" class="btn btn-secondary delete-group" value="delete"><i
                            class="fas fa-times"></i></button>
                </div>
            </div>
        </div>
        <div class="overflow-auto group-member-editor">
            <table class="table table-secondary table-striped table-bordered table-hover table-responsive">
                <thead>
                    <tr>
                        <th scope="col">Student Id</th>
                        <th scope="col">Name</th>
                        <th scope="col" colspan="2"></th>
                    </tr>
                    <tr>
                        <td><input type="text" class="form-control" pattern="[0-9{11}]"></td>
                        <td><input type="text" class="form-control"></td>
                        <td colspan="2"><button type="button" class="btn btn-secondary btn-block add-member"><i
                                    class="fas fa-plus"></i></button></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="text" class="form-control" pattern="[0-9{11}]"></td>
                        <td><input type="text" class="form-control"></td>
                        <td><button type="button" class="btn btn-secondary btn-block add-member"><i
                                    class="fas fa-plus"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- confirmation modal -->
<!--
<div class="modal fade confirm-commit">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-secondary">
            <div class="modal-header">
                <h5 class="modal-title">This action cannot be undone. Confirm Delete?</h5>
            </div>
            <div class="modal-body">
                <p>Press "Yes" to delete or press "No" to cancel.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success btn-lg" data-dismiss="modal" value="1">Yes</button>
                <button type="button" class="btn btn-danger btn-lg" data-dismiss="modal" value="0">No</button>
            </div>
        </div>
    </div>
</div>
-->

<div class="modal fade" id="groupTutorial" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div class="modal-content bg-dark">
            <div class="modal-header">
                <h3 class="modal-title">How to use Team Setting page</h3>
                <button type="button" class="close" data-dismiss="modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                You can view detail of a group by clicking its card which shows name, deadline and number of members. </br>
                    
                <div class="my-3">
                    <img src="./groupSetting/openGroup.gif" class="mb-3" style="width:100%;">
                </div>

                Once you see, the detail of the group, you can change name and deadline with 
                <button type="button" class="btn btn-secondary"><i class="fas fa-edit"></i></button> and delete group with 
                <button type="button" class="btn btn-secondary"><i class="fas fa-times"></i></button> on the section above the table (Group Detail Editor). 
                Deleting group won't delete its former members. </br>

                <div class="my-3">
                    <img src="./groupSetting/editGroup.gif" style="width:100%;">
                </div>

                You can also add new group by clicking <button type="button" class="btn btn-secondary"><i class="fas fa-plus"></i></button> 
                then a section like group detail editor will appear. You must input at least name of the group then 
                click check button to create a new group. You can also cancel by clicking 
                <button type="button" class="btn btn-secondary"><i class="fas fa-times"></i></button> </br>

                <div class="my-3">
                    <img src="./groupSetting/addGroup.gif" class="mb-3" style="width:100%;">
                    <img src="./groupSetting/deleteGroup.gif" style="width:100%;">
                </div>

                In the table below group detail editor, it shows players in the group. You can edit name of a player by clicking 
                <button type="button" class="btn btn-secondary"><i class="fas fa-edit"></i></button> on his row or remove that player from the group by 
                clicking <button type="button" class="btn btn-secondary"><i class="fas fa-times"></i></button> on the same row. 
                Removing a player won't delete his data. </br>

                <div class="my-3">
                    <img src="./groupSetting/editMember.gif" class="mb-3" style="width:100%;">
                    <img src="./groupSetting/deleteMember.gif" style="width:100%;">
                </div>

                You can also add a player to the group by filling Student Id and Name of the player in the second row of the table. 
                If inputted Student Id already exists, the name section will be automatically filled. Once you are done, click 
                <button type="button" class="btn btn-secondary"><i class="fas fa-plus"></i></button> to add member to the table.

                <div class="my-3">
                    <img src="./groupSetting/addMember.gif" style="width:100%;">
                </div>

                You can import groups using csv file 
                <a href="./groupSetting/groupImportEx.csv">(example file or an image shown in the first picture below)</a> 
                by clicking 
                <button type="button" class="btn btn-secondary"><i class="fas fa-file-import"></i></button> next to a button for adding group.
                However, if you import existed group, the membes of that group 
                will be appended to it. You can also import members into groups by using csv file 
                <a href="./groupSetting/memberImportEx.csv">(example file or an image shown in the second picture below)</a>  
                by clicking 
                <button type="button" class="btn btn-secondary"><i class="fas fa-file-import"></i></button> above group detail editor section </br>

                <div class="my-3">
                    <img src="./groupSetting/groupFormat.PNG" class="mb-3" style="width:100%;">
                    <img src="./groupSetting/memberFormat.PNG" style="width:100%;">
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>