(function(){
'use strict';

  angular.module('wmsApp')
      .service('timelineSteps', TimelineSteps);
  TimelineSteps.$inject = ['$http', 'settings'];

  function TimelineSteps($http, settings) {
    this.step_process = step_process;
    this.move_to_step = move_to_step;
    this.timeline_onload = timeline_onload;

    /////////////////////////////////////////////

    function step_process(from, to, dir) {
      if (typeof(dir) === 'undefined') dir = 'asc';
      var old_move = '';
      var new_start = '';

      var speed = 500;

      if (dir == 'asc') {
          old_move = '-';
          new_start = '';
      } else if (dir == 'desc') {
          old_move = '';
          new_start = '-';
      }

      angular.element('#block'+from).animate({left: old_move+'100%'}, speed, function() {
          angular.element(this).css({left: '100%', 'background-color':'transparent', 'z-index':'2'});
      });
      angular.element('#block'+to).css({'z-index': '3', left:new_start+'100%'}).animate({left: '0%'}, speed, function() {
          angular.element(this).css({'z-index':'2'});
      });

      if (Math.abs(from-to) === 1) {
          // Next Step
          if (from < to) angular.element("#step"+from).addClass('complete').removeClass('current');
          else angular.element("#step"+from).removeClass('complete').removeClass('current');
          var width = (parseInt(to) - 1) * 25;
          angular.element(".progress_bar").find('.current_steps').animate({'width': width+'%'}, speed, function() {
              angular.element("#step"+to).removeClass('complete').addClass('current');
          });
      } else {
          // Move to Step
          var steps = Math.abs(from-to);
          var step_speed = speed / steps;
          if (from < to) {
              move_to_step(from, to, 'asc', step_speed);
          } else {
              move_to_step(from, to, 'desc', step_speed);
          }
      }
    }

    function move_to_step(step, end, dir, step_speed) {
        if (dir == 'asc') {
            angular.element("#step"+step).addClass('complete').removeClass('current');
            var width = (parseInt(step+1) - 1) * 25;
            angular.element(".progress_bar").find('.current_steps').animate({'width': width+'%'}, step_speed, function() {
                angular.element("#step"+(step+1)).removeClass('complete').addClass('current');
                if (step+1 < end) move_to_step((step+1), end, dir, step_speed);
            });
        } else {
            angular.element("#step"+step).removeClass('complete').removeClass('current');
            var width = (parseInt(step-1) - 1) * 25;
            angular.element(".progress_bar").find('.current_steps').animate({'width': width+'%'}, step_speed, function() {
                angular.element("#step"+(step-1)).removeClass('complete').addClass('current');
                if (step-1 > end) move_to_step((step-1), end, dir, step_speed);
            });
        }
    }

    function timeline_onload(){
      angular.element("body").on("click", ".progress_bar .step.complete", function() {
          var from = angular.element(this).parent().find('.current').data('step');
          var to = angular.element(this).data('step');
          var dir = "desc";
          if (from < to) dir = "asc";

          step_process(from, to, dir);
      });
    }
  }
})();
