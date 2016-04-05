"use strict";
import * as firstService from './foo-service';
import * as secondService from './bar-service';
(function(){
  firstService.foo();
  secondService.bar();

})();