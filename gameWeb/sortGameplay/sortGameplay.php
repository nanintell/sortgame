<head>
    <link rel="stylesheet" href="./sortGameplay/sortGameplay.css">
    <!--<script src="./sortGameplay/sortGameplay_class.js"></script>-->
    <script src="./sortGameplay/sortGameplay.js"></script>
</head>

<p class="font-weight-bold">Help: <span class="font-weight-normal sort-help">Choose a function to perform!</span></p>
<p class="font-weight-bold">Move left: <span class="font-weight-normal move-left"></span></p>
<button type="button" class="btn btn-success toggle-heap float-right" style="display:none;">Tree view</button>

<ul class="sort-obj" data-sort-type="counting">
    <li>
        <input type="checkbox" id="cb1" value=-1 disabled />
        <label for="cb1">
            <div id="d1">A</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb2" value=-1 disabled />
        <label for="cb2">
            <div id="d2">B</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb3" value=-1 disabled />
        <label for="cb3">
            <div id="d3">C</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb4" value=-1 disabled />
        <label for="cb4">
            <div id="d4">D</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb5" value=-1 disabled />
        <label for="cb5">
            <div id="d5">E</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb6" value=-1 disabled />
        <label for="cb6">
            <div id="d6">F</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb7" value=-1 disabled />
        <label for="cb7">
            <div id="d7">E</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb8" value=-1 disabled />
        <label for="cb8">
            <div id="d8">F</div>
        </label>
    </li>
</ul>

<ul class="sort-obj animation">
    <label> 
        <div id="da_A" style="left:0px;top:0px;">A</div>
        <div id="da_B" style="left:61px;top:-40px;">B</div>
        <div id="da_C" style="left:122px;top:-80px;">C</div>
        <div id="da_D" style="left:183px;top:-120px;">D</div>
        <div id="da_E" style="left:244px;top:-160px;">E</div>
        <div id="da_F" style="left:306px;top:-200px;">F</div>
        <div id="da_G" style="left:306px;top:-240px;">G</div>
        <div id="da_H" style="left:306px;top:-280px;">H</div>
    </label>
</ul>

<ul class="sort-obj group">
    <li>
        <input type="checkbox" id="cb_g1" value=-1 disabled />
        <label for="cb_g1">
            <div id="g1">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g2" value=-1 disabled />
        <label for="cb_g2">
            <div id="g2">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g3" value=-1 disabled />
        <label for="cb_g3">
            <div id="g3">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g4" value=-1 disabled />
        <label for="cb_g4">
            <div id="g4">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g5" value=-1 disabled />
        <label for="cb_g5">
            <div id="g5">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g6" value=-1 disabled />
        <label for="cb_g6">
            <div id="g6">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g7" value=-1 disabled />
        <label for="cb_g7">
            <div id="g7">
            </div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_g7" value=-1 disabled />
        <label for="cb_g8">
            <div id="g8">
            </div>
        </label>
    </li>
</ul>

