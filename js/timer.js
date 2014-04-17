// options
var speed = 100;



var totalTime = 0;
var crst = 0;
var timer;
var running = false;
var currentRunningSplitTime;
var startTimerButton, addTimeForm, addTimeTextField, addTimeAddButton, totalTimeLabel, splitTimeContainer, splitTimeList;
$(document).ready(function(){
  addTimeForm = $('form#addTime');
  addTimeTextField = addTimeForm.find('input#time');
  addNameTextField = addTimeForm.find('input#name');
  addTimeAddButton = addTimeForm.find('input#add');
  totalTimeLabel = $('#totalTime');
  splitTimeContainer = $('div#splitTimeContainer');
  splitTimeList = splitTimeContainer.find('ul');
  startTimerButton = $('#startTimer');
  skipButton = $('#skipCurrent');
  resetButton = $('#resetTimer');

  $(window).on('resize', function(){
    totalTimeLabel.textfill();
    $('.resizeText').textfill();
    $(window).height() * 1.2 < $(window).width() ? $('.timerElements').addClass('wide') : $('.timerElements').removeClass('wide')
  }).trigger('resize');


  addTimeAddButton.on('click', function(){
    var parsedTimeMinutes = parseFloat(addTimeTextField.val() || 0);
    var name = addNameTextField.val() || "";
    console.log(parsedTimeMinutes);
    var ParsedTimeMSec = parsedTimeMinutes * 60 * 100
    totalTime += ParsedTimeMSec;
    var hours = Math.floor(ParsedTimeMSec / 60);
    var minutes = ParsedTimeMSec % 60;
    var li = $('<li/>').addClass('splitTime').attr('data-init-time', ParsedTimeMSec).attr('data-time', ParsedTimeMSec).appendTo(splitTimeList);
    var spanTimeContainer = $('<div/>').addClass('resizeText').appendTo(li);
    var spanTime = $('<span/>').addClass('splitTimeLabel').text(timeFromMSec(ParsedTimeMSec)).appendTo(spanTimeContainer);
    var spanNameContainer = $('<div/>').addClass('').addClass('upthere').appendTo(li);
    var spanName = $('<span/>').addClass('splitTimeName').text(name).appendTo(spanNameContainer);
    var aaa = $('<button/>').attr("type", "button").addClass('close').appendTo(li).html("&times;");

    

    setTotalTime();
    addTimeTextField.val("");
    addNameTextField.val("");

    $(window).trigger('resize');
    return false;
  })

  startTimerButton.on('click', function(){
    if(running == false && totalTime > 0){
      startTimer();
    } else {
      stopTimer();
    }
    return false;
  })

  skipButton.on('click', function(){
    clearCurrentSplitTime();
  })

  resetButton.on('click', function(){
    stopTimer();
    totalTime = 0;
    $.each($('li.splitTime'), function(){
      $(this).attr('data-time', $(this).attr('data-init-time'));
      $(this).removeClass('done').removeClass('current');
      thisTime = parseInt($(this).attr('data-time'));
      $(this).find('.splitTimeLabel').text(timeFromMSec(thisTime));
      totalTime += thisTime;
    })
    setTotalTime();
    currentRunningSplitTime = null;
    crst = 0;
    return false;
  })

  $(document).on('click', 'li.splitTime .close', function(){
    console.log($(this));
    var splitTimeItem = $(this).closest('li.splitTime');
    var seconds = parseInt(splitTimeItem.attr('data-time'));
    // totalTime -= seconds;
    splitTimeItem.remove();
    totalTime = 0;
    $.each($('li.splitTime'), function(){
      totalTime += parseInt($(this).attr('data-time'));
    })
    setTotalTime();
    currentRunningSplitTime = null;
    crst = 0;
    return false;
  });
});

function startTimer(){
  startTimerButton.removeClass('btn-success');
  startTimerButton.addClass('btn-danger');
  startTimerButton.text('STOP');
  running = true;
  timer = setInterval(runTimer, speed);
}

function stopTimer(){
  startTimerButton.removeClass('btn-danger');
  startTimerButton.addClass('btn-success');
  startTimerButton.text('START');
  running = false;
  window.clearInterval(timer);
}

function flashRed(){
  totalTimeLabel.css('background-color', 'red');
  totalTimeLabel.css('color', 'white');
  setTimeout(function(){
    totalTimeLabel.css('background-color', 'transparent');
    totalTimeLabel.css('color', 'black');
  }, 100)
}

function clearCurrentSplitTime(){
  if(typeof currentRunningSplitTime !== 'undefined' || currentRunningSplitTime !== null){
    currentRunningSplitTime.addClass('done');
    currentRunningSplitTime.removeClass('current');
    currentRunningSplitTime = null;
    crst = 0;
  }
}

function runTimer(){
  if(totalTime <= 0){
    stopTimer();
    clearCurrentSplitTime();
  } else {
    totalTime -= speed/10;
    setTotalTime();
    // crst == 0 && 
    while(crst == 0 && (splitTimeListItems = splitTimeList.children("li:not(.done)")).length > 0){
      if(typeof currentRunningSplitTime === 'undefined' || currentRunningSplitTime == null){
        currentRunningSplitTime = splitTimeListItems.first();
        currentRunningSplitTime.addClass('current')
        crst = parseInt(currentRunningSplitTime.attr('data-time'));
        flashRed();
      } else {
        clearCurrentSplitTime();
      }
    }
    if(crst > 0){
      crst -= speed/10;
      currentRunningSplitTime.attr('data-time', crst);
      try{
        currentRunningSplitTime.find('.splitTimeLabel').text(timeFromMSec(crst));
      } catch(e){
        console.log(e);
        console.log(currentRunningSplitTime);
      }
    } else {
      stopTimer();
    }
  }
}

function timeFromMSec(time){
  var hh = Math.floor(time / 360000);
  var mm = Math.floor((time % 360000) / 6000);
  var ss = Math.floor((time % 6000) / 100);
  var ms = time % 100 / 10;
  return pad(mm, 2) + ":" + pad(ss, 2) + "." + pad(ms, 1);
}

function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function setTotalTime(){
  totalTimeLabel.find('span').text(timeFromMSec(totalTime));
}