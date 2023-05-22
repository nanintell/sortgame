<head>
    <link rel="stylesheet" href="./battleGameplay/battleGameplay.css">
    <script src="./battleGameplay/battleGameplay.js"></script>
</head>

<div class="row battle-bg">
    <div class="col-sm-4 background-battle">
        <div class="p-3">
            <table class="table table-hover table-info table-striped">
                <thead>
                    <tr>
                        <th scope="col">Compare Log</th>
                    </tr>
                </thead>
                <tbody class="compare-log">
                </tbody>
            </table>
        </div>
    </div> <!-- background image and compare log-->
    <div class="col-sm-4">
        <div class="menu d-flex align-items-center justify-content-end mr-1">
            <button type="button" class="btn btn-dark wave-number">Wave 0</button>
            <button type="button" class="btn btn-primary turn-owner" style="display:none;">Player Turn</button>
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#battleTutorial"><i
                    class="fas fa-question"></i></button>
            <button type="button" class="btn btn-secondary battle-setting" data-toggle="modal"
                data-target=".setting-modal"><i class="fas fa-cog"></i></button>
            <button type="button" class="btn btn-light logmodal-button" data-toggle="modal" data-target="#logModal"><i
                    class="fas fa-history"></i></button>
            <button type="button" class="btn btn-light" data-toggle="modal" data-target="#menuModal"><i
                    class="fas fa-bars"></i></button>
        </div>
        <div class="mobs d-flex align-items-center">
            <div class="d-flex justify-content-around" style="width:100%;">
                <div class="mob-sprite">
                    <p class="dmg-hit">0</p>
                    <div class="border border-dark col-sm-11 px-0 bg-dark" style="width:100%;height:10%;">
                        <div class="hp bg-success" data-hp-now=80 style="width:80%;height:100%;"></div>
                    </div>
                    <img src="./battleGameplay/mobSample.png" width="100%">
                    <div class="mob-dmg"></div>
                </div>
                <div class="mob-sprite">
                    <p class="dmg-hit">0</p>
                    <div class="border border-dark col-sm-11 px-0 bg-dark" style="width:100%;height:10%;">
                        <div class="hp bg-success" data-hp-now=80 style="width:80%;height:100%;"></div>
                    </div>
                    <img src="./battleGameplay/mobSample.png" width="100%">
                    <div class="mob-dmg"></div>
                </div>
                <div class="mob-sprite">
                    <p class="dmg-hit">0</p>
                    <div class="border border-dark col-sm-11 px-0 bg-dark" style="width:100%;height:10%;">
                        <div class="hp bg-success" data-hp-now=80 style="width:80%;height:100%;"></div>
                    </div>
                    <img src="./battleGameplay/mobSample.png" width="100%">
                    <div class="mob-dmg"></div>
                </div>
                <div class="mob-sprite">
                    <p class="dmg-hit">0</p>
                    <div class="border border-dark col-sm-11 px-0 bg-dark" style="width:100%;height:10%;">
                        <div class="hp bg-success" data-hp-now=80 style="width:80%;height:100%;"></div>
                    </div>
                    <img src="./battleGameplay/mobSample.png" width="100%">
                    <div class="mob-dmg"></div>
                </div>
                <div class="mob-sprite">
                    <p class="dmg-hit">0</p>
                    <div class="border border-dark col-sm-11 px-0 bg-dark" style="width:100%;height:10%;">
                        <div class="hp bg-success" data-hp-now=80 style="width:80%;height:100%;"></div>
                    </div>
                    <img src="./battleGameplay/mobSample.png" width="100%">
                    <div class="mob-dmg"></div>
                </div>
            </div>
        </div>
        <div class="stat d-flex flex-column">
            <div class="row player-char mx-0">
                <div class="col-sm-4 px-0">
                    <p class="dmg-hit">0</p>
                    <div class="bg-secondary border border-dark char-card">A</div>
                </div>
                <div class="col-sm-4 px-0">
                    <p class="dmg-hit">0</p>
                    <div class="bg-secondary border border-dark char-card">B</div>
                </div>
                <div class="col-sm-4 px-0">
                    <p class="dmg-hit">0</p>
                    <div class="bg-secondary border border-dark char-card">C</div>
                </div>
            </div>
            <div class="row hp-bar mx-0">
                <div class="col-sm-1">HP: </div>
                <div class="border border-dark col-sm-11 px-0 bg-dark">
                    <div class="hp bg-success" data-hp-max=80 style="width:80%;">80</div>
                </div>
            </div>
        </div>
        <div class="command bg-light pt-3">
            <p class="text-center instruction sort-help"> Choose Skill to use. </p>
            <div class="skill-list d-flex justify-content-center">
                <div class="btn-group-vertical" style="width:60%;">
                    <button type="button" class="btn btn-default border-secondary text-left" value="0">Bubble</button>
                    <button type="button" class="btn btn-default border-secondary text-left" value="1">Insert</button>
                    <button type="button" class="btn btn-default border-secondary text-left" value="2">Select</button>
                    <button type="button" class="btn btn-default border-secondary text-left"
                        value="defend">Defend</button>
                </div>
            </div>
            <div class="sort-calc">
                <div class="action-list d-flex justify-content-between mb-3">
                    <button type="button" class="btn btn-danger text-left" value="cancel">Cancel</button>
                    <button type="button" class="btn btn-success text-left" value="done">Done</button>
                </div>
                <p class="font-weight-bold">Compare Result: <span class="font-weight-normal compare-result-latest"></span></p>
                <div class="dmg-calc"></div>
            </div>
        </div>
    </div>
    <div class="col-sm-4 background-battle">
        <div class="p-3" style="height:100%;">
            <div>
                <table class="table table-hover table-primary table-striped mb-0">
                    <thead>
                        <tr>
                            <th scope="col">Action Log</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div style="height:80%;overflow-y:auto;">
                <table class="table table-hover table-primary table-striped">
                    <tbody class="action-log">
                    </tbody>
                </table>
            </div>
        </div>
    </div> <!-- background image and action log-->
