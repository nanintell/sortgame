<head>
    <link rel="stylesheet" href="./questList/questList.css">
    <script src="./questList/questList.js"></script>
</head>

<div class="mb-3">
    <button type="button" class="btn btn-danger prev-page" onclick="$('body').css('overflow-y', '');">Back</button>
    <button type="button" class="btn btn-secondary float-right mx-3" data-toggle="modal" data-target="#editQuestTutorial"><i class="fas fa-question"></i></button>
    <button type="button" class="btn btn-info float-right" data-toggle="modal" data-target=".unlocked-content-modal" style="width:40vw;">
        Unlockable Content Editor
    </button>
</div>

<form>
    <input type="file" name="questInput" multiple style="display:none;">
    <input type="hidden" name="import-quest-cat" style="display:none;">
    <input type="hidden" name="import-quest-chapter" style="display:none;">
    <input type="hidden" name="import-quest-stage" style="display:none;">
</form>

<div class="row quest-background mx-1" data-quest-category="">
    <div class="col-sm-6 category-option">
        <div class="card">
            <div class="card-header h-100  bg-light p-0">
                <button type="button" class="btn btn-info btn-block border-0 h-100" value="main">
                    <div class="p-3 text-light lock-quest-category" data-lock-status="0">
                        <i class="fas fa-2x fa-lock"></i>
                    </div>
                    <h3>Main Story</h3>
                </button>
            </div>
        </div>
    </div>
    <div class="col-sm-6 category-option">
        <div class="card">
            <div class="card-header h-100  bg-light p-0">
                <button type="button" class="btn btn-success btn-block border-0 h-100" value="level">
                    <div class="p-3 text-light lock-quest-category" data-lock-status="0">
                        <i class="fas fa-2x fa-lock"></i>
                    </div>
                    <h3>Level</h3>
                </button>
            </div>
        </div>
        <div class="card">
            <div class="card-header h-100 bg-light p-0">
                <button type="button" class="btn btn-danger btn-block border-0 h-100" value="hard">
                    <div class="p-3 text-light lock-quest-category" data-lock-status="0">
                        <i class="fas fa-2x fa-lock"></i>
                    </div>
                    <h3>Hard</h3>
                </button>
            </div>
        </div>
    </div>
    <div class="col-sm-6 master-quest-detail">

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

