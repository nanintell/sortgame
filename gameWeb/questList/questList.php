<head>
    <link rel="stylesheet" href="./questList/questList.css">
    <script src="./questList/questList.js"></script>
</head>

<div class="mb-3">
    <button type="button" class="btn btn-danger prev-page" onclick="if($(this).hasClass('homepage')){$('body').css('overflow-y', '');}">Back</button>
    <button type="button" class="btn btn-dark" data-toggle="modal" data-target=".team-edit-modal" onclick="$('.team-edit-modal .modal-footer').hide();">Team</button>
    <button type="button" class="btn btn-dark library-quest">Library</button>
    <button type="button" class="btn btn-secondary float-right mx-3" data-toggle="modal" data-target="#questlistTutorial"><i class="fas fa-question"></i></button>
</div>

<div class="row quest-background mx-1" data-quest-category="">
    <div class="col-sm-6 category-option">
        <div class="card">
            <div class="card-header h-100 bg-light p-0">
                <button type="button" class="btn btn-info btn-block border-0 h-100" value="main">
                    <h3>Main Story</h3>
                </button>
            </div>
        </div> 
    </div>
    <div class="col-sm-6 category-option">
        <div class="card">
            <div class="card-header h-100  bg-light p-0">
                <button type="button" class="btn btn-success btn-block border-0 h-100" value="level">
                    <h3>Level</h3>
                </button>
            </div>
        </div> 
        <div class="card">
            <div class="card-header h-100 bg-light p-0">
                <button type="button" class="btn btn-danger btn-block border-0 h-100" value="hard">
                    <h3>Hard</h3>
                </button>
            </div>
        </div> 
    </div>
    <div class="col-sm-6 master-quest-detail">
        <div class="card bg-gradient-secondary quest-detail">
            <div class="card-body">
                <h4 class="font-weight-bold">Quest 1-1: --</h4>
                <span class="quest-desc">You find yourself in unknown place with unknown creature! What happened
                    here?</span>
                <h5 class="font-weight-bold">EXP Reward <span class="exp-reward font-weight-normal">-</span></h5>
                <h5 class="font-weight-bold">Requirement <span class="quest-req font-weight-normal">-</span></h5>
                <h5 class="font-weight-bold">Battle</h5>
                <span class="battle-detail">
                    <span class="font-weight-bold">Battle Description</span>
                    <p>Defeat all enemies!</p>
                    <p class="font-weight-bold">Enemies’ element affinities</p>
                    <table class="table table-sm table-bordered">
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
                        Waves: <span class="font-weight-normal">4</span>
                    </p>
                </span>
            </div>
        </div>
    </div>
    <div class="col-sm-6 master-quest">
        <div class="card card-primary chapter-card collapsed-card" data-chapter-index="0">
            <div class="card-header" data-card-widget="collapse"> <!-- Chapter -->
                Chapter 1: Strange World
            </div>
            <div class="card-body" style="display:none;">
                <div class="card card-dark collapsed-card stage-card" data-stage-index="0">
                    <div class="card-header" data-card-widget="collapse"> <!-- Stage -->
                        Stage 1: Strange Creature
                    </div>
                    <div class="card-body" style="display:none;">
                        <div class="card card-secondary collapsed-card quest-card" data-quest-index="0">
                            <div class="card-header" data-card-widget="collapse"> <!-- Quest -->
                                Quest 1-1: Beginning
                            </div>
                            <div class="card-body" style="display:none;">
                                <p class="mb-1">Proceed?</p>
                                <div class="d-flex justify-content-around">
                                    <button type="button" class="btn btn-success">Play</button>
                                    <button type="button" class="btn btn-danger"
                                        data-card-widget="collapse">Cancel</button>
                                </div>
                            </div>
                        </div>
                        <div class="card card-secondary collapsed-card quest-card" data-quest-index="1">
                            <div class="card-header" data-card-widget="collapse"> <!-- Quest -->
                                Quest 1-2: Let's battle
                            </div>
                            <div class="card-body" style="display:none;">
                                <p class="mb-1">Proceed?</p>
                                <div class="d-flex justify-content-around">
                                    <button type="button" class="btn btn-success">Play</button>
                                    <button type="button" class="btn btn-danger"
                                        data-card-widget="collapse">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal quest-detail-modal fade">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content bg-gradient-dark">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fas fa-times"></i></span>
        </button>
      </div>
      <div class="modal-body">
        <div class="card bg-gradient-secondary quest-detail">
            <div class="card-body">
                <h4 class="font-weight-bold">Quest 1-1: --</h4>
                <span class="quest-desc">You find yourself in unknown place with unknown creature! What happened
                    here?</span>
                <h5 class="font-weight-bold">EXP Reward <span class="exp-reward font-weight-normal">-</span></h5>
                <h5 class="font-weight-bold">Requirement <span class="quest-req font-weight-normal">-</span></h5>
                <h5 class="font-weight-bold">Battle</h5>
                <span class="battle-detail">
                    <span class="font-weight-bold">Battle Description</span>
                    <p>Defeat all enemies!</p>
                    <p class="font-weight-bold">Enemies’ element affinities</p>
                    <table class="table table-sm table-bordered">
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
                        Waves: <span class="font-weight-normal">4</span>
                    </p>
                </span>
            </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal team-edit-modal fade" data-backdrop="static">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document" style="max-width:90vw;">
    <div class="modal-content" style="background-color:#454d55;">
      <div class="modal-header">
        <h5 class="modal-title">Check your team!</h5>
        <button type="button" class="btn btn-secondary openTeamTutorial mx-3"><i class="fas fa-question"></i></button>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fas fa-times"></i></span>
        </button>
      </div>
      <div class="modal-body overflow-auto">
        Hello
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-success" onclick="if(openedQuest != undefined) {startQuest(openedQuest);}">Play</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="questlistTutorial" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
    <div class="modal-content bg-dark">
            <div class="modal-header">
                <h3 class="modal-title">How to use Quest List page</h3>
                <button type="button" class="close" data-dismiss="modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                You can choose quest category by simply clicking button of the category you want to play. 
                <button type="button" class="btn btn-info">Main Story</button> is the one you need to clear to end the game. 
                <button type="button" class="btn btn-success">Level</button> is for helping you level up your skills. 
                <button type="button" class="btn btn-danger">Hard</button> contains challenges for you. </br>
                
                <div class="my-3">
                    <img src="./questList/qcategory.PNG" style="width:100%;">
                </div>

                Quests are grouped in stages and stages are groups in chapters. 
                You can view list of stages in a chapter by clicking the chapter to expand it and 
                view list of quests in a stage by clicking the stage to expand it. 
                Also, if you want to go back to collapse stages or chapters, 
                you can click the expanded stage or chapter to collpase it. </br>

                <div class="my-3">
                    <img src="./questList/exColList.gif" style="width:100%;">
                </div>

                Each quest contains 3 stars in yellow or white (<i class="fas fa-star"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>) 
                which show your performance. If there are quests with 1 yellow star 
                (<i class="fas fa-star text-warning"></i> <i class="fas fa-star"></i> <i class="fas fa-star"></i>), it means that you didn't pass them and 
                you will need to play them again to unlock new contents. </br>

                You can choose the quest to play by clicking it to expand it and select <button type="button" class="btn btn-success">Play</button>  
                If you want to change quests, you can click another quest you want 
                to play or click <button type="button" class="btn btn-danger">Cancel</button> in expanded quest to collapase it. </br>

                <div class="my-3">
                    <img src="./questList/openQuest.gif" style="width:100%;">
                </div>

                You can also see the quest's description by hovering on the quest or expanding it if you are on a screen with 820 pixels or more. 
                However, If you are on a screen with less than 820 pixels wide, you can view quest's description by clicking 
                <button type="button" class="btn btn-secondary">Detail</button> 
                which will make a modal containing the quest's description appear. </br>

                <div class="my-3">
                    <img src="./questList/qDescPc.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/qDescMb.gif" style="width:100%;">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>