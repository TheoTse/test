/*
Copyright (C) 2017-2020 Haute Ecole Robert Schuman.

This file is part of hers-stagekine.

  hers-stagekine is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or (at your
  option) any later version.

  hers-stagekine is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
  or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
  License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with hers-stagekine.  If not, see <http://www.gnu.org/licenses/>.
*/

import 'bootstrap'
import 'bootstrap-select'
import '../scss/main.scss'
import 'tempusdominus-bootstrap-4/build/js/tempusdominus-bootstrap-4.min.js'
import loginPage from './login_page';
import bsCustomFileInput from 'bs-custom-file-input'

window.jQuery = jQuery
window.$ = jQuery

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
  bsCustomFileInput.init()
})

window.stage = {
  loginPage
}