<div class="modal fade quest-form-modal" data-backdrop="static">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title font-weight-bold">Quest Content Editor</h3>
            </div>
            <div class="modal-body overflow-auto" style="max-height:60vh;">
                <div class="general-quest-form" data-quest-index="" data-stage-index="" data-chapter-index="">
                    <h5 class="text-center mb-3 font-weight-bold">General Quest Detail</h5>
                    <div class="row mx-1 p-2 border">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" class="form-control quest-title" placeholder="Quest Title Here">
                            </div>
                            <div class="form-group">
                                <label>Required Quest</label>
                                <select class="form-control required-quest">
                                    <option value="0">Quest List</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Quest Category</label>
                                <select class="form-control quest-cat" disabled>
                                    <option value="1">Main</option>
                                    <option value="2">Level</option>
                                    <option value="3">Hard</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Quest Type</label>
                                <select class="form-control quest-type">
                                    <option value="1">Story Quest</option>
                                    <option value="2">Quiz Quest</option>
                                    <option value="3">Battle Quest</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Quest Description</label>
                                <textarea type="text" class="form-control quest-desc" rows="8"
                                    style="height:125px;max-height:125px;"></textarea>
                            </div>
                            <div class="form-group">
                                <label>EXP</label>
                                <input type="number" class="form-control quest-exp" min="0">
                            </div>
                            <div class="form-group">
                                <label>Background Picture</label>
                                <div class="input-group">
                                    <select class="form-control quest-bg">
                                        <option value="1">Waterfall</option>
                                    </select>
                                    <div class="input-group-append">
                                        <button class="btn btn-secondary add-img" value="background" onclick="openUploadForm(this)">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Flex on type of quest -->
                <!-- Story -->
                <div class="story-quest-form my-2">
                    <h5 class="text-center mb-3 font-weight-bold">Story Quest Detail</h5>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="master-story-line p-2 border">
                                <div class="story-line-form p-1 border">
                                    <div class="form-group">
                                        <label>Line <span class="story-line-no">1</span></label>
                                        <input type="text" class="form-control story-text" placeholder="Story Content">
                                    </div>
                                    <div class="form-group">
                                        <label >Sprites of Line <span class="story-line-no">1</span></label>
                                        <div class="input-group">
                                            <select class="form-control sprite-select story-sprite-left" title="Left Sprite">
                                                <option value="1">Evan</option>
                                            </select>
                                            <select class="form-control sprite-select story-sprite-right" title="Right Sprite">
                                                <option value="1">Evan</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="master-story-pic p-2 border">
                                <div class="story-pic-form p-1 border">
                                    <div class="form-group">
                                        <label >Picture</label>
                                        <div class="input-group">
                                            <select class="form-control storypic-select story-pic">
                                                <option value="1">./StoryPic/Bubble.gif</option>
                                            </select>
                                            <div class="input-group-append">
                                                <button class="btn btn-secondary add-img" value="story" onclick="openUploadForm(this)"><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label >Appear</label>
                                        <div class="input-group">
                                            <input type="number" class="form-control story-pic-line-range" placeholder="Start Line" min="1" max="1">
                                            <input type="number" class="form-control story-pic-line-range" placeholder="Stop Line" min="1" max="1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quiz -->
                <div class="quiz-quest-form my-2" style="display:none;">
                    <h5 class="text-center mb-3 font-weight-bold">Quiz Quest Detail</h5>
                    <div class="master-quiz-form">
                        <div class="quiz-detail-form border p-2">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Question <span class="question-no">1</span></label>
                                        <input type="text" class="form-control quiz-question" placeholder="Question">
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Test Sort</label>
                                        <select class="form-control sort-select quiz-test-sort">
                                            <option value="1">Bubble</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Sprites</label>
                                        <div class="input-group">
                                            <select class="form-control sprite-select quiz-sprite-left" title="Left Sprite">
                                                <option value="">--</option>
                                                <option value="1">Evan</option>
                                            </select>
                                            <select class="form-control sprite-select quiz-sprite-right" title="Right Sprite">
                                                <option value="">--</option>
                                                <option value="1">Evan</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="form-group">
                                        <label>Picture</label>
                                        <div class="input-group">
                                            <select class="form-control storypic-select quiz-pic">
                                                <option value="">--</option>
                                                <option value="1">./StoryPic/Bubble.gif</option>
                                            </select>
                                            <div class="input-group-append">
                                                <button class="btn btn-secondary add-img" value="story" onclick="openUploadForm(this)"><i class="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="master-dropdown-form">
                                <div class="dropdown-form border p-1">
                                    <label class="mb-3">Dropdown <span class="dropdown-no">1</span></label>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Label</label>
                                                <input type="text" class="form-control dropdown-label" placeholder="Label of dropdown">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Choice</label>
                                                <div class="choice-detail-form">
                                                    <div class="input-group">
                                                        <input type="text" class="form-control choice-label" placeholder="Choice in dropdown">
                                                        <div class="input-group-append" data-toggle="button">
                                                            <label class="btn btn-outline-dark">
                                                                <input type="checkbox" class="choice-correct" autocomplete="off" style="display:none;">
                                                                <i class="fas fa-check"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- Battle -->
                <div class="battle-quest-form my-2" style="display:none;">
                    <h5 class="text-center mb-3 font-weight-bold">Battle Quest Detail</h5>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Battle Description</label>
                                <textarea type="text" class="form-control battle-desc" rows="2" style="height:80px;max-height:80px;"></textarea>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Elements Resistance to show</label>
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
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                            <td class="p-0">
                                                <select class="form-control px-0 border-0 text-center res-select battle-desc-element">
                                                    <option value="null">??</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="master-wave-form">
                        <div class="wave-detail-form p-2 border">
                            <label class="mb-3">Wave <span class="wave-no">1</span></label>
                            <div class="wave-monster-form p-1 border">
                                <div class="form-group">
                                    <label>Monster 1</label>
                                    <select class="form-control monster-select">
                                        <option value="">--</option>
                                        <option value="1">Polwigle</option>
                                    </select>
                                </div>
                                <div class="monster-detail-form">
                                    <label class="mb-3">Monster 1 Detail</label>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Sprite</label>
                                                <select class="form-control sprite-select monster-sprite" title="Sprite">
                                                    <option value="1">Evan</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Attack</label>
                                                <input type="number" class="form-control monster-attack">
                                            </div>
                                            <div class="form-group">
                                                <label>HP</label>
                                                <input type="number" class="form-control monster-hp">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Name</label>
                                                <input type="text" class="form-control monster-name">
                                            </div>
                                            <div class="form-group">
                                                <label>Number</label>
                                                <input type="number" class="form-control monster-number">
                                            </div>
                                            <div class="form-group">
                                                <label>Elements Resistance</label>
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
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                    <option value="1">Nu</option>
                                                                    <option value="2">St</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="wave-monster-form p-1 border">
                                <div class="form-group">
                                    <label>Monster 2</label>
                                    <select class="form-control monster-select">
                                        <option value="">--</option>
                                        <option value="1">Polwigle</option>
                                    </select>
                                </div>
                                <div class="monster-detail-form">
                                    <label class="mb-3">Monster 2 Detail</label>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Sprite</label>
                                                <select class="form-control sprite-select monster-sprite" title="Sprite">
                                                    <option value="1">Evan</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Attack</label>
                                                <input type="number" class="form-control monster-attack">
                                            </div>
                                            <div class="form-group">
                                                <label>HP</label>
                                                <input type="number" class="form-control monster-hp">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="form-group">
                                                <label>Name</label>
                                                <input type="text" class="form-control monster-name">
                                            </div>
                                            <div class="form-group">
                                                <label>Number</label>
                                                <input type="number" class="form-control monster-number">
                                            </div>
                                            <div class="form-group">
                                                <label>Elements Resistance</label>
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
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                            <td class="p-0">
                                                                <select class="form-control px-0 border-0 text-center res-select monster-element">
                                                                    <option value="0">Wk</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary save-quest">Save</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade unlocked-content-modal" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Unlockable Content Editor</h3>
            </div>
            <div class="modal-body">
                <div class="card collapsed-card">
                    <div class="card-header" data-card-widget="collapse">
                        <h3 class="card-title">Character</h3>
                        <div class="card-tools py-0">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body character-unlock-form" style="display:none;">
                    </div>
                </div>
                <div class="card collapsed-card">
                    <div class="card-header" data-card-widget="collapse">
                        <h3 class="card-title">Elements</h3>
                        <div class="card-tools py-0">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body element-unlock-form" style="display:none;">
                        <small>
                            Please note that unlocked "elements" are used when a player uses a divine-element skill. 
                            One of those elements is randomly picked for him to sort with related sorting algorithm of it.
                        </small>
                    </div>
                </div>
                <div class="card collapsed-card">
                    <div class="card-header" data-card-widget="collapse">
                        <h3 class="card-title">Library Content</h3>
                        <div class="card-tools py-0">
                            <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body library-unlock-form" style="display:none;">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div> 

