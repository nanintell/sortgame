<head>
    <link rel="stylesheet" href="./homepage/homepage.css">
    <script src="./homepage/homepage.js"></script>
</head>

<!-- control sidebar -->
<aside class="control-sidebar widthcontrol login-sidebar">
    <!-- log in page -->
    <div class="login-page">
        <div class="card notif-card">
            <div class="card-header">
                <h3 class="card-title">Notif</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="remove"><i
                            class="fas fa-times"></i></button>
                </div>
            </div>
        </div>
        <div class="login-box">
            <div class="card">
                <div class="card-body">
                    <p class="login-box-msg">Sign in to start playing</p>
                    <input type="text" id="student-id" class="form-control mb-3" placeholder="Your student ID"
                        maxlength="11" pattern="[0-9]{11}">
                    <button type="button" class="btn btn-info btn-block my-3 log-in" data-widget="control-sidebar"
                        disabled>Log in</button>
                    <div class="social-auth-links text-center mb-3">
                        <p>- OR -</p>
                        <button type="button" class="btn btn-block btn-warning my-3 guest-log-in">Guest Log in</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</aside>
<!-- ./control-sidebar -->

<div class="card welcome-card">
    <div class="card-header">
        <h3>
            Welcome, Guest
        </h3>
    </div>
</div>
<div class="row">
    <div class="col-sm-9">
        <div class="card cai-playground">
            <div class="card-header" data-card-widget="collapse">
                <h3 class="card-title mt-2">Sort CAI playground</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <select class="form-control sort-type-option float-right mb-3" style="width:15%;">
                    <option value="bubble">Bubble Sort</option>
                    <option value="insertion">Insertion Sort</option>
                    <option value="selection">Selection Sort</option>
                    <option value="merge">Merge Sort</option>
                    <option value="quick">Quick Sort</option>
                    <option value="heap">Heap Sort</option>
                    <option value="counting">Distribution Counting Sort</option>
                </select>
                <select class="form-control add-object float-right mb-3" style="width:10%;">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                </select>
                <div class="sort-gameplay"></div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-success get-sort-score">Evaluate</button>
            </div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="card game-menu">
            <div class="card-header" data-card-widget="collapse">
                <h3 class="card-title mt-2">Game Menu</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex flex-column justify-content-around h-100">
                    <button type="button"
                        class="btn btn-block btn-outline-success btn-lg border-0 quest-list">Play</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0 team-setting">Team</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0 library">Library</button>
                    <button type="button"
                        class="btn btn-block btn-outline-dark border-0 gameplay-progress">Progress</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0" data-toggle="modal"
                        data-target=".setting-modal" onclick="$('.setting-modal .card').show();">Setting</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0 contact" title="Found a bug? Click here!">Contact</button>
                    <button type="button" class="btn btn-block btn-outline-danger border-0 log-out">Log out</button>
                </div>

            </div>
        </div>
    </div>
</div>
<!-- feedback form footer -->
<footer class="main-footer" style="display:none;">
    <strong>Thank you for playing our game! We would like to hear your thoughts so could you please fill
        <a target="_blank" href="https://forms.gle/3bFmVrNq49HyFQJm8">this form</a>
        for us? (Clicking the link will open a new tab.)
    </strong>
</footer>