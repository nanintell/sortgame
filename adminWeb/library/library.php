<head>
    <script src="./library/library.js"></script>
    <link rel="stylesheet" href="./library/library.css">
</head>

<div class="mb-3">
    <button type="button" class="btn btn-danger homepage">Back</button>
    <a class="mb-3 export-progress" target="_blank" onclick="exportCSV($(this), -1);" onmouseover="$('.export-all-desc').slideDown();">
      <button type="button" class="btn btn-secondary">
        <i class="fas fa-file-export"></i>
      </button>
    </a>
</div>
<p class="export-all-desc float-right" style="display:none;">This button will generate all groups' progress.</p>

<button type="button" class="btn btn-secondary btn-block label-modal-open" data-toggle="modal" data-target=".label-modal">Label</button>

<div class="row library-background py-3 mb-3" style="clear:both;">
    <div class="col-sm-6 d-flex align-items-center justify-content-center master-page-label">
        <div>
            <div class="card bg-gradient-dark">
                <div class="card-body overflow-auto">
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="1">Page 1</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="2">Page 2</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="3">Page 3</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="4">Page 4</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="5">Page 5</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="6">Page 6</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="7">Page 7</button>
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="8">Page 8</button>
                </div>
            </div>
            <div class="card bg-gradient-dark">
                <div class="card-body overflow-auto">
                    <button type="button" class="btn btn-outline-light btn-block mb-3 page-label" value="9">Sort</button>
                    </br>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-6" style="height:100%;">
        <div class="library-book">
            <div class="hard"><h2 class="font-weight-bold"> Sorting Algorithm </h2></div>
            <div class="hard"></div>
        </div>
    </div>
</div>

<div class="label-modal modal fade" data-backdrop="static">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content bg-gradient-dark">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"><i class="fas fa-times"></i></span>
        </button>
      </div>
      <div class="modal-body master-page-label">
        <div></div>
      </div>
    </div>
  </div>
</div>