<div class="modal fade img-save-modal" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Upload Image File</h3>
            </div>
            <div class="modal-body overflow-auto">
                <form class="bg-import-form" style="display:none;" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Background Image file</label>
                        <input type="file" name="bg-img-file" class="form-control-file">
                    </div>
                    <div class="form-group">
                        <label>Background Image name</label>
                        <input type="text" name="bg-name" class="form-control">
                        <small class="form-text text-muted">
                            File extension is automatically filled. 
                            Leaving this field empty will make the picture name become image file name.
                        </small>
                    </div>
                </form>
                <form class="story-img-form" style="display:none;" enctype="multipart/form-data">
                    <div class="form-group">
                        <label>Story Image file</label>
                        <input type="file" name="story-pic-img-file" class="form-control-file">
                    </div>
                    <div class="form-group">
                        <label>Story Image name (optional)</label>
                        <input type="text" name="story-pic-name" class="form-control">
                        <small class="form-text text-muted">
                            File extension is automatically filled. 
                            Leaving this field empty will make the picture name become image file name.
                        </small>
                    </div>
                </form>
                <button type="button" class="btn btn-primary float-right upload-image">Upload</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="$('.quest-form-modal').modal('show');">Cancel</button>
            </div>
        </div>
    </div>
</div> 

<div class="modal fade" id="editQuestTutorial" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div class="modal-content bg-dark">
            <div class="modal-header">
                <h3 class="modal-title">How to use Quest Setting page</h3>
                <button type="button" class="close" data-dismiss="modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                You can lock a quest category so player can't go play it by clicking <i class="fas fa-unlock"></i> after that, the icon will become 
                <i class="fas fa-lock"></i> and you can unlock the category again by clicking it. 
                You can access quest list of a quest category by clicking the category you want to access. </br>

                <div class="my-3">
                    <img src="./questList/lockQc.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/seeList.gif" style="width:100%;">
                </div>

                You can also edit which quest unlocks library contents, skills or elements by clicking 
                <button type="button" class="btn btn-info">Unlockable Content Editor</button>. 
                
                <div class="my-3">
                    <img src="./questList/contentEditor.gif" style="width:100%;">
                </div>
                
                You can edit name of a chapter or a stage by clicking 
                <button type="button" class="btn btn-tool"><i class="fas fa-2x fa-edit"></i></button> of it and 
                delete a chapter and a stage by clicking 
                <button type="button" class="btn btn-tool"><i class="fas fa-2x fa-times"></i></button> 
                Note that, deleting either chapter or stage will also delete quests and player progress of them as well. </br>

                <div class="my-3">
                    <img src="./questList/editCh.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/delCh.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/editSt.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/delSt.gif" style="width:100%;">
                </div>

                You can also add chapter or stage by clicking 
                <button type="button" class="btn btn-primary"><i class="fas fa-plus"></i></button> / 
                <button type="button" class="btn btn-dark"><i class="fas fa-plus"></i></button> above the list. </br>

                <div class="my-3">
                    <img src="./questList/addCh.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/addSt.gif" style="width:100%;">
                </div>

                You can also edit, add and delete a quest in similar manner but editing and adding quest will require you to fill the form. 
                In the form, you can cancel editing or adding by clicking 
                <button type="button" class="btn btn-secondary">Cancel</button> and save progress by clicking 
                <button type="button" class="btn btn-primary">Save</button> </br>

                <div class="my-3">
                    <img src="./questList/editQ.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/addQ.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/delQ.gif" class="mb-3" style="width:100%;">
                    <img src="./questList/tourForm.gif" style="width:100%;">
                </div>

                You can also import quest using csv files (you can import multiple files at once.) which you will see an alert asking if you want import or fill the form when clicking 
                <button type="button" class="btn btn-secondary"><i class="fas fa-plus"></i></button> 
                where 1 file represents 1 quest and each quest type has different format.  
                You can download example files for each types here. 
                (<a href="./questList/storyTest.csv">Example Story Quest File</a>, 
                <a href="./questList/battleTest.csv">Example Battle Quest</a>, 
                <a href="./questList/quizTest.csv">Exameple Quiz Quest</a>)
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