<ul class="sort-obj heap">
    <li> <!-- normal element -->
        <input type="checkbox" id="cb_h1" value=-1 disabled />
        <label for="cb_h1">
            <div id="d1_h">A</div>
        </label>
    </li>
    <li> <!-- heap tree checkbox -->
        <div class="heap-tree">
            <div class="row d-flex justify-content-center mx-0">
                <input type="checkbox" id="cb_h2" value=-1 disabled />
                <label for="cb_h2">
                    <div id="d2_h">B</div>
                </label>
            </div>
            <div class="row mx-0">
                <div class="col-sm-6 d-flex justify-content-center">
                    <input type="checkbox" id="cb_h3" value=-1 disabled />
                    <label for="cb_h3">
                        <div id="d3_h">C</div>
                    </label>
                </div>
                <div class="col-sm-6 d-flex justify-content-center">
                    <input type="checkbox" id="cb_h4" value=-1 disabled />
                    <label for="cb_h4">
                        <div id="d4_h">D</div>
                    </label>
                </div>
            </div>
            <div class="row mx-0">
                <div class="col-sm-3 d-flex justify-content-center">
                    <input type="checkbox" id="cb_h5" value=-1 disabled />
                    <label for="cb_h5">
                        <div id="d5_h">E</div>
                    </label>
                </div>
            </div>
        </div>
        <div class="heap-tree d-flex justify-content-around">
            <input type="checkbox" id="cb_h2" value=-1 disabled />
            <label for="cb_h2">
                <div id="d2_h">B</div>
            </label>
            <input type="checkbox" id="cb_h3" value=-1 disabled />
            <label for="cb_h3">
                <div id="d3_h">C</div>
            </label>
            <input type="checkbox" id="cb_h4" value=-1 disabled />
            <label for="cb_h4">
                <div id="d4_h">D</div>
            </label>
            <input type="checkbox" id="cb_h5" value=-1 disabled />
            <label for="cb_h5">
                <div id="d5_h">E</div>
            </label>
        </div>
    </li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>

<div class="cumulative-tbl">
    <table class="table table-bordered table-secondary">
        <thead>
            <tr class="table-active">
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
            </tr>
        </tbody>
    </table>
</div>

<ul class="sort-obj counting">
    <li>
        <input type="checkbox" id="cb_c1" value=-1 disabled />
        <label for="cb_c1">
            <div id="d_c1" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c2" value=-1 disabled />
        <label for="cb_c2">
            <div id="d_c2" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c3" value=-1 disabled />
        <label for="cb_c3">
            <div id="d_c3" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c4" value=-1 disabled />
        <label for="cb_c4">
            <div id="d_c4" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c5" value=-1 disabled />
        <label for="cb_c5">
            <div id="d_c5" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c6" value=-1 disabled />
        <label for="cb_c6">
            <div id="d_c6" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c7" value=-1 disabled />
        <label for="cb_c7">
            <div id="d_c7" class="emptyBox">&nbsp;</div>
        </label>
    </li>
    <li>
        <input type="checkbox" id="cb_c8" value=-1 disabled />
        <label for="cb_c8">
            <div id="d_c8" class="emptyBox">&nbsp;</div>
        </label>
    </li>
</ul>

<ul class="sort-obj heap-animation">
    <div></div>
    <label> 
        <div id="dha_A" style="left:0px;top:0px;">A</div>
        <div id="dha_B" style="left:57px;top:-40px;">B</div>
        <div id="dha_C" style="left:114px;top:-80px;">C</div>
        <div id="dha_D" style="left:171px;top:-120px;">D</div>
        <div id="dha_E" style="left:228px;top:-160px;">E</div>
        <div id="dha_F" style="left:285px;top:-200px;">F</div>
        <div id="dha_G" style="left:228px;top:-240px;">E</div>
        <div id="dha_H" style="left:285px;top:-280px;">F</div>
    </label>
</ul>

<div>
    <p class="compare-log">
        <span class="font-weight-bold">Compare Log </br></span>
    </p>
    <p class="action-log">
        <span class="font-weight-bold">Action Log </br></span>
    </p>
</div>

<div class="mb-3 master-sort-func">
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="compare">Compare</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="swap">Swap</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="min">Find Min</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="pivot">Partition</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="divide">Divide</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="merge" style="display:none;">Merge</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="heap">Heap</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="popNode" style="display:none;">Pop Last Child</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="getCount">Get Cumulative Count</button>
    <button type="button" class="sort-func btn btn-secondary mr-1 mt-1" value="copy" style="display:none;">Move</button>
</div>
<div class="proc-button" style="display:none;">
    <button type="button" class="done btn btn-success mr-1 mt-1" disabled>done</button>
    <button type="button" class="cancel btn btn-danger mr-1 mt-1" disabled>cancel</button>
</div>