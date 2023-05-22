<head>
    <link rel="stylesheet" href="./storyQuest/storyQuest.css">
    <script src="./storyQuest/storyQuest.js"></script>
</head>

<div class="story-background">
    <div class="log-buttons">
        <button type="button" class="btn btn-light float-right" value="open-log">Log</button>
        <button type="button" class="btn btn-secondary float-right mx-3" data-toggle="modal" data-target="#storyTutorial"><i class="fas fa-question"></i></button>
    </div>
    <div class="justify-content-center mobile-story-image">
        <img class="story-image" src="../storyPic/insertAnimation.gif">
    </div>
    <div class="sprite-image row mx-0">
        <div class="col-sm-3 d-flex justify-content-center">
            <img src="../spritePics/alcor.png">
        </div>
        <div class="col-sm-6 justify-content-center">
            <img class="story-image" src="../storyPic/insertAnimation.gif">
        </div>
        <div class="col-sm-3 d-flex justify-content-center">
            <img src="../spritePics/evanF5.png">
        </div>
    </div>
    <div class="dialogue bg-dark">
        <!--<p>
        </p>-->
    </div>

    
</div>

<!-- log window -->
<!-- need js to size this div (so that width and height are equal to story-background) -->
<div class="log-window" style="display:none;overflow-y:scroll;">
    <div class="log-buttons">
        <button type="button" class="btn btn-light float-right" value="close-log">Close</button>
    </div>
    <div class="log-text w-75 mx-auto text-light">
        <p>
            <span class="font-weight-bold">Evan </br></span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </p>
        <img src="../storyPic/insertAnimation.gif" class="col-sm-6 mb-3">
        <p>
            <span class="font-weight-bold">Evan </br></span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </p>
    </div>
</div>

<!-- Result Modal -->
<div class="modal fade" id="storyModal" data-backdrop="static">
  <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
    <div class="modal-content bg-success">
        <div class="modal-header justify-content-center">
            <h3>Story Ended</h3>
        </div>
        <div class="modal-body">
        	Exp obtained: <span class="exp-obtained"></span> <br>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-lg btn-warning btn-block" value="open-log">Log</button>
            <button type="button" class="btn btn-lg btn-danger btn-block" value="library-quest">Library</button>
            <button type="button" class="btn btn-lg btn-danger btn-block" value="back-quest" data-quest-category="">Retreat</button>
        </div>
    </div>
  </div>
</div>

<div class="modal fade" id="storyTutorial" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div class="modal-content bg-dark">
            <div class="modal-header">
                <h3 class="modal-title">How to play Story Quest</h3>
                <button type="button" class="close" data-dismiss="modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <!--How to use -->
                <b>How to play</b> </br>
                Click the screen anywhere, except <button type="button" class="btn btn-light">Log</button> and 
                <button type="button" class="btn btn-secondary"><i class="fas fa-question"></i></button> to continue story. </br>
                You can click Log button to see previous lines and pictures and close it with <button type="button" class="btn btn-light">Close</button> </br>
                If you click the screen after you have reached the last line, you finish this quest. </br>

                <div class="my-3">
                    <img src="./storyQuest/storyPlay.gif" class="mb-2" style="width:100%;">
                    <img src="./storyQuest/logScreen.PNG" style="width:100%;">
                </div>

                <!-- Result -->
                <b>Finishing and Result</b> </br>
                After you finish this quest, a modal containing EXP and unlocked contents will appear. 
                You can also view Log from this modal with <button type="button" class="btn btn-warning">Log</button> 
                and return to Quest List with <button type="button" class="btn btn-danger">Retreat</button></br>

                <div class="my-3">
                    <img src="./storyQuest/resultModal.PNG" style="width:100%;">
                </div>

                <!-- Evaluation + Stars -->
                <b>Score, Stars and EXP</b> </br>
                For this quest type, the score is fixed to 100 and 3 stars  
                (<i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i>).
                Thus, they are not shown. You will also receive EXP as equal as the amount stated in 
                the quest description which you can view in Quest List. 
                However, if this is not the first time you play this quest, you will receive half of EXP.</br></br>

                <!-- Rewards and unlock content -->
                <b>Unlocked Contents</b> </br>
                In this quest type, you may unlock new quest(s), skill(s), character(s) or library content(s). </br>
                If there is a new library content unlocked from finishing this quest, <button type="button" class="btn btn-danger">Retreat</button> 
                will be changed to <button type="button" class="btn btn-danger">Library</button> instead and clicking it will direct you to Library instead.</br>

                <div class="my-3">
                    <img src="./storyQuest/resultModal_unlocked.PNG" style="width:100%;">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>