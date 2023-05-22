<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sorting Algo Game</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="../resources/plugins/fontawesome-free/css/all.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="../resources/dist/css/adminlte.min.css">
  <!-- jQuery -->
  <script src="../resources/plugins/jquery/jquery.min.js"></script>
  <!-- jQuery UI 1.13.2 -->
  <link rel="stylesheet" href="../resources/plugins/jquery-ui-1.13.2.custom/jquery-ui.min.css">
  <script src="../resources/plugins/jquery-ui-1.13.2.custom/jquery-ui.min.js"></script>
  <!-- turn.js -->
  <script type="text/javascript" src="../resources/plugins/turnjs4/extras/modernizr.2.5.3.min.js"></script>
  <script type="text/javascript" src="../resources/plugins/turnjs4/lib/turn.min.js"></script>
  <!-- css -->
  <link rel="stylesheet" href="./main.css">
  <!-- js classes -->
  <!--<script src="../classes/sortcai.js"></script>-->
</head>

<!-- add layout-top-nav and remove sidebar -->

<body class="hold-transition layout-top-nav layout-footer-fixed">
  <!-- Site wrapper -->
  <div class="wrapper">

    <!-- audio player -->
    <audio id="bgm-player" controls loop style="display:none;">
      <source src="" type="audio/mpeg">
    </audio>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-12">
              <h1>Sorting Algorithm Game</h1>
            </div>
          </div>
        </div><!-- /.container-fluid -->
      </section>

      <!-- Main content -->
      <section class="content">
      </section>
      <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <div class="loading-page">
      <!--
      <div class="card card-dark bg-gradient-secondary">
        <div class="card-header ">
          <h3 class="card-title">Did you know?</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-sm-6">
              
            </div>
            <div class="col-sm-6">

            </div>
          </div>
        </div>
        <div class="card-fotter"></div>
      </div>
      -->
      <div class="loading-status">
        <h3 class="d-flex align-items-center">
          <i class="fas fa-2x fa-sync-alt fa-spin mr-4"></i>
          Loading . . .
        </h3>
      </div>
    </div>

    <!-- setting modal -->
    <div class="modal fade setting-modal" data-backdrop="static">
      <div class="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div class="modal-content" style="background-color:#E5E7E9;">
          <div class="modal-header">
            <h5 class="modal-title">Setting</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fas fa-times"></i></span>
            </button>
          </div>
          <div class="modal-body bg-light">
            <div class="card"> <!-- collapsed card removed-->
              <div class="card-header"> <!-- data-card-widget="collapse" removed-->
                <h5 class="card-title">General</h5>
                <!--<div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>-->
              </div>
              <div class="card-body"> <!--style="display:none; removed"-->
                <div class="form-group row mb-0">
                  <label class="col-sm-2 col-form-label">Theme</label>
                  <div class="col-sm-10">
                    <div class="btn-group btn-group-toggle website-theme" data-toggle="buttons">
                      <label class="btn btn-outline-dark active">
                        <input type="radio" autocomplete="off" value="light-theme"> Light Theme
                      </label>
                      <label class="btn btn-outline-dark">
                        <input type="radio" autocomplete="off" value="dark-theme"> Dark Theme
                      </label>
                    </div>
                    <small class="form-text text-muted">Adjust theme of system.</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h5 class="card-title">Audio</h5>
                <!--<div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>-->
              </div>
              <div class="card-body">
                <div class="form-group row mb-0">
                  <label class="col-sm-2 col-form-label">Sound</label>
                  <div class="col-sm-10">
                    <div class="btn-group btn-group-toggle sound-toggle" data-toggle="buttons">
                      <label class="btn btn-outline-dark active">
                        <input type="radio" autocomplete="off" value="sound-on"> ON
                      </label>
                      <label class="btn btn-outline-dark">
                        <input type="radio" autocomplete="off" value="sound-off"> OFF
                      </label>
                    </div>
                    <div class="form-group row mb-0 mt-2 sound-value">
                      <label class="col-sm-3 col-form-label">Volume</label>
                      <div class="col-sm-9 form-inline">
                        <input type="text" readonly class="form-control-plaintext mr-3 border-0" value="100"
                          style="width:10%;">
                        <input type="range" class="form-control w-50 p-0" min="1" max="100" value="100">
                      </div>
                    </div>
                    <small class="form-text text-muted">Adjust audio of background music. Beware that sometimes, audio
                      may not turn on in some browsers.</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h5 class="card-title">In-Game setting</h5>
                <!--<div class="card-tools">
                  <button type="button" class="btn btn-tool" data-card-widget="collapse" title="Collapse">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>-->
              </div>
              <div class="card-body">
                <div class="form-group row mb-0">
                  <label class="col-sm-2 col-form-label">Battle</label>
                  <div class="col-sm-10">
                    <div class="form-group row mb-0">
                      <label class="col-sm-5 col-form-label px-0">Sort Animation</label>
                      <div class="col-sm-7">
                        <div class="form-inline animation-duration">
                          <input type="text" readonly class="form-control-plaintext mr-3 border-0" value="3"
                            style="width:15%;">
                          <input type="range" class="form-control w-50 p-0" min="1" max="300" value="300">
                        </div>
                      </div>
                      <small class="form-text text-muted">Animation duration of excuting function in CAI
                        (sorting marbles in battle quest and playground in homepage). </br>Unit is in seconds.</small>
                      <!--<div class="col-sm-7 btn-group btn-group-toggle animation-duration" data-toggle="buttons">
                        <label class="btn btn-outline-dark">
                          <input type="radio" autocomplete="off" value="slow"> Slow
                        </label>
                        <label class="btn btn-outline-dark">
                          <input type="radio" autocomplete="off" value="default"> Normal
                        </label>
                        <label class="btn btn-outline-dark">
                          <input type="radio" autocomplete="off" value="fast"> Fast
                        </label>
                      </div>-->
                    </div>
                    <div class="form-group row mb-0 mt-2">
                      <label class="col-sm-5 col-form-label px-0">Show Values in CAI</label>
                      <div class="col-sm-7 btn-group btn-group-toggle value-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-dark active">
                          <input type="radio" autocomplete="off" value="show-value"> ON
                        </label>
                        <label class="btn btn-outline-dark">
                          <input type="radio" autocomplete="off" value="hide-value"> OFF
                        </label>
                      </div>
                      <small class="form-text text-muted value-toggle-desc">Values will be shown in each marble in
                        CAI.</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger close-setting" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ./wrapper -->


  <!-- Bootstrap 4 -->
  <script src="../resources/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
  <!-- AdminLTE App -->
  <script src="../resources/dist/js/adminlte.min.js"></script>
  <!-- AdminLTE for demo purposes -->
  <!--<script src="../resources/dist/js/demo.js"></script>-->

  <script src="main.js"></script>

</body>

</html>