</div>

<!-- Menu Modal -->
<div class="modal fade" id="menuModal">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-dark">
            <div class="modal-header justify-content-center">
                <h3>Pause</h3>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-6 my-auto">
                        <div class="card bg-gradient-secondary">
                            <div class="card-body battle-description">
                                <p class="font-weight-bold">Battle Description</p>
                                <p class="quest-detail">Defeat all enemies!</p>
                                <p class="font-weight-bold">Enemies’ element affinities</p>
                                <table class="table table-sm table-bordered element-affinity">
                                    <tbody>
                                        <tr>
                                            <td class="text-center"><img src="../elementPic/water.png" width="30px"></td>
                                            <td class="text-center"><img src="../elementPic/fire.png" width="30px"></td>
                                            <td class="text-center"><img src="../elementPic/earth.png" width="30px"></td>
                                            <td class="text-center"><img src="../elementPic/wind.png" width="30px"></td>
                                            <td class="text-center"><img src="../elementPic/dark.png" width="30px"></td>
                                            <td class="text-center"><img src="../elementPic/light.png" width="30px"></td>
                                            <td class="text-center"><img src="../elementPic/ice.png" width="30px"></td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">Wk</td>
                                            <td class="text-center">St</td>
                                            <td class="text-center">--</td>
                                            <td class="text-center">Dr</td>
                                            <td class="text-center">Rf</td>
                                            <td class="text-center">Nu</td>
                                            <td class="text-center">--</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p class="font-weight-bold" style="margin-top:1rem;margin-bottom:0px;">
                                    Waves: <span class="total-wave font-weight-normal">4</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <button type="button" class="btn btn-lg btn-success btn-block"
                            data-dismiss="modal">Resume</button>
                        <button type="button" class="btn btn-lg btn-warning btn-block" value="retry">Retry</button>
                        <button type="button" class="btn btn-lg btn-danger btn-block" value="back-quest"
                            data-quest-category="">Retreat</button>

                        <!--<div class="mt-5">
                            <button type="button" class="btn btn-secondary btn-block battle-setting" data-toggle="modal" data-target=".setting-modal">Setting</button>
                        </div>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="resultModal" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content bg-success">
            <div class="modal-header justify-content-center">
                <h3>Result</h3>
            </div>
            <div class="modal-body">
                Exp obtained: <span class="exp-obtained"></span> <br>
                Score obtained: <span class="score-obtained"></span> <br>
                Stars:
                <i class="fa fa-star" style="color:white;"></i>
                <i class="fa fa-star" style="color:white;"></i>
                <i class="fa fa-star" style="color:white;"></i>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-lg btn-warning btn-block" value="retry">Retry</button>
                <button type="button" class="btn btn-lg btn-danger btn-block" value="back-quest"
                    data-quest-category="">Retreat</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="logModal" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content bg-dark">
            <div class="modal-header justify-content-center">
                <h3>Logs</h3>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" style="width:50%;">
                        <a class="nav-link active" data-toggle="tab" href="#compare-log-content" role="tab" aria-selected="true" id="compare-log-tab">
                            Compare Log</a>
                    </li>
                    <li class="nav-item" style="width:50%;">
                        <a class="nav-link" data-toggle="tab" href="#action-log-content" role="tab" aria-selected="false" id="action-log-tab">
                            Action Log</a>
                    </li>
                </ul>

                <div class="tab-content">
                    <div class="tab-pane fade show active" id="compare-log-content" role="tabpanel" aria-labelledby="compare-log-tab">
                        <div>
                            <table class="table table-hover table-info table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Compare Log</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div>
                            <table class="table table-hover table-info table-striped">
                                <tbody class="compare-log">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="action-log-content" role="tabpanel" aria-labelledby="action-log-tab">
                        <div>
                            <table class="table table-hover table-primary table-striped mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">Action Log</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div>
                            <table class="table table-hover table-primary table-striped">
                                <tbody class="action-log">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-lg btn-success btn-block" data-dismiss="modal">Resume</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="battleTutorial" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div class="modal-content bg-dark">
            <div class="modal-header">
                <h3 class="modal-title">How to play Battle Quest</h3>
                <button type="button" class="close" data-dismiss="modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <!-- How to play -->
                <b>How to play</b> </br>
                The battle is turn-based which starts with your turn in every wave. </br>
                In you turn, you will need to choose your skill(s) or Defend. 
                If you choose to Defend, 
                you will pass your turn and take half of damage in next enemies' turn. </br>

                <div class="my-3">
                    <img src="./battleGameplay/skillSelection.PNG" class="mb-3" style="width:100%;">
                    <img src="./battleGameplay/clickSkill.gif" style="width:100%;">
                </div>

                If you choose one of skills, you will need to sort marbles according to specified sorting algorithm 
                which varies on element of skill you chose, as seen in the table below. </br>

                <!-- element and sort table -->
                <table class="table table-secondary table-bordered my-3">
                    <thead>
                        <tr>
                            <th scope="col">Element</th>
                            <th scope="col">Icon</th>
                            <th scope="col">Sorting Algorithm</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Water</td>
                            <td><img src="../elementPic/water.png" width="30px"></td>
                            <td>Bubble Sort</td>
                        </tr>
                        <tr>
                            <td>Fire</td>
                            <td><img src="../elementPic/fire.png" width="30px"></td>
                            <td>Insertion Sort</td>
                        </tr>
                        <tr>
                            <td>Earth</td>
                            <td><img src="../elementPic/earth.png" width="30px"></td>
                            <td>Selection Sort</td>
                        </tr>
                        <tr>
                            <td>Wind</td>
                            <td><img src="../elementPic/wind.png" width="30px"></td>
                            <td>Heap Sort</td>
                        </tr>
                        <tr>
                            <td>Dark</td>
                            <td><img src="../elementPic/dark.png" width="30px"></td>
                            <td>Merge Sort</td>
                        </tr>
                        <tr>
                            <td>Light</td>
                            <td><img src="../elementPic/light.png" width="30px"></td>
                            <td>Quick Sort</td>
                        </tr>
                        <tr>
                            <td>Ice</td>
                            <td><img src="../elementPic/ice.png" width="30px"></td>
                            <td>Distribution Counting Sort</td>
                        </tr>
                        <tr>
                            <td>Divine (Recover skills' HP)</td>
                            <td><img src="../elementPic/divine.png" width="30px"></td>
                            <td>Randomized unlocked Sorting Algorithms</td>
                        </tr>
                    </tbody>
                </table>

                <div class="my-3">
                    <img src="./battleGameplay/cai.PNG" style="width:100%;">
                </div>

                In order to use a function to move marbles or get data of them, 
                you can click a function to use then choose marble(s) 
                according to its requirement (some may not need an input at all though). </br>

                <div class="my-3">
                    <img src="./battleGameplay/caiChoosingFunc.gif" style="width:100%;">
                </div>

                You can click <button type="button" class="btn btn-danger">cancel</button> (the lower red button one) 
                to go back to choosing function or <button type="button" class="btn btn-success">done</button> (the lower green button one) 
                (clickable once you fulfill its requirement.) 
                to execute that function. For how each function works, 
                you can see it in detail on each Sorting Algorithm in Library. </br>

                You can click <button type="button" class="btn btn-danger">Cancel</button> (the upper red button one) 
                to go to choose your actions again or click <button type="button" class="btn btn-success">Done</button> (the upper green button one) 
                to submit your result. </br>

                More score you get from sorting algorithm, more damage you inflicts on enemies. 
                However, some enemies may have some kind of resistances 
                (types of element resistance are listed in table below.) 
                towards them which shows or hints in the battle description. 
                You can see it in Menu by clicking <button type="button" class="btn btn-light"><i class="fas fa-bars"></i></button> </br>

                <!-- element resistance table -->
                <table class="table table-secondary table-bordered my-3">
                    <thead>
                        <tr>
                            <th scope="col">Resistance</th>
                            <th scope="col">Abbreviate</th>
                            <th scope="col">Change on Damage to enemies</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Neutral</td>
                            <td>--</td>
                            <td>Equal to original damage</td>
                        </tr>
                        <tr>
                            <td>Weak</td>
                            <td>Wk</td>
                            <td>Double of original damage</td>
                        </tr>
                        <tr>
                            <td>Strong</td>
                            <td>St</td>
                            <td>Half of original damage</td>
                        </tr>
                        <tr>
                            <td>Nullify</td>
                            <td>Nu</td>
                            <td>No damage inflicted</td>
                        </tr>
                        <tr>
                            <td>Reflect</td>
                            <td>Rf</td>
                            <td>No damage inflicted and all skills take damage equal to mean of original damage instead.</td>
                        </tr>
                        <tr>
                            <td>Drain</td>
                            <td>Dr</td>
                            <td>Enemies recover their HP by original damage amount instead.</td>
                        </tr>
                    </tbody>
                </table>

                Once you attack or defend, enemies will start randomly attacking your skills. 
                When all of them are done, it will be your turn once more. </br>

                <div class="my-3">
                    <img src="./battleGameplay/enemyturn.gif" style="width:100%;">
                </div>

                If any of your skills have high chance of breaking (HP falls to 0) in next turn, their name will have red background and 
                if any of your skills break, their name will have black background and you can't use those broken skills. </br>

                <div class="my-3">
                    <img src="./battleGameplay/dangerSkill.PNG" class="mb-3" style="width:100%;">
                    <img src="./battleGameplay/deadSkill.PNG" style="width:100%;">
                </div>

                If you manage to kill all enemies in that wave, enemies in the next wave will appear and you can attack them again. </br>

                <div class="my-3">
                    <img src="./battleGameplay/newwave.gif" style="width:100%;">
                </div>

                Also in Menu, you can try playing the quest again with 
                <button type="button" class="btn btn-warning">Retry</button> or go back to quest list with 
                <button type="button" class="btn btn-danger">Retreat</button> 
                However, your quest progress in that round won't be recorded. </br>

                <div class="my-3">
                    <img src="./battleGameplay/menuScreen.PNG" style="width:100%;">
                </div>
                
                You can also adjust theme and audio via <button type="button" class="btn btn-secondary"><i class="fas fa-cog"></i></button> </br>

                <div class="my-3">
                    <img src="./battleGameplay/battleSetting.PNG" style="width:100%;">
                </div>
                
                If you play on a screen with less than 820 pixels wide, 
                you can view Action Log and Compare Log via 
                <button type="button" class="btn btn-light"><i class="fas fa-history"></i></button> which appears next to menu button. </br>

                <div class="my-3">
                    <img src="./battleGameplay/logModal.PNG" style="width:100%;">
                </div>

                <!-- Result -->
                <b>Finishing and Result</b> </br>
                After killing all enemies in last wave or breaking all skills, a modal containing EXP, score, stars and unlocked contents will appear. </br>

                <div class="my-3">
                    <img src="./battleGameplay/resultModal.PNG" style="width:100%;">
                </div>
                
                <!-- Evaluation -->
                <b>Score, Stars and EXP</b> </br>
                For this quest type, Score is calculated from scores you get from sorting marbles and stars 
                (initially, <i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>) 
                are determined as follows. </br>
                If you kill all enemies, the first star will turn into yellow like this. 
                <i class="fas fa-star text-warning"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i> </br>
                If you kill all enemies and your score is more than 50 points, the second star will also turn into yellow. 
                <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> <i class="fas fa-star"></i> </br>
                If you kill all enemies and your score is 100 points or perfect score, the third star will also turn into yellow. 
                <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> <i class="fas fa-star text-warning"></i> </br>
                You will also receive EXP equal to the amount stated in the quest description, 
                which you can view in Quest List, plus half of your score. 
                However, if this is not the first time you play this quest, you will receive half of EXP. 
                Also, skills which are not in the team will receive half of EXP.</br>

                <div class="my-3">
                    <img src="./battleGameplay/resultModal_unlocked.PNG" style="width:100%;">
                </div>

                <!-- Unlocked Contents -->
                <b>Unlocked Contents</b> </br>
                In this quest type, you may unlock new quest(s) if your score exceeds 50 points or gets 2 or 3 stars.</br>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>