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
                    <p class="login-box-msg">Admin Sign in</p>
                    <input type="text" id="admin-id" class="form-control mb-3" placeholder="Your Admin ID or First Name">
                    <input type="password" id="admin-pwd" class="form-control mb-3" placeholder="Your Admin Password">
                    <button type="button" class="btn btn-info btn-block my-3 log-in">Log in</button>
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
                <h3 class="card-title mt-2">Empty Card</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="card-body"></div>
        </div>
    </div>
    <div class="col-sm-3">
        <div class="card game-menu">
            <div class="card-header" data-card-widget="collapse">
                <h3 class="card-title mt-2">Admin Menu</h3>
                <div class="card-tools">
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex flex-column justify-content-around h-100">
                    <button type="button"
                        class="btn btn-block btn-outline-success btn-lg border-0 quest-list">Edit Quests</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0 group-setting">Group</button>
                    <!--<button type="button" class="btn btn-block btn-outline-dark my-3 border-0 library">Library</button>-->
                    <button type="button"
                        class="btn btn-block btn-outline-dark border-0 gameplay-progress">Progress</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0" data-toggle="modal" data-target=".setting-modal">Setting</button>
                    <button type="button" class="btn btn-block btn-outline-dark border-0 contact" title="Found a bug? Click here!">Contact</button>
                    <button type="button" class="btn btn-block btn-outline-danger border-0 log-out">Log out</button>
                </div>
            </div>
        </div>
    </div>
</div>