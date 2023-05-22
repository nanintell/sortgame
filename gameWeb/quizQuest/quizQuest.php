<head>
    <link rel="stylesheet" href="./storyQuest/storyQuest.css">
    <link rel="stylesheet" href="./quizQuest/quizQuest.css">
    <script src="./quizQuest/quizQuest.js"></script>
</head>

<div class="story-background">
    <div class="log-buttons">
        <button type="button" class="btn btn-secondary float-right mx-3" data-toggle="modal" data-target="#quizTutorial"><i class="fas fa-question"></i></button>
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
    <div class="quiz-dialogue bg-dark">
        <p>
            <span class="font-weight-bold"> 1 </span>
            Tell me how to do bubble sort.
        </p>
        <div class="form-row justify-content-center">
            <div class="col-sm-2">
                <label>1</label>
                <select class="form-control">
                    <option value="">A</option>
                    <option value="">B</option>
                    <option value="">C</option>
                    <option value="">D</option>
                </select>
            </div>
            <div class="col-sm-2">
                <label>2</label>
                <select class="form-control">
                    <option value="">A</option>
                    <option value="">B</option>
                    <option value="">C</option>
                    <option value="">D</option>
                </select>
            </div>
            <div class="col-sm-2">
                <label>3</label>
                <select class="form-control">
                    <option value="">A</option>
                    <option value="">B</option>
                    <option value="">C</option>
                    <option value="">D</option>
                </select>
            </div>
            <div class="col-sm-2">
                <label>4</label>
                <select class="form-control">
                    <option value="">A</option>
                    <option value="">B</option>
                    <option value="">C</option>
                    <option value="">D</option>
                </select>
            </div>
            <div class="col-sm-2">
                <button type="button" class="btn btn-secondary w-100" value="done">Done</button>
            </div>
        </div>
    </div>    
</div>

<!-- Result Modal -->
<div class="modal fade" id="quizModal" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content bg-success">
            <div class="modal-header justify-content-center">
                <h3>Result</h3>
            </div>
            <div class="modal-body">
                Exp obtained: <span class="exp-obtained"></span> <br>
                Score obtained: <span class="score-obtained"></span> <br>
                Stars: 
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-lg btn-warning btn-block" value="retry">Retry</button>
                <button type="button" class="btn btn-lg btn-danger btn-block" value="back-quest" data-quest-category="">Retreat</button>
            </div>
        </div>
  </div>
</div>

<div class="modal fade" id="quizTutorial" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div class="modal-content bg-dark">
            <div class="modal-header">
                <h3 class="modal-title">How to play Quiz Quest</h3>
                <button type="button" class="close" data-dismiss="modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <!-- How to use -->
                <b>How to play</b> </br>
                Choose the correct answer of each dropdown then click 
                <button type="button" class="btn btn-secondary">Done</button> 
                to submit answer(s) and preceed to next question. </br>

                <div class="my-3">
                    <img src="./quizQuest/quizPlay.gif" class="mb-2" style="width:100%;">
                    <img src="./quizQuest/quizDropdown.PNG" style="width:100%;">
                </div>
                
                <!-- Result -->
                <b>Finishing and Result</b> </br>
                After submitting answer(s) of last question, a modal containing EXP, score, stars and unlocked contents will appear. </br>

                <div class="my-3">
                    <img src="./quizQuest/quizResult.PNG" style="width:100%;">
                </div>

                <!-- Evaluation + Stars -->
                <b>Score, Stars and EXP</b> </br>
                For this quest type, the score is calculated from how many dropdowns you answer correctly and stars 
                (initially, <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>) 
                are determined as follows. </br>
                If your score is more than 25 points, the first star will turn into yellow like this. 
                <i class="fas fa-star text-warning"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> </br>
                If your score is more than 50 points, the second star will also turn into yellow. 
                <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> <i class="fas fa-star"></i> </br>
                If your score is 100 points or perfect score, the third star will also turn into yellow. 
                <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> </br>
                You will also receive EXP equal to the amount stated in the quest description, 
                which you can view in Quest List, plus half of your score. 
                However, if this is not the first time you play this quest, you will receive half of EXP.</br></br>

                <!-- Rewards and unlock content -->
                <b>Unlocked Contents</b> </br>
                In this quest type, you may unlock new quest(s) if your score exceeds 50 points or gets 2 or 3 stars.</br>

                <div class="my-3">
                    <img src="./quizQuest/quizResult_unlocked.PNG" style="width:100%;">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>